'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/context/SettingsContext'
import { motion } from 'framer-motion'

export function SaleBanner() {
  const { settings } = useSettings()
  
  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 8,
    minutes: 29,
    seconds: 36
  })

  // Generate random particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; size: number; duration: number; delay: number; drift: number }>>([])

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

  // Generate particles on mount
  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 80; i++) {
      newParticles.push({
        id: i,
        x: 8 + Math.random() * 84, // Particles stay within 8% - 92% (avoid edges)
        size: Math.random() * 8 + 3,
        duration: Math.random() * 10 + 6,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 60,
      })
    }
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 -mt-4 z-20 overflow-visible">
      {/* Particles - Originate from behind the banner, rise upward */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: '50%',
              background: `rgba(250, 73, 73, ${0.3 + Math.random() * 0.5})`,
              boxShadow: `0 0 ${particle.size * 2.5}px rgba(250, 73, 73, 0.4)`,
            }}
            animate={{
              y: [0, -350, -700],
              opacity: [0.9, 0.5, 0],
              x: [0, particle.drift, particle.drift * 0.2],
              scale: [1, 1.3, 0.7],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Banner Content */}
      <div className="relative border-4 border-brand bg-brand/30 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 z-10">
        
        {/* Left - Sale Text */}
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-brand">15%</span>
          <span className="text-xl sm:text-2xl font-semibold text-text-heading">SUMMER SALE</span>
        </div>

        {/* Right - Countdown Timer */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Days */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Days</div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-brand/50">:</span>
          
          {/* Hours */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Hrs</div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-brand/50">:</span>
          
          {/* Minutes */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Min</div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-brand/50">:</span>
          
          {/* Seconds */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Sec</div>
          </div>
        </div>

      </div>
    </div>
  )
}