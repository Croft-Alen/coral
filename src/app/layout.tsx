import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

import settingsData from '@/data/settings.json'

import Providers from '@/components/providers/Providers'
import { StoreHeader } from '@/components/layout/StoreHeader'
import { StoreHero } from '@/components/layout/StoreHero'
import { StoreFooter } from '@/components/layout/StoreFooter'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: settingsData.siteName,
  description:
    'Complete website and store solution for Minecraft servers powered by Tebex.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <body className="antialiased bg-pageBg text-text-body">
        <Providers>
          <StoreHeader />
          <StoreHero />

          {children}

          <StoreFooter />
        </Providers>
      </body>
    </html>
  )
}
