'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaStore, FaChevronDown, FaChevronRight } from 'react-icons/fa'

interface CategoryParent {
  id: number
  name: string
  slug?: string
}

interface Category {
  id: number
  name: string
  slug?: string
  description?: string
  parent?: CategoryParent | null
  tiered?: boolean
  packages?: any[]
  order?: number
  display_type?: string
  image_url?: string | null
  dynamic?: boolean
}

export function CategoriesCard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  )

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/tebex/categories')
        const data = await response.json()

        if (data.success) {
          const fetchedCategories = Array.isArray(data.data) ? data.data : []
          const sortedCategories = [...fetchedCategories].sort((a, b) => {
            const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER
            const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER
            return orderA - orderB
          })
          setCategories(sortedCategories)
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

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div aria-hidden="true" className="bg-cardBg shadow-lg overflow-hidden rounded-md min-h-[200px]" />
    )
  }

  if (categories.length === 0) {
    return null
  }

  const topLevelCategories = categories.filter(
    category => category.parent === null || category.parent === undefined
  )

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      <div className="relative">
        <div className="absolute inset-0 h-12 bg-brand" />
        <div className="relative px-4 py-3 flex items-center gap-3">
          <FaStore className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
            Browse Categories
          </h3>
        </div>
      </div>

      <div className="p-3">
        <div className="space-y-2">
          {topLevelCategories.map(category => {
            const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
            const childCategories = categories
              .filter(child => child.parent?.id === category.id)
              .sort((a, b) => {
                const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER
                const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER
                return orderA - orderB
              })
            const isExpanded = expandedCategories.has(category.id)
            const hasChildren = childCategories.length > 0

            return (
              <div key={category.id} className="bg-pageBg rounded-md overflow-hidden">
                <div className="flex items-center">
                  <Link
                    href={`/${categorySlug}`}
                    className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-pageBg/80 transition-colors min-w-0"
                  >
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt=""
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <span className="flex-1 text-text-body text-base sm:text-lg font-medium">
                      {category.name}
                    </span>
                  </Link>

                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      aria-label={
                        isExpanded
                          ? `Collapse ${category.name}`
                          : `Expand ${category.name}`
                      }
                      aria-expanded={isExpanded}
                      className="px-4 py-3 self-stretch flex items-center justify-center hover:text-brand transition-colors"
                    >
                      {isExpanded ? (
                        <FaChevronDown className="w-4 h-4 text-text-muted" />
                      ) : (
                        <FaChevronRight className="w-4 h-4 text-text-muted" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={`/${categorySlug}`}
                      aria-label={`Open ${category.name}`}
                      className="px-4 py-3 self-stretch flex items-center justify-center hover:text-brand transition-colors"
                    >
                      <FaChevronRight className="w-4 h-4 text-text-muted" />
                    </Link>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="pb-3 space-y-1">
                    {childCategories.map(child => {
                      const childSlug = child.slug || child.name.toLowerCase().replace(/\s+/g, '-')
                      return (
                        <Link
                          key={child.id}
                          href={`/${childSlug}`}
                          className="block py-1.5 hover:text-brand transition-colors text-text-body text-sm sm:text-base font-medium pl-[76px]"
                        >
                          {child.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}