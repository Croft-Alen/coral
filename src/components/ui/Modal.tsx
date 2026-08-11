'use client'

import * as React from 'react'
import { FaTimes } from 'react-icons/fa'
import { cn } from '@/lib/utils/helpers'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export const Modal = ({ isOpen, onClose, title, children, className = '' }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className={cn(
        "relative bg-cardBg rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-6 z-10",
        className
      )}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-heading transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        
        {title && (
          <h3 className="text-xl font-bold text-text-heading mb-4">{title}</h3>
        )}
        
        {children}
      </div>
    </div>
  )
}