import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

// POST - Apply a coupon to a Tebex basket
export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()

    const { basketId, couponCode } = await request.json()

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    if (!couponCode || typeof couponCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'couponCode is required',
        },
        { status: 400 }
      )
    }

    const code = couponCode.trim()

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coupon code cannot be empty',
        },
        { status: 400 }
      )
    }

    // Apply coupon through Tebex
    await client.apply(
      basketId,
      'coupons',
      {
        coupon_code: code,
      }
    )

    // Fetch the updated basket so the frontend receives
    // the actual Tebex pricing and coupon state.
    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
      coupon: {
        code,
        applied: true,
      },
    })
  } catch (error: any) {
    console.error('Error applying coupon:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to apply coupon',
        details: error?.body || null,
      },
      {
        status: error?.status || 400,
      }
    )
  }
}

// DELETE - Remove a coupon from a Tebex basket
export async function DELETE(request: Request) {
  try {
    const client = getTebexServerClient()

    const { basketId, couponCode } = await request.json()

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    if (!couponCode || typeof couponCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'couponCode is required',
        },
        { status: 400 }
      )
    }

    const code = couponCode.trim()

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coupon code cannot be empty',
        },
        { status: 400 }
      )
    }

    // Remove coupon through Tebex
    await client.remove(
      basketId,
      'coupons',
      {
        coupon_code: code,
      }
    )

    // Fetch the updated basket after removal
    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
      coupon: {
        code,
        applied: false,
      },
    })
  } catch (error: any) {
    console.error('Error removing coupon:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to remove coupon',
        details: error?.body || null,
      },
      {
        status: error?.status || 400,
      }
    )
  }
}