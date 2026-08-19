'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] bg-pageBg flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-text-heading mb-3">404</h1>
        <h2 className="text-xl font-semibold text-text-heading mb-2">Page Not Found</h2>
        <p className="text-text-muted mb-6">The page you're looking for doesn't exist.</p>
        <Button href="/" variant="primary" size="md">
          Return Home
        </Button>
      </div>
    </div>
  )
}