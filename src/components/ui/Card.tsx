'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ active = false, className = '', children, onClick, ...props }, ref) => {
    const baseClasses = cn(
      "rounded-xl transition-all duration-300 cursor-pointer bg-cardBg",
      active ? 'border-brand/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_6px_12px_rgba(0,0,0,0.3)]' : '',
      className
    )

    return (
      <div ref={ref} className={baseClasses} onClick={onClick} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'