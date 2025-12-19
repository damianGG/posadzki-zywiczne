'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface CartItem {
  productKitId: string
  sku: string
  name: string
  price: number
  quantity: number
}

interface Cart {
  items: CartItem[]
  total: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerZip: '',
    paymentMethod: 'COD' as 'COD' | 'PRZELEWY24',
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      
      if (!data || data.items.length === 0) {
        router.push('/koszyk')
        return
      }
      
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        alert(error.error || 'Nie udało się utworzyć zamówienia')
        setSubmitting(false)
        return
      }

      const orderData = await orderResponse.json()
      const orderId = orderData.order.id

      // If payment method is Przelewy24, redirect to payment
      if (formData.paymentMethod === 'PRZELEWY24') {
        const paymentResponse = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        })

        if (!paymentResponse.ok) {
          alert('Nie udało się utworzyć płatności')
          setSubmitting(false)
          return
        }

        const paymentData = await paymentResponse.json()
        
        // Redirect to Przelewy24
        window.location.href = paymentData.paymentUrl
      } else {
        // COD - redirect to order status page
        router.push(`/zamowienie/${orderId}`)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Ładowanie...</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">Finalizacja zamówienia</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dane zamawiającego</CardTitle>
                    <CardDescription>Podaj dane do wysyłki i kontaktu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Imię i nazwisko *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        placeholder="Jan Kowalski"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="customerEmail">Email *</Label>
                        <Input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          required
                          placeholder="jan@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">Telefon *</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          required
                          placeholder="+48 123 456 789"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customerAddress">Adres *</Label>
                      <Input
                        id="customerAddress"
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleChange}
                        required
                        placeholder="ul. Przykładowa 123"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="customerCity">Miasto *</Label>
                        <Input
                          id="customerCity"
                          name="customerCity"
                          value={formData.customerCity}
                          onChange={handleChange}
                          required
                          placeholder="Warszawa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerZip">Kod pocztowy *</Label>
                        <Input
                          id="customerZip"
                          name="customerZip"
                          value={formData.customerZip}
                          onChange={handleChange}
                          required
                          placeholder="00-000"
                          pattern="[0-9]{2}-[0-9]{3}"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metoda płatności</CardTitle>
                    <CardDescription>Wybierz sposób płatności</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                          formData.paymentMethod === 'PRZELEWY24'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'PRZELEWY24' })}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="PRZELEWY24"
                            checked={formData.paymentMethod === 'PRZELEWY24'}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          <div>
                            <p className="font-semibold">Przelewy24</p>
                            <p className="text-sm text-muted-foreground">
                              BLIK, szybkie przelewy, karty płatnicze
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                          formData.paymentMethod === 'COD'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === 'COD'}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          <div>
                            <p className="font-semibold">Płatność przy odbiorze (COD)</p>
                            <p className="text-sm text-muted-foreground">
                              Zapłać gotówką przy odbiorze
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Podsumowanie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.productKitId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span>{(item.price * item.quantity).toLocaleString('pl-PL')} zł</span>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span>Dostawa:</span>
                          <span className="text-green-600">Gratis</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Razem:</span>
                          <span>{cart.total.toLocaleString('pl-PL')} zł</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? 'Przetwarzanie...' : 'Złóż zamówienie'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
