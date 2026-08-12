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
      <div className="bg-pageBg shadow-lg overflow-hidden flex flex-col w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-sm">
        <div className="w-full aspect-square flex items-center justify-center p-8 bg-pageBg">
          <img
            src={product.image || '/images/rank-placeholder.png'}
            alt={product.name}
            className="w-3/5 h-3/5 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/rank-placeholder.png'
            }}
          />
        </div>

        <div className="px-4 pt-1 pb-1 flex items-center justify-between bg-pageBg">
          <h3 className="text-base sm:text-lg font-bold text-text-heading">{product.name || 'Unnamed Product'}</h3>
          <span className="text-base sm:text-lg font-bold text-brand">${formattedPrice}</span>
        </div>

        <div className="px-4 pb-4 pt-2 flex items-center gap-2 bg-pageBg">
          <Button 
            variant="primary" 
            size="md" 
            className="flex-1 gap-1.5 h-10 text-sm sm:text-base cursor-pointer rounded-sm"
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  )
}