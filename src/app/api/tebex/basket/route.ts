import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

/*
 * GET - Get basket by ID
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const basketId = searchParams.get('basketId')

    if (!basketId?.trim()) {
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
        error:
          error?.message ||
          'Failed to fetch basket',
        details: error?.body || null,
      },
      {
        status: error?.status || 500,
      }
    )
  }
}

/*
 * POST - Create a new basket and add a package
 */
export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()

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

    const numericPackageId = Number(packageId)

    if (
      !Number.isInteger(numericPackageId) ||
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

    const numericQuantity = Number(quantity)

    if (
      !Number.isInteger(numericQuantity) ||
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
        status: error?.status || 500,
      }
    )
  }
}

/*
 * PUT - Add package or update package quantity
 */
export async function PUT(request: Request) {
  try {
    const client = getTebexServerClient()

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
          error: 'basketId is required',
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
          error:
            'packageId must be a valid positive integer',
        },
        { status: 400 }
      )
    }

    const numericQuantity = Number(quantity)

    if (
      !Number.isInteger(numericQuantity) ||
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
      await client.getBasket(basketId)

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

    const updatedBasket =
      await client.getBasket(basketId)

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
        status: error?.status || 500,
      }
    )
  }
}

/*
 * DELETE - Remove item from basket
 */
export async function DELETE(request: Request) {
  try {
    const client = getTebexServerClient()

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
          error: 'basketId is required',
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

    const updatedBasket =
      await client.getBasket(basketId)

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
        status: error?.status || 500,
      }
    )
  }
}
