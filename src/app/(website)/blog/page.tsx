'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/website/PageLayout'
import { BlogCard } from '@/components/website/BlogCard'
import { BlogFilters } from '@/components/website/BlogFilters'
import blogData from '@/data/blog.json'

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const posts = blogData.posts

  // Get all unique tags
  const allTags = ['all', ...new Set(posts.flatMap(post => post.tags))]

  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag))

  return (
    <PageLayout title="Blog" description="Latest news, updates, and guides from our community.">
      <BlogFilters 
        tags={allTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-text-muted col-span-2 text-center py-8">
            No posts found with this tag.
          </p>
        )}
      </div>
    </PageLayout>
  )
}