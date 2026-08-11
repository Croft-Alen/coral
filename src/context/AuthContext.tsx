// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  user: any
  login: (user: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const login = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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