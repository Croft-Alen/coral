'use client'

interface StoreLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function StoreLayout({ sidebar, children }: StoreLayoutProps) {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 25% width - NO PADDING */}
          <div className="lg:w-[25%] flex-shrink-0">
            {sidebar}
          </div>
          
          {/* Main Content - 75% width */}
          <div className="lg:w-[75%]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}