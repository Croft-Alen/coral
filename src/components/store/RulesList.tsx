'use client'

import { useState } from 'react'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

interface Rule {
  id: string
  title: string
  description: string
}

interface RulesListProps {
  rules: Rule[]
  title?: string
}

export function RulesList({ rules, title }: RulesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleRule = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div>
      {title && (
        <h2 className="text-brand text-lg sm:text-xl font-bold mb-5">
          {title}
        </h2>
      )}
      
      <div className="space-y-3">
        {rules.map((rule) => {
          const isExpanded = expandedId === rule.id
          
          return (
            <div key={rule.id} className="bg-pageBg rounded-md overflow-hidden">
              {/* Rule Header - Clickable */}
              <button
                onClick={() => toggleRule(rule.id)}
                className="w-full flex items-center justify-between px-4 py-4 cursor-pointer text-left"
              >
                <span className="text-base font-semibold text-text-heading">
                  {rule.title}
                </span>
                {isExpanded ? (
                  <FaChevronDown className="w-4 h-4 text-text-muted flex-shrink-0 ml-4" />
                ) : (
                  <FaChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 ml-4" />
                )}
              </button>
              
              {/* Rule Description - Collapsible */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-5 text-text-muted text-sm">
                  {rule.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}