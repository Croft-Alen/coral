'use client'

import { useEffect } from 'react'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { RulesList } from '@/components/store/RulesList'
import { useSettings } from '@/context/SettingsContext'
import rulesData from '@/data/rules.json'

export default function RulesPage() {
  const { settings } = useSettings()

  useEffect(() => {
    if (settings.siteName) {
      document.title = `${settings.siteName} | Rules`
    }
  }, [settings.siteName])

  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <div className="bg-cardBg shadow-lg rounded-md overflow-hidden">
        <div className="p-6 sm:p-8 pb-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading">
            Our Rules
          </h1>
        </div>

        <div className="border-t-2 border-white/10 mt-2" />

        <div className="p-6 sm:p-8 pt-3">
          <div className="space-y-8">
            {rulesData.categories.map((category) => (
              <RulesList
                key={category.id}
                title={category.title}
                rules={category.rules}
              />
            ))}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}