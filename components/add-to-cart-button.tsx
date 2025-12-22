'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  product: {
    id: string
    sku: string
    name: string
    basePrice: number
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKitId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.basePrice,
          quantity: 1
        })
      })

      if (response.ok) {
        router.push('/koszyk')
      } else {
        alert('Nie udało się dodać produktu do koszyka')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || product.stock <= 0}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? 'Dodawanie...' : product.stock > 0 ? 'Dodaj do koszyka' : 'Brak w magazynie'}
    </button>
  )
}
