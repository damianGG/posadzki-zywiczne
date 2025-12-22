import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ShoppingCart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sklep - Zestawy Posadzkowe do Garażu | Posadzki Żywiczne',
  description: 'Kup profesjonalne zestawy posadzkowe do garażu. Żywice epoksydowe i poliuretanowe z ogrzewaniem podłogowym.',
}

async function getProducts() {
  const products = await prisma.productKit.findMany({
    where: { active: true },
    orderBy: [
      { type: 'asc' },
      { bucketSize: 'asc' }
    ]
  })
  return products
}

export default async function SklepPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sklep - Zestawy Posadzkowe</h1>
          <p className="text-lg text-gray-600 mb-6">
            Profesjonalne zestawy do posadzek żywicznych w garażach. Wszystkie zestawy zawierają kompletne materiały potrzebne do wykończenia powierzchni.
          </p>
          <div className="flex gap-4">
            <Link
              href="/konfigurator"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Użyj konfiguratora
            </Link>
            <Link
              href="/koszyk"
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Koszyk
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.type === 'PU' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.type}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.basePrice.toFixed(2)} PLN
                    </span>
                  </div>
                  {product.hasR10 && product.r10Surcharge > 0 && (
                    <p className="text-xs text-gray-500">
                      (zawiera dopłatę R10: +{product.r10Surcharge.toFixed(2)} PLN)
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {product.bucketSize}m²
                  </span>
                  {product.hasR10 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      R10 Antypoślizg
                    </span>
                  )}
                  {product.color && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {product.color}
                    </span>
                  )}
                </div>

                <form action={`/api/cart/add`} method="POST" className="space-y-3">
                  <input type="hidden" name="productKitId" value={product.id} />
                  <input type="hidden" name="sku" value={product.sku} />
                  <input type="hidden" name="name" value={product.name} />
                  <input type="hidden" name="price" value={product.basePrice} />
                  <input type="hidden" name="quantity" value="1" />
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? 'Dodaj do koszyka' : 'Brak w magazynie'}
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Dostępne: {product.stock} szt.
                </p>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Brak dostępnych produktów</p>
          </div>
        )}
      </div>
    </div>
  )
}
