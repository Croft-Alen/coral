'use client'

interface StoreDescriptionProps {
  description: string
  loading?: boolean
}

export function StoreDescription({
  description,
  loading = false,
}: StoreDescriptionProps) {
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="
          bg-cardBg
          shadow-lg
          rounded-md
          relative
          z-10
          min-h-[140px]
          sm:min-h-[160px]
          md:min-h-[180px]
        "
      />
    )
  }

  if (!description) {
    return null
  }

  return (
    <div
      className="
        bg-cardBg
        p-6 sm:p-8
        shadow-lg
        rounded-md
        relative
        z-10
        min-h-[140px]
        sm:min-h-[160px]
        md:min-h-[180px]
      "
    >
      <div
        className="
          store-description
          prose prose-invert max-w-none
          text-text-body text-sm sm:text-base

          [&>p]:mb-3
          [&>p:last-child]:mb-0

          [&>h1]:text-2xl
          [&>h1]:font-bold
          [&>h1]:text-text-heading
          [&>h1]:mb-3

          [&>h2]:text-xl
          [&>h2]:font-bold
          [&>h2]:text-text-heading
          [&>h2]:mb-2

          [&>h3]:text-lg
          [&>h3]:font-semibold
          [&>h3]:text-text-heading
          [&>h3]:mb-2

          [&>ul]:list-disc
          [&>ul]:pl-5
          [&>ul]:mb-3

          [&>ol]:list-decimal
          [&>ol]:pl-5
          [&>ol]:mb-3

          [&>li]:mb-1

          [&>a]:text-brand
          [&>a]:hover:underline

          [&>strong]:text-text-heading
          [&>strong]:font-semibold

          [&>em]:text-text-heading
        "
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </div>
  )
}
