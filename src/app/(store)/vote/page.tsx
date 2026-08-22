import type { Metadata } from 'next'
import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { VoteCard } from '@/components/store/VoteCard'
import voteData from '@/data/vote.json'
import settingsData from '@/data/settings.json'

export const metadata: Metadata = {
  title: `${settingsData.siteName} | Vote`,
}

export default function VotePage() {
  return (
    <StoreLayout sidebar={<StoreSidebar />}>
      <div className="bg-cardBg shadow-lg rounded-md overflow-hidden">
        <div className="p-6 sm:p-8 pb-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-heading">
            Vote for Us
          </h1>
        </div>

        <div className="border-t-2 border-white/10 mt-2" />

        <div className="p-6 sm:p-8 pt-3">
          <div className="space-y-4">
            {voteData.voteLinks.map((link) => (
              <VoteCard
                key={link.id}
                link={link}
              />
            ))}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}