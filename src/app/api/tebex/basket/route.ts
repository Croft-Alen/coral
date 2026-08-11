import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

// GET - Get basket by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const basketId = searchParams.get('basketId')
    
    if (!basketId) {
      return NextResponse.json(
        { success: false, error: 'basketId is required' },
        { status: 400 }
      )
    }
    
    const client = getTebexServerClient()
    const basket = await client.getBasket(basketId)
    
    return NextResponse.json({ success: true, data: basket })
  } catch (error: any) {
    console.error('Error fetching basket:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch basket' },
      { status: 500 }
    )
  }
}

// POST - Create basket
export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()
    const { packageId, quantity = 1, username } = await request.json()
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
    
    // Create basket with username
    const basket = await client.createBasket({
      completeUrl: `${siteUrl}/store/complete`,
      cancelUrl: `${siteUrl}/store`,
      username: username,
    })
    
    // Add package to basket with username
    await client.addPackageToBasket({
      basketIdent: basket.ident,
      packageId: packageId,
      quantity: quantity,
      username: username,
    })
    
    return NextResponse.json({ success: true, data: basket })
  } catch (error: any) {
    console.error('Error creating basket:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create basket' },
      { status: 500 }
    )
  }
}

// PUT - Update basket item quantity
export async function PUT(request: Request) {
  try {
    const client = getTebexServerClient()
    const { basketId, packageId, quantity, username } = await request.json()

    await client.updateQuantity({
      basketIdent: basketId,
      packageId: packageId,
      quantity: quantity,
      username: username,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating basket:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update basket',
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from basket
export async function DELETE(request: Request) {
  try {
    const client = getTebexServerClient()
    const { basketId, packageId, username } = await request.json()

    await client.removePackage({
      basketIdent: basketId,
      packageId: packageId,
      username: username,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing from basket:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove item from basket',
      },
      { status: 500 }
    )
  }
}