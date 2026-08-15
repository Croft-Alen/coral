
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaStore, FaArrowRight, FaHome } from 'react-icons/fa'
import { CrossButton } from '@/components/ui/CrossButton'
import { Button } from '@/components/ui/Button'

interface Category {
  id: number
  name: string
  slug?: string
  packages?: any[]
}

export function CategoriesCard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  if (!isModalOpen) {
    return (
      <div
        className="bg-brand shadow-lg overflow-hidden rounded-md cursor-pointer hover:brightness-105 transition-all duration-200 py-6 px-4 flex flex-col items-center justify-center relative z-20"
        onClick={handleCardClick}
      >
        <FaStore className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2" />

        <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider text-center">
          Browse Categories
        </h3>
      </div>
    )
  }

  return (
    <>
      {/* Categories Card */}
      <div
        className="bg-brand shadow-lg overflow-hidden rounded-md cursor-pointer py-6 px-4 flex flex-col items-center justify-center relative z-20 opacity-50"
        onClick={handleCardClick}
      >
        <FaStore className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2" />

        <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider text-center">
          Browse Categories
        </h3>
      </div>

      {/* Categories Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <div className="bg-pageBg rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden relative">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
            <h2 className="text-lg font-bold text-text-heading">
              Select a category
            </h2>

            <CrossButton
              onClick={() => setIsModalOpen(false)}
              size="md"
              ariaLabel="Close categories"
              className="!absolute !top-4 !right-4"
            />
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 bg-cardBg rounded-md px-4 py-3"
                  >
                    <span className="flex-1 text-text-body text-base sm:text-lg">
                      {category.name}
                    </span>

                    <Link
                     href={`/${category.name
  .toLowerCase()
  .replace(/\s+/g, '-')}`}
                      onClick={() => setIsModalOpen(false)}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-9 w-9 p-0 flex items-center justify-center cursor-pointer rounded-sm"
                        aria-label={`Go to ${category.name}`}
                      >
                        <FaArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}

                {/* Home */}
                <div className="flex items-center gap-2 bg-cardBg rounded-md px-4 py-3">
                  <span className="flex-1 text-text-body text-base sm:text-lg">
                    Home
                  </span>

                  <Link
                    href="/"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center cursor-pointer rounded-sm"
                      aria-label="Go to Store Home"
                    >
                      <FaHome className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-text-muted text-sm text-center py-8">
                No categories available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

