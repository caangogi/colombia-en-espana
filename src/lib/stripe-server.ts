// Server-side Stripe configuration
// This file should only be imported in API routes or server components

import Stripe from 'stripe'

// Server-side Stripe (backend/API routes only)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

// Initialize Stripe for server-side usage
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20', // Use latest stable API version
})