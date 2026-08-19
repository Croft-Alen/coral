'use client'

interface BlogFiltersProps {
  tags: string[]
  selectedTag: string
  onTagChange: (tag: string) => void
}

export function BlogFilters({ tags, selectedTag, onTagChange }: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedTag === tag
              ? 'bg-brand text-pageBg'
              : 'bg-white/5 text-text-body hover:bg-white/10'
          }`}
        >
          {tag.charAt(0).toUpperCase() + tag.slice(1)}
        </button>
      ))}
    </div>
  )
}