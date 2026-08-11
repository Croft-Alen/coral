'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as React from 'react' // Import React
import { PageLayout } from '@/components/website/PageLayout'
import blogData from '@/data/blog.json'
import { FaArrowLeft } from 'react-icons/fa'

interface BlogDetailPageProps {
  params: Promise<{ // Change to Promise
    slug: string
  }>
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  // Unwrap the params Promise using React.use()
  const { slug } = React.use(params)
  const post = blogData.posts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <PageLayout title={post.title}>
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-heading transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6 pb-6 border-b border-white/10">
        <span>By {post.author}</span>
        <span>•</span>
        <span>{formatDate(post.publishedDate)}</span>
        <span>•</span>
        <span>{post.readTime} min read</span>
      </div>

      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-full bg-brand/10 text-brand border border-brand/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </PageLayout>
  )
}