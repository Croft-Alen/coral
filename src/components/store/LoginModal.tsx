'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleLogin = () => {
    const trimmed = username.trim()
    if (!trimmed) {
      setError('Please enter your Minecraft username')
      return
    }
    if (trimmed.length < 3 || trimmed.length > 16) {
      setError('Username must be 3-16 characters')
      return
    }
    login(trimmed)
    setUsername('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Login to Shop"
      className="!max-w-md !w-full !rounded-none"
    >
      <div className="py-4">
        <p className="text-text-muted text-sm mb-4">
          Minecraft Java Edition
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-text-body text-sm mb-1.5">
              Enter your username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="Minecraft username"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-none text-text-body placeholder-text-muted focus:outline-none focus:border-brand transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-brand text-pageBg font-semibold py-2.5 rounded-none hover:bg-brand-dark transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </Modal>
  )
}