'use client'

import { CategoriesCard } from './CategoriesCard'
import { TopCustomers } from './TopCustomers'
import { RecentPayments } from './RecentPayments'

export function StoreSidebar() {
  return (
    <div className="space-y-4">
      {/* Categories Card - handles its own loading */}
      <CategoriesCard />
      
      {/* Top Customers - handles its own loading */}
      <TopCustomers />
      
      {/* Recent Payments - handles its own loading */}
      <RecentPayments />
    </div>
  )
}