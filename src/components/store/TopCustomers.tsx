'use client'

import { useState, useEffect } from 'react'

interface TopCustomer {
  username: string
  username_id: string
  avatar_url?: string
  total?: number
}

export function TopCustomers() {
  const [customer, setCustomer] = useState<TopCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopCustomer = async () => {
      try {
        const response = await fetch('/api/tebex/store')
        const data = await response.json()

        if (data.success) {
          setCustomer(data.data.topCustomer || null)
        }
      } catch (error) {
        console.error('Error fetching top customer:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopCustomer()
  }, [])

  if (loading) {
    return (
      <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
        <div className="px-4 py-3">
          <div className="inline-flex flex-col items-start">
            <h3 className="text-sm sm:text-base font-semibold text-text-heading uppercase tracking-wider">
              TOP CUSTOMER
            </h3>
            <div className="w-1/2 h-1 bg-brand rounded-full mt-[7px]" />
          </div>
        </div>

        {/* Empty content area with same height */}
        <div className="px-3 pb-3">
          <div className="h-[125px] rounded-md bg-pageBg" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      {/* Header */}
      <div className="px-4 py-3">
        <div className="inline-flex flex-col items-start">
          <h3 className="text-sm sm:text-base font-semibold text-text-heading uppercase tracking-wider">
            TOP CUSTOMER
          </h3>

          {/* Half-width underline based on the title width */}
          <div className="w-1/2 h-1 bg-brand rounded-full mt-1" />
        </div>
      </div>

      {customer ? (
        <div className="px-3 pb-3">
          {/* Inner Customer Card */}
          <div className="relative h-[125px] rounded-md bg-pageBg overflow-hidden">
            {/* Customer Information */}
            <div className="absolute left-[110px] top-1/2 -translate-y-1/2 z-10 min-w-0 pr-3">
              <p className="text-text-body font-bold text-base sm:text-lg truncate">
                {customer.username}
              </p>

              <p className="text-text-muted text-xs sm:text-sm mt-0.5">
                Paid the most this week
              </p>
            </div>

            {/* Minecraft Character */}
            <div className="absolute left-0 bottom-0 w-[100px] h-[145px] overflow-hidden pointer-events-none">
              <img
                src={`https://api.mineatar.io/body/full/${customer.username_id}?scale=6&overlay=true`}
                alt={`${customer.username}'s Minecraft skin`}
                className="absolute left-1/2 -translate-x-1/2 top-8 h-[155px] w-auto max-w-none object-contain image-rendering-pixelated"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-3">
          <div className="h-[125px] rounded-md bg-pageBg flex items-center justify-center">
            <p className="text-text-muted text-sm">
              No top customer yet.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}