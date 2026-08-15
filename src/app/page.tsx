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

export default function StorePage() {
  const [storeData, setStoreData] = useState<StoreData | null>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch('/api/tebex/store')
        const data = await response.json()

        if (data.success) {
          setStoreData(data.data || null)
        }
      } catch (error) {
        console.error('Error fetching store data:', error)
      }
    }

    fetchStoreData()
  }, [])

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <StoreDescription
        description={storeData?.webstore?.description || ''}
      />
    </StoreLayout>
  )
}
