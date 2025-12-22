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

const CART_COOKIE_NAME = 'cart'

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

export async function saveCart(cart: Cart): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

export async function addToCart(item: CartItem): Promise<Cart> {
  const cart = await getCart()
  
  const existingItemIndex = cart.items.findIndex(
    (i) => i.productKitId === item.productKitId
  )
  
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += item.quantity
  } else {
    cart.items.push(item)
  }
  
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  
  await saveCart(cart)
  return cart
}

export async function removeFromCart(productKitId: string): Promise<Cart> {
  const cart = await getCart()
  
  cart.items = cart.items.filter((item) => item.productKitId !== productKitId)
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  
  await saveCart(cart)
  return cart
}

export async function updateCartItemQuantity(
  productKitId: string,
  quantity: number
): Promise<Cart> {
  const cart = await getCart()
  
  const itemIndex = cart.items.findIndex(
    (item) => item.productKitId === productKitId
  )
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
  }
  
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  
  await saveCart(cart)
  return cart
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}
