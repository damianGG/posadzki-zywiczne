// Cart management utilities using cookies

import { cookies } from 'next/headers'

export interface CartItem {
  productKitId: string
  sku: string
  name: string
  price: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

const CART_COOKIE_NAME = 'shopping_cart'

/**
 * Get cart from cookies
 */
export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get(CART_COOKIE_NAME)
  
  if (!cartCookie) {
    return { items: [], total: 0 }
  }

  try {
    const cart = JSON.parse(cartCookie.value) as Cart
    return cart
  } catch {
    return { items: [], total: 0 }
  }
}

/**
 * Save cart to cookies
 */
export async function saveCart(cart: Cart): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  })
}

/**
 * Add item to cart
 */
export async function addToCart(item: CartItem): Promise<Cart> {
  const cart = await getCart()
  
  const existingItemIndex = cart.items.findIndex(
    (i) => i.productKitId === item.productKitId
  )

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += item.quantity
  } else {
    cart.items.push(item)
  }

  cart.total = calculateTotal(cart.items)
  await saveCart(cart)
  
  return cart
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productKitId: string): Promise<Cart> {
  const cart = await getCart()
  
  cart.items = cart.items.filter((item) => item.productKitId !== productKitId)
  cart.total = calculateTotal(cart.items)
  
  await saveCart(cart)
  
  return cart
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(
  productKitId: string,
  quantity: number
): Promise<Cart> {
  const cart = await getCart()
  
  const itemIndex = cart.items.findIndex((i) => i.productKitId === productKitId)
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
  }

  cart.total = calculateTotal(cart.items)
  await saveCart(cart)
  
  return cart
}

/**
 * Clear cart
 */
export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}

/**
 * Calculate cart total
 */
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
