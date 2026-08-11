'use client'

import { useState, useEffect } from 'react'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { useSettings } from '@/context/SettingsContext'

interface Package {
  id: number
  name: string
  price: number
  description: string
  image?: string
}

export default function StorePage() {
  const { settings } = useSettings()
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/tebex/packages')
        const data = await response.json()
        if (data.success) {
          setFeaturedPackages(data.data?.slice(0, 4) || [])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  return (
    <StoreLayout
      sidebar={<StoreSidebar />}
    >
      {/* Welcome Card */}
      <div className="bg-cardBg p-6 sm:p-8 shadow-lg border border-white/5">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-heading mb-4">
          Welcome to {settings.siteName} Store
        </h1>
        
        <div className="space-y-4 text-text-body text-sm sm:text-base">
          <p>
            If you have made a purchase but haven't received your items, please open a support ticket in the {settings.siteName} Discord server for assistance.
          </p>
          
          <p>
            For billing issues, payment-related questions, or any other purchase concerns, you can also contact our support team through Discord. Our team will respond within 48 hours.
          </p>
          
          <p>
            You can also reach us by email at support@{settings.siteName.toLowerCase()}.fun.
          </p>
        </div>

        {/* Refund Policy Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h2 className="text-lg font-semibold text-text-heading mb-2">Refund Policy</h2>
          <p className="text-text-body text-sm sm:text-base">
            All purchases made through the {settings.siteName} store are final and non-refundable.
          </p>
          <p className="text-text-body text-sm sm:text-base mt-2">
            Any attempt to initiate a chargeback or payment dispute may result in a permanent and irreversible ban from {settings.siteName} and our associated Minecraft services and stores.
          </p>
          <p className="text-text-body text-sm sm:text-base mt-2">
            Please allow 1–20 minutes for your purchase to be credited in-game. If your purchase has not been delivered after this time, please create a support ticket in our Discord server and provide proof of purchase so our team can investigate and resolve the issue.
          </p>
        </div>
      </div>
    </StoreLayout>
  )
}