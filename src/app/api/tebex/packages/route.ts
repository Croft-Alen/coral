import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function GET() {
  try {
    console.log('📦 Fetching packages from Tebex...')
    const client = getTebexServerClient()
    
    // Try to get packages with more detailed error handling
    const packages = await client.getPackages()
    
    console.log('✅ Packages fetched successfully:', packages?.length || 0)
    
    return NextResponse.json({ success: true, data: packages })
  } catch (error: any) {
    console.error('❌ Error fetching packages:', error)
    
    // Log more details about the error
    if (error.body) {
      console.error('📝 Error body:', JSON.stringify(error.body, null, 2))
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch packages',
        details: error.body || null
      },
      { status: error.status || 500 }
    )
  }
}