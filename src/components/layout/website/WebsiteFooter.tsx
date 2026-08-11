'use client'

import { useSettings } from '@/context/SettingsContext'

export function WebsiteFooter() {
  const { settings } = useSettings()

  return (
    <footer className="bg-cardBg py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-center gap-1">
          <span className="text-sm sm:text-base text-text-muted">
            © 2026 {settings.siteName}. All rights reserved.
          </span>
          <span className="text-xs sm:text-sm text-text-muted/60">
            Not affiliated with Mojang or Microsoft.
          </span>
        </div>
      </div>
    </footer>
  )
}