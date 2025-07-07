import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { clientService } from '@/lib/client-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, amount, currency = 'eur', metadata = {} } = body

    // Validate required fields
    if (!clientId || !amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Client ID and valid amount are required' },
        { status: 400 }
      )
    }

    // Get client data to include in metadata
    const client = await clientService.getClient(clientId)
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    console.log('Creating client payment intent:', { clientId, amount, currency })

    // Create payment intent with client information
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        clientId,
        customerEmail: client.personalInfo.email,
        customerName: `${client.personalInfo.firstName} ${client.personalInfo.lastName}`,
        serviceType: (client.metadata as any).serviceType || 'unknown',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    console.log('Client payment intent created:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating client payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}