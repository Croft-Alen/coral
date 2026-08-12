'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { FaJava, FaMobile } from 'react-icons/fa'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [edition, setEdition] = useState<'java' | 'bedrock'>('java')
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
      className="!max-w-md !w-full !rounded-sm !bg-cardBg"
    >
      <div className="py-4">
        <p className="text-text-muted text-sm mb-4">
          Select your Minecraft edition and enter your username
        </p>
        
        <div className="space-y-4">
          {/* Edition Selection */}
          <div>
            <label className="block text-text-body text-sm mb-2 font-medium">
              Minecraft Edition
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEdition('java')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm transition-all duration-200 ${
                  edition === 'java'
                    ? 'bg-brand text-white border-2 border-brand'
                    : 'bg-pageBg text-text-body border-2 border-white/10 hover:border-brand/50'
                }`}
              >
                <FaJava className="w-4 h-4" />
                <span className="font-medium">Java Edition</span>
              </button>
              <button
                onClick={() => setEdition('bedrock')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm transition-all duration-200 ${
                  edition === 'bedrock'
                    ? 'bg-brand text-white border-2 border-brand'
                    : 'bg-pageBg text-text-body border-2 border-white/10 hover:border-brand/50'
                }`}
              >
                <FaMobile className="w-4 h-4" />
                <span className="font-medium">Bedrock Edition</span>
              </button>
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-text-body text-sm mb-1.5 font-medium">
              {edition === 'java' ? 'Java Username' : 'Bedrock Gamertag'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder={edition === 'java' ? 'Enter your Java username' : 'Enter your Bedrock gamertag'}
              className="w-full px-4 py-2.5 bg-pageBg border-2 border-white/10 rounded-sm text-text-body placeholder-text-muted focus:outline-none focus:border-brand transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-brand text-white font-semibold py-3 rounded-sm hover:brightness-105 transition-all duration-200 border-0 shadow-[inset_0_-3px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2),0_7px_13px_-3px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2),0_7px_13px_-3px_rgba(0,0,0,0.15),inset_0_-3px_0_rgba(0,0,0,0.2)] active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.3)] active:translate-y-0.5"
          >
            Login
          </button>
        </div>
      </div>
    </Modal>
  )
}