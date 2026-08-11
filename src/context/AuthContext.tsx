'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  username: string | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('mc_username')
    if (saved) {
      setUsername(saved)
    }
  }, [])

  const login = (name: string) => {
    setUsername(name)
    localStorage.setItem('mc_username', name)
  }

  const logout = () => {
    setUsername(null)
    localStorage.removeItem('mc_username')
  }

  return (
    <AuthContext.Provider value={{ username, isLoggedIn: !!username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}