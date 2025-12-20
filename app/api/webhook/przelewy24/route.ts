import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber, updateOrderPaymentStatus } from '@/lib/db';
import { verifyPrzelewy24Notification, getPrzelewy24Config } from '@/lib/przelewy24';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract Przelewy24 notification parameters
    const {
      sessionId,
      orderId,
      amount,
      currency,
      sign,
    } = body;
    
    // Verify notification signature
    const config = getPrzelewy24Config();
    const isValid = verifyPrzelewy24Notification({
      sessionId,
      merchantId: config.merchantId,
      amount: parseInt(amount),
      currency,
      orderId: parseInt(orderId),
      sign,
      crc: config.crc,
    });
    
    if (!isValid) {
      console.error('Invalid Przelewy24 notification signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    // Get order by session ID (which is our order number)
    const order = await getOrderByNumber(sessionId);
    
    if (!order) {
      console.error('Order not found for sessionId:', sessionId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update payment status
    await updateOrderPaymentStatus(order.id, 'paid', orderId.toString());
    
    console.log(`Payment confirmed for order ${order.orderNumber}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Przelewy24 webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
