import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { OrderInput } from '@/types/ecommerce';
import { clearCart } from '@/lib/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as OrderInput;
    
    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    // Create the order
    const order = await createOrder(body);
    
    // Clear cart after successful order creation
    await clearCart();
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
