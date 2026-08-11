'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug?: string
  packages?: any[]
}

export function StoreSidebar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/tebex/categories')
        const data = await response.json()
        if (data.success) {
          setCategories(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="space-y-4">
      {/* Categories Card */}
      <div className="bg-cardBg shadow-lg overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 h-10 bg-brand" />
          <div className="relative px-3 py-2">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
              Categories
            </h3>
          </div>
        </div>
        <div className="px-3 pt-4 pb-6 min-h-[80px]">
          {loading ? (
            <p className="text-text-muted text-sm">Loading categories...</p>
          ) : categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
  href={`/store/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
  className="text-text-muted hover:text-brand transition-colors text-sm block"
>
  {category.name}
</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-sm">No categories yet.</p>
          )}
        </div>
      </div>
      
      {/* Top Customers Card */}
      <div className="bg-cardBg shadow-lg overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 h-10 bg-brand" />
          <div className="relative px-3 py-2">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
              Top Customers
            </h3>
          </div>
        </div>
        <div className="px-3 pt-4 pb-6 min-h-[80px]">
          <p className="text-text-muted text-sm">No top customers yet.</p>
        </div>
      </div>
      
      {/* Recent Payments Card */}
      <div className="bg-cardBg shadow-lg overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 h-10 bg-brand" />
          <div className="relative px-3 py-2">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
              Recent Payments
            </h3>
          </div>
        </div>
        <div className="px-3 pt-4 pb-6 min-h-[80px]">
          <p className="text-text-muted text-sm">No recent payments yet.</p>
        </div>
      </div>
    </div>
  )
}