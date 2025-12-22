import { NextResponse } from 'next/server'
import { addToCart, CartItem } from '@/lib/cart'

export async function POST(request: Request) {
  try {
    const item: CartItem = await request.json()
    
    // Validate item
    if (!item.productKitId || !item.sku || !item.name || !item.price || !item.quantity) {
      return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
    }
    
    const cart = await addToCart(item)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
