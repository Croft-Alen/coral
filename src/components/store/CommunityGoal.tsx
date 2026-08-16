'use client'

import { useState, useEffect } from 'react'
import { FaTrophy } from 'react-icons/fa'

interface CommunityGoal {
  header: string
  bar_style: 'normal' | 'striped'
  bar_animated: boolean
  percentage: number
  target: number
  total_payments: number
}

export function CommunityGoal() {
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

  // Reserve the card's expected height while Tebex data is loading.
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="bg-cardBg shadow-lg overflow-hidden rounded-md min-h-[151px]"
      />
    )
  }

  // Tebex has no active community goal.
  if (!goal) {
    return null
  }

  const percentage = Math.min(
    100,
    Math.max(0, Number(goal.percentage ?? 0))
  )

  // Use Tebex's actual values.
  const target = Number(goal.target ?? 0)
  const current = Number(goal.total_payments ?? 0)

  return (
    <div className="bg-cardBg shadow-lg overflow-hidden rounded-md">
      {/* Header with Brand Strip Behind Title */}
      <div className="relative">
        <div className="absolute inset-0 h-12 bg-brand" />
        <div className="relative px-4 py-3 flex items-center gap-3">
          <FaTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">
            COMMUNITY GOAL
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pt-4 pb-5">
        <div>
          {/* Amount - Left aligned */}
          <div className="flex items-center justify-start gap-1">
            <span className="text-text-body text-sm sm:text-base font-semibold">
              ${Math.floor(current)}
            </span>

            <span className="text-text-muted text-sm sm:text-base font-semibold">
              /
            </span>

            <span className="text-text-body text-sm sm:text-base font-semibold">
              ${Math.floor(target)}
            </span>
          </div>

          {/* Progress Bar - Animated diagonal stripes */}
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
                  background: `
                    repeating-linear-gradient(
                      45deg,
                      var(--color-brand) 0px,
                      var(--color-brand) 12px,
                      var(--color-text-heading) 12px,
                      var(--color-text-heading) 24px,
                      var(--color-brand) 24px,
                      var(--color-brand) 36px,
                      var(--color-text-heading) 36px,
                      var(--color-text-heading) 48px,
                      var(--color-brand) 48px,
                      var(--color-brand) 60px,
                      var(--color-text-heading) 60px,
                      var(--color-text-heading) 72px,
                      var(--color-brand) 72px,
                      var(--color-brand) 84px,
                      var(--color-text-heading) 84px,
                      var(--color-text-heading) 96px
                    )
                  `,
                  backgroundSize: '136px 136px',
                  animation: 'slide 4s linear infinite',
                  boxShadow:
                    'inset 0 0.05em 0.05em rgba(255,255,255,0.35)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 136px 0;
          }
        }
      `}</style>
    </div>
  )
}