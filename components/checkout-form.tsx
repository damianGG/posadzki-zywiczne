'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cart } from '@/lib/cart'
import { CreditCard, Truck } from 'lucide-react'

interface CheckoutFormProps {
  cart: Cart
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'przelewy24' | 'cod'>('przelewy24')
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerZip: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items: cart.items,
          totalAmount: cart.total
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (paymentMethod === 'przelewy24' && data.paymentUrl) {
          // Redirect to Przelewy24
          window.location.href = data.paymentUrl
        } else {
          // Redirect to order confirmation
          router.push(`/zamowienie/${data.orderId}`)
        }
      } else {
        alert('Wystąpił błąd podczas tworzenia zamówienia. Spróbuj ponownie.')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Wystąpił błąd podczas tworzenia zamówienia. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dane kontaktowe</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Imię i nazwisko *
            </label>
            <input
              type="text"
              id="customerName"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="customerEmail"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                id="customerPhone"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Adres dostawy</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Ulica i numer *
            </label>
            <input
              type="text"
              id="customerAddress"
              required
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerZip" className="block text-sm font-medium text-gray-700 mb-1">
                Kod pocztowy *
              </label>
              <input
                type="text"
                id="customerZip"
                required
                pattern="[0-9]{2}-[0-9]{3}"
                placeholder="00-000"
                value={formData.customerZip}
                onChange={(e) => setFormData({ ...formData, customerZip: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="customerCity" className="block text-sm font-medium text-gray-700 mb-1">
                Miasto *
              </label>
              <input
                type="text"
                id="customerCity"
                required
                value={formData.customerCity}
                onChange={(e) => setFormData({ ...formData, customerCity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Metoda płatności</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('przelewy24')}
            className={`p-6 border-2 rounded-lg transition ${
              paymentMethod === 'przelewy24'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-semibold mb-1">Przelewy24</p>
            <p className="text-xs text-gray-600">BLIK, karty, przelewy</p>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentMethod('cod')}
            className={`p-6 border-2 rounded-lg transition ${
              paymentMethod === 'cod'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Truck className="w-8 h-8 mb-2 mx-auto" />
            <p className="font-semibold mb-1">Za pobraniem</p>
            <p className="text-xs text-gray-600">Płatność przy odbiorze</p>
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Uwagi do zamówienia (opcjonalnie)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Przetwarzanie...' : 'Złóż zamówienie'}
      </button>
    </form>
  )
}
