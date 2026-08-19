'use client'

import { ReactNode } from 'react'
import { FaTimes } from 'react-icons/fa'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-pageBg rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="sticky top-0 bg-pageBg z-10 px-6 pt-4 pb-3 flex items-center justify-between">
          {title && (
            <h2 className="text-xl font-bold text-text-heading">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-heading transition-colors cursor-pointer ml-auto"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}