import { NextResponse } from 'next/server'
import { updateCartItemQuantity } from '@/lib/cart'

export async function POST(request: Request) {
  try {
    const { productKitId, quantity } = await request.json()
    
    if (!productKitId || quantity === undefined) {
      return NextResponse.json({ error: 'Product kit ID and quantity are required' }, { status: 400 })
    }
    
    const cart = await updateCartItemQuantity(productKitId, quantity)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}
