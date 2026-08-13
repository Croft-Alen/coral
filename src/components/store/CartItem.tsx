'use client'

import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'

interface CartItemProps {
  item: {
    id: string
    packageId: number
    name: string
    price: number
    quantity: number
    image?: string
  }
  onUpdateQuantity: (packageId: number, quantity: number) => void
  onRemove: (packageId: number) => void
  isLoading?: boolean
  compact?: boolean
}

export function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isLoading = false,
  compact = false 
}: CartItemProps) {
  return (
    <div className={`flex items-center gap-4 p-4 bg-pageBg rounded-sm ${compact ? 'p-3 gap-3' : ''}`}>
      {/* No Image - Removed */}

      {/* Name - Increased size */}
      <div className={`flex-1 min-w-0 ${compact ? 'max-w-[100px] sm:max-w-[140px]' : 'max-w-[150px] sm:max-w-[200px]'}`}>
        <h4 className={`font-bold text-text-heading truncate ${compact ? 'text-sm' : 'text-base'}`}>
          {item.name}
        </h4>
        {!compact && (
          <p className="text-sm font-bold text-brand">${item.price.toFixed(2)}</p>
        )}
      </div>

      {/* Quantity Controls - Increased size */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.packageId, item.quantity - 1)}
          className={`flex items-center justify-center transition-colors cursor-pointer rounded-sm hover:bg-red-500/10 ${compact ? 'w-7 h-7' : 'w-8 h-8'}`}
          disabled={isLoading}
        >
          <FaMinus className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-red-500`} />
        </button>
        <span className={`text-center text-text-heading font-semibold ${compact ? 'w-8 text-sm' : 'w-10 text-base'}`}>
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.packageId, item.quantity + 1)}
          className={`flex items-center justify-center transition-colors cursor-pointer rounded-sm hover:bg-green-500/10 ${compact ? 'w-7 h-7' : 'w-8 h-8'}`}
          disabled={isLoading}
        >
          <FaPlus className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-green-500`} />
        </button>
      </div>

      {/* Price - Increased size */}
      <div className={`text-right flex-shrink-0 ${compact ? 'min-w-[60px]' : 'min-w-[80px]'}`}>
        <p className={`font-bold text-brand ${compact ? 'text-sm' : 'text-base'}`}>
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button - Increased size */}
      <button
        onClick={() => onRemove(item.packageId)}
        className="text-red-500 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
        disabled={isLoading}
      >
        <FaTrash className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      </button>
    </div>
  )
}