import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log(`📂 Resolving category: ${id}`)

    const client = getTebexServerClient()

    // Get all categories first
    const categories = await client.getCategories(true)

    const category = categories.find((item: any) => {
      // Support both numeric IDs and slugs
      if (String(item.id) === id) {
        return true
      }

      return createSlug(item.name) === id.toLowerCase()
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      )
    }

    console.log(
      `✅ Resolved "${id}" → ${category.name} (${category.id})`
    )

    // Fetch the complete category using the actual Tebex ID
    const categoryData = await client.getCategory(
      category.id,
      true
    )

    return NextResponse.json({
      success: true,
      data: categoryData,
    })
  } catch (error: any) {
    console.error('❌ Error fetching category:', error)

    if (error.body) {
      console.error(
        '📝 Error body:',
        JSON.stringify(error.body, null, 2)
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch category',
        details: error.body || null,
      },
      {
        status: error.status || 500,
      }
    )
  }
}