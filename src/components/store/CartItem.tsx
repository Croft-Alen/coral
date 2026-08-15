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
    <div className={`flex items-center gap-4 p-5 bg-pageBg rounded-sm ${compact ? 'p-4 gap-4' : ''}`}>
      {/* Name and Price - Stacked vertically */}
      <div className={`flex-1 min-w-0 ${compact ? 'max-w-[120px] sm:max-w-[160px]' : 'max-w-[180px] sm:max-w-[220px]'}`}>
        <h4 className={`font-bold text-text-heading truncate ${compact ? 'text-base' : 'text-lg'}`}>
          {item.name}
        </h4>
        <p className={`font-bold text-brand ${compact ? 'text-base mt-0.5' : 'text-xl mt-1'}`}>
          ${item.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.packageId, item.quantity - 1)}
          className={`flex items-center justify-center transition-colors cursor-pointer rounded-sm hover:bg-red-500/10 ${compact ? 'w-8 h-8' : 'w-9 h-9'}`}
          disabled={isLoading}
        >
          <FaMinus className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-red-500`} />
        </button>
        <span className={`text-center text-text-heading font-semibold ${compact ? 'w-9 text-base' : 'w-11 text-lg'}`}>
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.packageId, item.quantity + 1)}
          className={`flex items-center justify-center transition-colors cursor-pointer rounded-sm hover:bg-green-500/10 ${compact ? 'w-8 h-8' : 'w-9 h-9'}`}
          disabled={isLoading}
        >
          <FaPlus className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-green-500`} />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.packageId)}
        className="text-red-500 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
        disabled={isLoading}
      >
        <FaTrash className={`${compact ? 'w-4 h-4' : 'w-4.5 h-4.5'}`} />
      </button>
    </div>
  )
}