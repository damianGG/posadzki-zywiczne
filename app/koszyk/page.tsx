'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cart } from '@/types/ecommerce';

export default function KoszykPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productKitId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          productKitId,
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productKitId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          productKitId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Ładowanie koszyka...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Twój koszyk jest pusty
            </h1>
            <p className="text-gray-600 mb-8">
              Dodaj produkty do koszyka, aby kontynuować zakupy
            </p>
            <div className="space-x-4">
              <Link
                href="/sklep"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Przejdź do sklepu
              </Link>
              <Link
                href="/konfigurator"
                className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Skorzystaj z konfiguratora
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Koszyk</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {cart.items.map((item) => (
            <div
              key={item.productKitId}
              className="p-6 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {item.price.toFixed(2)} zł
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productKitId, item.quantity - 1)
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productKitId, item.quantity + 1)
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-lg font-bold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} zł
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.productKitId)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Suma:</span>
            <span className="text-3xl font-bold text-gray-900">
              {cart.totalAmount.toFixed(2)} zł
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Przejdź do kasy
            </button>
            <Link
              href="/sklep"
              className="block text-center w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Kontynuuj zakupy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
