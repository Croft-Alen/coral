'use client'

interface StaffCardProps {
  member: {
    id: string
    name: string
    role: string
    avatar: string
  }
}

export function StaffCard({ member }: StaffCardProps) {
  return (
    <div className="bg-pageBg p-4 transition-all duration-300 flex items-center gap-4 border-b border-white/5">
      {/* Avatar - Boxy */}
      <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-white/5 border-2 border-white/10">
        <img 
          src={member.avatar || '/images/default-avatar.png'} 
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name and Role */}
      <div>
        <h3 className="text-lg font-bold text-text-heading">{member.name}</h3>
        <p className="text-brand text-sm font-medium">{member.role}</p>
      </div>
    </div>
  )
}