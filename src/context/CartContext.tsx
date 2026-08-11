'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface CartItem {
  id: string
  packageId: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  basketId: string | null
  isLoading: boolean
  addItem: (packageId: number, name: string, price: number, image?: string) => Promise<void>
  removeItem: (packageId: number) => Promise<void>
  updateQuantity: (packageId: number, quantity: number) => Promise<void>
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  checkout: () => Promise<string | null>
  syncBasket: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [basketId, setBasketId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useAuth()

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItems(parsed.items || [])
        setBasketId(parsed.basketId || null)
      } catch (e) {}
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items, basketId }))
  }, [items, basketId])

  // Sync basket after login
  useEffect(() => {
    if (username && basketId) {
      syncBasket()
    }
  }, [username])

  const syncBasket = async () => {
    if (!basketId) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tebex/basket?basketId=${basketId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const tebexItems = data.data.packages || []
        const syncedItems = tebexItems.map((pkg: any) => ({
          id: pkg.id.toString(),
          packageId: pkg.id,
          name: pkg.name,
          price: pkg.price || 0,
          quantity: pkg.quantity || 1,
          image: pkg.image || pkg.icon,
        }))
        setItems(syncedItems)
      }
    } catch (error) {
      console.error('Error syncing basket:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (packageId: number, name: string, price: number, image?: string) => {
    // Check if user is logged in
    if (!username) {
      alert('Please login first to add items to your cart.')
      return
    }

    try {
      setIsLoading(true)
      
      let currentBasketId = basketId
      
      // Calculate new quantity
      const existingItem = items.find(item => item.packageId === packageId)
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1
      
      if (!currentBasketId) {
        const response = await fetch('/api/tebex/basket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            packageId, 
            quantity: newQuantity,
            username: username
          }),
        })
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to create basket')
        }
        
        currentBasketId = data.data.ident
        setBasketId(currentBasketId)
      } else {
        const response = await fetch('/api/tebex/basket', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            basketId: currentBasketId,
            packageId,
            quantity: newQuantity,
            username: username
          }),
        })
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to update basket')
        }
      }
      
      // Update local state after successful API call
      setItems(prev => {
        const existing = prev.find(item => item.packageId === packageId)
        if (existing) {
          return prev.map(item =>
            item.packageId === packageId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, { 
          id: Date.now().toString(), 
          packageId, 
          name, 
          price, 
          quantity: 1,
          image 
        }]
      })
      
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (packageId: number) => {
    if (!basketId) return
    if (!username) {
      alert('Please login first.')
      return
    }
    
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/tebex/basket', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          basketId, 
          packageId,
          username: username 
        }),
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to remove item')
      }
      
      setItems(prev => prev.filter(item => item.packageId !== packageId))
      
      if (items.length === 1) {
        setBasketId(null)
        localStorage.removeItem('cart')
      }
      
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (packageId: number, quantity: number) => {
    if (quantity < 1) {
      await removeItem(packageId)
      return
    }
    
    if (!basketId) return
    if (!username) {
      alert('Please login first.')
      return
    }
    
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/tebex/basket', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          basketId, 
          packageId, 
          quantity,
          username: username 
        }),
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update quantity')
      }
      
      setItems(prev =>
        prev.map(item =>
          item.packageId === packageId ? { ...item, quantity } : item
        )
      )
      
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = () => {
    setItems([])
    setBasketId(null)
    localStorage.removeItem('cart')
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const checkout = async (): Promise<string | null> => {
    if (!basketId) return null
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/tebex/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketId }),
      })
      const data = await response.json()
      
      if (data.success) {
        return data.checkoutUrl
      }
      return null
    } catch (error) {
      console.error('Error during checkout:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider value={{
      items,
      basketId,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      checkout,
      syncBasket,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}