import { NextRequest, NextResponse } from 'next/server'
import { getCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart } from '@/lib/cart'

export async function GET() {
  try {
    const cart = await getCart()
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, item, productKitId, quantity } = body

    let cart

    switch (action) {
      case 'add':
        if (!item) {
          return NextResponse.json(
            { error: 'Item is required' },
            { status: 400 }
          )
        }
        cart = await addToCart(item)
        break

      case 'remove':
        if (!productKitId) {
          return NextResponse.json(
            { error: 'Product kit ID is required' },
            { status: 400 }
          )
        }
        cart = await removeFromCart(productKitId)
        break

      case 'update':
        if (!productKitId || quantity === undefined) {
          return NextResponse.json(
            { error: 'Product kit ID and quantity are required' },
            { status: 400 }
          )
        }
        cart = await updateCartItemQuantity(productKitId, quantity)
        break

      case 'clear':
        await clearCart()
        cart = { items: [], total: 0 }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
