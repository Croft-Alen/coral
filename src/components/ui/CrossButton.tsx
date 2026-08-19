'use client'

import { FaTimes } from 'react-icons/fa'
import { Button } from './Button'

interface CrossButtonProps {
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

export function CrossButton({
  onClick,
  className = '',
  size = 'md',
  ariaLabel = 'Close',
}: CrossButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-0 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <FaTimes className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4.5 h-4.5' : 'w-5.5 h-5.5'}`} />
    </Button>
  )
}