'use client'

import { useEffect, useRef, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { useCart } from '@/context/CartContext'

export default function CompletePage() {
  const { basketId, isLoading, clearCart } = useCart()
  const [isComplete, setIsComplete] = useState(false)

  /*
   * Prevent verification from starting more than once.
   *
   * clearCart() sets basketId to null. Without this ref,
   * changing basketId after clearCart() could cause the
   * verification effect to run again.
   */
  const verificationStartedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const verifyPayment = async () => {
      /*
       * Never start payment verification twice.
       */
      if (verificationStartedRef.current) {
        return
      }

      /*
       * CartContext needs time to hydrate the existing
       * basket ID from localStorage.
       *
       * While this is happening, simply wait.
       */
      if (isLoading) {
        return
      }

      /*
       * No basket ID yet.
       *
       * Do not redirect and do not clear anything.
       *
       * The page remains mounted and visible while
       * CartContext finishes its lifecycle.
       */
      if (!basketId) {
        console.warn('[Complete] Waiting for basket ID...')
        return
      }

      verificationStartedRef.current = true

      try {
        console.log('[Complete] Verifying basket:', basketId)

        const response = await fetch(
          `/api/tebex/basket?basketId=${encodeURIComponent(basketId)}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const data = await response.json()

        if (cancelled) {
          return
        }

        if (!response.ok || !data.success || !data.data) {
          console.error('[Complete] Failed to fetch basket:', data)
          verificationStartedRef.current = false
          window.location.replace('/')
          return
        }

        const basket = data.data

        console.log('[Complete] Basket:', basket)

        /*
         * Tebex is the source of truth.
         *
         * Only clear the local cart when Tebex
         * explicitly reports the basket as complete.
         */
        if (basket.complete !== true) {
          console.warn('[Complete] Basket is not complete:', basket)
          verificationStartedRef.current = false
          window.location.replace('/')
          return
        }

        /*
         * PAYMENT SUCCESSFULLY VERIFIED.
         *
         * Clear the local cart now.
         *
         * This clears:
         *
         * - cart items
         * - basket ID
         * - coupons
         * - gift cards
         * - creator code
         * - basket pricing
         * - persisted cart storage
         *
         * The completed Tebex basket is NOT modified.
         *
         * The next product added after returning to
         * the store will therefore create a fresh basket.
         */
        clearCart()

        if (cancelled) {
          return
        }

        setIsComplete(true)

        console.log('[Complete] Payment verified and local cart cleared.')
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error('[Complete] Failed to verify completed payment:', error)
        verificationStartedRef.current = false
        window.location.replace('/')
      }
    }

    verifyPayment()

    return () => {
      cancelled = true
    }
  }, [basketId, isLoading, clearCart])

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <div className="relative z-20 mt-4 pb-12">
        <div className="bg-cardBg p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12">
            {/* Success icon */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand/10 mb-6">
              <FaCheckCircle className="w-12 h-12 text-brand" />
            </div>

            {/* Main heading */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading">
              Payment Complete
            </h1>

            {/* Message */}
            <p className="mt-3 text-sm sm:text-base text-text-muted">
              {isComplete ? 'Thank you for your purchase!' : 'Verifying your payment...'}
            </p>

            {/* Verification status */}
            {!isComplete && (
              <div className="mt-6 text-sm text-text-muted">
                Please wait a moment while we confirm your payment.
              </div>
            )}

            {/* Return button */}
            {isComplete && (
              <a
                href="/"
                className="mt-8 inline-flex items-center justify-center h-11 px-6 rounded-md bg-brand text-white font-medium hover:brightness-105 transition-all"
              >
                Return to Store
              </a>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}