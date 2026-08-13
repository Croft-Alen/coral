'use client'

import { useState } from 'react'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { StoreHeader } from '@/components/layout/store/StoreHeader'
import { StoreHero } from '@/components/layout/store/StoreHero'
import { StoreFooter } from '@/components/layout/store/StoreFooter'
import { SaleBanner } from '@/components/website/SaleBanner'
import { CartSidebar } from '@/components/store/CartSidebar'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <StoreHeader onCartClick={toggleCart} />
          <StoreHero />
          <SaleBanner />
          <main>{children}</main>
          <StoreFooter />
          
          {/* Cart Sidebar */}
          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={closeCart} 
          />
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}