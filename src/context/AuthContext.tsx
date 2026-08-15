'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

type PlayerPlatform = 'java' | 'bedrock'

interface PlayerIdentity {
  username: string
  usernameId: string | null
  platform: PlayerPlatform
}

interface AuthContextType {
  player: PlayerIdentity | null

  username: string | null
  usernameId: string | null
  platform: PlayerPlatform | null

  isLoggedIn: boolean

  isLoginModalOpen: boolean

  login: (
    username: string,
    platform?: PlayerPlatform
  ) => void

  setUsernameId: (usernameId: string | null) => void

  logout: () => void

  openLoginModal: () => void
  closeLoginModal: () => void
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined)

const PLAYER_STORAGE_KEY = 'mc_player'

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [player, setPlayer] =
    useState<PlayerIdentity | null>(null)

  const [isLoginModalOpen, setIsLoginModalOpen] =
    useState(false)

  /*
   * Restore the selected Minecraft player.
   */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(PLAYER_STORAGE_KEY)

      if (!saved) return

      const parsed = JSON.parse(saved)

      if (
        !parsed ||
        typeof parsed.username !== 'string' ||
        !parsed.username.trim()
      ) {
        localStorage.removeItem(
          PLAYER_STORAGE_KEY
        )
        return
      }

      const restoredPlayer: PlayerIdentity = {
        username: parsed.username,
        usernameId:
          typeof parsed.usernameId === 'string'
            ? parsed.usernameId
            : null,
        platform:
          parsed.platform === 'bedrock'
            ? 'bedrock'
            : 'java',
      }

      setPlayer(restoredPlayer)
    } catch (error) {
      console.error(
        'Error loading player identity:',
        error
      )

      localStorage.removeItem(
        PLAYER_STORAGE_KEY
      )
    }
  }, [])

  /*
   * Select a Minecraft player.
   *
   * This only controls the currently selected player.
   * Cart data is handled separately by CartContext.
   */
  const login = (
    username: string,
    platform: PlayerPlatform = 'java'
  ) => {
    const trimmedUsername = username.trim()

    if (!trimmedUsername) return

    const newPlayer: PlayerIdentity = {
      username: trimmedUsername,
      usernameId: null,
      platform,
    }

    setPlayer(newPlayer)

    localStorage.setItem(
      PLAYER_STORAGE_KEY,
      JSON.stringify(newPlayer)
    )
  }

  /*
   * Store the Tebex username_id once it becomes available.
   */
  const setUsernameId = (
    usernameId: string | null
  ) => {
    setPlayer(current => {
      if (!current) return current

      const updatedPlayer: PlayerIdentity = {
        ...current,
        usernameId,
      }

      localStorage.setItem(
        PLAYER_STORAGE_KEY,
        JSON.stringify(updatedPlayer)
      )

      return updatedPlayer
    })
  }

  /*
   * Logout only removes the currently selected player.
   *
   * It does NOT clear cart data.
   *
   * CartContext is responsible for loading the cart
   * belonging to whichever player is selected next.
   */
  const logout = () => {
    setPlayer(null)

    localStorage.removeItem(
      PLAYER_STORAGE_KEY
    )

    setIsLoginModalOpen(false)
  }

  /*
   * Open the existing global LoginModal.
   *
   * This can be called from ProductCard,
   * ProductModal, StoreHeader, or any other component.
   */
  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  /*
   * Close the existing global LoginModal.
   */
  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        player,

        username:
          player?.username ?? null,

        usernameId:
          player?.usernameId ?? null,

        platform:
          player?.platform ?? null,

        isLoggedIn: !!player,

        isLoginModalOpen,

        login,
        setUsernameId,
        logout,

        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    )
  }

  return context
}