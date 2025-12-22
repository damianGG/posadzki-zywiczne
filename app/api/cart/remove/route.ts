import { NextResponse } from 'next/server'
import { removeFromCart } from '@/lib/cart'

export async function POST(request: Request) {
  try {
    const { productKitId } = await request.json()
    
    if (!productKitId) {
      return NextResponse.json({ error: 'Product kit ID is required' }, { status: 400 })
    }
    
    const cart = await removeFromCart(productKitId)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}
