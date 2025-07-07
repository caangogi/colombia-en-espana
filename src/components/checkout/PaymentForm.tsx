'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, CreditCard, Shield } from 'lucide-react'

interface PaymentFormProps {
  customerName: string
  customerEmail: string
  amount: number
  onPaymentSuccess?: (paymentIntentId: string) => void
}

export function PaymentForm({ customerName, customerEmail, amount, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setPaymentStatus('processing')

    try {
      console.log('🔄 Starting payment confirmation...')
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/stripe-simple?success=true`,
        },
        redirect: 'if_required'
      })

      if (error) {
        console.error('❌ Payment failed:', error)
        setErrorMessage(error.message || 'Payment failed')
        setPaymentStatus('failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded:', paymentIntent)
        setPaymentStatus('succeeded')
        onPaymentSuccess?.(paymentIntent.id)
      } else {
        console.log('⏳ Payment requires further action:', paymentIntent)
        setErrorMessage('Payment requires further action')
        setPaymentStatus('failed')
      }
    } catch (err) {
      console.error('❌ Payment error:', err)
      setErrorMessage('An unexpected error occurred')
      setPaymentStatus('failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (paymentStatus === 'succeeded') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Payment Successful!</h3>
            <p className="text-green-700">
              Your payment of €{amount.toFixed(2)} has been processed successfully.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">
                <strong>Customer:</strong> {customerName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {customerEmail}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> €{amount.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Summary
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-medium">{customerEmail}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>€{amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <h3 className="font-semibold">Payment Information</h3>
        <div className="border rounded-lg p-4">
          <PaymentElement 
            options={{
              layout: 'accordion',
              paymentMethodOrder: ['card', 'paypal', 'apple_pay', 'google_pay']
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={!stripe || isLoading || paymentStatus === 'processing'}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Pay €{amount.toFixed(2)} Securely
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Secured by Stripe
        </p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </form>
  )
}