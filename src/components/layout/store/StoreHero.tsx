'use client'

import { useState } from 'react'
import { useSettings } from '@/context/SettingsContext'
import { FaDiscord } from 'react-icons/fa'
import { Modal } from '@/components/ui/Modal'

export function StoreHero() {
  const { settings } = useSettings()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCopyIP = () => {
    navigator.clipboard.writeText(settings.serverIp)
    setIsModalOpen(true)
  }

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[440px] w-full overflow-hidden bg-cardBg shadow-lg">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={settings.storeHeroBackground || settings.heroBackground || '/images/hero-bg.jpg'}
              alt=""
              className="h-full w-full object-cover"
            />

            {/* Card bg color overlay */}
            <div className="absolute inset-0 bg-cardBg/85" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cardBg via-cardBg/70 to-cardBg/20" />

            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-cardBg to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex min-h-[300px] sm:min-h-[380px] md:min-h-[440px] items-center">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">

              {/* Main 3-column composition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 sm:gap-6">

                {/* LEFT */}
                <div className="flex justify-center sm:justify-end order-2 sm:order-1 pr-0 sm:pr-4">
                  <button
                    onClick={handleCopyIP}
                    className="flex items-center gap-3 sm:gap-4 group cursor-pointer focus:outline-none shrink-0"
                    aria-label="Copy server IP"
                  >
                    <div className="text-center sm:text-right whitespace-nowrap">
                      <div className="text-base sm:text-lg font-semibold uppercase tracking-wide text-brand">
                        Join Our Server
                      </div>
                      <div className="mt-1 text-xs sm:text-sm font-medium text-white/70">
                        {settings.serverIp}
                      </div>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 512 512" 
                      className="h-10 w-10 sm:h-12 sm:w-12 text-brand shrink-0 transition-all duration-500 ease-in-out hover:scale-110"
                      fill="currentColor"
                    >
                      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                    </svg>
                  </button>
                </div>

                {/* CENTER — Logo */}
                <div className="flex justify-center order-1 sm:order-2">
                  <img
                    src={settings.logo || '/images/logo.png'}
                    alt={settings.siteName}
                    className="
                      h-28 w-28
                      sm:h-36 sm:w-36
                      md:h-44 md:w-44
                      object-contain
                      drop-shadow-2xl
                      shrink-0
                      transition-all duration-700 ease-in-out hover:scale-105
                    "
                  />
                </div>

                {/* RIGHT — Discord */}
                <div className="flex justify-center sm:justify-start order-3 pl-0 sm:pl-4">
                  <a
                    href={settings.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 group cursor-pointer shrink-0"
                  >
                    <FaDiscord className="h-10 w-10 sm:h-12 sm:w-12 text-brand shrink-0 transition-all duration-500 ease-in-out hover:scale-110" />
                    <div className="whitespace-nowrap text-center sm:text-left">
                      <div className="text-base sm:text-lg font-semibold uppercase tracking-wide text-brand">
                        Join Our Discord
                      </div>
                      <div className="mt-1 text-xs sm:text-sm font-medium text-white/70">
                        DISCORD.GG/{settings.discordInviteCode || 'yourserver'}
                      </div>
                    </div>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* IP Copied Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="IP Copied!"
        className="!max-w-sm !w-full !m-0 !fixed !top-4 !right-4 !left-auto !bottom-auto !translate-x-0 !translate-y-0 !border-none"
      >
        <div className="text-center py-2 px-2">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-text-body text-base mb-1">
            Now go join the server!
          </p>
          <p className="text-text-muted text-xs">
            Server IP: <span className="text-brand font-medium">{settings.serverIp}</span>
          </p>
        </div>
      </Modal>
    </section>
  )
}