'use client'

import { StoreDescription } from './StoreDescription'
import { CategoryNameCard } from './CategoryNameCard'

interface StoreMainContentProps {
  type: 'store' | 'category'
  description?: string
  categoryName?: string
  loading?: boolean
}

export function StoreMainContent({
  type,
  description,
  categoryName = '',
  loading = false,
}: StoreMainContentProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {type === 'store' && description && (
        <StoreDescription description={description} />
      )}

      {type === 'category' && (
        <>
          <CategoryNameCard
            name={categoryName}
            loading={loading}
          />

          {/* Products will be rendered after this in the page */}
        </>
      )}
    </div>
  )
}