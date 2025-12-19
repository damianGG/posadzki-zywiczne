// Cart validation utilities

import { prisma } from './prisma'
import { Cart, CartItem } from './cart'

/**
 * Validate cart items against database and recalculate prices
 */
export async function validateCart(cart: Cart): Promise<{ valid: boolean; errors: string[]; validatedCart?: Cart }> {
  const errors: string[] = []
  const validatedItems: CartItem[] = []

  for (const item of cart.items) {
    // Fetch product from database
    const product = await prisma.productKit.findUnique({
      where: { id: item.productKitId },
    })

    if (!product) {
      errors.push(`Product ${item.sku} not found`)
      continue
    }

    // Validate SKU matches
    if (product.sku !== item.sku) {
      errors.push(`SKU mismatch for product ${item.productKitId}`)
      continue
    }

    // Recalculate price from database
    const correctPrice = parseFloat(product.basePrice.toString()) + parseFloat(product.r10Surcharge.toString())

    // Warn if price doesn't match (allow small rounding differences)
    if (Math.abs(item.price - correctPrice) > 0.01) {
      errors.push(`Price mismatch for ${item.sku}: expected ${correctPrice}, got ${item.price}`)
    }

    // Add validated item with correct price
    validatedItems.push({
      ...item,
      price: correctPrice, // Use database price
      name: product.name, // Use database name
    })
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // Recalculate total
  const validatedTotal = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return {
    valid: true,
    errors: [],
    validatedCart: {
      items: validatedItems,
      total: validatedTotal,
    },
  }
}
