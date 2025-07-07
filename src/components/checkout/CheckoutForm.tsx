'use client'

// Payment Element implementation following official Stripe documentation
// https://docs.stripe.com/payments/payment-element

import React, { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { stripePromise } from '@/lib/stripe'

interface CheckoutFormProps {
  clientSecret: string
  amount: number
  currency: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutFormContent({ clientSecret, amount, currency, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      // Following the official documentation pattern for confirmPayment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Return URL for redirect scenarios
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required', // Avoid redirect unless required
      })

      if (error) {
        // Payment failed
        onError(error.message || 'Payment failed')
        toast({
          title: "Error en el pago",
          description: error.message,
          variant: "destructive",
        })
      } else {
        // Payment succeeded - no error means success
        // Since we used redirect: 'if_required', we get here on success
        onSuccess('payment_succeeded')
        toast({
          title: "¡Pago exitoso!",
          description: "Tu pago se ha procesado correctamente",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      onError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Completar Pago</CardTitle>
        <CardDescription>
          Total: {formatPrice(amount, currency)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Element from official documentation */}
          <PaymentElement />

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={!stripe || !elements || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              `Pagar ${formatPrice(amount, currency)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface PaymentWrapperProps {
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  description?: string
  metadata?: Record<string, string>
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export default function CheckoutForm({
  amount,
  currency,
  customerEmail,
  customerName,
  description,
  metadata,
  onSuccess,
  onError
}: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          customerEmail,
          customerName,
          description,
          metadata,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating payment'
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Preparando pago...</span>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-red-600">Error al preparar el pago</p>
        </CardContent>
      </Card>
    )
  }

  // Following the official documentation pattern for Elements options
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutFormContent
        clientSecret={clientSecret}
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}