'use client'

import { PageLayout } from '@/components/website/PageLayout'
import { RulesList } from '@/components/website/RulesList'
import rulesData from '@/data/rules.json'

export default function RulesPage() {
  return (
    <PageLayout 
      title="Server Rules" 
      description="Please read and follow all rules to ensure a safe and enjoyable experience for everyone."
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-text-heading mb-4">Server Rules</h2>
          <RulesList rules={rulesData.serverRules} />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-text-heading mb-4">Discord Rules</h2>
          <RulesList rules={rulesData.discordRules} />
        </div>
      </div>
    </PageLayout>
  )
}