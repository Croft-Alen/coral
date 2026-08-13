'use client'

import { useState } from 'react'
import { FaShoppingBasket, FaTimes } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    price: number
    description?: string
    image?: string
  }
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addItem } = useCart()
  const { username } = useAuth()
  const [isAdding, setIsAdding] = useState(false)

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
      onClose()
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.')
      console.error('Error adding to cart:', error)
    }
    setIsAdding(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="!max-w-2xl !w-full !rounded-sm !max-h-[90vh] !overflow-y-auto !bg-pageBg !p-0"
    >
      <div className="py-2">
        {/* Top Section - Full width card background, no padding */}
        <div className="bg-cardBg rounded-sm px-6 py-4">
          <div className="flex items-start gap-6">
            {/* Image - Top Left */}
            <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center">
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

            {/* Name and Price - Next to Image */}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-2xl font-bold text-text-heading mb-1">
                {product.name || 'Unnamed Product'}
              </h2>
              <p className="text-xl font-bold text-brand">
                ${formattedPrice}
              </p>

              {/* Add to Cart Button - Below Price */}
              <div className="mt-3">
                <Button 
                  variant="primary" 
                  size="md"
                  className="gap-2 h-10 px-5 text-sm cursor-pointer w-auto"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <FaShoppingBasket className="w-4 h-4" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section - Page Background */}
        <div className="px-6 py-4">
          <div
            className="text-text-body text-base"
            dangerouslySetInnerHTML={{
              __html:
                product.description ||
                '<p>No description available for this product.</p>',
            }}
          />
        </div>
      </div>
    </Modal>
  )
}