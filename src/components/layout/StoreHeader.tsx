'use client'

import {
  useState,
  useRef,
  useEffect,
} from 'react'
import Link from 'next/link'
import {
  FaHome,
  FaShoppingBasket,
  FaSignOutAlt,
  FaUsers,
  FaVoteYea,
  FaBook,
} from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useStoreUI } from '@/context/StoreUIContext'
import { LoginModal } from '@/components/store/LoginModal'
import { Button } from '@/components/ui/Button'

const DEFAULT_AVATAR =
  'https://minotar.net/avatar/_Ziper_YT_/64'

export function StoreHeader() {
  const {
    username,
    isLoggedIn,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  } = useAuth()

  const { getItemCount } = useCart()
  const { openCart } = useStoreUI()

  const [
    isUserMenuOpen,
    setIsUserMenuOpen,
  ] = useState(false)

  const dropdownRef =
    useRef<HTMLDivElement>(null)

  const itemCount = getItemCount()

  const avatarUrl =
    isLoggedIn && username
      ? `https://minotar.net/avatar/${encodeURIComponent(
          username
        )}/64`
      : DEFAULT_AVATAR

  const handleLogout = () => {
    setIsUserMenuOpen(false)
    logout()
  }

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-2 sm:py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Home */}
            <Link
              href="/"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md transition-colors text-text-body hover:text-text-heading"
              aria-label="Home"
            >
              <FaHome className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">

              {/* Staff / Vote / Rules */}
              <div className="flex items-center bg-brand rounded-md overflow-hidden shadow-lg">

                {/* Staff */}
                <Link
                  href="/staff"
                  className="flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 text-white hover:brightness-105 transition-all cursor-pointer"
                >
                  <FaUsers className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                    Staff
                  </span>
                </Link>

                <div className="w-[1px] h-7 bg-white/30" />

                {/* Vote */}
                <Link
                  href="/vote"
                  className="flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 text-white hover:brightness-105 transition-all cursor-pointer"
                >
                  <FaVoteYea className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                    Vote
                  </span>
                </Link>

                <div className="w-[1px] h-7 bg-white/30" />

                {/* Rules */}
                <Link
                  href="/rules"
                  className="flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 text-white hover:brightness-105 transition-all cursor-pointer"
                >
                  <FaBook className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                    Rules
                  </span>
                </Link>

              </div>

              {/* Cart Button */}
              <Button
                variant="primary"
                size="md"
                className="relative w-10 h-10 sm:w-11 sm:h-11 p-0 flex items-center justify-center rounded-md cursor-pointer"
                onClick={openCart}
                aria-label="Open cart"
              >
                <FaShoppingBasket className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />

                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
                    {itemCount > 99
                      ? '99+'
                      : itemCount}
                  </span>
                )}
              </Button>

              {/* User Avatar */}
              <div
                className="relative"
                ref={dropdownRef}
              >
                {isLoggedIn && username ? (
                  <>
                    <button
                      onClick={() =>
                        setIsUserMenuOpen(
                          current => !current
                        )
                      }
                      className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-white/10"
                      aria-label="Open user menu"
                      aria-expanded={isUserMenuOpen}
                    >
                      <img
                        src={avatarUrl}
                        alt={username}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-cardBg/90 backdrop-blur-sm rounded-md shadow-xl overflow-hidden z-50 border-2 border-white/10">

                        <div className="px-4 py-3 border-b border-white/5">
                          <div className="flex items-center gap-3">

                            <img
                              src={avatarUrl}
                              alt={username}
                              className="w-10 h-10 rounded-md object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-base font-semibold text-text-heading truncate">
                                {username}
                              </p>
                            </div>

                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>
                            Logout
                          </span>
                        </button>

                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-white/10"
                    aria-label="Login"
                  >
                    <img
                      src={DEFAULT_AVATAR}
                      alt="Login"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </>
  )
}