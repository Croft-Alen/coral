'use client'

interface RulesListProps {
  rules: {
    id: string
    title: string
    description: string
  }[]
}

export function RulesList({ rules }: RulesListProps) {
  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <div 
          key={rule.id} 
          className="bg-cardBg p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="flex gap-3">
            <span className="text-brand font-bold text-lg">{index + 1}.</span>
            <div>
              <h4 className="font-semibold text-text-heading">{rule.title}</h4>
              <p className="text-text-muted text-sm">{rule.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}