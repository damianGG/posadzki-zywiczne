import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { przelewy24 } from '@/lib/przelewy24'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Verify the callback signature
    const isValid = przelewy24.verifyCallback(body)
    
    if (!isValid) {
      console.error('Invalid Przelewy24 callback signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Extract data from callback
    const { sessionId, orderId, amount, currency, statement } = body
    
    // Update order payment status
    const order = await prisma.order.update({
      where: { id: sessionId },
      data: {
        paymentStatus: 'paid',
        paymentId: orderId.toString(),
        status: 'processing'
      }
    })

    console.log(`Payment confirmed for order ${order.orderNumber}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing Przelewy24 callback:', error)
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 })
  }
}
