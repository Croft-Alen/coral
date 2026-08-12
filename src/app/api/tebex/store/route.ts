import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function GET() {
  try {
    const client = getTebexServerClient()

    // Get store information from Tebex
    const webstore = await client.getWebstore()

    // Get Tebex sidebar modules
    const sidebar = await client.getSidebar()

    console.log(
      '🧩 TEBEX SIDEBAR:',
      JSON.stringify(sidebar, null, 2)
    )

    // Recent Payments
    // Tebex's SDK type does not currently declare avatar_url
    // on RecentPayment, but the runtime API may provide it.
    const recentPaymentsModule = sidebar.find(
      (module) => module.type === 'recent_payments'
    )

    const recentPayments =
      recentPaymentsModule?.type === 'recent_payments'
        ? recentPaymentsModule.data.payments.map((payment) => {
            const runtimePayment = payment as typeof payment & {
              avatar_url?: string
            }

            return {
              id: recentPaymentsModule.data.payments.indexOf(payment),
              username: payment.username,
              username_id: payment.username_id,
              avatar_url: runtimePayment.avatar_url,
            }
          })
        : []

    // Top Customer
    // Same situation: avatar_url is not declared in the SDK type,
    // so access it through a runtime-safe extended type.
    const topCustomerModule = sidebar.find(
      (module) => module.type === 'top_customer'
    )

    const topCustomer =
      topCustomerModule?.type === 'top_customer'
        ? (() => {
            const runtimeCustomer =
              topCustomerModule.data as typeof topCustomerModule.data & {
                avatar_url?: string
              }

            return {
              username: topCustomerModule.data.username,
              username_id: topCustomerModule.data.username_id,
              avatar_url: runtimeCustomer.avatar_url,
              total: topCustomerModule.data.total ?? 0,
            }
          })()
        : null

    return NextResponse.json({
      success: true,
      data: {
        // Store information managed through Tebex
        webstore: {
          id: webstore.id,
          name: webstore.name,
          description: webstore.description,
          webstore_url: webstore.webstore_url,
          currency: webstore.currency,
          lang: webstore.lang,
          logo: webstore.logo,
          platform_type: webstore.platform_type,
          disabled: webstore.disabled,
          supports_usernames: webstore.supports_usernames,
          supports_gifting: webstore.supports_gifting,
        },

        // Sidebar data
        recentPayments,
        topCustomer,
      },
    })
  } catch (error: any) {
    console.error('Error fetching store data:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch store data',
        details: error.body || null,
      },
      { status: error.status || 500 }
    )
  }
}