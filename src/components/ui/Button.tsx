'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/helpers'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  target?: string
  className?: string
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, target, className = '', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-6 py-2.5 text-sm gap-2',
      lg: 'px-8 py-3 text-base gap-2.5'
    }

    const variantClasses = {
      primary: 'bg-brand text-white font-semibold hover:brightness-105',
      secondary: 'bg-cardBg text-text-body font-semibold border border-white/10 hover:bg-white/5',
      ghost: 'text-text-body font-medium hover:text-text-heading transition-colors'
    }

    const baseClasses = cn(
      "inline-flex items-center justify-center transition-all duration-150 select-none",
      sizeClasses[size],
      variantClasses[variant],
      className
    )

    if (href) {
      return (
        <Link href={href} target={target} className={baseClasses}>
          {children}
        </Link>
      )
    }

    return (
      <button ref={ref} className={baseClasses} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'