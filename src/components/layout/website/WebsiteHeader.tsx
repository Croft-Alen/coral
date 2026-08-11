'use client'

import Link from 'next/link'
import { FaHome, FaNewspaper, FaVoteYea, FaGavel, FaUsers, FaStore } from 'react-icons/fa'

export function WebsiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12 sm:h-16 -mt-2 bg-brand shadow-lg">
          {/* Navigation - All links same size */}
          <nav className="flex items-center gap-2 sm:gap-6 md:gap-8 overflow-x-auto px-2 sm:px-0">
            <Link href="/vote" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-base font-medium whitespace-nowrap">
              <FaVoteYea className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Vote</span>
            </Link>
            
            <span className="w-[2px] h-8 bg-white/40 hidden sm:block flex-shrink-0" />
            
            <Link href="/blog" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-base font-medium whitespace-nowrap">
              <FaNewspaper className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Blog</span>
            </Link>
            
            <span className="w-[2px] h-8 bg-white/40 hidden sm:block flex-shrink-0" />
            
            <Link href="/" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-base font-medium whitespace-nowrap">
              <FaHome className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <span className="w-[2px] h-8 bg-white/40 hidden sm:block flex-shrink-0" />
            
            <Link href="/store" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-base font-medium whitespace-nowrap">
              <FaStore className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Store</span>
            </Link>
            
            <span className="w-[2px] h-8 bg-white/40 hidden sm:block flex-shrink-0" />
            
            <Link href="/staff" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-base font-medium whitespace-nowrap">
              <FaUsers className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Staff</span>
            </Link>
            
            <span className="w-[2px] h-8 bg-white/40 hidden sm:block flex-shrink-0" />
            
            <Link href="/rules" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-base font-medium whitespace-nowrap">
              <FaGavel className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Rules</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}