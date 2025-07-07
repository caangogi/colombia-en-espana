'use client'

// Simple test page for Stripe implementation
// Following official Stripe documentation

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'
import CheckoutForm from '@/components/checkout/CheckoutForm'

interface CustomerData {
  name: string
  email: string
}

interface TestProduct {
  id: string
  name: string
  price: number
  description: string
}

const testProducts: TestProduct[] = [
  {
    id: 'basic',
    name: 'Servicio Básico',
    price: 29.99,
    description: 'Consulta inicial y orientación básica'
  },
  {
    id: 'premium',
    name: 'Servicio Premium',
    price: 99.99,
    description: 'Acompañamiento completo en el proceso'
  }
]

export default function StripeTestPage() {
  const [selectedProduct, setSelectedProduct] = useState<TestProduct | null>(null)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: ''
  })
  const [currentStep, setCurrentStep] = useState<'select' | 'customer' | 'payment' | 'success'>('select')
  const [paymentResult, setPaymentResult] = useState<string>('')

  const handleProductSelect = (product: TestProduct) => {
    setSelectedProduct(product)
    setCurrentStep('customer')
  }

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerData.name && customerData.email) {
      setCurrentStep('payment')
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentResult(paymentIntentId)
    setCurrentStep('success')
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Could show error state here
  }

  const resetFlow = () => {
    setSelectedProduct(null)
    setCustomerData({ name: '', email: '' })
    setCurrentStep('select')
    setPaymentResult('')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prueba de Stripe - Implementación Oficial
          </h1>
          <p className="text-gray-600">
            Siguiendo estrictamente la documentación de Stripe Elements
          </p>
        </div>

        {/* Step 1: Product Selection */}
        {currentStep === 'select' && (
          <div className="grid md:grid-cols-2 gap-6">
            {testProducts.map((product) => (
              <Card key={product.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {formatPrice(product.price)}
                  </div>
                  <Button 
                    onClick={() => handleProductSelect(product)}
                    className="w-full"
                  >
                    Seleccionar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Customer Information */}
        {currentStep === 'customer' && selectedProduct && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
                <CardDescription>
                  {selectedProduct.name} - {formatPrice(selectedProduct.price)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('select')}
                      className="flex-1"
                    >
                      Atrás
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continuar al Pago
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 'payment' && selectedProduct && customerData.name && customerData.email && (
          <div className="max-w-md mx-auto">
            <CheckoutForm
              amount={selectedProduct.price}
              currency="eur"
              customerEmail={customerData.email}
              customerName={customerData.name}
              description={`Pago por ${selectedProduct.name}`}
              metadata={{
                product_id: selectedProduct.id,
                product_name: selectedProduct.name,
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <div className="text-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('customer')}
              >
                Modificar Datos
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 'success' && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  ¡Pago Exitoso!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Tu pago se ha procesado correctamente.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Producto:</p>
                    <p className="text-sm text-gray-600">{selectedProduct?.name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700">ID de Pago:</p>
                    <p className="text-sm text-gray-600 font-mono">{paymentResult}</p>
                  </div>
                  <Button onClick={resetFlow} className="w-full">
                    Realizar Otra Prueba
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Information */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Modo de prueba:</strong> Usa la tarjeta 4242 4242 4242 4242 con cualquier fecha futura y CVC
          </p>
        </div>
      </div>
    </div>
  )
}