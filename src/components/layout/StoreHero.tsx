'use client'

import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'
import { useToast } from '@/context/ToastContext'
import { FaDiscord } from 'react-icons/fa'

export function StoreHero() {
  const { settings } = useSettings()
  const { success } = useToast()

  const handleCopyIP = async () => {
    try {
      await navigator.clipboard.writeText(settings.serverIp)
      success('IP copied! Now go join the server.')
    } catch {
      // Clipboard failure is intentionally kept silent.
    }
  }

  return (
    <section className="w-full -mt-2 relative z-0">
      <div className="w-full">
        <div className="relative min-h-[320px] sm:min-h-[380px] md:min-h-[420px] w-full overflow-hidden bg-cardBg">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={
                settings.storeHeroBackground ||
                settings.heroBackground ||
                '/images/hero-bg.jpg'
              }
              alt=""
              className="h-full w-full object-cover"
            />

            {/* Card bg color overlay - same intensity everywhere */}
            <div className="absolute inset-0 bg-cardBg/85" />

            {/* Bottom fade - minimal, just enough to blend */}
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-cardBg to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex min-h-[320px] sm:min-h-[380px] md:min-h-[420px] items-center">
            <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">

              {/* Mobile: Only Logo */}
              <div className="flex justify-center sm:hidden">
                <Link href="/">
                  <img
                    src={settings.logo || '/images/logo.png'}
                    alt={settings.siteName}
                    className="h-48 w-48 object-contain drop-shadow-2xl cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>

              {/* Desktop: Full 3-column composition */}
              <div className="hidden grid-cols-3 items-center gap-6 sm:grid">

                {/* LEFT */}
                <div className="order-1 flex justify-end pr-4">
                  <button
                    onClick={handleCopyIP}
                    className="group flex shrink-0 cursor-pointer items-center gap-4 focus:outline-none"
                    aria-label="Copy server IP"
                  >
                    <div className="whitespace-nowrap text-right">
                      <div className="text-lg font-semibold uppercase tracking-wide text-brand">
                        Join Our Server
                      </div>

                      <div className="mt-1 text-sm font-medium text-text-body">
                        {settings.serverIp}
                      </div>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-12 w-12 shrink-0 text-brand transition-all duration-500 ease-in-out hover:scale-110"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                    </svg>
                  </button>
                </div>

                {/* CENTER — Logo */}
                <div className="order-2 flex justify-center">
                  <Link href="/">
                    <img
                      src={settings.logo || '/images/logo.png'}
                      alt={settings.siteName}
                      className="
                        h-44 w-44
                        shrink-0
                        object-contain
                        drop-shadow-2xl
                        transition-all
                        duration-700
                        ease-in-out
                        hover:scale-105
                        sm:h-44 sm:w-44
                        md:h-52 md:w-52
                        cursor-pointer
                        hover:opacity-80
                      "
                    />
                  </Link>
                </div>

                {/* RIGHT — Discord */}
                <div className="order-3 flex justify-start pl-4">
                  <a
                    href={settings.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex shrink-0 cursor-pointer items-center gap-4"
                  >
                    <FaDiscord
                      className="h-12 w-12 shrink-0 text-brand transition-all duration-500 ease-in-out hover:scale-110"
                      aria-hidden="true"
                    />

                    <div className="whitespace-nowrap text-left">
                      <div className="text-lg font-semibold uppercase tracking-wide text-brand">
                        Join Our Discord
                      </div>

                      <div className="mt-1 text-sm font-medium text-text-body">
                        DISCORD.GG/
                        {settings.discordInviteCode || 'yourserver'}
                      </div>
                    </div>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}