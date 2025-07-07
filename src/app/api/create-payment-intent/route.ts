// Payment Intent API endpoint following Stripe official documentation
// https://docs.stripe.com/payments/payment-intents

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import type { PaymentIntentData } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Creating payment intent...')
    
    // Create payment intent with minimal required fields for testing
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // $20.00 for testing
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      description: 'Test payment for Colombia en España',
      metadata: {
        integration_check: 'accept_a_payment',
      },
    })

    console.log('✅ Payment intent created:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('❌ Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}