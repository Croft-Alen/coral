'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'
import { useAuth } from '@/context/AuthContext'
import { FaDiscord, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { LoginModal } from '@/components/store/LoginModal'

export function StoreHeader() {
  const { settings } = useSettings()
  const { username, isLoggedIn, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-pageBg/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img 
                src={settings.logo || '/images/logo.png'} 
                alt={settings.siteName}
                className="h-9 w-9 object-contain"
              />
              <span className="text-xl font-bold text-text-heading">{settings.siteName}</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-text-body hover:text-text-heading transition-colors text-sm font-medium">
                Home
              </Link>
              <Link href="/store" className="text-brand hover:text-brand-light transition-colors text-sm font-medium">
                Store
              </Link>
              <Link href="/store/cart" className="text-text-body hover:text-text-heading transition-colors text-sm font-medium flex items-center gap-1">
                <FaShoppingCart className="w-4 h-4" />
                Cart
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Login/User Button */}
              {isLoggedIn && username ? (
                <div className="flex items-center gap-3 bg-brand/10 px-4 py-1.5 rounded-full border border-brand/20">
                  <span className="text-text-body text-sm font-medium flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-brand" />
                    {username}
                  </span>
                  <button
                    onClick={logout}
                    className="text-text-muted hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <FaSignOutAlt className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-brand text-pageBg hover:bg-brand-dark transition-colors px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  <FaUser className="w-4 h-4" />
                  Login
                </button>
              )}

              <a
                href={settings.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-[#5865F2] transition-colors"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}