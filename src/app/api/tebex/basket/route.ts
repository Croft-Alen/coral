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

      const numericPackageId = Number(packageId)

      if (
        !Number.isInteger(numericPackageId) ||
        numericPackageId <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'packageId must be a valid positive integer',
          },
          { status: 400 }
        )
      }

      const client = getTebexServerClient()

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://your-domain.com'

      // 1. Create a completely fresh Minecraft basket
      const createdBasket =
        await client.createMinecraftBasket(
          username,
          `${siteUrl}/store/complete`,
          `${siteUrl}/store`
        )

      // 2. Add ONE real package
      await client.addPackageToBasket(
        createdBasket.ident,
        numericPackageId,
        1
      )

      // 3. Fetch the basket again AFTER adding the package
      const fetchedBasket =
        await client.getBasket(
          createdBasket.ident
        )

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

    const basketId =
      searchParams.get('basketId')

    if (!basketId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'basketId is required',
        },
        { status: 400 }
      )
    }

    const client =
      getTebexServerClient()

    const basket =
      await client.getBasket(
        basketId
      )

    return NextResponse.json({
      success: true,
      data: basket,
    })
  } catch (error: any) {
    console.error(
      'Error fetching basket:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to fetch basket',
        details: error?.body || null,
      },
      {
        status:
          error?.status || 500,
      }
    )
  }
}

// POST - Create basket
export async function POST(request: Request) {
  try {
    const client =
      getTebexServerClient()

    const {
      packageId,
      quantity = 1,
      username,
    } = await request.json()

    if (
      !username ||
      typeof username !== 'string' ||
      !username.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username is required',
        },
        { status: 400 }
      )
    }

    const numericPackageId =
      Number(packageId)

    if (
      !Number.isInteger(
        numericPackageId
      ) ||
      numericPackageId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'packageId must be a valid positive integer',
        },
        { status: 400 }
      )
    }

    const numericQuantity =
      Number(quantity)

    if (
      !Number.isInteger(
        numericQuantity
      ) ||
      numericQuantity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'quantity must be a positive integer',
        },
        { status: 400 }
      )
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://your-domain.com'

    const basket =
      await client.createMinecraftBasket(
        username.trim(),
       `${siteUrl}/complete`,
`${siteUrl}/`
      )

    await client.addPackageToBasket(
      basket.ident,
      numericPackageId,
      numericQuantity
    )

    const updatedBasket =
      await client.getBasket(
        basket.ident
      )

    return NextResponse.json({
      success: true,
      data: updatedBasket,
    })
  } catch (error: any) {
    console.error(
      'Error creating basket:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to create basket',
        details: error?.body || null,
      },
      {
        status:
          error?.status || 500,
      }
    )
  }
}

// PUT - Add package or update package quantity
export async function PUT(request: Request) {
  try {
    const client =
      getTebexServerClient()

    const {
      basketId,
      packageId,
      quantity,
    } = await request.json()

    if (
      !basketId ||
      typeof basketId !== 'string' ||
      !basketId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'basketId is required',
        },
        { status: 400 }
      )
    }

    const numericPackageId =
      Number(packageId)

    if (
      !Number.isInteger(
        numericPackageId
      ) ||
      numericPackageId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'packageId must be a valid positive integer',
        },
        { status: 400 }
      )
    }

    const numericQuantity =
      Number(quantity)

    if (
      !Number.isInteger(
        numericQuantity
      ) ||
      numericQuantity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'quantity must be a positive integer',
        },
        { status: 400 }
      )
    }

    const basket =
      await client.getBasket(
        basketId
      )

    const existingPackage =
      basket.packages?.find(
        (pkg: any) =>
          Number(pkg.id) ===
          numericPackageId
      )

    if (existingPackage) {
      await client.updateQuantity(
        basketId,
        numericPackageId,
        numericQuantity
      )
    } else {
      await client.addPackageToBasket(
        basketId,
        numericPackageId,
        numericQuantity
      )
    }

    // Always return Tebex's latest basket
    const updatedBasket =
      await client.getBasket(
        basketId
      )

    return NextResponse.json({
      success: true,
      data: updatedBasket,
    })
  } catch (error: any) {
    console.error(
      'Error updating basket:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to update basket',
        details: error?.body || null,
      },
      {
        status:
          error?.status || 500,
      }
    )
  }
}

// DELETE - Remove item from basket
export async function DELETE(request: Request) {
  try {
    const client =
      getTebexServerClient()

    const {
      basketId,
      packageId,
    } = await request.json()

    if (
      !basketId ||
      typeof basketId !== 'string' ||
      !basketId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'basketId is required',
        },
        { status: 400 }
      )
    }

    const numericPackageId =
      Number(packageId)

    if (
      !Number.isInteger(
        numericPackageId
      ) ||
      numericPackageId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'packageId must be a valid positive integer',
        },
        { status: 400 }
      )
    }

    await client.removePackage(
      basketId,
      numericPackageId
    )

    /*
     * Fetch Tebex's latest basket.
     *
     * This allows CartContext to know whether:
     *
     * 1. Items still remain.
     * 2. The basket became completely empty.
     * 3. Pricing changed.
     * 4. Coupons/gift cards/creator codes changed.
     */
    const updatedBasket =
      await client.getBasket(
        basketId
      )

    return NextResponse.json({
      success: true,
      data: updatedBasket,
    })
  } catch (error: any) {
    console.error(
      'Error removing from basket:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to remove item from basket',
        details: error?.body || null,
      },
      {
        status:
          error?.status || 500,
      }
    )
  }
}