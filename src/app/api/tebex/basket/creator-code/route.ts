import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

// POST - Apply a creator code to a Tebex basket
export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()

    const { basketId, creatorCode } = await request.json()

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    if (!creatorCode || typeof creatorCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'creatorCode is required',
        },
        { status: 400 }
      )
    }

    const code = creatorCode.trim()

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator code cannot be empty',
        },
        { status: 400 }
      )
    }

    // Apply creator code through Tebex
    await client.apply(
      basketId,
      'creator-codes',
      {
        creator_code: code,
      }
    )

    // Fetch the updated basket so the frontend receives
    // the actual Tebex pricing and creator code state.
    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
      creatorCode: {
        code,
        applied: true,
      },
    })
  } catch (error: any) {
    console.error('Error applying creator code:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to apply creator code',
        details: error?.body || null,
      },
      {
        status: error?.status || 400,
      }
    )
  }
}

// DELETE - Remove a creator code from a Tebex basket
export async function DELETE(request: Request) {
  try {
    const client = getTebexServerClient()

    const { basketId, creatorCode } = await request.json()

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    if (!creatorCode || typeof creatorCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'creatorCode is required',
        },
        { status: 400 }
      )
    }

    const code = creatorCode.trim()

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator code cannot be empty',
        },
        { status: 400 }
      )
    }

    // Remove creator code through Tebex
    await client.remove(
      basketId,
      'creator-codes',
      {
        creator_code: code,
      }
    )

    // Fetch the updated basket after removal
    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
      creatorCode: {
        code,
        applied: false,
      },
    })
  } catch (error: any) {
    console.error('Error removing creator code:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to remove creator code',
        details: error?.body || null,
      },
      {
        status: error?.status || 400,
      }
    )
  }
}

