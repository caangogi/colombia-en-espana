import { NextRequest, NextResponse } from 'next/server'
import { stripeServerService } from '@/lib/stripe-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({
        error: 'Session ID is required'
      }, { status: 400 })
    }

    // Get session details from Stripe
    const session = await stripeServerService.getCheckoutSession(sessionId)

    if (!session) {
      return NextResponse.json({
        error: 'Session not found'
      }, { status: 404 })
    }

    // Return relevant session data
    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      mode: session.mode,
      metadata: session.metadata
    })

  } catch (error) {
    console.error('Error getting session details:', error)
    return NextResponse.json({
      error: 'Failed to get session details'
    }, { status: 500 })
  }
}