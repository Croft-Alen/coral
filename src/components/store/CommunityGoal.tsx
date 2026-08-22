'use client'

import { useState, useEffect } from 'react'
import { FaTrophy } from 'react-icons/fa'
import { useSettings } from '@/context/SettingsContext'

interface CommunityGoal {
  header: string
  bar_style: 'normal' | 'striped'
  bar_animated: boolean
  percentage: number
  target: number
  total_payments: number
}

export function CommunityGoal() {
  const { settings } = useSettings()
  const [goal, setGoal] = useState<CommunityGoal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommunityGoal = async () => {
      try {
        const response = await fetch('/api/tebex/store')
        const data = await response.json()

        if (data.success) {
          setGoal(data.data.communityGoal || null)
        } else {
          setGoal(null)
        }
      } catch (error) {
        console.error('Error fetching community goal:', error)
        setGoal(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityGoal()
  }, [])

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="bg-cardBg shadow-lg overflow-hidden rounded-md min-h-[151px]"
      />
    )
  }

  if (!goal) {
    return null
  }

  const percentage = Math.min(
    100,
    Math.max(0, Number(goal.percentage ?? 0))
  )

  const target = Number(goal.target ?? 0)
  const current = Number(goal.total_payments ?? 0)

  const useHorizontal = settings?.communityGoalHorizontal === true
  const useSemiCircle = settings?.communityGoalSemiCircle !== false

  if (useHorizontal) {
    return (
      <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
        <div className="relative">
          <div className="absolute inset-0 h-12 bg-brand" />
          <div className="relative px-4 py-3 flex items-center gap-3">
            <FaTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
              COMMUNITY GOAL
            </h3>
          </div>
        </div>

        <div className="px-3 pt-4 pb-5">
          <div>
            <div className="flex items-center justify-start gap-1">
              <span className="text-text-body text-sm sm:text-base font-semibold">
                ${Math.floor(current)}
              </span>
              <span className="text-text-muted text-sm sm:text-base font-semibold">/</span>
              <span className="text-text-body text-sm sm:text-base font-semibold">
                ${Math.floor(target)}
              </span>
            </div>

            <div className="mt-4">
              <div
                className="relative w-full h-8 rounded-full overflow-hidden"
                style={{
                  background: 'var(--color-pageBg)',
                  border: '2px solid var(--color-border)',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full overflow-hidden"
                  style={{
                    width: `${percentage}%`,
                    background: `var(--color-brand)`,
                    boxShadow: 'inset 0 0.05em 0.05em rgba(255,255,255,0.35)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (useSemiCircle) {
    const radius = 92
    const circumference = Math.PI * radius
    const progressOffset = circumference - (percentage / 100) * circumference

    return (
      <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
        <div className="relative">
          <div className="absolute inset-0 h-12 bg-brand" />
          <div className="relative px-4 py-3 flex items-center gap-3">
            <FaTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
              COMMUNITY GOAL
            </h3>
          </div>
        </div>

        <div className="relative px-4 pt-4 pb-2">
          <div className="flex justify-center mt-1">
            <div className="relative w-[220px] h-[128px]">
              <svg
                viewBox="0 0 220 128"
                className="absolute inset-0 w-full h-full overflow-visible"
                aria-label={`${Math.floor(percentage)}% community goal progress`}
              >
                <path
                  d="M 18 108 A 92 92 0 0 1 202 108"
                  fill="none"
                  stroke="var(--color-pageBg)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                <path
                  d="M 18 108 A 92 92 0 0 1 202 108"
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  pathLength={circumference}
                  className="community-goal-progress"
                  style={{
                    transition: 'stroke-dashoffset 1s ease-out',
                  }}
                />
              </svg>

              <div className="absolute inset-x-0 bottom-[7px] flex items-center justify-center gap-1">
                <span className="text-text-body text-lg sm:text-xl font-semibold">
                  ${Math.floor(current)}
                </span>
                <span className="text-text-muted text-lg sm:text-xl font-semibold">/</span>
                <span className="text-text-body text-lg sm:text-xl font-semibold">
                  ${Math.floor(target)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            .community-goal-progress {
              transition: none !important;
            }
          }
        `}</style>
      </div>
    )
  }

  return null
}