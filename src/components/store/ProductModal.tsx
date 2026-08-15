'use client'

import { useState } from 'react'
import { FaShoppingBasket } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { CrossButton } from '@/components/ui/CrossButton'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

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

export function ProductModal({
  isOpen,
  onClose,
  product,
}: ProductModalProps) {
  const { addItem } = useCart()

  const {
    isLoggedIn,
    openLoginModal,
  } = useAuth()

  const [
    isAdding,
    setIsAdding,
  ] = useState(false)

  const formattedPrice =
    typeof product.price === 'number'
      ? product.price.toFixed(2)
      : '0.00'

  const handleAddToCart = async () => {
    /*
     * If the player is not logged in,
     * open the existing LoginModal.
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

      onClose()
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error
      )
    } finally {
      setIsAdding(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60">
      <div className="bg-pageBg rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative flex flex-col">

        {/* Close Button */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
          <CrossButton
            onClick={onClose}
            size="md"
            ariaLabel="Close product details"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-full overflow-hidden">

          {/* Left Column */}
          <div className="w-full md:w-2/5 lg:w-1/2 bg-cardBg p-4 sm:p-6 flex flex-col items-center justify-center flex-shrink-0 overflow-hidden min-h-[200px] md:min-h-0">

            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center flex-shrink-0">
              <img
                src={
                  product.image ||
                  '/images/rank-placeholder.png'
                }
                alt={
                  product.name ||
                  'Product'
                }
                className="w-full h-full object-contain"
                onError={e => {
                  const target =
                    e.target as HTMLImageElement

                  target.src =
                    '/images/rank-placeholder.png'
                }}
              />
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-heading mt-2 sm:mt-3 text-center">
              {product.name ||
                'Unnamed Product'}
            </h2>

            <p className="text-base sm:text-lg md:text-xl font-bold text-brand">
              ${formattedPrice}
            </p>

            <Button
              variant="primary"
              size="lg"
              className="mt-3 sm:mt-4 gap-2 h-10 sm:h-11 md:h-12 text-sm sm:text-base cursor-pointer w-full max-w-[180px] sm:max-w-[200px] flex-shrink-0"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              <FaShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5" />

              {isAdding
                ? 'Adding...'
                : 'Add to Cart'}
            </Button>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-3/5 lg:w-[55%] p-4 sm:p-6 overflow-y-auto flex-1 max-h-[50vh] md:max-h-none">
            <div
              className="product-description prose prose-invert max-w-none text-text-body text-sm sm:text-base
                [&>p]:mb-3 [&>p:last-child]:mb-0
                [&>h1]:text-xl [&>h1]:font-bold [&>h1]:text-text-heading [&>h1]:mb-3
                [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-text-heading [&>h2]:mt-4 [&>h2]:mb-2
                [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-text-heading [&>h3]:mt-3 [&>h3]:mb-1.5
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
                [&>li]:mb-1
                [&>strong]:text-text-heading [&>strong]:font-semibold
                [&>em]:text-text-heading
                [&>a]:text-brand [&>a]:hover:underline
                [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-md
              "
              dangerouslySetInnerHTML={{
                __html:
                  product.description ||
                  '<p class="text-text-muted">No description available for this product.</p>',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}