'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentForm } from './PaymentForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentWrapperProps {
  customerData: any
  serviceData: any
  amount: number
  currency: string
  onSuccess?: (paymentIntentId: string) => void
  onCancel?: () => void
}

export default function StripePaymentWrapper({
  customerData,
  serviceData,
  amount,
  currency,
  onSuccess,
  onCancel
}: StripePaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'succeeded' | 'failed'>('pending')

  useEffect(() => {
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Creating payment intent with data:', {
        amount,
        currency,
        customerData,
        serviceData
      })

      const response = await fetch('/api/payment-intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          customerData,
          serviceData
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear el pago')
      }

      const data = await response.json()
      console.log('✅ Payment intent created:', data)
      
      setClientSecret(data.clientSecret)
    } catch (err) {
      console.error('❌ Error creating payment intent:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setPaymentStatus('succeeded')
    
    // Save client data to database
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          paymentInfo: {
            paymentIntentId,
            amount,
            currency,
            status: 'completed'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Error al guardar los datos del cliente')
      }

      const result = await response.json()
      console.log('✅ Client data saved:', result)
      
      onSuccess?.(paymentIntentId)
    } catch (err) {
      console.error('❌ Error saving client data:', err)
      // Payment succeeded but data saving failed - still show success
      onSuccess?.(paymentIntentId)
    }
  }

  const handlePaymentError = (error: string) => {
    setPaymentStatus('failed')
    setError(error)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Preparando el pago...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={createPaymentIntent} variant="outline">
              Reintentar
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="ghost">
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === 'succeeded') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            ¡Pago exitoso!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Tu pago se ha procesado correctamente. Recibirás un email con los detalles.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Próximos pasos</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Nuestro equipo te contactará en 24-48 horas</li>
              <li>• Recibirás un email con los siguientes pasos</li>
              <li>• Podrás hacer seguimiento de tu solicitud</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Error al cargar el formulario de pago</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        clientSecret={clientSecret}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        amount={amount}
        currency={currency}
        customerData={customerData}
        serviceData={serviceData}
      />
    </Elements>
  )
}