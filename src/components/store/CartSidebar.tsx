'use client'

import { useEffect, useState } from 'react'
import {
  FaTimes,
  FaGift,
  FaUser,
  FaTag,
} from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { CartItem } from './CartItem'
import { CodeModal } from './CodeModal'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

type CodeType = 'coupon' | 'creator' | 'gift'

export function CartSidebar({
  isOpen,
  onClose,
}: CartSidebarProps) {
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
  } = useCart()

  const [activeCodeModal, setActiveCodeModal] =
    useState<CodeType | null>(null)

  const localTotal = getTotal()
  const hasBasket = Boolean(basketId)

  const subtotal = hasBasket
    ? Number(basketSubtotal) || 0
    : localTotal

  const tax = Number(basketTax) || 0

  const total = hasBasket
    ? Number(basketTotal) || 0
    : subtotal + tax

  const itemCount = getItemCount()

  /*
   * ---------------------------------------------------------
   * BODY SCROLL LOCK
   * ---------------------------------------------------------
   */
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

  /*
   * ---------------------------------------------------------
   * ESCAPE
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return
      }

      if (activeCodeModal) {
        setActiveCodeModal(null)
        return
      }

      if (isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape
      )
    }
  }, [isOpen, onClose, activeCodeModal])

  /*
   * ---------------------------------------------------------
   * CODE MODAL
   * ---------------------------------------------------------
   */
  const openCodeModal = (type: CodeType) => {
    setActiveCodeModal(type)
  }

  const closeCodeModal = () => {
    setActiveCodeModal(null)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 md:w-[420px] bg-cardBg shadow-2xl transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-cardBg flex-shrink-0">
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

        {/* Items */}
        {/*
         * IMPORTANT:
         *
         * flex-1 + min-h-0 allows this section to use only the
         * vertical space that remains between the header and footer.
         *
         * This prevents cart items from going underneath the
         * footer/separator on smaller laptop screens.
         */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
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
                href="/"
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
          <div className="flex-shrink-0 p-4 border-t border-white/5 bg-cardBg">
            {/* Code Buttons */}
            <div className="bg-pageBg rounded-sm p-3 space-y-2.5 mb-3">
              {/* Gift Card */}
              <Button
                variant="ghost"
                size="md"
                className="w-full flex items-center gap-3 justify-start bg-cardBg rounded-sm px-3 py-2.5 text-sm text-text-body hover:text-text-heading transition-colors cursor-pointer text-left"
                onClick={() => openCodeModal('gift')}
              >
                <FaGift className="text-text-muted w-3.5 h-3.5 flex-shrink-0" />
                <span>Gift Card</span>
              </Button>

              {/* Creator Code */}
              <Button
                variant="ghost"
                size="md"
                className="w-full flex items-center gap-3 justify-start bg-cardBg rounded-sm px-3 py-2.5 text-sm text-text-body hover:text-text-heading transition-colors cursor-pointer text-left"
                onClick={() => openCodeModal('creator')}
              >
                <FaUser className="text-text-muted w-3.5 h-3.5 flex-shrink-0" />
                <span>Creator Code</span>
              </Button>

              {/* Coupon */}
              <Button
                variant="ghost"
                size="md"
                className="w-full flex items-center gap-3 justify-start bg-cardBg rounded-sm px-3 py-2.5 text-sm text-text-body hover:text-text-heading transition-colors cursor-pointer text-left"
                onClick={() => openCodeModal('coupon')}
              >
                <FaTag className="text-text-muted w-3.5 h-3.5 flex-shrink-0" />
                <span>Coupon Code</span>
              </Button>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-text-body text-sm">
                <span>Subtotal</span>

                <span className="font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/*
               * Keep tax available for the calculation but don't
               * change the existing visual layout.
               */}
              <div className="border-t border-white/10 pt-2 flex justify-between text-text-heading font-bold text-lg">
                <span>Total</span>

                <span className="text-brand">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center h-11 text-base cursor-pointer"
              disabled={!basketId || isLoading}
              onClick={async () => {
                if (!basketId || isLoading) return

                try {
                  const response = await fetch(
                    '/api/tebex/checkout',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type':
                          'application/json',
                      },
                      body: JSON.stringify({
                        basketId,
                      }),
                    }
                  )

                  const data =
                    await response.json()

                  if (
                    !response.ok ||
                    !data.success ||
                    !data.checkoutUrl
                  ) {
                    console.error(
                      'Checkout error:',
                      data
                    )

                    return
                  }

                  onClose()

                  window.location.href =
                    data.checkoutUrl
                } catch (error) {
                  console.error(
                    'Failed to start checkout:',
                    error
                  )
                }
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>

      {/* Code Modal */}
      <CodeModal
        isOpen={activeCodeModal !== null}
        onClose={closeCodeModal}
        type={activeCodeModal ?? 'coupon'}
      />
    </>
  )
}
