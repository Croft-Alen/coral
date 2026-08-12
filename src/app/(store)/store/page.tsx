'use client'

import { useState, useEffect } from 'react'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { StoreDescription } from '@/components/store/StoreDescription'

interface Package {
  id: number
  name: string
  price: number
  description: string
  image?: string
}

interface Webstore {
  description: string
}

interface StoreData {
  webstore: Webstore
}

export default function StorePage() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([])
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [packagesResponse, storeResponse] = await Promise.all([
          fetch('/api/tebex/packages'),
          fetch('/api/tebex/store'),
        ])

        const packagesData = await packagesResponse.json()
        const storeResponseData = await storeResponse.json()

        if (packagesData.success) {
          setFeaturedPackages(packagesData.data?.slice(0, 4) || [])
        }

        if (storeResponseData.success) {
          setStoreData(storeResponseData.data || null)
        }
      } catch (error) {
        console.error('Error fetching store data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [])

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      {/* Description Card - only shows when not loading and has description */}
      {!loading && storeData?.webstore?.description && (
        <StoreDescription description={storeData.webstore.description} />
      )}
    </StoreLayout>
  )
}