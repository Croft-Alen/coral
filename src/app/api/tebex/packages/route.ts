import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function GET(request: Request) {
  try {
    const client = getTebexServerClient()

    const { searchParams } =
      new URL(request.url)

    const basketId =
      searchParams.get('basketId')?.trim() || ''

    /*
     * If a basketId is provided, return the
     * actual Tebex basket.
     *
     * This is required by /complete because
     * that page verifies:
     *
     * data.data.complete === true
     */
    if (basketId) {
      console.log(
        '🛒 Fetching basket from Tebex:',
        basketId
      )

      const basket =
        await client.getBasket(
          basketId
        )

      if (!basket) {
        return NextResponse.json(
          {
            success: false,
            error: 'Basket not found',
          },
          { status: 404 }
        )
      }

      console.log(
        '✅ Basket fetched successfully:',
        basket.ident
      )

      return NextResponse.json({
        success: true,
        data: basket,
      })
    }

    /*
     * No basketId means the request is asking
     * for store packages.
     *
     * Preserve the existing package-fetching
     * behavior.
     */
    console.log(
      '📦 Fetching packages from Tebex...'
    )

    const packages =
      await client.getPackages()

    console.log(
      '✅ Packages fetched successfully:',
      packages?.length || 0
    )

    return NextResponse.json({
      success: true,
      data: packages,
    })
  } catch (error: any) {
    console.error(
      '❌ Error fetching Tebex data:',
      error
    )

    if (error?.body) {
      console.error(
        '📝 Error body:',
        JSON.stringify(
          error.body,
          null,
          2
        )
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to fetch Tebex data',
        details:
          error?.body || null,
      },
      {
        status:
          error?.status || 500,
      }
    )
  }
}