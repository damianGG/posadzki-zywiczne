import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

async function getProducts() {
  try {
    const products = await prisma.productKit.findMany({
      orderBy: {
        bucket: 'asc',
      },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function SklepPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Sklep - Zestawy do Posadzek Żywicznych</h1>
          <p className="text-xl text-muted-foreground">
            Kompletne zestawy do wykonania trwałej posadzki w garażu
          </p>
          <div className="mt-6">
            <Link href="/konfigurator">
              <Button size="lg" className="text-lg">
                🎯 Skorzystaj z konfiguratora
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  SKU: {product.sku}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4 text-muted-foreground">{product.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Typ:</span>
                    <span className="text-sm">
                      {product.type === 'EP' ? 'Epoksydowa' : 'Poliuretanowa'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Powierzchnia:</span>
                    <span className="text-sm">do {product.bucket}m²</span>
                  </div>
                  {product.hasR10 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Antypoślizg:</span>
                      <span className="text-sm text-green-600">R10 ✓</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Kolor:</span>
                      <span className="text-sm">{product.color}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold">
                      {parseFloat(product.basePrice.toString()).toLocaleString('pl-PL')} zł
                    </span>
                    {product.hasR10 && product.r10Surcharge > 0 && (
                      <span className="text-sm text-muted-foreground">
                        +{parseFloat(product.r10Surcharge.toString()).toLocaleString('pl-PL')} zł (R10)
                      </span>
                    )}
                  </div>
                </div>
                <form action="/api/cart" method="POST" className="w-full">
                  <input type="hidden" name="action" value="add" />
                  <input type="hidden" name="productKitId" value={product.id} />
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={async (e) => {
                      e.preventDefault()
                      const totalPrice = parseFloat(product.basePrice.toString()) + parseFloat(product.r10Surcharge.toString())
                      
                      const response = await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          action: 'add',
                          item: {
                            productKitId: product.id,
                            sku: product.sku,
                            name: product.name,
                            price: totalPrice,
                            quantity: 1,
                          },
                        }),
                      })
                      
                      if (response.ok) {
                        window.location.href = '/koszyk'
                      }
                    }}
                  >
                    Dodaj do koszyka
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-xl text-muted-foreground">
              Brak dostępnych produktów. Uruchom seeder bazy danych.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
