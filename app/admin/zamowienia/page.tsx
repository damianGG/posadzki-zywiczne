'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * SECURITY NOTE: This is a simplified admin panel for MVP purposes.
 * The password check is client-side only, which is NOT secure for production.
 * 
 * For production deployment, you MUST implement:
 * 1. Server-side authentication (NextAuth.js, Clerk, or custom)
 * 2. Secure session management
 * 3. Role-based access control
 * 4. HTTP-only cookies for auth tokens
 * 
 * Current implementation is suitable only for:
 * - Local development
 * - Demo purposes
 * - Internal tools with network-level security
 */

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    productKit: {
      name: string;
      sku: string;
    };
  }>;
}

export default function AdminZamowieniaPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password against environment variable
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
      loadOrders();
    } else {
      setError('Nieprawidłowe hasło');
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        setError('Błąd podczas ładowania zamówień');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Błąd podczas ładowania zamówień');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (response.ok) {
        loadOrders();
      } else {
        alert('Błąd podczas aktualizacji statusu');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Błąd podczas aktualizacji statusu');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Panel Administracyjny
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasło
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wprowadź hasło administracyjne"
                />
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Zaloguj
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Zarządzanie Zamówieniami
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Wyloguj
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Ładowanie zamówień...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Brak zamówień do wyświetlenia</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Zamówienie #{order.orderNumber}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {order.totalAmount.toFixed(2)} zł
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Dane klienta
                      </h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.customerEmail}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Płatność
                      </h3>
                      <p className="text-sm text-gray-600">
                        Metoda: {order.paymentMethod === 'COD' ? 'Przy odbiorze' : 'Przelewy24'}
                      </p>
                      <p className="text-sm">
                        Status:{' '}
                        <span
                          className={`font-semibold ${
                            order.paymentStatus === 'paid'
                              ? 'text-green-600'
                              : order.paymentStatus === 'failed'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Opłacone' : 
                           order.paymentStatus === 'failed' ? 'Nieudane' : 'Oczekuje'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Produkty
                    </h3>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-sm text-gray-600">
                          {item.productKit.name} (SKU: {item.productKit.sku}) x {item.quantity} -{' '}
                          {(item.price * item.quantity).toFixed(2)} zł
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                      Status zamówienia:
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="new">Nowe</option>
                      <option value="processing">W realizacji</option>
                      <option value="completed">Zrealizowane</option>
                      <option value="cancelled">Anulowane</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
