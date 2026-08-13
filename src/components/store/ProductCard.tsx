'use client'

import { useState } from 'react'
import { FaShoppingBasket, FaInfoCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import { ProductModal } from './ProductModal'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    description?: string
    image?: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()
  const { username } = useAuth()

  const formattedPrice = typeof product.price === 'number' 
    ? product.price.toFixed(2) 
    : '0.00'

  const handleAddToCart = async () => {
    if (!username) {
      toast.warning('Please login first to add items to your cart!')
      return
    }

    setIsAdding(true)
    try {
      await addItem(product.id, product.name, typeof product.price === 'number' ? product.price : 0)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.')
      console.error('Error adding to cart:', error)
    }
    setIsAdding(false)
  }

  return (
    <>
      <div className="bg-cardBg overflow-hidden flex flex-row w-full max-w-full cursor-pointer transition-shadow duration-300 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)] -mt-1">
        {/* Image - Left side */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center p-3 bg-cardBg">
          <img
            src={product.image || '/images/rank-placeholder.png'}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/rank-placeholder.png'
            }}
          />
        </div>

        {/* Content - Right side */}
        <div className="flex-1 flex items-center justify-between px-5 py-4 bg-cardBg gap-4 min-w-0">
          {/* Name and Price */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-text-heading truncate">{product.name || 'Unnamed Product'}</h3>
            <span className="text-base sm:text-lg font-bold text-brand">${formattedPrice}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button 
              variant="primary" 
              size="md" 
              className="gap-2 h-10 px-4 text-sm sm:text-base cursor-pointer rounded-sm"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              <FaShoppingBasket className="w-4 h-4" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button 
              variant="primary" 
              size="md" 
              className="w-10 h-10 p-0 flex items-center justify-center cursor-pointer rounded-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <FaInfoCircle className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  )
}