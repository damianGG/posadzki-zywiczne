import { NextResponse } from 'next/server'
import { getCart } from '@/lib/cart'

export async function GET() {
  try {
    const cart = await getCart()
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
