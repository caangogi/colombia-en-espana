import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'

export async function GET(request: NextRequest) {
  try {
    // Verificar la cuenta de Stripe
    const account = await stripe.accounts.retrieve()
    
    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        country: account.country,
        default_currency: account.default_currency,
        email: account.email,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
      secret_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 15) + '...',
      public_key_prefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 15) + '...',
    })
  } catch (error) {
    console.error('Stripe verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        secret_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 15) + '...',
        public_key_prefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 15) + '...',
      },
      { status: 500 }
    )
  }
}