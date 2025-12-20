import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus } = body;
    
    if (!orderStatus) {
      return NextResponse.json(
        { error: 'Order status is required' },
        { status: 400 }
      );
    }
    
    const order = await updateOrderStatus(id, orderStatus);
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
