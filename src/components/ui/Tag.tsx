'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/helpers'

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'dark' | 'outline'
  size?: 'sm' | 'md'
  className?: string
  children?: React.ReactNode
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = 'brand', size = 'md', className = '', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-1.5 text-sm'
    }

    const variantClasses = {
      brand: 'bg-brand text-pageBg font-semibold border border-black/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_12px_rgba(0,0,0,0.25)]',
      dark: 'bg-cardBg text-text-body font-semibold border border-white/10',
      outline: 'border border-white/15 text-text-body font-semibold bg-transparent'
    }

    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-full transition-all duration-150 select-none",
      sizeClasses[size],
      variantClasses[variant],
      className
    )

    return (
      <span ref={ref} className={baseClasses} {...props}>
        {children}
      </span>
    )
  }
)

Tag.displayName = 'Tag'