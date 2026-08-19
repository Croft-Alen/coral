'use client'

import Link from 'next/link'

interface BlogCardProps {
  post: {
    id: string
    slug: string
    title: string
    description: string
    author: string
    publishedDate: string
    readTime: number
    tags: string[]
    bannerImage?: string
  }
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block w-full h-full">
      <div className="flex flex-col sm:flex-row w-full h-full overflow-hidden bg-cardBg shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Left - Image */}
        <div className="w-full sm:w-2/5 md:w-1/2 h-48 sm:h-auto">
          <img
            src={post.bannerImage || '/images/blog-placeholder.jpg'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Content - Start from top */}
        <div className="w-full sm:w-3/5 md:w-1/2 p-3 sm:p-5 md:p-7 flex flex-col justify-start">
          <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-text-heading mb-1 sm:mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-text-muted text-[11px] sm:text-sm md:text-base mb-2 sm:mb-4 line-clamp-3">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm text-text-muted">
            <span className="font-medium text-text-body">{post.author}</span>
            <span className="text-text-muted/40">•</span>
            <span>{formatDate(post.publishedDate)}</span>
            <span className="text-text-muted/40">•</span>
            <span>{post.readTime} min read</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mt-1.5 sm:mt-2 md:mt-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag} 
                  className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs bg-brand text-white font-medium"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs bg-brand/80 text-white font-medium">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}