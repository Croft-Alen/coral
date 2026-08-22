'use client'

import { FaDiscord } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { useSettings } from '@/context/SettingsContext'

export function SupportCard() {
  const { settings } = useSettings()

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      <div className="relative">
        <div className="absolute inset-0 h-12 bg-brand" />
        <div className="relative px-4 py-3 flex items-center gap-3">
          <FaDiscord className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
            Need Support?
          </h3>
        </div>
      </div>

      <div className="px-3 pt-4 pb-4">
        <p className="text-text-muted text-sm sm:text-base mb-4">
          For support create a support ticket in our discord server.
        </p>

        <Button
          variant="primary"
          size="sm"
          className="w-auto gap-2.5 h-11 text-sm sm:text-base cursor-pointer px-5"
          href={settings.discordUrl}
          target="_blank"
        >
          <FaDiscord className="w-4.5 h-4.5" />
          Join Discord
        </Button>
      </div>
    </div>
  )
}