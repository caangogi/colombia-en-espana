'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { PaymentForm } from './PaymentForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react'

interface ServiceStripeFormProps {
  customerData: any
  serviceData: any
  type: 'service' | 'package'
  onBack: () => void
  onSuccess: (paymentIntentId: string) => void
}

export function ServiceStripeForm({ 
  customerData, 
  serviceData, 
  type, 
  onBack, 
  onSuccess 
}: ServiceStripeFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔄 Creating payment intent for:', serviceData.name)
      
      const response = await fetch('/api/service-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: serviceData.price,
          currency: 'eur',
          customerData,
          serviceData,
          type
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const data = await response.json()
      console.log('✅ Payment intent created successfully')
      
      setClientSecret(data.clientSecret)
    } catch (err) {
      console.error('❌ Error creating payment intent:', err)
      setError(err instanceof Error ? err.message : 'Error creating payment intent')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log('✅ Payment successful:', paymentIntentId)
    
    // Save client data to Firestore
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          serviceInfo: {
            type,
            serviceId: serviceData.id,
            serviceName: serviceData.name,
            price: serviceData.price,
            currency: 'EUR'
          },
          paymentInfo: {
            paymentIntentId,
            amount: serviceData.price,
            currency: 'EUR',
            status: 'completed',
            completedAt: new Date().toISOString()
          }
        })
      })

      if (response.ok) {
        console.log('✅ Client data saved successfully')
      } else {
        console.warn('⚠️ Failed to save client data, but payment succeeded')
      }
    } catch (err) {
      console.warn('⚠️ Error saving client data:', err)
    }
    
    onSuccess(paymentIntentId)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <h3 className="text-lg font-semibold">Preparando el pago</h3>
            <p className="text-gray-600">Configurando el formulario de pago seguro...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            Error al procesar el pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{error}</p>
          <div className="flex gap-3">
            <Button 
              onClick={createPaymentIntent}
              variant="outline"
              className="flex-1"
            >
              Reintentar
            </Button>
            <Button 
              onClick={onBack}
              variant="ghost"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-yellow-200">
        <CardContent className="text-center p-8">
          <p className="text-gray-600">Error: No se pudo configurar el pago</p>
          <Button onClick={onBack} variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Service Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Resumen del {type === 'package' ? 'Paquete' : 'Servicio'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{serviceData.name}</h3>
              <p className="text-gray-600 mb-4">{serviceData.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="font-medium">{customerData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{customerData.email}</span>
                </div>
                {customerData.phone && (
                  <div className="flex justify-between">
                    <span>Teléfono:</span>
                    <span className="font-medium">{customerData.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  €{serviceData.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {type === 'package' ? 'Paquete completo' : 'Servicio individual'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={onBack} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Modificar datos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            }
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Información de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm 
              customerName={customerData.name}
              customerEmail={customerData.email}
              amount={serviceData.price}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </CardContent>
        </Card>
      </Elements>
    </div>
  )
}