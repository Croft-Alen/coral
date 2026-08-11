'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import settingsData from '@/data/settings.json'

interface SettingsContextType {
  settings: typeof settingsData
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings: settingsData, isLoading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}