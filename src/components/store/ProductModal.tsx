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
      title={product.name || 'Product'}
      className="!max-w-2xl !w-full !rounded-sm !bg-pageBg !max-h-[90vh] !overflow-y-auto"
    >
      <div className="py-4">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-32 h-32 flex items-center justify-center p-4 bg-pageBg flex-shrink-0">
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
          className="text-text-body text-base mb-6"
          dangerouslySetInnerHTML={{
            __html:
              product.description ||
              '<p>No description available for this product.</p>',
          }}
        />
        
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full gap-2 h-12 text-base cursor-pointer"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <FaShoppingBasket className="w-5 h-5" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </Modal>
  )
}