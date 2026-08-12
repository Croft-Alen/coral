import { NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.TEBEX_WEBHOOK_SECRET || 'your-webhook-secret'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('X-Signature')

    // Verify webhook signature
    if (WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
      hmac.update(body)
      const expectedSignature = hmac.digest('hex')

      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature')
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 401 }
        )
      }
      console.log('✅ Webhook signature verified')
    }

    const data = JSON.parse(body)
    console.log('📨 Webhook received:', data)

    // Handle different webhook events
    const event = data.type || data.event

    switch (event) {
      case 'payment.completed':
      case 'transaction.created':
      case 'payment.completed':
        await handlePaymentCompleted(data)
        break
      
      case 'payment.refunded':
        console.log('💳 Payment refunded:', data)
        break
      
      case 'payment.declined':
        console.log('❌ Payment declined:', data)
        break
      
      default:
        console.log(`⚠️ Unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Handle payment completed
async function handlePaymentCompleted(data: any) {
  console.log('💳 Processing completed payment...')

  const transaction = data.transaction || data.data?.transaction || data
  
  const customer = transaction.customer || data.customer
  const username = customer?.username || customer?.name || 'Unknown'
  const packages = transaction.packages || data.packages || []
  const amount = transaction.amount || data.amount || 0
  const currency = transaction.currency || data.currency || 'USD'

  console.log(`👤 Customer: ${username}`)
  console.log(`📦 Packages: ${packages.map((p: any) => p.name).join(', ')}`)
  console.log(`💰 Amount: ${amount} ${currency}`)

  // TODO: Deliver items to player
  // This is where you would:
  // 1. Connect to your Minecraft server
  // 2. Execute commands to give items/ranks
  // 3. Update your database with purchase record

  // Example: Log the delivery
  console.log(`✅ Should deliver ${packages.length} package(s) to ${username}`)

  // You could also store in database for "Recent Payments" or "Top Customers"
  // await savePurchaseToDatabase({ username, packages, amount, currency })
}

// GET - For testing webhook endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Webhook endpoint is active',
    webhookSecretSet: !!WEBHOOK_SECRET,
  })
}