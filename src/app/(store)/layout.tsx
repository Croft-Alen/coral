'use client'

import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { StoreHeader } from '@/components/layout/store/StoreHeader'
import { StoreHero } from '@/components/layout/store/StoreHero'
import { StoreFooter } from '@/components/layout/store/StoreFooter'
import { SaleBanner } from '@/components/website/SaleBanner'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <StoreHeader />
          <StoreHero />
          <SaleBanner />
          <main>{children}</main>
          <StoreFooter />
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}