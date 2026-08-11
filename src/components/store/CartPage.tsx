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
    clearCart,
    isLoading 
  } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = getTotal()
  const tax = subtotal * 0.10 // 10% tax
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
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Loading your cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-text-heading mb-4">Your Cart is Empty</h1>
        <p className="text-text-muted mb-6">Looks like you haven't added anything yet.</p>
        <Button href="/store" variant="primary" size="md" className="cursor-pointer">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-heading mb-6">Your Cart ({getItemCount()} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-cardBg p-4 shadow-lg flex items-center gap-4">
              {/* Product Image Placeholder */}
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
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
              
              {/* Product Info */}
              <div className="flex-1">
                <h4 className="text-base font-bold text-text-heading">{item.name}</h4>
                <p className="text-sm font-bold text-brand">${item.price.toFixed(2)}</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.packageId, item.quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center bg-brand/10 hover:bg-brand/20 transition-colors text-brand cursor-pointer"
                  disabled={isLoading}
                >
                  <FaMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-text-heading font-semibold text-base">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.packageId, item.quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center bg-brand/10 hover:bg-brand/20 transition-colors text-brand cursor-pointer"
                  disabled={isLoading}
                >
                  <FaPlus className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Item Total & Remove */}
              <div className="text-right min-w-[80px]">
                <p className="text-base font-bold text-brand">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.packageId)}
                  className="text-text-muted hover:text-red-500 transition-colors cursor-pointer mt-1"
                  disabled={isLoading}
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-cardBg p-6 shadow-lg">
            <h3 className="text-lg font-bold text-text-heading mb-4">Order Summary</h3>
            
            <div className="space-y-3">
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
              className="w-full mt-6 justify-center h-12 text-base cursor-pointer"
              disabled={isCheckingOut || items.length === 0 || isLoading}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </Button>

            <button
              onClick={clearCart}
              className="w-full text-center text-text-muted hover:text-red-500 transition-colors text-sm mt-3"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}