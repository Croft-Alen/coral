'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  const [settings, setSettings] =
    useState<typeof settingsData>({
      ...settingsData,
      siteName: '',
    })

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    async function loadTebexSettings() {
      try {
        const response = await fetch('/api/tebex/store')

        if (!response.ok) {
          throw new Error(
            `Failed to fetch store data: ${response.status}`
          )
        }

        const result = await response.json()

        if (
          !result.success ||
          !result.data?.webstore
        ) {
          throw new Error(
            'Invalid Tebex store response'
          )
        }

        const webstore = result.data.webstore

        setSettings((prev) => ({
          ...prev,
          siteName:
            webstore.name || '',
        }))
      } catch (error) {
        console.error(
          'Failed to load Tebex store settings:',
          error
        )

        // If Tebex fails, fall back to the local
        // settings.json site name.
        setSettings((prev) => ({
          ...prev,
          siteName: settingsData.siteName,
        }))
      } finally {
        setIsLoading(false)
      }
    }

    loadTebexSettings()
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
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