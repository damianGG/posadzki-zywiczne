'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productKitId: string
  sku: string
  name: string
  price: number
}

export function AddToCartButton({ productKitId, sku, name, price }: AddToCartButtonProps) {
  const router = useRouter()

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          item: {
            productKitId,
            sku,
            name,
            price,
            quantity: 1,
          },
        }),
      })

      if (response.ok) {
        router.push('/koszyk')
      } else {
        alert('Nie udało się dodać produktu do koszyka')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
    }
  }

  return (
    <Button className="w-full" onClick={handleAddToCart}>
      Dodaj do koszyka
    </Button>
  )
}
