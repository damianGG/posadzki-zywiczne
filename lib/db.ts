import { prisma } from './prisma';
import { OrderInput } from '@/types/ecommerce';

/**
 * Generate a unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Create a new order
 */
export async function createOrder(input: OrderInput) {
  const orderNumber = generateOrderNumber();
  
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
      totalAmount: input.totalAmount,
      items: {
        create: input.items.map((item) => ({
          productKitId: item.productKitId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          productKit: true,
        },
      },
    },
  });
  
  return order;
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          productKit: true,
        },
      },
    },
  });
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          productKit: true,
        },
      },
    },
  });
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  przelewy24TransactionId?: string
) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus,
      przelewy24TransactionId,
    },
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, orderStatus: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { orderStatus },
  });
}

/**
 * List all orders (for admin)
 */
export async function listOrders(limit = 50, offset = 0) {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            productKit: true,
          },
        },
      },
    }),
    prisma.order.count(),
  ]);
  
  return { orders, total };
}

/**
 * Get all product kits
 */
export async function getProductKits() {
  return prisma.productKit.findMany({
    orderBy: { bucketSize: 'asc' },
  });
}

/**
 * Get product kit by ID
 */
export async function getProductKitById(id: string) {
  return prisma.productKit.findUnique({
    where: { id },
  });
}

/**
 * Get product kit by SKU
 */
export async function getProductKitBySKU(sku: string) {
  return prisma.productKit.findUnique({
    where: { sku },
  });
}
