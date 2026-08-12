import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

// GET - Get basket by ID OR run temporary Tebex investigation
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // ============================================================
    // TEMPORARY TEBEX INVESTIGATION
    // ============================================================
    if (searchParams.get('diagnostic') === 'true') {
      const username = searchParams.get('username')
      const packageId = searchParams.get('packageId')

      if (!username || !packageId) {
        return NextResponse.json(
          {
            success: false,
            error: 'diagnostic requires username and packageId',
          },
          { status: 400 }
        )
      }

      const client = getTebexServerClient()

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

      // 1. Create a completely fresh Minecraft basket
      const createdBasket = await client.createMinecraftBasket(
        username,
        `${siteUrl}/store/complete`,
        `${siteUrl}/store`
      )

      // 2. Add ONE real package
      await client.addPackageToBasket(
        createdBasket.ident,
        Number(packageId),
        1
      )

      // 3. Fetch the basket again AFTER adding the package
      const fetchedBasket = await client.getBasket(createdBasket.ident)

      return NextResponse.json({
        success: true,
        diagnostic: true,

        message:
          'Tebex diagnostic basket created, package added, and basket fetched successfully.',

        createdBasket,

        fetchedBasket,

        investigation: {
          basket: {
            ident: fetchedBasket.ident,
            id: fetchedBasket.id,
            complete: fetchedBasket.complete,
          },

          minecraftIdentity: {
            username: fetchedBasket.username,
            username_id: fetchedBasket.username_id,
          },

          customer: {
            email: fetchedBasket.email,
            country: fetchedBasket.country,
            ip: fetchedBasket.ip,
          },

          checkout: {
            complete_url: fetchedBasket.complete_url,
            cancel_url: fetchedBasket.cancel_url,
            complete_auto_redirect:
              fetchedBasket.complete_auto_redirect,
            links: fetchedBasket.links,
          },

          pricing: {
            base_price: fetchedBasket.base_price,
            sales_tax: fetchedBasket.sales_tax,
            total_price: fetchedBasket.total_price,
            currency: fetchedBasket.currency,
          },

          discountsAndCodes: {
            coupons: fetchedBasket.coupons,
            giftcards: fetchedBasket.giftcards,
            creator_code: fetchedBasket.creator_code,
          },

          packages: fetchedBasket.packages,

          custom: fetchedBasket.custom,
        },
      })
    }

    // ============================================================
    // NORMAL GET - Get basket by ID
    // ============================================================

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

    const client = getTebexServerClient()

    const basket = await client.getBasket(basketId)

    return NextResponse.json({
      success: true,
      data: basket,
    })
  } catch (error: any) {
    console.error('Error fetching basket:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch basket',
      },
      { status: 500 }
    )
  }
}

// POST - Create basket
export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()

    const {
      packageId,
      quantity = 1,
      username,
    } = await request.json()

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username is required',
        },
        { status: 400 }
      )
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

    // Create Minecraft basket
    const basket = await client.createMinecraftBasket(
      username,
      `${siteUrl}/store/complete`,
      `${siteUrl}/store`
    )

    // Add package to basket
    await client.addPackageToBasket(
      basket.ident,
      packageId,
      quantity
    )

    return NextResponse.json({
      success: true,
      data: basket,
    })
  } catch (error: any) {
    console.error('Error creating basket:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create basket',
      },
      { status: 500 }
    )
  }
}

// PUT - Update basket item quantity OR add package if it doesn't exist
export async function PUT(request: Request) {
  try {
    const client = getTebexServerClient()

    const {
      basketId,
      packageId,
      quantity,
    } = await request.json()

    if (!basketId || !packageId || !quantity) {
      return NextResponse.json(
        {
          success: false,
          error:
            'basketId, packageId and quantity are required',
        },
        { status: 400 }
      )
    }

    // Get the current basket to check whether this package already exists
    const basket = await client.getBasket(basketId)

    const existingPackage = basket.packages?.find(
      (pkg: any) => pkg.id === packageId
    )

    if (existingPackage) {
      // Package already exists → update quantity
      await client.updateQuantity(
        basketId,
        packageId,
        quantity
      )

      console.log(
        `Updated package ${packageId} quantity to ${quantity}`
      )
    } else {
      // Package doesn't exist → add it to the existing basket
      await client.addPackageToBasket(
        basketId,
        packageId,
        quantity
      )

      console.log(
        `Added package ${packageId} to existing basket ${basketId}`
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error updating basket:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update basket',
        details: error.body || null,
      },
      { status: error.status || 500 }
    )
  }
}

// DELETE - Remove item from basket
export async function DELETE(request: Request) {
  try {
    const client = getTebexServerClient()

    const {
      basketId,
      packageId,
    } = await request.json()

    if (!basketId || !packageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId and packageId are required',
        },
        { status: 400 }
      )
    }

    await client.removePackage(
      basketId,
      packageId
    )

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error removing from basket:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error.message || 'Failed to remove item from basket',
      },
      { status: error.status || 500 }
    )
  }
}