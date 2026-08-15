'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { ToastCard } from '@/components/ui/ToastCard'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(current =>
      current.filter(toast => toast.id !== id)
    )
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random()

      setToasts(current => [
        ...current,
        {
          id,
          type,
          message,
        },
      ])

      setTimeout(() => {
        removeToast(id)
      }, 4000)
    },
    [removeToast]
  )

  const success = useCallback(
    (message: string) => addToast('success', message),
    [addToast]
  )

  const error = useCallback(
    (message: string) => addToast('error', message),
    [addToast]
  )

  const warning = useCallback(
    (message: string) => addToast('warning', message),
    [addToast]
  )

  const info = useCallback(
    (message: string) => addToast('info', message),
    [addToast]
  )

  return (
    <ToastContext.Provider
      value={{
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* TOAST VIEWPORT */}
      <div
        className="
          pointer-events-none
          fixed
          inset-x-0
          bottom-6
          z-[9999]
          flex
          justify-center
          px-4
        "
      >
        <div className="pointer-events-auto flex w-full max-w-md flex-col gap-3">
          {toasts.map(toast => (
            <ToastCard
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      'useToast must be used within a ToastProvider'
    )
  }

  return context
}