'use client'

import * as React from 'react'
import * as FaIcons from 'react-icons/fa'
import { cn } from '@/lib/utils/helpers'

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

export const Icon = ({ name, size = 'md', className = '', ...props }: IconProps) => {
  const IconComponent = (FaIcons as any)[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in react-icons/fa`)
    return (
      <svg 
        className={cn(sizeClasses[size], className)} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }

  return <IconComponent className={cn(sizeClasses[size], className)} {...props} />
}