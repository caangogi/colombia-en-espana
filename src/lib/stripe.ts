// Stripe configuration following official documentation
// https://docs.stripe.com/payments/elements

import { loadStripe } from '@stripe/stripe-js'

// Client-side Stripe (frontend only)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
}

// Initialize Stripe.js for client-side usage
export const stripePromise = loadStripe(stripePublishableKey)

// Types for our implementation
export interface PaymentIntentData {
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  description?: string
  metadata?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  paymentIntent?: any
  error?: string
}