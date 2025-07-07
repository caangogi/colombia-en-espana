import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth/firebase-auth'
import { UserProfileService } from '@/lib/firestore-service'
import { z } from 'zod'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const subscriptionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  plan: z.enum(['basic', 'premium', 'featured']),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.user || !authResult.userProfile) {
      return NextResponse.json({ 
        error: authResult.error || 'Unauthorized' 
      }, { 
        status: authResult.error?.includes('permissions') ? 403 : 401 
      })
    }
    
    const { user: firebaseUser, userProfile } = authResult
    
    const body = await request.json()
    
    // Validate input
    const validation = subscriptionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.message 
      }, { 
        status: 400 
      })
    }
    
    const { priceId, plan } = validation.data
    
    // Check if user already has a Stripe customer
    let customerId = userProfile.stripeCustomerId
    
    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: firebaseUser.email || userProfile.email,
        name: userProfile.name || firebaseUser.displayName,
        metadata: {
          userId: firebaseUser.uid,
          role: userProfile.role
        }
      })
      
      customerId = customer.id
      
      // Update user with Stripe customer ID
      await UserProfileService.updateProfile(firebaseUser.uid, {
        stripeCustomerId: customerId
      })
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: firebaseUser.uid,
        plan: plan
      }
    })
    
    // Calculate monthly credits based on plan
    const monthlyCredits = {
      basic: 100,
      premium: 300,
      featured: 1000
    }[plan]
    
    // Update user subscription info
    await UserProfileService.updateProfile(firebaseUser.uid, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: 'pending',
      subscriptionPlan: plan,
      monthlyCredits: monthlyCredits,
      creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })
    
    const invoice = subscription.latest_invoice as any
    const paymentIntent = invoice?.payment_intent as any
    
    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        customerId: customerId,
        plan: plan,
        monthlyCredits: monthlyCredits
      },
      message: 'Subscription created successfully'
    })
    
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}