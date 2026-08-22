'use client'

import { useState, useEffect } from 'react'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { StoreDescription } from '@/components/store/StoreDescription'

interface Webstore {
  description: string
}

interface StoreData {
  webstore: Webstore
}

export default function HomePageClient() {
  const [storeData, setStoreData] =
    useState<StoreData | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch('/api/tebex/store')

        const data = await response.json()

        if (data.success) {
          setStoreData(data.data || null)
        } else {
          setStoreData(null)
        }
      } catch (error) {
        console.error(
          'Error fetching store data:',
          error
        )

        setStoreData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [])

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <StoreDescription
        description={
          storeData?.webstore?.description || ''
        }
        loading={loading}
      />
    </StoreLayout>
  )
}
