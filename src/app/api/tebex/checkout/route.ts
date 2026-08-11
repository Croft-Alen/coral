import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function POST(request: Request) {
  try {
    const client = getTebexServerClient()
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Tebex client not configured' },
        { status: 400 }
      )
    }
    
    const { basketId } = await request.json()
    
    // Get basket with checkout URL
    const basket = await client.getBasket(basketId)
    
    if (!basket || !basket.links || !basket.links.checkout) {
      return NextResponse.json(
        { success: false, error: 'Invalid basket or checkout URL not found' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      checkoutUrl: basket.links.checkout 
    })
  } catch (error: any) {
    console.error('Error getting checkout:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get checkout URL' },
      { status: 500 }
    )
  }
}