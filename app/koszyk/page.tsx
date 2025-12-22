import { Metadata } from 'next'
import Link from 'next/link'
import { getCart } from '@/lib/cart'
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { CartActions } from '@/components/cart-actions'

export const metadata: Metadata = {
  title: 'Koszyk | Posadzki Żywiczne',
  description: 'Twój koszyk zakupowy',
}

export default async function KoszykPage() {
  const cart = await getCart()

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Twój koszyk jest pusty</h1>
            <p className="text-gray-600 mb-6">
              Dodaj produkty do koszyka, aby kontynuować zakupy
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/sklep"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Przejdź do sklepu
              </Link>
              <Link
                href="/konfigurator"
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Użyj konfiguratora
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Koszyk</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productKitId} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">SKU: {item.sku}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Ilość:</span>
                        <CartActions productKitId={item.productKitId} quantity={item.quantity} />
                      </div>
                      
                      <div className="text-lg font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} PLN
                      </div>
                    </div>
                  </div>
                  
                  <form action="/api/cart/remove" method="POST">
                    <input type="hidden" name="productKitId" value={item.productKitId} />
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 transition p-2"
                      title="Usuń z koszyka"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Podsumowanie</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Produkty ({cart.items.length})</span>
                  <span>{cart.total.toFixed(2)} PLN</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Suma</span>
                    <span>{cart.total.toFixed(2)} PLN</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Przejdź do kasy
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-4 space-y-2">
                <Link
                  href="/sklep"
                  className="block text-center text-blue-600 hover:text-blue-800 transition text-sm"
                >
                  Kontynuuj zakupy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
