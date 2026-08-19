'use client'

interface CategoryNameCardProps {
  name: string
  loading?: boolean
}

export function CategoryNameCard({
  name,
  loading = false,
}: CategoryNameCardProps) {
  return (
    <div className="bg-cardBg p-3 sm:p-6 md:p-8 shadow-lg rounded-md">
      <h1 className="text-base sm:text-xl md:text-2xl font-bold text-text-heading">
        {loading ? '‎ ' : name}
      </h1>
    </div>
  )
}