import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      amount, 
      currency = 'eur', 
      customerData, 
      serviceData,
      type // 'service' or 'package'
    } = body

    // Validate required fields
    if (!amount || !customerData || !serviceData) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, customerData, or serviceData' },
        { status: 400 }
      )
    }

    console.log('🔄 Creating payment intent for:', {
      type,
      serviceId: serviceData.id,
      amount,
      currency,
      customerName: customerData.name
    })

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: type || 'unknown',
        service_id: serviceData.id,
        service_name: serviceData.name,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone || '',
        created_at: new Date().toISOString()
      },
      description: `${type === 'package' ? 'Paquete' : 'Servicio'}: ${serviceData.name} - ${customerData.name}`
    })

    console.log('✅ Payment intent created:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('❌ Error creating payment intent:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}