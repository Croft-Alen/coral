'use client'

import { useSettings } from '@/context/SettingsContext'
import { BlogCard } from '@/components/website/BlogCard'
import { ClassicBlogCard } from '@/components/website/ClassicBlogCard'
import blogData from '@/data/blog.json'

export default function HomePage() {
  const { settings, isLoading } = useSettings()

  if (isLoading) {
    return <div className="min-h-screen bg-pageBg flex items-center justify-center">Loading...</div>
  }

  const posts = blogData.posts

  // Separate first post and remaining posts
  const [firstPost, ...remainingPosts] = posts

  return (
    <>
      {/* Blog Cards */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length > 0 ? (
          <div className="space-y-6">
            {/* First Post - 50/50 Layout (Featured) */}
            {firstPost && <BlogCard post={firstPost} />}

            {/* Remaining Posts - Classic Grid (2 per row) */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remainingPosts.map((post) => (
                  <ClassicBlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-text-muted text-center py-12">No blog posts yet.</p>
        )}
      </div>
    </>
  )
}