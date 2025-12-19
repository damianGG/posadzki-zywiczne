import { getOrderById } from '@/lib/orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { payment?: string }
}) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  const paymentSuccess = searchParams.payment === 'success'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Success Message */}
          {paymentSuccess && (
            <div className="mb-8 rounded-lg bg-green-50 p-6 text-center dark:bg-green-950">
              <div className="mb-2 text-4xl">✓</div>
              <h2 className="mb-2 text-2xl font-bold text-green-900 dark:text-green-100">
                Zamówienie złożone pomyślnie!
              </h2>
              <p className="text-green-700 dark:text-green-300">
                Dziękujemy za zakupy. Potwierdzenie zostało wysłane na adres email.
              </p>
            </div>
          )}

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Zamówienie #{order.orderNumber}</CardTitle>
              <CardDescription>
                Złożone: {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <h3 className="mb-2 font-semibold">Status zamówienia</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {order.status === 'paid' ? '✓ Opłacone' : 'Oczekuje na płatność'}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="mb-2 font-semibold">Metoda płatności</h3>
                  <p>
                    {order.paymentMethod === 'COD' ? 'Płatność przy odbiorze (COD)' : 'Przelewy24'}
                  </p>
                  {order.paymentMethod === 'COD' && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Zapłać gotówką przy odbiorze zamówienia
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="mb-2 font-semibold">Produkty</h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">{item.productKit.name}</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.productKit.sku} • Ilość: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {(parseFloat(item.price.toString()) * item.quantity).toLocaleString('pl-PL')} zł
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="mb-2 font-semibold">Adres dostawy</h3>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm">{order.customerAddress}</p>
                    <p className="text-sm">
                      {order.customerZip} {order.customerCity}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Email:</span> {order.customerEmail}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Telefon:</span> {order.customerPhone}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Razem do zapłaty:</span>
                    <span>{parseFloat(order.total.toString()).toLocaleString('pl-PL')} zł</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Link href="/sklep">
              <Button size="lg">Wróć do sklepu</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              Drukuj zamówienie
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
