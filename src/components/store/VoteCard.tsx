'use client'

import { FaArrowRight } from 'react-icons/fa'

interface VoteCardProps {
  link: {
    id: string
    siteName: string
    url: string
    description: string
  }
}

export function VoteCard({ link }: VoteCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-pageBg p-4 hover:bg-pageBg/80 transition-all duration-300 rounded-md flex items-center justify-between group"
    >
      <div>
        <h3 className="text-base sm:text-lg font-bold text-text-heading mb-2">
          {link.siteName}
        </h3>

        <p className="text-text-muted text-sm sm:text-base">
          {link.description}
        </p>
      </div>

      <FaArrowRight className="w-5 h-5 text-brand transform rotate-[-45deg] flex-shrink-0 ml-4 group-hover:translate-x-1 transition-transform" />
    </a>
  )
}