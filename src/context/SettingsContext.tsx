'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

import settingsData from '@/data/settings.json'

interface SettingsContextType {
  settings: typeof settingsData
  isLoading: boolean
}

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined)

export function SettingsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [settings] =
    useState<typeof settingsData>(settingsData)

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading: false,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context =
    useContext(SettingsContext)

  if (context === undefined) {
    throw new Error(
      'useSettings must be used within a SettingsProvider'
    )
  }

  return context
}