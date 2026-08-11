'use client'

interface PageLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="relative z-20 mt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cardBg p-6 sm:p-8 shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-text-body text-sm sm:text-base font-normal mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}