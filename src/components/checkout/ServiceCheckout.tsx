'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard } from 'lucide-react'
import ClientDataForm from './ClientDataForm'
import { ServiceStripeForm } from './ServiceStripeForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ServiceCheckoutProps {
  itemId: string
  type: 'service' | 'package'
  onClose: () => void
}

export default function ServiceCheckout({ itemId, type, onClose }: ServiceCheckoutProps) {
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'success'>('form')
  const [customerData, setCustomerData] = useState<any>(null)
  const [serviceData, setServiceData] = useState<any>(null)

  // Get service/package information based on itemId and type
  const getItemInfo = () => {
    // Service data mapping
    const services = {
      'asesoria_inicial': {
        id: 'asesoria_inicial',
        name: 'Asesoría Inicial',
        description: 'Consulta personalizada de 2 horas para evaluar tu caso y crear plan de migración',
        price: 150,
        currency: 'EUR'
      },
      'nie': {
        id: 'nie',
        name: 'Gestión NIE/TIE',
        description: 'Tramitación completa de documentos de identificación para extranjeros',
        price: 400,
        currency: 'EUR'
      },
      'busqueda_vivienda': {
        id: 'busqueda_vivienda',
        name: 'Búsqueda Vivienda',
        description: 'Búsqueda personalizada de apartamentos y apoyo en contratos de alquiler',
        price: 350,
        currency: 'EUR'
      },
      'cuenta_bancaria': {
        id: 'cuenta_bancaria',
        name: 'Cuenta Bancaria',
        description: 'Acompañamiento para apertura de cuenta bancaria y gestión inicial',
        price: 200,
        currency: 'EUR'
      },
      'seguro_salud': {
        id: 'seguro_salud',
        name: 'Seguro de Salud',
        description: 'Asesoramiento y contratación de seguro médico privado',
        price: 180,
        currency: 'EUR'
      },
      'recogida_aeropuerto': {
        id: 'recogida_aeropuerto',
        name: 'Recogida Aeropuerto',
        description: 'Servicio de bienvenida y traslado desde el aeropuerto a tu alojamiento',
        price: 120,
        currency: 'EUR'
      },
      'orientacion_laboral': {
        id: 'orientacion_laboral',
        name: 'Orientación Laboral',
        description: 'Asesoramiento para búsqueda de empleo y preparación de CV',
        price: 250,
        currency: 'EUR'
      },
      'acompanamiento_tramites': {
        id: 'acompanamiento_tramites',
        name: 'Acompañamiento Trámites',
        description: 'Apoyo presencial en gestiones oficiales y administrativas',
        price: 300,
        currency: 'EUR'
      }
    }

    const packages = {
      'esencial': {
        id: 'esencial',
        name: 'Paquete Esencial',
        description: 'Perfecto para comenzar tu proceso migratorio con lo fundamental',
        price: 500,
        currency: 'EUR'
      },
      'integral': {
        id: 'integral',
        name: 'Paquete Integral',
        description: 'Acompañamiento completo durante todo tu proceso de migración',
        price: 1500,
        currency: 'EUR'
      },
      'bip': {
        id: 'bip',
        name: 'Paquete VIP',
        description: 'Servicio premium con atención personalizada y exclusiva',
        price: 2500,
        currency: 'EUR'
      }
    }

    return type === 'service' ? services[itemId as keyof typeof services] : packages[itemId as keyof typeof packages]
  }

  const itemInfo = getItemInfo()

  if (!itemInfo) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">Servicio no encontrado</p>
          <Button onClick={onClose} variant="outline">
            Volver
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleFormComplete = (clientId: string, clientData: any) => {
    console.log('📋 Form completed, proceeding to payment')
    setCustomerData(clientData)
    setServiceData(itemInfo)
    setCurrentStep('payment')
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('💳 Payment successful:', paymentIntentId)
    setCurrentStep('success')
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={currentStep === 'form' ? onClose : handleBackToForm}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 'form' ? 'Volver' : 'Atrás'}
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{itemInfo.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={type === 'service' ? 'default' : 'secondary'}>
              {type === 'service' ? 'Servicio' : 'Paquete'}
            </Badge>
            <span className="text-lg font-semibold text-blue-600">
              {formatPrice(itemInfo.price, itemInfo.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${currentStep === 'form' ? 'text-blue-600' : 'text-green-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'form' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}>
            1
          </div>
          <span className="font-medium">Datos del cliente</span>
        </div>
        
        <div className={`w-8 h-px ${currentStep !== 'form' ? 'bg-green-200' : 'bg-gray-200'}`} />
        
        <div className={`flex items-center gap-2 ${
          currentStep === 'payment' ? 'text-blue-600' : 
          currentStep === 'success' ? 'text-green-600' : 'text-gray-400'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'payment' ? 'bg-blue-100 text-blue-600' :
            currentStep === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <CreditCard className="h-4 w-4" />
          </div>
          <span className="font-medium">Pago</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-96">
        {currentStep === 'form' && (
          <ClientDataForm
            itemId={itemId}
            type={type}
            onComplete={handleFormComplete}
          />
        )}

        {currentStep === 'payment' && customerData && serviceData && (
          <ServiceStripeForm
            customerData={customerData}
            serviceData={serviceData}
            type={type}
            onBack={handleBackToForm}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {currentStep === 'success' && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-green-600">
                ¡Proceso completado!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Tu solicitud ha sido procesada exitosamente.
              </p>
              <Button onClick={onClose} className="w-full">
                Finalizar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}