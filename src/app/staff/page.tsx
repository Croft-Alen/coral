'use client'

import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { StaffCard } from '@/components/store/StaffCard'
import staffData from '@/data/staff.json'

export default function StaffPage() {
  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <div className="bg-cardBg shadow-lg rounded-md overflow-hidden">
        <div className="p-6 sm:p-8 pb-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand">
            Staff Team
          </h1>
        </div>

        <div className="border-t-2 border-white/10 mt-2" />

        <div className="p-6 sm:p-8 pt-3">
          <div className="space-y-8">
            {staffData.categories.map((category) => (
              <div key={category.id}>
                <h2 className="text-lg font-semibold text-brand mb-4">
                  {category.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {category.members.map((member) => (
                    <StaffCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}