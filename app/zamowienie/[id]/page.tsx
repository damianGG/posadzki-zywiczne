import { getOrderById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Status zamówienia | Posadzki Żywiczne',
  description: 'Sprawdź status swojego zamówienia',
};

export default async function ZamowieniePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment } = await searchParams;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const paymentStatusText = {
    pending: 'Oczekuje na płatność',
    paid: 'Opłacone',
    failed: 'Płatność nieudana',
    cancelled: 'Anulowane',
  };

  const orderStatusText = {
    new: 'Nowe',
    processing: 'W realizacji',
    completed: 'Zrealizowane',
    cancelled: 'Anulowane',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {payment === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              ✓ Płatność została zainicjowana. Sprawdź status poniżej.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zamówienie #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Złożone: {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Status zamówienia
              </h2>
              <div className="flex items-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.orderStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.orderStatus === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {orderStatusText[order.orderStatus as keyof typeof orderStatusText]}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Status płatności
              </h2>
              <div className="flex items-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {paymentStatusText[order.paymentStatus as keyof typeof paymentStatusText]}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Dane klienta
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Imię i nazwisko:</span>{' '}
                {order.customerName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.customerEmail}
              </p>
              <p>
                <span className="font-medium">Telefon:</span> {order.customerPhone}
              </p>
              <p>
                <span className="font-medium">Adres:</span>{' '}
                {order.customerAddress}, {order.customerZip} {order.customerCity}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Zamówione produkty
            </h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.productKit.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      SKU: {item.productKit.sku} | Ilość: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} zł
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.price.toFixed(2)} zł / szt.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-900">
                Suma całkowita:
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {order.totalAmount.toFixed(2)} zł
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Metoda płatności:</span>{' '}
                {order.paymentMethod === 'COD'
                  ? 'Płatność przy odbiorze'
                  : 'Przelewy24'}
              </p>
            </div>

            <Link
              href="/sklep"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Wróć do sklepu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
