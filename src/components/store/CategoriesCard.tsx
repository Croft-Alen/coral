'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaStore } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'

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

  return (
    <>
      {/* Categories Card - Solid brand background */}
      <div 
        className="bg-brand shadow-lg overflow-hidden rounded-md cursor-pointer hover:brightness-105 transition-all duration-200 py-6 px-4 flex flex-col items-center justify-center"
        onClick={handleCardClick}
      >
        {/* Icon above text */}
        <FaStore className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2" />
        <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider text-center">
          Browse Categories
        </h3>
      </div>

      {/* Categories Modal - Rounded corners, no border, taller */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Categories"
        className="!max-w-2xl !w-full !border-none !shadow-lg !rounded-xl !min-h-[300px]"
      >
        <div className="py-6">
          {loading ? (
            <p className="text-text-muted text-sm text-center py-4">Loading categories...</p>
          ) : categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/store/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-3 text-text-body hover:text-brand transition-colors text-base sm:text-lg px-4 py-4 bg-[#2a2a4a]/30 rounded-sm border-l-4 border-brand"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-4">No categories yet.</p>
          )}
        </div>
      </Modal>
    </>
  )
}