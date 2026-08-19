'use client'

import { useSettings } from '@/context/SettingsContext'

export function StoreFooter() {
  const { settings, isLoading } = useSettings()

  return (
    <footer
      className={`shrink-0 bg-cardBg py-6 ${
        isLoading ? 'min-h-[104px]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div
            aria-hidden="true"
            className="min-h-[56px]"
          />
        ) : (
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="text-sm sm:text-base text-text-muted">
              {settings.siteName} Store © 2026. All rights reserved.
            </span>

            <span className="text-xs sm:text-sm text-text-muted/60">
              Not affiliated with Mojang or Microsoft.
            </span>
          </div>
        )}
      </div>
    </footer>
  )
}