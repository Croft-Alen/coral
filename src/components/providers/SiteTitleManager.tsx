'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSettings } from '@/context/SettingsContext'

export function SiteTitleManager() {
  const pathname = usePathname()
  const { settings } = useSettings()

  useEffect(() => {
    /*
     * Only testing the Vote page for now.
     *
     * Do not modify titles for any other page yet.
     */
    if (pathname !== '/vote') {
      return
    }

    /*
     * Wait until settings.json has provided the site name.
     */
    if (!settings.siteName) {
      return
    }

    /*
     * Set the browser tab title from the existing
     * settings.json siteName.
     */
    document.title = `${settings.siteName} | Vote`
  }, [pathname, settings.siteName])

  return null
}

