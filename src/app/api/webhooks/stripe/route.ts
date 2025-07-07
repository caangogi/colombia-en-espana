import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { UserProfileService } from '@/lib/firestore-services'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer || !invoice.subscription) return

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    await handleSubscriptionUpdate(subscription)
    
    console.log(`Payment succeeded for customer ${invoice.customer}`)
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    if (!subscription.metadata?.userId) {
      console.error('No userId in subscription metadata')
      return
    }

    const userId = subscription.metadata.userId
    const planId = subscription.metadata.planId

    // Map Stripe subscription status to our internal status
    let status: 'active' | 'inactive' | 'past_due' | 'canceled'
    switch (subscription.status) {
      case 'active':
        status = 'active'
        break
      case 'past_due':
        status = 'past_due'
        break
      case 'canceled':
      case 'unpaid':
        status = 'canceled'
        break
      default:
        status = 'inactive'
    }

    // Get plan details to set credits
    const planCredits = getPlanCredits(planId)

    await UserProfileService.updateUserProfile(userId, {
      subscriptionStatus: status,
      subscriptionPlan: planId as 'basic' | 'premium' | 'featured',
      stripeSubscriptionId: subscription.id,
      credits: status === 'active' ? planCredits : 0,
      monthlyCredits: status === 'active' ? planCredits : 0,
      creditsResetDate: status === 'active' ? new Date() : undefined
    })

    console.log(`Updated subscription for user ${userId}: ${status}`)
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    if (!subscription.metadata?.userId) return

    const userId = subscription.metadata.userId

    await UserProfileService.updateUserProfile(userId, {
      subscriptionStatus: 'canceled',
      credits: 0,
      monthlyCredits: 0
    })

    console.log(`Subscription deleted for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer || !invoice.subscription) return

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    
    if (!subscription.metadata?.userId) return

    const userId = subscription.metadata.userId

    await UserProfileService.updateUserProfile(userId, {
      subscriptionStatus: 'past_due'
    })

    console.log(`Payment failed for user ${userId}`)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

function getPlanCredits(planId: string): number {
  const planCredits = {
    'basic': 100,
    'premium': 300,
    'featured': 1000
  }
  
  return planCredits[planId as keyof typeof planCredits] || 0
}