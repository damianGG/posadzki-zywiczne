// Order management utilities

import { prisma } from './prisma'
import { Cart } from './cart'

export interface CreateOrderInput {
  cart: Cart
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerZip: string
  paymentMethod: 'COD' | 'PRZELEWY24'
}

export interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerZip: string
  subtotal: number
  total: number
  createdAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  productKit: {
    sku: string
    name: string
  }
}

/**
 * Generate unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `ORD-${timestamp}-${random}`
}

/**
 * Create a new order
 */
export async function createOrder(input: CreateOrderInput) {
  const orderNumber = generateOrderNumber()

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      customerAddress: input.customerAddress,
      customerCity: input.customerCity,
      customerZip: input.customerZip,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'COD' ? 'pending' : 'pending',
      status: 'pending',
      subtotal: input.cart.total,
      total: input.cart.total,
      items: {
        create: input.cart.items.map((item) => ({
          productKitId: item.productKitId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          productKit: {
            select: {
              sku: true,
              name: true,
            },
          },
        },
      },
    },
  })

  return order
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          productKit: {
            select: {
              sku: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
  })

  return order
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          productKit: {
            select: {
              sku: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
  })

  return order
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  przelewy24Id?: string
) {
  const updateData: any = {
    paymentStatus,
  }

  if (paymentStatus === 'completed') {
    updateData.status = 'paid'
  }

  if (przelewy24Id) {
    updateData.przelewy24Id = przelewy24Id
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  })

  return order
}

/**
 * Get all orders (for admin)
 */
export async function getAllOrders(page = 1, perPage = 20) {
  const skip = (page - 1) * perPage

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            productKit: {
              select: {
                sku: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.order.count(),
  ])

  return {
    orders,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}
