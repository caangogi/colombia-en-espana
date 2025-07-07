import { NextRequest, NextResponse } from 'next/server'
import { stripeServerService } from '@/lib/stripe-server'

// This endpoint is for creating checkout sessions for clients without user accounts
// Used for package/service purchases from the homepage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, items, customerEmail, mode, successUrl, cancelUrl, metadata } = body

    console.log('🔍 Creating client checkout session:', { clientId, items, customerEmail, mode })

    // Validate required fields
    if (!clientId) {
      return NextResponse.json({
        error: 'Client ID is required'
      }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        error: 'Items are required'
      }, { status: 400 })
    }

    if (!customerEmail) {
      return NextResponse.json({
        error: 'Customer email is required'
      }, { status: 400 })
    }

    if (!mode || !['payment', 'subscription'].includes(mode)) {
      return NextResponse.json({
        error: 'Invalid mode. Must be "payment" or "subscription"'
      }, { status: 400 })
    }

    // Default URLs if not provided
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000'
    const defaultSuccessUrl = successUrl || `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}&client_id=${clientId}`
    const defaultCancelUrl = cancelUrl || `${baseUrl}/stripe/cancel?client_id=${clientId}`

    // Create checkout session
    const session = await stripeServerService.createCheckoutSession(
      items,
      customerEmail,
      defaultSuccessUrl,
      defaultCancelUrl,
      mode,
      {
        clientId,
        customerEmail,
        ...metadata
      }
    )

    console.log('✅ Checkout session created:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('❌ Error creating client checkout session:', error)
    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}