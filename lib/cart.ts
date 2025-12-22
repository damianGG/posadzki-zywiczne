import { cookies } from 'next/headers';
import { Cart, CartItem } from '@/types/ecommerce';

const CART_COOKIE_NAME = 'cart';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get cart from cookies
 */
export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);
  
  if (!cartCookie) {
    return { items: [], totalAmount: 0 };
  }
  
  try {
    const cart = JSON.parse(cartCookie.value) as Cart;
    return cart;
  } catch (error) {
    console.error('Error parsing cart cookie:', error);
    return { items: [], totalAmount: 0 };
  }
}

/**
 * Save cart to cookies
 */
export async function saveCart(cart: Cart): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Add item to cart
 */
export async function addToCart(item: CartItem): Promise<Cart> {
  const cart = await getCart();
  
  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    (i) => i.productKitId === item.productKitId
  );
  
  if (existingItemIndex >= 0) {
    // Update quantity
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.items.push(item);
  }
  
  // Recalculate total
  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  await saveCart(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productKitId: string): Promise<Cart> {
  const cart = await getCart();
  
  cart.items = cart.items.filter((item) => item.productKitId !== productKitId);
  
  // Recalculate total
  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  await saveCart(cart);
  return cart;
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(
  productKitId: string,
  quantity: number
): Promise<Cart> {
  const cart = await getCart();
  
  const itemIndex = cart.items.findIndex(
    (item) => item.productKitId === productKitId
  );
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
  }
  
  // Recalculate total
  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  await saveCart(cart);
  return cart;
}

/**
 * Clear cart
 */
export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}
