'use client'

import { useState, useEffect } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
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

interface CategoryPageClientProps {
  categoryId: string
}

export default function CategoryPageClient({
  categoryId,
}: CategoryPageClientProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [categoryName, setCategoryName] = useState('')
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

          const safePackages = (
            categoryData.packages || []
          ).map((pkg: any) => ({
            id: pkg.id || 0,
            name: pkg.name || 'Unnamed Product',
            price:
              typeof pkg.total_price === 'number'
                ? pkg.total_price
                : typeof pkg.base_price === 'number'
                  ? pkg.base_price
                  : 0,
            description: pkg.description || '',
            image:
              pkg.image ||
              pkg.icon ||
              '/images/rank-placeholder.png',
          }))

          setPackages(safePackages)

          setCategoryName(
            typeof categoryData.name === 'string'
              ? categoryData.name
              : ''
          )
        } else {
          setError(
            data.error || 'Failed to load category'
          )
          setPackages([])
          setCategoryName('')
        }
      } catch (error) {
        console.error(
          'Error fetching category:',
          error
        )

        setError('Failed to load products')
        setPackages([])
        setCategoryName('')
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
        <div className="bg-cardBg shadow-lg rounded-md overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center px-6 py-12 sm:px-8 sm:py-16">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
              <FaBoxOpen className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading">
              Category Not Found
            </h1>

            <p className="mt-3 text-sm sm:text-base text-text-muted max-w-md">
              {error}
            </p>
          </div>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      {/* ALWAYS PRESENT */}
      <StoreMainContent
        type="category"
        categoryName={categoryName}
        loading={loading}
      />

      {!loading && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4 mt-4 sm:mt-6">
          {packages.map((pkg) => (
            <ProductCard
              key={pkg.id}
              product={pkg}
            />
          ))}
        </div>
      )}

      {!loading && packages.length === 0 && (
        <div className="bg-cardBg shadow-lg rounded-md overflow-hidden mt-4 sm:mt-6">
          <div className="flex flex-col items-center justify-center text-center px-6 py-12 sm:px-8 sm:py-16">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand/10 mb-6">
              <FaBoxOpen className="w-10 h-10 text-brand" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading">
              No Products Found
            </h2>

            <p className="mt-3 text-sm sm:text-base text-text-muted max-w-md">
              There are currently no products available in this category.
            </p>
          </div>
        </div>
      )}
    </StoreLayout>
  )
}