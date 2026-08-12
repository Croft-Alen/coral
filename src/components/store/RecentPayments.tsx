'use client'

import { useState, useEffect } from 'react'

interface RecentPayment {
  id: number
  username: string
  username_id: string
  avatar_url?: string
}

export function RecentPayments() {
  const [payments, setPayments] = useState<RecentPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const response = await fetch('/api/tebex/store')
        const data = await response.json()

        if (data.success) {
          setPayments(data.data.recentPayments || [])
        }
      } catch (error) {
        console.error('Error fetching recent payments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPayments()
  }, [])

  const totalSlots = 8
  const filledSlots = payments.slice(0, totalSlots)
  const emptySlots = totalSlots - filledSlots.length

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      <div className="px-4 py-3">
        <div className="inline-flex flex-col items-start">
          <h3 className="text-sm sm:text-base font-semibold text-text-heading uppercase tracking-wider">
            RECENT PAYMENTS
          </h3>
          <div className="w-1/2 h-1 bg-brand rounded-full mt-1" />
        </div>
      </div>

      <div className="px-3 pt-3 pb-4">
        <div className="grid grid-cols-4 gap-3">
          {!loading && payments.length > 0 ? (
            <>
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
                  </div>
                  
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand text-white text-sm px-3 py-1.5 rounded-sm whitespace-nowrap pointer-events-none font-medium">
                    {payment.username}
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
            </>
          ) : (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-pageBg" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}