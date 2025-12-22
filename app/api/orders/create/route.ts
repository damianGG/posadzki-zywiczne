import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clearCart, CartItem } from '@/lib/cart'
import { przelewy24 } from '@/lib/przelewy24'

interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerZip: string
  paymentMethod: 'przelewy24' | 'cod'
  notes?: string
  items: CartItem[]
  totalAmount: number
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json()
    
    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.customerPhone || 
        !body.customerAddress || !body.customerCity || !body.customerZip) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Generate order number
    const orderNumber = generateOrderNumber()
    
    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        customerAddress: body.customerAddress,
        customerCity: body.customerCity,
        customerZip: body.customerZip,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'pending',
        totalAmount: body.totalAmount,
        currency: 'PLN',
        status: 'new',
        notes: body.notes || null,
        items: {
          create: body.items.map((item) => ({
            productKitId: item.productKitId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            productKit: true
          }
        }
      }
    })

    // Clear cart
    await clearCart()

    // If payment method is Przelewy24, create payment transaction
    if (body.paymentMethod === 'przelewy24') {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      const paymentUrl = await przelewy24.createTransaction({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: body.totalAmount,
        currency: 'PLN',
        description: `Zamówienie ${order.orderNumber}`,
        email: body.customerEmail,
        country: 'PL',
        language: 'pl',
        urlReturn: `${baseUrl}/zamowienie/${order.id}?payment=success`,
        urlStatus: `${baseUrl}/api/payments/przelewy24/callback`
      })

      if (paymentUrl) {
        return NextResponse.json({
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentUrl
        })
      } else {
        // If payment creation failed, return error but keep the order
        return NextResponse.json({
          orderId: order.id,
          orderNumber: order.orderNumber,
          error: 'Failed to create payment. Please contact us to complete the order.'
        }, { status: 500 })
      }
    }

    // For COD, just return order ID
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
