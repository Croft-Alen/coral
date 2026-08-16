'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaStore, FaArrowRight } from 'react-icons/fa'

interface Category {
  id: number
  name: string
  slug?: string
  packages?: any[]
}

export function CategoriesCard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/tebex/categories')
        const data = await response.json()

        if (data.success) {
          setCategories(data.data || [])
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Reserve the card's expected height while Tebex data is loading.
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="bg-cardBg shadow-lg overflow-hidden rounded-md min-h-[200px]"
      />
    )
  }

  // No categories available.
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      {/* Header with Brand Strip Behind Title */}
      <div className="relative">
        <div className="absolute inset-0 h-12 bg-brand" />
        <div className="relative px-4 py-3 flex items-center gap-3">
          <FaStore className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
            Browse Categories
          </h3>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-3">
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center gap-2 bg-pageBg rounded-md px-4 py-3 hover:bg-pageBg/80 transition-colors"
            >
              <span className="flex-1 text-text-body text-base sm:text-lg">
                {category.name}
              </span>
              <FaArrowRight className="w-4 h-4 text-text-muted" />
            </Link>
          ))}

          {/* Home Link */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-pageBg rounded-md px-4 py-3 hover:bg-pageBg/80 transition-colors"
          >
            <span className="flex-1 text-text-body text-base sm:text-lg">
              Home
            </span>
            <FaArrowRight className="w-4 h-4 text-text-muted" />
          </Link>
        </div>
      </div>
    </div>
  )
}