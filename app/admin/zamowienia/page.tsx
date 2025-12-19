'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface OrderItem {
  id: string
  quantity: number
  price: string
  productKit: {
    sku: string
    name: string
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  customerName: string
  customerEmail: string
  customerPhone: string
  total: string
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Basic ${btoa(`admin:${password}`)}`,
        },
      })

      if (response.status === 401) {
        setAuthenticated(false)
        setError('Nieprawidłowe hasło')
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
      setAuthenticated(true)
      setError(null)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Błąd pobierania zamówień')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    fetchOrders()
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel Administratora</CardTitle>
            <CardDescription>Wprowadź hasło aby kontynuować</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Hasło administratora"
                  className="w-full rounded-md border px-4 py-2"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logowanie...' : 'Zaloguj'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Ładowanie zamówień...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Zamówienia</h1>
            <p className="text-muted-foreground">
              Panel administratora - zarządzanie zamówieniami
            </p>
          </div>
          <Button onClick={() => { setAuthenticated(false); setPassword('') }}>
            Wyloguj
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground">Brak zamówień</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Zamówienie #{order.orderNumber}</CardTitle>
                      <CardDescription>
                        {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                          order.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status === 'paid' ? 'Opłacone' : 'Oczekuje'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer Info */}
                    <div>
                      <h3 className="mb-2 font-semibold">Klient</h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-muted-foreground">{order.customerEmail}</p>
                        <p className="text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h3 className="mb-2 font-semibold">Płatność</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          Metoda: {order.paymentMethod === 'COD' ? 'Przy odbiorze' : 'Przelewy24'}
                        </p>
                        <p>
                          Status:{' '}
                          <span
                            className={
                              order.paymentStatus === 'completed'
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }
                          >
                            {order.paymentStatus === 'completed' ? 'Opłacone' : 'Oczekuje'}
                          </span>
                        </p>
                        <p className="text-lg font-bold">
                          {parseFloat(order.total).toLocaleString('pl-PL')} zł
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="md:col-span-2">
                      <h3 className="mb-2 font-semibold">Produkty</h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between rounded-lg border p-2 text-sm"
                          >
                            <span>
                              {item.productKit.name} (SKU: {item.productKit.sku}) × {item.quantity}
                            </span>
                            <span className="font-medium">
                              {(parseFloat(item.price) * item.quantity).toLocaleString('pl-PL')} zł
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link href={`/zamowienie/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Zobacz szczegóły
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
