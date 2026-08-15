'use client'

import { useState, useEffect } from 'react'

interface RecentPayment {
  id: number
  username: string
  username_id: string
  avatar_url?: string
}

export function RecentPayments() {
  const [payments, setPayments] = useState<RecentPayment[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const response = await fetch('/api/tebex/store')
        const data = await response.json()

        if (data.success) {
          setPayments(data.data.recentPayments || null)
        } else {
          setPayments(null)
        }
      } catch (error) {
        console.error('Error fetching recent payments:', error)
        setPayments(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPayments()
  }, [])

  // Reserve the card's expected height while Tebex data is loading.
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="bg-cardBg shadow-lg overflow-hidden rounded-md min-h-[136px]"
      />
    )
  }

  // Tebex does not have the recent_payments module.
  if (payments === null) {
    return null
  }

  const totalSlots = 8
  const filledSlots = payments.slice(0, totalSlots)
  const emptySlots = totalSlots - filledSlots.length

  // Module exists, but there are currently no payments.
  if (filledSlots.length === 0) {
    return null
  }

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      {/* Header with Brand Strip Behind Title */}
      <div className="relative">
        <div className="absolute inset-0 h-12 bg-brand" />

        <div className="relative px-4 py-3">
          <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
            RECENT PAYMENTS
          </h3>
        </div>
      </div>

      <div className="px-3 pt-3 pb-4">
        <div className="grid grid-cols-4 gap-3">
          {filledSlots.map((payment) => (
            <div
              key={payment.id}
              className="relative group flex flex-col items-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm overflow-hidden bg-white/5">
                <img
                  src={
                    payment.avatar_url ||
                    `https://minotar.net/avatar/${payment.username_id}.png`
                  }
                  alt={payment.username}
                  className="w-full h-full object-cover"
                />

                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-pageBg text-text-body text-sm px-3 py-1.5 rounded-sm whitespace-nowrap pointer-events-none font-medium shadow-lg border border-white/5">
                  {payment.username}
                </div>
              </div>
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-pageBg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

