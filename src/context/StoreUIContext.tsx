'use client'

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

interface StoreUIContextValue {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const StoreUIContext =
  createContext<StoreUIContextValue | undefined>(undefined)

export function StoreUIProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  return (
    <StoreUIContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </StoreUIContext.Provider>
  )
}

export function useStoreUI() {
  const context = useContext(StoreUIContext)

  if (!context) {
    throw new Error(
      'useStoreUI must be used within StoreUIProvider'
    )
  }

  return context
}
