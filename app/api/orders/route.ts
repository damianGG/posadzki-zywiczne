import { NextRequest, NextResponse } from 'next/server'
import { createOrder, CreateOrderInput } from '@/lib/orders'
import { getCart, clearCart } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerZip,
      paymentMethod,
    } = body

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress ||
      !customerCity ||
      !customerZip ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: 'All customer fields and payment method are required' },
        { status: 400 }
      )
    }

    // Get cart
    const cart = await getCart()

    if (cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create order
    const orderInput: CreateOrderInput = {
      cart,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerZip,
      paymentMethod: paymentMethod as 'COD' | 'PRZELEWY24',
    }

    const order = await createOrder(orderInput)

    // Clear cart after successful order creation
    await clearCart()

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        total: order.total.toString(),
      },
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
