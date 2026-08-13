import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

// POST - Apply a gift card to a Tebex basket
export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()

    const { basketId, cardNumber } = await request.json()

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    if (!cardNumber || typeof cardNumber !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'cardNumber is required',
        },
        { status: 400 }
      )
    }

    const card = cardNumber.trim()

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gift card number cannot be empty',
        },
        { status: 400 }
      )
    }

    // Apply gift card through Tebex using the generic apply method
    await client.apply(
      basketId,
      'giftcards',
      {
        card_number: card,
      }
    )

    // Fetch the updated basket so the frontend receives
    // the actual Tebex pricing and gift card state.
    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
      giftCard: {
        cardNumber: card,
        applied: true,
      },
    })
  } catch (error: any) {
    console.error('Error applying gift card:', error)

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to apply gift card',
        details: error?.body || null,
      },
      {
        status: error?.status || 400,
      }
    )
  }
}

// DELETE - Remove a gift card from a Tebex basket
export async function DELETE(request: Request) {
  try {
    const client = getTebexServerClient()

    const { basketId, cardNumber } = await request.json()

    if (!basketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    if (!cardNumber || typeof cardNumber !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'cardNumber is required',
        },
        { status: 400 }
      )
    }

    const card = cardNumber.trim()

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gift card number cannot be empty',
        },
        { status: 400 }
      )
    }

    // Remove gift card through Tebex using the generic remove method
    await client.remove(
      basketId,
      'giftcards',
      {
        card_number: card,
      }
    )

    // Fetch the updated basket after removal
    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
      giftCard: {
        cardNumber: card,
        applied: false,
      },
    })
  } catch (error: any) {
    console.error('Error removing gift card:', error)

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to remove gift card',
        details: error?.body || null,
      },
      {
        status: error?.status || 400,
      }
    )
  }
}