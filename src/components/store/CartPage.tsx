'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import { useCart } from '@/context/CartContext'

export function CartPage() {
  const router = useRouter()
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    getItemCount, 
    checkout, 
    isLoading 
  } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = getTotal()
  const tax = subtotal * 0.10
  const total = subtotal + tax

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    const checkoutUrl = await checkout()
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    } else {
      alert('Failed to start checkout. Please try again.')
    }
    setIsCheckingOut(false)
  }

  if (isLoading) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="bg-cardBg shadow-lg p-8 text-center rounded-md">
        <h1 className="text-2xl font-bold text-text-heading mb-4">Your Cart is Empty</h1>
        <p className="text-text-muted mb-6">Looks like you haven't added anything yet.</p>
        <Button href="/store" variant="primary" size="md" className="cursor-pointer">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cart Items Card */}
      <div className="bg-cardBg shadow-lg p-6 rounded-md">
        <h1 className="text-2xl font-bold text-text-heading mb-6">Your Cart</h1>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-cardBg rounded-sm border-2 border-[#242844]">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <img 
                  src={item.image || '/images/rank-placeholder.png'} 
                  alt={item.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/rank-placeholder.png'
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-text-heading truncate">{item.name}</h4>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.packageId, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-sm hover:bg-red-500/10"
                  disabled={isLoading}
                >
                  <FaMinus className="w-3.5 h-3.5 text-red-500" />
                </button>
                <span className="w-10 text-center text-text-heading font-semibold text-base">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.packageId, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-sm hover:bg-green-500/10"
                  disabled={isLoading}
                >
                  <FaPlus className="w-3.5 h-3.5 text-green-500" />
                </button>
              </div>
              
              <div className="text-right min-w-[80px]">
                <p className="text-base font-bold text-brand">${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <button
                onClick={() => removeItem(item.packageId)}
                className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card - Separate card below */}
      <div className="bg-cardBg shadow-lg p-6 rounded-md">
        <h3 className="text-lg font-bold text-text-heading mb-4">Order Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-text-body text-sm">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-body text-sm">
            <span>Tax (10%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between text-text-heading font-bold text-lg">
            <span>Total</span>
            <span className="text-brand">${total.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          onClick={handleCheckout}
          variant="primary" 
          size="lg"
          className="w-full mt-4 justify-center h-12 text-base cursor-pointer"
          disabled={isCheckingOut || items.length === 0 || isLoading}
        >
          {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </div>
    </div>
  )
}