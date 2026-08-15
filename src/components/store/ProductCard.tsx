'use client'

import { useState } from 'react'
import {
  FaShoppingBasket,
  FaInfoCircle,
} from 'react-icons/fa'
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

export function ProductCard({
  product,
}: ProductCardProps) {
  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false)

  const [
    isAdding,
    setIsAdding,
  ] = useState(false)

  const { addItem } = useCart()

  const {
    isLoggedIn,
    openLoginModal,
  } = useAuth()

  const formattedPrice =
    typeof product.price === 'number'
      ? product.price.toFixed(2)
      : '0.00'

  const handleAddToCart = async () => {
    /*
     * If the player is not logged in,
     * open the existing LoginModal instead
     * of showing a warning toast.
     */
    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    setIsAdding(true)

    try {
      await addItem(
        product.id,
        product.name,
        typeof product.price === 'number'
          ? product.price
          : 0
      )
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="bg-cardBg shadow-md overflow-hidden flex flex-col w-full cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg">

        <div className="w-full aspect-square flex items-center justify-center p-3 sm:p-5 bg-cardBg">
          <img
            src={
              product.image ||
              '/images/rank-placeholder.png'
            }
            alt={product.name}
            className="w-2/5 h-2/5 sm:w-3/5 sm:h-3/5 object-contain"
            onError={e => {
              const target =
                e.target as HTMLImageElement

              target.src =
                '/images/rank-placeholder.png'
            }}
          />
        </div>

        <div className="px-3 sm:px-4 pt-2 pb-1 flex items-center justify-between bg-cardBg">
          <h3 className="text-sm sm:text-base font-bold text-text-heading truncate">
            {product.name ||
              'Unnamed Product'}
          </h3>

          <span className="text-sm sm:text-base font-bold text-brand">
            ${formattedPrice}
          </span>
        </div>

        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 flex items-center gap-2 bg-cardBg">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 gap-1.5 h-10 sm:h-11 text-sm sm:text-base cursor-pointer rounded-sm"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FaShoppingBasket className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                Add to cart
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="w-10 h-10 sm:w-11 sm:h-11 p-0 flex items-center justify-center cursor-pointer rounded-sm"
            onClick={() =>
              setIsModalOpen(true)
            }
          >
            <FaInfoCircle className="w-4 h-4 sm:w-4.5 h-4.5" />
          </Button>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        product={product}
      />
    </>
  )
}