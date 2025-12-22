'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface CartActionsProps {
  productKitId: string
  quantity: number
}

export function CartActions({ productKitId, quantity: initialQuantity }: CartActionsProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKitId, quantity: newQuantity })
      })
      
      if (response.ok) {
        setQuantity(newQuantity)
        // Refresh the page to update cart totals
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
      <button
        onClick={() => updateQuantity(quantity - 1)}
        disabled={isUpdating || quantity <= 1}
        className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span className="px-3 font-semibold">{quantity}</span>
      
      <button
        onClick={() => updateQuantity(quantity + 1)}
        disabled={isUpdating}
        className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
