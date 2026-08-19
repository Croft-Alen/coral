'use client'

import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfo,
} from 'react-icons/fa'
import { Button } from '@/components/ui/Button'

interface ToastCardProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export function ToastCard({
  type,
  message,
  onClose,
}: ToastCardProps) {
  const config = {
    success: {
      icon: FaCheck,
      color: '#22C55E',
      bg: 'rgba(34, 197, 94, 0.55)',
    },
    error: {
      icon: FaTimes,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.55)',
    },
    warning: {
      icon: FaExclamationTriangle,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.55)',
    },
    info: {
      icon: FaInfo,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.55)',
    },
  }

  const { icon: Icon, color, bg } = config[type]

  return (
    <div
      className="
        inline-flex
        w-full
        items-center
        justify-center
        select-none
        rounded-[4px]
        px-6
        py-2.5
        gap-3
        h-12
        text-base
        font-medium
        border-0
        transition-all
        duration-150
      "
      style={{
        backgroundColor: bg,
      }}
    >
      {/* Status icon */}
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
        "
        style={{
          backgroundColor: color,
        }}
      >
        <Icon
          className="text-sm"
          style={{
            color: 'var(--color-text-heading)',
          }}
        />
      </div>

      {/* Message */}
      <p
        className="
          min-w-0
          flex-1
          text-left
          text-base
          font-medium
        "
        style={{
          color: 'var(--color-text-heading)',
        }}
      >
        {message}
      </p>

      {/* Close */}
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close notification"
          className="!h-8 !w-8 !rounded-[4px] !p-0"
          style={{
            color: 'var(--color-text-heading)',
          }}
        >
          <FaTimes className="text-xs" />
        </Button>
      )}
    </div>
  )
}