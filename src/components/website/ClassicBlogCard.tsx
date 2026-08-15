'use client'

import Link from 'next/link'

interface ClassicBlogCardProps {
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

export function ClassicBlogCard({ post }: ClassicBlogCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block w-full h-full group">
      <div className="flex flex-col w-full h-full overflow-hidden bg-cardBg shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg border border-white/5 hover:border-brand/20">
        {/* Image - Full width on top */}
        <div className="w-full h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden">
          <img
            src={post.bannerImage || '/images/blog-placeholder.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content - Below image */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-heading mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {post.title}
          </h3>
          
          <p className="text-text-muted text-sm sm:text-base mb-4 line-clamp-3 flex-grow">
            {post.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-muted">
            <span className="font-medium text-text-body">{post.author}</span>
            <span className="text-text-muted/40">•</span>
            <span>{formatDate(post.publishedDate)}</span>
            <span className="text-text-muted/40">•</span>
            <span>{post.readTime} min read</span>
          </div>
          
          {/* Tags with spacing above */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 text-xs bg-brand/10 text-brand font-medium rounded"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs bg-brand/10 text-brand font-medium rounded">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}