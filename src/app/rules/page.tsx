import type { Metadata } from 'next'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { RulesList } from '@/components/store/RulesList'
import rulesData from '@/data/rules.json'
import settingsData from '@/data/settings.json'

export const metadata: Metadata = {
  title: `${settingsData.siteName} | Rules`,
}

export default function RulesPage() {
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