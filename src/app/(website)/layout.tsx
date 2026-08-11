import { SettingsProvider } from '@/context/SettingsContext'
import { WebsiteHeader } from '@/components/layout/website/WebsiteHeader'
import { WebsiteHero } from '@/components/layout/website/WebsiteHero'
import { WebsiteFooter } from '@/components/layout/website/WebsiteFooter'
import { SaleBanner } from '@/components/website/SaleBanner'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsProvider>
      <WebsiteHeader />
      <WebsiteHero />
      <SaleBanner />  {/* Added here - appears on all website pages */}
      <main>{children}</main>
      <WebsiteFooter />
    </SettingsProvider>
  )
}