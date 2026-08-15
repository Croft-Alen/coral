'use client'

import { CartSidebar } from './CartSidebar'
import { useStoreUI } from '@/context/StoreUIContext'

interface StoreLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function StoreLayout({
  sidebar,
  children,
}: StoreLayoutProps) {
  const { isCartOpen, closeCart } = useStoreUI()

  return (
    <>
      <div className="py-8 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <div className="lg:w-[25%] flex-shrink-0 min-h-[500px]">
              {sidebar}
            </div>

            {/* Main Content */}
            <main className="lg:w-[75%] min-h-[220px]">
              {children}
            </main>

          </div>
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </>
  )
}
