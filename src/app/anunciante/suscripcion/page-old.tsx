'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check, CreditCard, Star, Zap, Crown, Image, Video, FileText, Layout, BarChart3, Users, Globe, Shield, MessageSquare, Settings, X, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { CLIENT_SUBSCRIPTION_PLANS, stripeClientService } from '@/lib/stripe-client'

// Plan comparison component
function PlanComparison() {
  const plans = Object.values(CLIENT_SUBSCRIPTION_PLANS)
  
  const getIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <FileText className="w-5 h-5" />
      case 'premium':
        return <Star className="w-5 h-5" />
      case 'featured':
        return <Crown className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getBadgeColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'border-gray-200 bg-gray-50 text-gray-700'
      case 'premium':
        return 'border-blue-200 bg-blue-50 text-blue-700'
      case 'featured':
        return 'border-purple-200 bg-purple-50 text-purple-700'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.id === 'premium' ? 'border-2 border-blue-500' : ''}`}>
          {plan.id === 'premium' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white">Más Popular</Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2">
              {getIcon(plan.id)}
              <CardTitle className="text-xl">{plan.name}</CardTitle>
            </div>
            <CardDescription className="text-sm">{plan.description}</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold">€{plan.price}</div>
              <div className="text-sm text-gray-600">/mes</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Créditos mensuales</span>
                <Badge className={getBadgeColor(plan.id)}>
                  {plan.credits} créditos
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Ad types showcase
function AdTypesShowcase() {
  const adTypes = [
    {
      type: 'text',
      name: 'Anuncio de Texto',
      description: 'Anuncio simple con texto y enlace',
      plans: ['basic', 'premium', 'featured'],
      icon: <FileText className="w-6 h-6" />,
      preview: (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold text-gray-900">Restaurante La Parrilla</h3>
          <p className="text-sm text-gray-600 mt-1">Auténtica comida colombiana en Madrid. Reserva tu mesa ahora.</p>
          <Button size="sm" className="mt-2">Contactar</Button>
        </div>
      )
    },
    {
      type: 'image',
      name: 'Anuncio con Imagen',
      description: 'Anuncio con imagen HD y descripción',
      plans: ['premium', 'featured'],
      icon: <Image className="w-6 h-6" />,
      preview: (
        <div className="border rounded-lg p-4 bg-white">
          <div className="w-full h-20 bg-gradient-to-r from-colombian-blue to-colombian-red rounded mb-3"></div>
          <h3 className="font-semibold text-gray-900">Servicios Legales</h3>
          <p className="text-sm text-gray-600 mt-1">Especialistas en trámites de inmigración</p>
          <Button size="sm" className="mt-2">Ver más</Button>
        </div>
      )
    },
    {
      type: 'video',
      name: 'Anuncio con Video',
      description: 'Anuncio con video promocional',
      plans: ['featured'],
      icon: <Video className="w-6 h-6" />,
      preview: (
        <div className="border rounded-lg p-4 bg-white">
          <div className="w-full h-20 bg-black rounded flex items-center justify-center mb-3">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">Academia de Español</h3>
          <p className="text-sm text-gray-600 mt-1">Clases para colombianos en España</p>
          <Button size="sm" className="mt-2">Reproducir</Button>
        </div>
      )
    },
    {
      type: 'banner',
      name: 'Banner Promocional',
      description: 'Banner destacado en páginas principales',
      plans: ['premium', 'featured'],
      icon: <Layout className="w-6 h-6" />,
      preview: (
        <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">¡Oferta Especial!</h3>
              <p className="text-sm opacity-90">Descuento del 20% en todos nuestros servicios</p>
            </div>
            <Button size="sm" variant="secondary">Aprovechar</Button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tipos de Anuncios por Plan</h2>
        <p className="text-gray-600 mt-2">Cada plan te permite crear diferentes tipos de anuncios</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {adTypes.map((adType) => (
          <Card key={adType.type} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-3">
                {adType.icon}
                <div>
                  <CardTitle className="text-lg">{adType.name}</CardTitle>
                  <CardDescription>{adType.description}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {adType.plans.map((plan) => (
                  <Badge key={plan} variant="outline" className="text-xs">
                    {CLIENT_SUBSCRIPTION_PLANS[plan].name}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Vista previa:</div>
                {adType.preview}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function SuscripcionPage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handlePlanSelect = async (planId: string) => {
    setLoading(true)

    try {
      const plan = CLIENT_SUBSCRIPTION_PLANS[planId]
      if (!plan) {
        throw new Error('Plan no encontrado')
      }

      // Create checkout session using the new dynamic system
      const result = await stripeClientService.createCheckoutSession({
        items: [{
          name: plan.name,
          amount: plan.price
        }],
        mode: 'subscription',
        metadata: {
          planId,
          userId: user?.uid || '',
          userEmail: user?.email || ''
        }
      })

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url
      } else {
        throw new Error('No se pudo crear la sesión de checkout')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la suscripción",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }



  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planes de Suscripción
            </h1>
            <p className="text-xl text-gray-600">
              Elige el plan perfecto para promocionar tu negocio
            </p>
          </div>

          {/* Current subscription status */}
          {userProfile?.subscriptionStatus && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">
                      Plan actual: {userProfile.subscriptionPlan || 'Básico'}
                    </p>
                    <p className="text-green-600 text-sm">
                      Estado: {userProfile.subscriptionStatus}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {userProfile.credits} créditos disponibles
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan comparison */}
              <PlanComparison />
              
              <div className="mt-8 text-center">
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.values(CLIENT_SUBSCRIPTION_PLANS).map((plan) => (
                    <Button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={loading}
                      className={`h-12 ${plan.id === 'premium' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                      {loading && selectedPlan === plan.id ? (
                        "Creando..."
                      ) : (
                        `Elegir ${plan.name}`
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Ad types showcase */}
              <div className="mt-16">
                <AdTypesShowcase />
              </div>

              {/* FAQ Section */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">¿Puedo cambiar de plan en cualquier momento?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Sí, puedes actualizar o cambiar tu plan en cualquier momento desde tu panel de control.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">¿Qué sucede con mis créditos no utilizados?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Los créditos no utilizados se acumulan hasta el siguiente período de facturación.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">¿Ofrecen reembolsos?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Ofrecemos reembolsos completos dentro de los primeros 7 días de tu suscripción.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}