import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCart } from '@/lib/cart'
import { CheckoutForm } from '@/components/checkout-form'

export const metadata: Metadata = {
  title: 'Kasa | Posadzki Żywiczne',
  description: 'Finalizacja zamówienia',
}

export default async function CheckoutPage() {
  const cart = await getCart()

  if (cart.items.length === 0) {
    redirect('/koszyk')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizacja zamówienia</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <CheckoutForm cart={cart} />
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Podsumowanie zamówienia</h2>
              
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.productKitId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)} PLN
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Suma</span>
                    <span>{cart.total.toFixed(2)} PLN</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Metody płatności:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Przelewy24 (BLIK, karty, przelewy)</li>
                  <li>• Za pobraniem (COD)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
