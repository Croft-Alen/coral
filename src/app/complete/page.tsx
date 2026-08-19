import type { Metadata } from 'next'
import settingsData from '@/data/settings.json'
import CompletePageClient from './CompletePageClient'

export const metadata: Metadata = {
  title: `${settingsData.siteName} | Complete`,
}

export default function CompletePage() {
  return <CompletePageClient />
}