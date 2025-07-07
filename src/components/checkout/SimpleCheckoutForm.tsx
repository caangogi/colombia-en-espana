'use client'

import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SimpleCheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true)
    }
  }, [stripe, elements])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet. Please wait.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/stripe-simple/success`,
        },
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred')
        } else {
          setMessage('An unexpected error occurred.')
        }
      }
    } catch (err) {
      console.error('Payment error:', err)
      setMessage('An unexpected error occurred.')
    }

    setIsLoading(false)
  }

  if (!isReady) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment form...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !stripe || !elements}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Pay €20.00'}
          </Button>
          {message && (
            <div className="text-sm text-red-600 mt-2">
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}