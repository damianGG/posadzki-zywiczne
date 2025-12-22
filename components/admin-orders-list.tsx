'use client'

import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: number
  createdAt: Date
  items: Array<{
    id: string
    quantity: number
    price: number
    productKit: {
      name: string
      sku: string
    }
  }>
}

interface AdminOrdersListProps {
  orders: Order[]
}

const statusLabels: Record<string, string> = {
  new: 'Nowe',
  processing: 'W realizacji',
  shipped: 'Wysłane',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane'
}

const paymentStatusLabels: Record<string, string> = {
  pending: 'Oczekuje',
  paid: 'Opłacone',
  failed: 'Niepowodzenie',
  cancelled: 'Anulowane'
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">Brak zamówień</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numer zamówienia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produkty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Płatność
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-gray-500">{order.customerEmail}</div>
                    <div className="text-gray-500">{order.customerPhone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.map((item, idx) => (
                      <div key={item.id} className="mb-1">
                        {item.productKit.name} × {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusColors[order.status] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className={`font-semibold ${
                      order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                    </div>
                    <div className="text-gray-500 text-xs">{order.paymentMethod}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {order.totalAmount.toFixed(2)} PLN
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('pl-PL')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/zamowienie/${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Szczegóły
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
