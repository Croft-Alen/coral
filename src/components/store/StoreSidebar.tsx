'use client'

import { CategoriesCard } from './CategoriesCard'
import { TopCustomers } from './TopCustomers'
import { RecentPayments } from './RecentPayments'
import { CommunityGoal } from './CommunityGoal'

export function StoreSidebar() {
  return (
    <div className="space-y-4 min-h-[500px]">
      {/* Categories Card - handles its own loading */}
      <CategoriesCard />

      {/* Top Customers - handles its own loading */}
      <TopCustomers />

      {/* Recent Payments - handles its own loading */}
      <RecentPayments />

      {/* Community Goal - handles its own loading */}
      <CommunityGoal />
    </div>
  )
}