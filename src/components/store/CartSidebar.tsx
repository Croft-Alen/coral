'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaGift, FaUser, FaTag, FaArrowRight } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { CartItem } from './CartItem'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    items,
    basketId,
    updateQuantity,
    removeItem,
    getTotal,
    getItemCount,
    isLoading,
    basketSubtotal,
    basketTax,
    basketTotal,
    coupons,
    giftCards,
    creatorCode,
    applyCoupon,
    removeCoupon,
    applyGiftCard,
    removeGiftCard,
    applyCreatorCode,
    removeCreatorCode,
    syncBasket,
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [giftCardInput, setGiftCardInput] = useState('')
  const [creatorCodeInput, setCreatorCodeInput] = useState('')

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false)
  const [isApplyingCreatorCode, setIsApplyingCreatorCode] = useState(false)

  const localTotal = getTotal()
  const hasBasket = Boolean(basketId)

  const subtotal = hasBasket ? Number(basketSubtotal) : localTotal
  const tax = Number(basketTax) || 0
  const total = hasBasket ? Number(basketTotal) : subtotal + tax

  const itemCount = getItemCount()

  const safeCoupons = Array.isArray(coupons) ? coupons : []
  const safeGiftCards = Array.isArray(giftCards) ? giftCards : []

  const hasCoupon = safeCoupons.length > 0
  const hasGiftCard = safeGiftCards.length > 0
  const hasCreatorCode =
    typeof creatorCode === 'string' && creatorCode.trim().length > 0

  const handleApplyCoupon = async () => {
    const code = couponInput.trim()

    if (!code || isApplyingCoupon) return

    setIsApplyingCoupon(true)

    try {
      const success = await applyCoupon(code)

      if (success) {
        setCouponInput('')
        setTimeout(() => syncBasket(), 100)
      }
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = async (code: string) => {
    await removeCoupon(code)
    await syncBasket()
  }

  const handleApplyGiftCard = async () => {
    const code = giftCardInput.trim()

    if (!code || isApplyingGiftCard) return

    setIsApplyingGiftCard(true)

    try {
      const success = await applyGiftCard(code)

      if (success) {
        setGiftCardInput('')
        setTimeout(() => syncBasket(), 100)
      }
    } finally {
      setIsApplyingGiftCard(false)
    }
  }

  const handleRemoveGiftCard = async (cardNumber: string) => {
    await removeGiftCard(cardNumber)
    await syncBasket()
  }

  const handleApplyCreatorCode = async () => {
    const code = creatorCodeInput.trim()

    if (!code || isApplyingCreatorCode) return

    setIsApplyingCreatorCode(true)

    try {
      const success = await applyCreatorCode(code)

      if (success) {
        setCreatorCodeInput('')
        setTimeout(() => syncBasket(), 100)
      }
    } finally {
      setIsApplyingCreatorCode(false)
    }
  }

  const handleRemoveCreatorCode = async () => {
    if (!creatorCode) return

    await removeCreatorCode(creatorCode)
    await syncBasket()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 md:w-[420px] bg-cardBg shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-cardBg">
          <h2 className="text-lg font-bold text-text-heading">
            Your Cart ({itemCount} items)
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-heading transition-colors cursor-pointer p-2"
            aria-label="Close cart"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="overflow-y-auto px-4 py-4 max-h-[300px]">
          {isLoading && items.length === 0 ? (
            <p className="text-text-muted text-center py-8">
              Loading your cart...
            </p>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted mb-4">
                Your cart is empty.
              </p>

              <Button
                href="/store"
                variant="primary"
                size="md"
                onClick={onClose}
                className="cursor-pointer"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  isLoading={isLoading}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-cardBg">
            {/* Code Inputs Container */}
            <div className="bg-pageBg rounded-sm p-3 space-y-2.5 mb-3">

              {/* Gift Card */}
              {!hasGiftCard && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <FaGift className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />

                    <input
                      type="text"
                      placeholder="Gift card number"
                      value={giftCardInput}
                      onChange={(e) => setGiftCardInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyGiftCard()
                        }
                      }}
                      className="w-full bg-cardBg rounded-sm pl-8 pr-3 py-2 text-sm text-text-body placeholder-text-muted focus:outline-none"
                      disabled={isApplyingGiftCard || isLoading}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyGiftCard}
                    className="h-9 w-9 flex items-center justify-center bg-brand text-white rounded-sm hover:brightness-105 transition-all cursor-pointer flex-shrink-0"
                    disabled={
                      !giftCardInput.trim() ||
                      isApplyingGiftCard ||
                      isLoading
                    }
                  >
                    {isApplyingGiftCard ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Applied Gift Cards */}
              {hasGiftCard && (
                <div className="space-y-2">
                  {safeGiftCards.map((giftCard: any, index: number) => {
                    const rawCardNumber =
                      giftCard?.card_number ??
                      giftCard?.code ??
                      ''

                    // Tebex may return card_number as a NUMBER.
                    // Always normalize it to a string before using
                    // string methods or passing it to removeGiftCard.
                    const cardNumber = String(rawCardNumber)

                    const maskedCard =
                      cardNumber.length > 4
                        ? `•••• •••• •••• ${cardNumber.slice(-4)}`
                        : cardNumber

                    return (
                      <div
                        key={`gift-${index}`}
                        className="flex items-center justify-between gap-3 bg-cardBg border border-white/10 rounded-sm px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FaGift className="text-brand w-3.5 h-3.5 flex-shrink-0" />

                          <span className="text-sm text-text-body truncate">
                            {maskedCard}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveGiftCard(cardNumber)}
                          disabled={isLoading}
                          className="text-text-muted hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                          aria-label="Remove gift card"
                        >
                          <FaTimes className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Creator Code */}
              {!hasCreatorCode && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />

                    <input
                      type="text"
                      placeholder="Creator code"
                      value={creatorCodeInput}
                      onChange={(e) =>
                        setCreatorCodeInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCreatorCode()
                        }
                      }}
                      className="w-full bg-cardBg rounded-sm pl-8 pr-3 py-2 text-sm text-text-body placeholder-text-muted focus:outline-none"
                      disabled={isApplyingCreatorCode || isLoading}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCreatorCode}
                    className="h-9 w-9 flex items-center justify-center bg-brand text-white rounded-sm hover:brightness-105 transition-all cursor-pointer flex-shrink-0"
                    disabled={
                      !creatorCodeInput.trim() ||
                      isApplyingCreatorCode ||
                      isLoading
                    }
                  >
                    {isApplyingCreatorCode ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Applied Creator Code */}
              {hasCreatorCode && (
                <div className="flex items-center justify-between gap-3 bg-cardBg border border-white/10 rounded-sm px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaUser className="text-brand w-3.5 h-3.5 flex-shrink-0" />

                    <span className="text-sm text-text-body truncate">
                      {creatorCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCreatorCode}
                    disabled={isLoading}
                    className="text-text-muted hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                    aria-label={`Remove creator code ${creatorCode}`}
                  >
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Coupon Code */}
              {!hasCoupon && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />

                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon()
                        }
                      }}
                      className="w-full bg-cardBg rounded-sm pl-8 pr-3 py-2 text-sm text-text-body placeholder-text-muted focus:outline-none"
                      disabled={isApplyingCoupon || isLoading}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="h-9 w-9 flex items-center justify-center bg-brand text-white rounded-sm hover:brightness-105 transition-all cursor-pointer flex-shrink-0"
                    disabled={
                      !couponInput.trim() ||
                      isApplyingCoupon ||
                      isLoading
                    }
                  >
                    {isApplyingCoupon ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Applied Coupons */}
            {hasCoupon && (
              <div className="mb-3 space-y-2">
                {safeCoupons.map((coupon: any, index: number) => {
                  const rawCode =
                    coupon?.coupon_code ??
                    coupon?.code ??
                    coupon?.name ??
                    ''

                  const code = String(rawCode)

                  return (
                    <div
                      key={`${code}-${index}`}
                      className="flex items-center justify-between gap-3 bg-pageBg border border-white/10 rounded-sm px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FaTag className="text-brand w-3.5 h-3.5 flex-shrink-0" />

                        <span className="text-sm text-text-body truncate">
                          {code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(code)}
                        disabled={isLoading}
                        className="text-text-muted hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                        aria-label={`Remove ${code}`}
                      >
                        <FaTimes className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Summary */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-text-body text-sm">
                <span>Subtotal</span>

                <span className="font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-text-body text-sm">
                <span>Tax</span>

                <span className="font-medium">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-2 flex justify-between text-text-heading font-bold text-lg">
                <span>Total</span>

                <span className="text-brand">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
  variant="primary"
  size="lg"
  className="w-full justify-center h-11 text-base cursor-pointer"
  disabled={!basketId || isLoading}
  onClick={async () => {
    if (!basketId || isLoading) return

    try {
      const response = await fetch('/api/tebex/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basketId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.checkoutUrl) {
        console.error('Checkout error:', data)
        return
      }

      onClose()

      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Failed to start checkout:', error)
    }
  }}
>
  Proceed to Checkout
</Button>
          </div>
        )}
      </div>
    </>
  )
}