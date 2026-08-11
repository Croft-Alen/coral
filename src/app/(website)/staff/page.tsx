'use client'

import { PageLayout } from '@/components/website/PageLayout'
import { StaffCard } from '@/components/website/StaffCard'
import staffData from '@/data/staff.json'

export default function StaffPage() {
  return (
    <div className="relative z-20 mt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cardBg p-6 sm:p-8 shadow-lg">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-brand inline-block relative">
              STAFF TEAM
              <span className="absolute -bottom-2 left-0 w-3/4 h-0.5 bg-brand"></span>
            </h1>
          </div>

          {/* Staff Cards Grid - All staff in one grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {staffData.staff.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}