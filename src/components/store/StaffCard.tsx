'use client'

import { useState } from 'react'

interface StaffCardProps {
  member: {
    id: string
    name: string
    role: string
  }
}

export function StaffCard({ member }: StaffCardProps) {
  const [imgError, setImgError] = useState(false)

  // Using Minotar helm (head only) with 100px size
  const avatarUrl = `https://minotar.net/helm/${encodeURIComponent(member.name)}/100.png`

  return (
    <div className="bg-pageBg rounded-md overflow-hidden relative h-[125px]">
      {/* Avatar - Head only, reduced size with left padding */}
      <div className="absolute left-3 bottom-0 w-[80px] h-[125px] overflow-hidden pointer-events-none flex items-center justify-start">
        <img
          src={avatarUrl}
          alt={member.name}
          className="w-14 h-14 object-contain image-rendering-pixelated"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/default-avatar.png'
          }}
        />
      </div>

      {/* Name and Role */}
      <div className="absolute left-[100px] top-1/2 -translate-y-1/2 z-10 min-w-0 pr-3">
        <p className="text-text-body font-bold text-base sm:text-lg truncate">
          {member.name}
        </p>
        <p className="text-brand text-xs sm:text-sm mt-0.5 font-medium">
          {member.role}
        </p>
      </div>
    </div>
  )
}