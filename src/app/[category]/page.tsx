'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { StoreMainContent } from '@/components/store/StoreMainContent'
import { ProductCard } from '@/components/store/ProductCard'

interface Package {
  id: number
  name: string
  price: number
  description?: string
  image?: string
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.category as string
  const [packages, setPackages] = useState<Package[]>([])
  const [categoryName, setCategoryName] = useState('Products')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/tebex/categories/${categoryId}`
        )

        const data = await response.json()

        if (data.success) {
          const categoryData = data.data

          const safePackages = (categoryData.packages || []).map((pkg: any) => ({
            id: pkg.id || 0,
            name: pkg.name || 'Unnamed Product',
            price: typeof pkg.total_price === 'number'
              ? pkg.total_price
              : typeof pkg.base_price === 'number'
              ? pkg.base_price
              : 0,
            description: pkg.description || '',
            image: pkg.image || pkg.icon || '/images/rank-placeholder.png',
          }))

          setPackages(safePackages)
          setCategoryName(categoryData.name || 'Products')
        } else {
          setError(data.error || 'Failed to load category')
          setPackages([])
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        setError('Failed to load products')
        setPackages([])
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  if (error) {
    return (
      <StoreLayout sidebar={<StoreSidebar />}>
        <div className="bg-cardBg p-6 shadow-lg border border-red-500/20">
          <h1 className="text-xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-text-muted">{error}</p>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <StoreMainContent 
        type="category"
        categoryName={categoryName}
        loading={loading}
      />
      
      {!loading && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4 mt-4 sm:mt-6">
          {packages.map((pkg) => (
            <ProductCard key={pkg.id} product={pkg} />
          ))}
        </div>
      )}
      
      {!loading && packages.length === 0 && (
        <p className="text-text-muted text-sm sm:text-base mt-4 sm:mt-6">
          No products found in this category.
        </p>
      )}
    </StoreLayout>
  )
}