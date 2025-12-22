import { NextRequest, NextResponse } from 'next/server';
import { listOrders } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // In production, you should implement proper authentication
    // For now, this is a simple implementation
    const { orders, total } = await listOrders(100, 0);
    
    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
