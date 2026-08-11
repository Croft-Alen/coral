import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pageBg">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-text-heading mb-3">404</h1>
        <h2 className="text-xl font-semibold text-text-heading mb-2">Page Not Found</h2>
        <p className="text-text-muted mb-6">Sorry, the page you're looking for doesn't exist.</p>
        <Link 
          href="/"
          className="inline-block bg-brand text-pageBg font-semibold px-6 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}