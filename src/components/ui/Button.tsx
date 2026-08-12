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
      sm: 'px-4 py-2 text-sm gap-1.5 h-10',
      md: 'px-6 py-2.5 text-base gap-2 h-12',
      lg: 'px-8 py-3 text-lg gap-2.5 h-14'
    }

    const variantClasses = {
      primary: 'bg-brand text-white font-medium border-0 shadow-[inset_0_-3px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2),0_7px_13px_-3px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2),0_7px_13px_-3px_rgba(0,0,0,0.15),inset_0_-3px_0_rgba(0,0,0,0.2)] hover:brightness-105 active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.3)] active:translate-y-0.5 transition-all duration-150',
      secondary: 'bg-[#FCFCFD] text-[#36395A] font-medium border-0 shadow-[inset_0_-3px_0_#D6D6E7,0_2px_4px_rgba(45,35,66,0.4),0_7px_13px_-3px_rgba(45,35,66,0.3)] hover:shadow-[0_4px_8px_rgba(45,35,66,0.4),0_7px_13px_-3px_rgba(45,35,66,0.3),inset_0_-3px_0_#D6D6E7] active:shadow-[inset_0_3px_7px_#D6D6E7] active:translate-y-0.5 transition-all duration-150',
      ghost: 'text-text-body font-medium hover:text-text-heading transition-colors border-0 shadow-none bg-transparent'
    }

    const baseClasses = cn(
      "inline-flex items-center justify-center select-none rounded-[4px]",
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