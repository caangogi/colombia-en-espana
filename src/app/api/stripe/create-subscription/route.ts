import { NextRequest, NextResponse } from 'next/server'
import { stripeService, SUBSCRIPTION_PLANS } from '@/lib/stripe-service'
import { UserProfileService } from '@/lib/firestore-services'

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, email } = await request.json()

    if (!planId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, userId, email' },
        { status: 400 }
      )
    }

    if (!SUBSCRIPTION_PLANS[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    const plan = SUBSCRIPTION_PLANS[planId]
    
    // Get or create Stripe customer
    let customerId: string
    
    // Check if user already has a Stripe customer ID
    const userProfile = await UserProfileService.getUserProfile(userId)
    
    if (userProfile?.stripeCustomerId) {
      customerId = userProfile.stripeCustomerId
    } else {
      // Create new Stripe customer
      const customer = await stripeService.createCustomer(
        email,
        userProfile?.firstName && userProfile?.lastName 
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : email,
        {
          userId,
          planId
        }
      )
      customerId = customer.id

      // Update user profile with Stripe customer ID
      await UserProfileService.updateUserProfile(userId, {
        stripeCustomerId: customerId
      })
    }

    // Create Stripe subscription
    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Plan price ID not configured' },
        { status: 500 }
      )
    }

    const subscription = await stripeService.createSubscription(
      customerId,
      plan.stripePriceId,
      {
        userId,
        planId,
        planName: plan.name
      }
    )

    // Extract client secret from the payment intent
    const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret

    if (!clientSecret) {
      return NextResponse.json(
        { error: 'Failed to create payment intent' },
        { status: 500 }
      )
    }

    // Update user profile with subscription info
    await UserProfileService.updateUserProfile(userId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: 'inactive', // Will be updated to 'active' via webhook
      subscriptionPlan: planId as 'basic' | 'premium' | 'featured',
      monthlyCredits: plan.credits
    })

    return NextResponse.json({
      success: true,
      clientSecret,
      subscriptionId: subscription.id,
      customerId
    })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}