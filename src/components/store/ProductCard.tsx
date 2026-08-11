'use client'

import { useState } from 'react'
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
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
      toast.success(`${product.name} added to cart! 🛒`)
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.')
      console.error('Error adding to cart:', error)
    }
    setIsAdding(false)
  }

  return (
    <>
      <div className="bg-cardBg shadow-lg overflow-hidden flex flex-col w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] border-4 border-[#242844] cursor-pointer hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="w-full aspect-square flex items-center justify-center p-8">
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

        {/* Product Name & Price */}
        <div className="px-4 pt-1 pb-1 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-text-heading">{product.name || 'Unnamed Product'}</h3>
          <span className="text-base sm:text-lg font-bold text-brand">${formattedPrice}</span>
        </div>

        {/* Buttons */}
        <div className="px-4 pb-4 pt-2 flex items-center gap-2">
          <Button 
            variant="primary" 
            size="md" 
            className="flex-1 gap-1.5 h-10 text-sm sm:text-base cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <FaShoppingCart className="w-4 h-4" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            className="w-10 h-10 p-0 flex items-center justify-center cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <FaInfoCircle className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>

      {/* Product Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={product.name || 'Product'}
        className="!max-w-2xl !w-full !border-4 !border-[#242844] !rounded-none"
      >
        <div className="py-4">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-32 h-32 flex items-center justify-center p-4">
              <img
                src={product.image || '/images/rank-placeholder.png'}
                alt={product.name || 'Product'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/rank-placeholder.png'
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-heading">{product.name || 'Unnamed Product'}</h2>
              <p className="text-xl font-bold text-brand">${formattedPrice}</p>
            </div>
          </div>
          <div
            className="text-text-body text-base"
            dangerouslySetInnerHTML={{
              __html:
                product.description ||
                '<p>No description available for this product.</p>',
            }}
          />
        </div>
      </Modal>
    </>
  )
}