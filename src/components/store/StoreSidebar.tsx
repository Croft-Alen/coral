'use client'

import { useSettings } from '@/context/SettingsContext'
import { CategoriesCard } from './CategoriesCard'
import { TopCustomers } from './TopCustomers'
import { RecentPayments } from './RecentPayments'
import { CommunityGoal } from './CommunityGoal'
import { SupportCard } from './SupportCard'

export function StoreSidebar() {
  const { settings, isLoading } = useSettings()

  const showTopCustomers = settings?.showTopCustomers !== false
  const showRecentPayments = settings?.showRecentPayments !== false
  const showCommunityGoal = settings?.showCommunityGoal !== false
  const showSupportModule = settings?.showSupportModule !== false

  return (
    <div className="space-y-4 min-h-[500px]">
      <CategoriesCard />
      {showTopCustomers && <TopCustomers />}
      {showRecentPayments && <RecentPayments />}
      {showCommunityGoal && <CommunityGoal />}
      {showSupportModule && <SupportCard />}
    </div>
  )
}