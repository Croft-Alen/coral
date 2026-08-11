'use client'

import { PageLayout } from '@/components/website/PageLayout'
import { VoteCard } from '@/components/website/VoteCard'
import voteData from '@/data/vote.json'

const VotePage = () => {
  return (
    <PageLayout 
      title="Vote for Us" 
      description="Help our server grow by voting on these Minecraft server lists!"
    >
      <div className="space-y-4">
        {voteData.voteLinks.map((link) => (
          <VoteCard key={link.id} link={link} />
        ))}
      </div>
    </PageLayout>
  )
}

export default VotePage