import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Status zamówienia | Posadzki Żywiczne',
  description: 'Sprawdź status swojego zamówienia',
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          productKit: true
        }
      }
    }
  })
  return order
}

const statusIcons = {
  new: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  new: 'Nowe',
  processing: 'W realizacji',
  shipped: 'Wysłane',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane'
}

const paymentStatusLabels = {
  pending: 'Oczekuje',
  paid: 'Opłacone',
  failed: 'Niepowodzenie',
  cancelled: 'Anulowane'
}

const paymentMethodLabels = {
  przelewy24: 'Przelewy24',
  cod: 'Za pobraniem'
}

export default async function ZamowieniePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Clock

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Zamówienie {order.orderNumber}</h1>
                <p className="text-blue-100">
                  Data złożenia: {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <StatusIcon className="w-12 h-12" />
            </div>
          </div>

          {/* Status */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Status zamówienia</p>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[order.status as keyof typeof statusColors]
                }`}>
                  {statusLabels[order.status as keyof typeof statusLabels]}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Status płatności</p>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels]}
                </span>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Dane klienta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Imię i nazwisko</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">Telefon</p>
                <p className="font-semibold">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-gray-600">Adres</p>
                <p className="font-semibold">
                  {order.customerAddress}<br />
                  {order.customerZip} {order.customerCity}
                </p>
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Produkty</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.productKit.name}</p>
                    <p className="text-sm text-gray-600">SKU: {item.productKit.sku}</p>
                    <p className="text-sm text-gray-600">Ilość: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{(item.price * item.quantity).toFixed(2)} PLN</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Metoda płatności</span>
                <span className="font-semibold">
                  {paymentMethodLabels[order.paymentMethod as keyof typeof paymentMethodLabels]}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Suma</span>
                <span>{order.totalAmount.toFixed(2)} PLN</span>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Uwagi</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 bg-white">
            <Link
              href="/sklep"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Powrót do sklepu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
