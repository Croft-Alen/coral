import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function GET() {
  try {

    const client = getTebexServerClient()

    const categories = await client.getCategories(true)

    

    return NextResponse.json({
      success: true,
      data: categories || [],
    })
  } catch (error: any) {
    console.error('❌ Error fetching categories:', error)

    if (error.body) {
      console.error(
        '📝 Error body:',
        JSON.stringify(error.body, null, 2)
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch categories',
        details: error.body || null,
      },
      {
        status: error.status || 500,
      }
    )
  }
}