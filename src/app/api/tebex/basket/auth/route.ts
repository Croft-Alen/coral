import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const basketId = searchParams.get('basketId')

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

    const returnUrl = `${siteUrl}/`

    const client = getTebexServerClient()

    const authUrls = await client.getBasketAuthUrl(
      basketId,
      returnUrl
    )

    return NextResponse.json({
      success: true,
      basketId,
      returnUrl,
      authUrls,
    })
  } catch (error: any) {
    console.error('Error fetching Tebex basket auth:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch basket authentication',
        details: error.body || null,
      },
      { status: error.status || 500 }
    )
  }
}