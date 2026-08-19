import type { Metadata } from 'next'
import { getTebexServerClient } from '@/lib/tebex/client'
import settingsData from '@/data/settings.json'
import CategoryPageClient from './CategoryPageClient'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

async function getCategoryBySlug(slug: string) {
  try {
    const client = getTebexServerClient()

    const categories = await client.getCategories(false)

    const normalizedSlug = slug.toLowerCase()

    const category = categories.find(
      (item) =>
        item.slug?.toLowerCase() === normalizedSlug
    )

    return category || null
  } catch (error) {
    console.error(
      'Failed to fetch Tebex categories:',
      error
    )

    return null
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params

  const categoryData = await getCategoryBySlug(category)

  if (!categoryData?.name) {
    return {
      title: settingsData.siteName,
    }
  }

  return {
    title: `${settingsData.siteName} | ${categoryData.name}`,
  }
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params

  return (
    <CategoryPageClient categoryId={category} />
  )
}