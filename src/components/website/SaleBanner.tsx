'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/context/SettingsContext'

export function SaleBanner() {
  const { settings } = useSettings()
  
  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 8,
    minutes: 29,
    seconds: 36
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        seconds -= 1
        if (seconds < 0) {
          seconds = 59
          minutes -= 1
        }
        if (minutes < 0) {
          minutes = 59
          hours -= 1
        }
        if (hours < 0) {
          hours = 23
          days -= 1
        }
        if (days < 0) {
          days = 0
          hours = 0
          minutes = 0
          seconds = 0
          clearInterval(timer)
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 -mt-4 z-20">
      {/* Banner Content - Solid brand color, rounded corners, no border */}
      <div className="relative bg-brand rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 z-10 shadow-lg">
        
        {/* Left - Sale Text */}
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-white">15%</span>
          <span className="text-xl sm:text-2xl font-semibold text-white">SUMMER SALE</span>
        </div>

        {/* Right - Countdown Timer */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Days */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Days</div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white/50">:</span>
          
          {/* Hours */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Hrs</div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white/50">:</span>
          
          {/* Minutes */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Min</div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white/50">:</span>
          
          {/* Seconds */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Sec</div>
          </div>
        </div>

      </div>
    </div>
  )
}