'use client'

import { useSettings } from '@/context/SettingsContext'
import { useToast } from '@/context/ToastContext'
import { FaCopy } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'

export function StoreFooter() {
  const { settings, isLoading } = useSettings()
  const { success } = useToast()

  const handleCopyIP = async () => {
    try {
      await navigator.clipboard.writeText(settings.serverIp)
      success('IP copied! Now go join the server.')
    } catch {
    }
  }

  return (
    <footer
      className={`shrink-0 bg-cardBg py-6 ${
        isLoading ? 'min-h-[104px]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div aria-hidden="true" className="min-h-[56px]" />
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="text-sm sm:text-base text-text-muted">
                {settings.siteName} Store © 2026. All rights reserved.
              </span>

              <span className="text-xs sm:text-sm text-text-muted/60">
                Not affiliated with Mojang or Microsoft.
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyIP}
              className="flex items-center gap-2 text-sm cursor-pointer"
              aria-label="Copy server IP"
            >
              <FaCopy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy IP</span>
            </Button>
          </div>
        )}
      </div>
    </footer>
  )
}