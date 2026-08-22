import type { Metadata } from 'next'
import settingsData from '@/data/settings.json'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: `${settingsData.siteName} | Home`,
}

export default function StorePage() {
  return <HomePageClient />
}