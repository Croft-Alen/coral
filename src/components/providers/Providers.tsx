'use client'

import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { StoreUIProvider } from '@/context/StoreUIContext'
import { ToastProvider } from '@/context/ToastContext'
import { SiteTitleManager } from './SiteTitleManager'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsProvider>
      <StoreUIProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <SiteTitleManager />

              {children}
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </StoreUIProvider>
    </SettingsProvider>
  )
}
