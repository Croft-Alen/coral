import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function POST(request: Request) {
  try {
    const client =
      getTebexServerClient()

    const body = await request.json()

    const basketId =
      typeof body?.basketId === 'string'
        ? body.basketId.trim()
        : ''

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    /*
     * Fetch the basket directly from Tebex.
     *
     * The basket returned here is the source of truth for
     * the checkout URL and current basket state.
     */
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

    /*
     * Do not start checkout for an empty basket.
     */
    if (
      !Array.isArray(
        basket.packages
      ) ||
      basket.packages.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot checkout an empty basket',
        },
        { status: 400 }
      )
    }

    /*
     * Tebex provides the checkout URL through basket.links.checkout.
     */
    const checkoutUrl =
      basket.links?.checkout

    if (
      typeof checkoutUrl !== 'string' ||
      !checkoutUrl.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Checkout URL not found for this basket',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutUrl,
    })
  } catch (error: any) {
    console.error(
      'Error getting checkout:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to get checkout URL',
        details: error?.body || null,
      },
      {
        status:
          error?.status || 500,
      }
    )
  }
}