'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_AVATAR =
  'https://minotar.net/avatar/_Ziper_YT_/64'

export function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const {
    login,
    isLoggedIn,
    username: loggedInUsername,
  } = useAuth()

  const handleLogin = () => {
    const trimmed = username.trim()

    if (!trimmed) {
      setError(
        'Please enter your Minecraft username'
      )
      return
    }

    if (
      trimmed.length < 3 ||
      trimmed.length > 16
    ) {
      setError(
        'Username must be 3-16 characters'
      )
      return
    }

    /*
     * Java Edition only.
     *
     * AuthContext defaults the platform to "java",
     * so no Bedrock/platform selection is needed.
     */
    login(trimmed)

    setUsername('')
    setError('')
    onClose()
  }

  const avatarUrl =
    isLoggedIn && loggedInUsername
      ? `https://minotar.net/avatar/${encodeURIComponent(
          loggedInUsername
        )}/64`
      : DEFAULT_AVATAR

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="!max-w-lg !w-full !rounded-sm !bg-cardBg !border-none"
    >
      <div className="py-6 px-2">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-md overflow-hidden bg-white/5">
            <img
              src={avatarUrl}
              alt={
                isLoggedIn
                  ? loggedInUsername || 'User'
                  : 'Login'
              }
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-heading text-center mb-6">
          {isLoggedIn
            ? 'Switch Account'
            : 'Log In'}
        </h2>

        {/* Username Input */}
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value)
              setError('')
            }}
            placeholder="Enter your Minecraft username"
            className="w-full px-4 py-3 bg-pageBg border-2 border-white/10 rounded-sm text-text-body placeholder-text-muted focus:outline-none focus:border-brand transition-colors text-base"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleLogin()
              }
            }}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />

          {error && (
            <p className="text-red-500 text-sm mt-1.5">
              {error}
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-brand text-white font-semibold py-3 rounded-sm hover:brightness-105 transition-all duration-200 border-0 shadow-[inset_0_-3px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2),0_7px_13px_-3px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2),0_7px_13px_-3px_rgba(0,0,0,0.15),inset_0_-3px_0_rgba(0,0,0,0.2)] active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.3)] active:translate-y-0.5"
        >
          {isLoggedIn
            ? 'Switch Account'
            : 'Log In'}
        </button>
      </div>
    </Modal>
  )
}