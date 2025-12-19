import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/przelewy24'
import { getOrderByNumber, updateOrderPaymentStatus } from '@/lib/orders'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, orderId, amount, currency, sign } = body

    // Verify signature
    const isValid = verifyWebhookSignature(
      sessionId,
      orderId,
      amount,
      currency,
      sign
    )

    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Get order by session ID (order number)
    const order = await getOrderByNumber(sessionId)

    if (!order) {
      console.error('Order not found:', sessionId)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order payment status
    await updateOrderPaymentStatus(order.id, 'completed', orderId.toString())

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
