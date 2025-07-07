import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'

export async function GET() {
  try {
    // Test 1: Verify environment variables
    const secretKey = process.env.STRIPE_SECRET_KEY
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    console.log('🔍 Testing Stripe configuration...')
    console.log('Secret key prefix:', secretKey?.substring(0, 20) + '...')
    console.log('Publishable key prefix:', publishableKey?.substring(0, 20) + '...')
    
    // Test 2: Verify keys belong to same account
    const secretPrefix = secretKey?.split('_')[2]?.substring(0, 14)
    const publishablePrefix = publishableKey?.split('_')[2]?.substring(0, 14)
    
    console.log('Secret account ID:', secretPrefix)
    console.log('Publishable account ID:', publishablePrefix)
    
    // Test 3: Make a simple Stripe API call
    const account = await stripe.accounts.retrieve()
    console.log('✅ Stripe account retrieved:', account.id)
    
    // Test 4: Create a test payment intent
    const testPaymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    console.log('✅ Test payment intent created:', testPaymentIntent.id)
    
    return NextResponse.json({
      success: true,
      message: 'Stripe configuration is working correctly',
      data: {
        environmentVariables: {
          secretKeyPrefix: secretKey?.substring(0, 20) + '...',
          publishableKeyPrefix: publishableKey?.substring(0, 20) + '...',
          keysMatch: secretPrefix === publishablePrefix
        },
        stripeAccount: {
          id: account.id,
          country: account.country,
          email: account.email,
          business_type: account.business_type
        },
        testPaymentIntent: {
          id: testPaymentIntent.id,
          amount: testPaymentIntent.amount,
          currency: testPaymentIntent.currency,
          status: testPaymentIntent.status,
          client_secret: testPaymentIntent.client_secret?.substring(0, 20) + '...'
        }
      }
    })
  } catch (error) {
    console.error('❌ Stripe test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Stripe configuration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}