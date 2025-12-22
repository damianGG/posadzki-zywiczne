import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderPaymentStatus } from '@/lib/db';
import {
  registerPrzelewy24Transaction,
  getPrzelewy24RedirectUrl,
  getPrzelewy24Config,
} from '@/lib/przelewy24';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Get the order
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    if (order.paymentMethod !== 'PRZELEWY24') {
      return NextResponse.json(
        { error: 'Order payment method is not Przelewy24' },
        { status: 400 }
      );
    }
    
    // Convert amount to grosze (1 PLN = 100 grosze)
    const amountInGrosze = Math.round(order.totalAmount * 100);
    
    // Create transaction
    const config = getPrzelewy24Config();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const transaction = {
      sessionId: order.orderNumber,
      amount: amountInGrosze,
      currency: 'PLN',
      description: `Zamówienie ${order.orderNumber}`,
      email: order.customerEmail,
      country: 'PL',
      language: 'pl',
      urlReturn: `${baseUrl}/zamowienie/${order.id}?payment=success`,
      urlStatus: `${baseUrl}/api/webhook/przelewy24`,
    };
    
    const result = await registerPrzelewy24Transaction(transaction);
    
    if (!result.success || !result.token) {
      return NextResponse.json(
        { error: 'Failed to register payment', details: result.error },
        { status: 500 }
      );
    }
    
    // Update order with transaction ID
    await updateOrderPaymentStatus(order.id, 'pending', result.token);
    
    // Return redirect URL
    const redirectUrl = getPrzelewy24RedirectUrl(result.token, config.sandbox);
    
    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error('Error initializing Przelewy24 payment:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
