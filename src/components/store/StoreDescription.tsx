'use client'

interface StoreDescriptionProps {
  description: string
}

export function StoreDescription({ description }: StoreDescriptionProps) {
  return (
    <div className="bg-cardBg p-6 sm:p-8 shadow-lg rounded-md">
      <div
        className="store-description prose prose-invert max-w-none text-text-body text-sm sm:text-base [&>p]:mb-3 [&>p:last-child]:mb-0 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-text-heading [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-text-heading [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-text-heading [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>li]:mb-1 [&>a]:text-brand [&>a]:hover:underline [&>strong]:text-text-heading [&>strong]:font-semibold [&>em]:text-text-heading"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </div>
  )
}