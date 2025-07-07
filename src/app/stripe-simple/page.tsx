'use client'

import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PaymentForm } from '@/components/checkout/PaymentForm'

export default function StripeSimplePage() {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState({
    amount: 50.00,
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    description: 'Test payment'
  })

  const createPaymentIntent = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('🔄 Creating payment intent with data:', paymentData)
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: 'eur',
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          description: paymentData.description
        }),
      })

      console.log('📋 Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ API Error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Payment intent created:', data)
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        console.log('🔑 Client secret set successfully')
      } else {
        throw new Error('No client secret received')
      }
    } catch (err) {
      console.error('❌ Error creating payment intent:', err)
      setError(err instanceof Error ? err.message : 'Failed to create payment intent')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Stripe Payment Test
        </h1>
        <p className="text-gray-600">
          Complete payment form following Stripe official documentation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Setup</CardTitle>
            <CardDescription>
              Configure your payment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (EUR)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                min="0.50"
                step="0.01"
              />
            </div>
            
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={paymentData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={paymentData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={paymentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Payment for services"
              />
            </div>

            <Button 
              onClick={createPaymentIntent}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Payment Intent...' : 'Create Payment Intent'}
            </Button>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Form</CardTitle>
            <CardDescription>
              Complete your payment using Stripe Elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!clientSecret ? (
              <div className="text-center py-8 text-gray-500">
                <p>Create a payment intent first to enable the payment form</p>
              </div>
            ) : (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0070f3',
                      colorBackground: '#ffffff',
                      colorText: '#000000',
                      colorDanger: '#df1b41',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '6px',
                    }
                  }
                }}
              >
                <PaymentForm 
                  customerName={paymentData.customerName}
                  customerEmail={paymentData.customerEmail}
                  amount={paymentData.amount}
                />
              </Elements>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}