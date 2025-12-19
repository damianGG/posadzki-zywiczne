import { NextRequest, NextResponse } from 'next/server'
import { createPrzelewy24Transaction, getPaymentRedirectUrl } from '@/lib/przelewy24'
import { getOrderById } from '@/lib/orders'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order
    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.paymentMethod !== 'PRZELEWY24') {
      return NextResponse.json(
        { error: 'Order payment method is not Przelewy24' },
        { status: 400 }
      )
    }

    // Convert total to grosze (cents)
    const amountInGrosze = Math.round(parseFloat(order.total.toString()) * 100)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Przelewy24 transaction
    const transaction = await createPrzelewy24Transaction({
      sessionId: order.orderNumber,
      amount: amountInGrosze,
      currency: 'PLN',
      description: `Zamówienie ${order.orderNumber}`,
      email: order.customerEmail,
      country: 'PL',
      urlReturn: `${siteUrl}/zamowienie/${order.id}?payment=success`,
      urlStatus: `${siteUrl}/api/payment/webhook`,
    })

    if (transaction.error) {
      return NextResponse.json(
        { error: transaction.error },
        { status: 500 }
      )
    }

    const paymentUrl = getPaymentRedirectUrl(transaction.token)

    return NextResponse.json({
      success: true,
      paymentUrl,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
