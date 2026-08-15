import { NextResponse } from 'next/server'
import { getTebexServerClient } from '@/lib/tebex/client'

export async function GET() {
  try {
    const client = getTebexServerClient()

    // Get store information from Tebex
    const webstore = await client.getWebstore()

    // Get Tebex sidebar modules
    const sidebar = await client.getSidebar()

    // Recent Payments
    // null = module is not enabled
    // [] = module exists but has no payments
    // [...] = module exists and has payments
    const recentPaymentsModule = sidebar.find(
      (module) => module.type === 'recent_payments'
    )

    const recentPayments =
      recentPaymentsModule?.type === 'recent_payments' &&
      recentPaymentsModule.data
        ? recentPaymentsModule.data.payments.map((payment, index) => {
            const runtimePayment = payment as typeof payment & {
              avatar_url?: string
            }

            return {
              id: index,
              username: payment.username,
              username_id: payment.username_id,
              avatar_url: runtimePayment.avatar_url,
            }
          })
        : null

    // Top Customer
    // null = module is not enabled
    const topCustomerModule = sidebar.find(
      (module) => module.type === 'top_customer'
    )

    const topCustomer =
      topCustomerModule?.type === 'top_customer' &&
      topCustomerModule.data
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

    // Community Goal
    // Tebex's SDK type does not currently declare target
    // and total_payments on CommunityGoal data, but the
    // runtime API provides them.
    const communityGoalModule = sidebar.find(
      (module) => module.type === 'community_goal'
    )

    const communityGoal =
      communityGoalModule?.type === 'community_goal' &&
      communityGoalModule.data
        ? (() => {
            const runtimeGoal =
              communityGoalModule.data as typeof communityGoalModule.data & {
                target?: number
                total_payments?: number
              }

            return {
              header: communityGoalModule.data.header,
              bar_style: communityGoalModule.data.bar_style,
              bar_animated: communityGoalModule.data.bar_animated,
              percentage: communityGoalModule.data.percentage,
              target: runtimeGoal.target ?? 0,
              total_payments: runtimeGoal.total_payments ?? 0,
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
        communityGoal,
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