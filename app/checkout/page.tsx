'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cart } from '@/types/ecommerce';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerZip: '',
    paymentMethod: 'COD' as 'COD' | 'PRZELEWY24',
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (!data.cart || data.cart.items.length === 0) {
        router.push('/koszyk');
        return;
      }
      
      setCart(data.cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart) return;
    
    setSubmitting(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart.items.map((item) => ({
            productKitId: item.productKitId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: cart.totalAmount,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.order.id;

      // Handle payment method
      if (formData.paymentMethod === 'PRZELEWY24') {
        // Initialize Przelewy24 payment
        const paymentResponse = await fetch('/api/payment/przelewy24', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        if (!paymentResponse.ok) {
          throw new Error('Failed to initialize payment');
        }

        const paymentData = await paymentResponse.json();
        
        // Redirect to Przelewy24
        window.location.href = paymentData.redirectUrl;
      } else {
        // COD - redirect to order page
        router.push(`/zamowienie/${orderId}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Ładowanie...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kasa</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Dane kontaktowe
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Adres dostawy
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica i numer *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, customerAddress: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kod pocztowy *
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{2}-[0-9]{3}"
                        placeholder="00-000"
                        value={formData.customerZip}
                        onChange={(e) =>
                          setFormData({ ...formData, customerZip: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miasto *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerCity}
                        onChange={(e) =>
                          setFormData({ ...formData, customerCity: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Metoda płatności
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as 'COD',
                        })
                      }
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Płatność przy odbiorze</div>
                      <div className="text-sm text-gray-500">
                        Zapłacisz gotówką przy dostawie
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PRZELEWY24"
                      checked={formData.paymentMethod === 'PRZELEWY24'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as 'PRZELEWY24',
                        })
                      }
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Przelewy24</div>
                      <div className="text-sm text-gray-500">
                        BLIK, przelew, karta płatnicza
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? 'Przetwarzanie...' : 'Złóż zamówienie'}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Podsumowanie
              </h2>

              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.productKitId} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)} zł
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">
                    Suma:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {cart.totalAmount.toFixed(2)} zł
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
