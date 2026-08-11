'use client'

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
      className="block bg-pageBg p-5 hover:bg-pageBg/80 transition-all duration-300"
    >
      <h3 className="text-lg font-bold text-text-heading">{link.siteName}</h3>
      <p className="text-text-muted text-sm">{link.description}</p>
    </a>
  )
}