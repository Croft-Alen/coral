'use client'

import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { useCart } from '@/context/CartContext'

export default function CompletePage() {
  const { basketId, isLoading } = useCart()
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let cancelled = false

    const verifyPayment = async () => {
      /*
       * CartContext needs time to hydrate the basket ID from
       * localStorage after the /complete page loads.
       *
       * Do NOT redirect when basketId is temporarily null.
       */
      if (isLoading || !basketId) {
        return
      }

      try {
        const response = await fetch(
          `/api/tebex/basket?basketId=${encodeURIComponent(basketId)}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const data = await response.json()

        if (cancelled) return

        if (
          !response.ok ||
          !data.success ||
          !data.data
        ) {
          console.error(
            '[Complete] Failed to fetch basket:',
            data
          )

          window.location.replace('/')
          return
        }

        console.log(
          '[Complete] Basket:',
          data.data
        )

        /*
         * The payment is only considered complete when
         * Tebex explicitly reports complete === true.
         */
        if (data.data.complete !== true) {
          console.warn(
            '[Complete] Basket is not complete:',
            data.data
          )

          window.location.replace('/')
          return
        }

        setIsComplete(true)
      } catch (error) {
        if (cancelled) return

        console.error(
          '[Complete] Failed to verify completed payment:',
          error
        )

        window.location.replace('/')
      }
    }

    verifyPayment()

    return () => {
      cancelled = true
    }
  }, [basketId, isLoading])

  if (!isComplete) {
    return null
  }

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <div className="relative z-20 mt-4 pb-12">
        <div className="bg-cardBg p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand/10 mb-6">
              <FaCheckCircle className="w-12 h-12 text-brand" />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading">
              Payment Complete
            </h1>

            <p className="mt-3 text-sm sm:text-base text-text-muted">
              Thank you for your purchase!
            </p>

            <a
              href="/"
              className="mt-8 inline-flex items-center justify-center h-11 px-6 rounded-md bg-brand text-white font-medium hover:brightness-105 transition-all"
            >
              Return to Store
            </a>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}