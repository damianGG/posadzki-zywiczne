import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, removeFromCart, updateCartItemQuantity } from '@/lib/cart';
import { CartItem } from '@/types/ecommerce';

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, item, productKitId, quantity } = body;
    
    let cart;
    
    switch (action) {
      case 'add':
        if (!item) {
          return NextResponse.json(
            { error: 'Item is required for add action' },
            { status: 400 }
          );
        }
        cart = await addToCart(item as CartItem);
        break;
        
      case 'remove':
        if (!productKitId) {
          return NextResponse.json(
            { error: 'productKitId is required for remove action' },
            { status: 400 }
          );
        }
        cart = await removeFromCart(productKitId);
        break;
        
      case 'update':
        if (!productKitId || quantity === undefined) {
          return NextResponse.json(
            { error: 'productKitId and quantity are required for update action' },
            { status: 400 }
          );
        }
        cart = await updateCartItemQuantity(productKitId, quantity);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
