import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      clientId, 
      amount, 
      currency = 'eur', 
      metadata = {},
      returnUrl 
    } = body

    // Validate required fields
    if (!clientId || !amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Client ID and valid amount are required' },
        { status: 400 }
      )
    }

    console.log('Creating checkout session for client:', clientId)

    // Create checkout session for embedded components
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: metadata.itemName || 'Servicio de migración',
              description: metadata.serviceType || 'Servicio profesional',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: returnUrl || `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        ...metadata,
        clientId,
      },
    })

    console.log('Checkout session created:', session.id)

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}