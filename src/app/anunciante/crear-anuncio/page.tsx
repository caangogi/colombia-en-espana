'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, FileText, Image, Video, Layout, BarChart3, Plus, Save, Eye, CreditCard, Clock, Target, Users, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { stripeService, SUBSCRIPTION_PLANS } from '@/lib/stripe-service'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AdType = 'text' | 'image' | 'video' | 'banner' | 'carousel'

interface AdFormData {
  title: string
  description: string
  ctaText: string
  ctaUrl: string
  adType: AdType
  imageUrl: string
  videoUrl: string
  images: string[]
  targetAudience: string[]
  placementType: string
  categories: string[]
  budget: number
  dailyBudget: number
  startDate: string
  endDate: string
}

// Ad type selector component
function AdTypeSelector({ 
  selectedType, 
  onSelect, 
  userPlan 
}: { 
  selectedType: AdType
  onSelect: (type: AdType) => void
  userPlan: 'basic' | 'premium' | 'featured'
}) {
  const adTypes = [
    {
      type: 'text' as AdType,
      name: 'Anuncio de Texto',
      description: 'Anuncio simple con texto y enlace',
      icon: <FileText className="w-6 h-6" />,
      credits: stripeService.calculateAdCreditCost('text', userPlan),
      available: stripeService.canCreateAdType('text', userPlan)
    },
    {
      type: 'image' as AdType,
      name: 'Anuncio con Imagen',
      description: 'Anuncio con imagen HD y descripción',
      icon: <Image className="w-6 h-6" />,
      credits: stripeService.calculateAdCreditCost('image', userPlan),
      available: stripeService.canCreateAdType('image', userPlan)
    },
    {
      type: 'video' as AdType,
      name: 'Anuncio con Video',
      description: 'Anuncio con video promocional',
      icon: <Video className="w-6 h-6" />,
      credits: stripeService.calculateAdCreditCost('video', userPlan),
      available: stripeService.canCreateAdType('video', userPlan)
    },
    {
      type: 'banner' as AdType,
      name: 'Banner Promocional',
      description: 'Banner destacado en páginas principales',
      icon: <Layout className="w-6 h-6" />,
      credits: stripeService.calculateAdCreditCost('banner', userPlan),
      available: stripeService.canCreateAdType('banner', userPlan)
    },
    {
      type: 'carousel' as AdType,
      name: 'Carrusel de Imágenes',
      description: 'Múltiples imágenes en carrusel',
      icon: <BarChart3 className="w-6 h-6" />,
      credits: stripeService.calculateAdCreditCost('carousel', userPlan),
      available: stripeService.canCreateAdType('carousel', userPlan)
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {adTypes.map((adType) => (
        <Card 
          key={adType.type}
          className={`cursor-pointer transition-all ${
            selectedType === adType.type 
              ? 'border-blue-500 bg-blue-50' 
              : adType.available 
                ? 'hover:border-gray-300' 
                : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => adType.available && onSelect(adType.type)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {adType.icon}
                <CardTitle className="text-sm">{adType.name}</CardTitle>
              </div>
              {!adType.available && (
                <Badge variant="secondary" className="text-xs">
                  Requiere {userPlan === 'basic' ? 'Premium' : 'Destacado'}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">{adType.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Costo:</span>
              <Badge variant="outline" className="text-xs">
                {adType.credits === 999 ? 'No disponible' : `${adType.credits} créditos`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Ad preview component
function AdPreview({ formData, adType }: { formData: AdFormData; adType: AdType }) {
  const getPreview = () => {
    switch (adType) {
      case 'text':
        return (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold text-gray-900">{formData.title || 'Título del anuncio'}</h3>
            <p className="text-sm text-gray-600 mt-1">{formData.description || 'Descripción del anuncio...'}</p>
            <Button size="sm" className="mt-2">{formData.ctaText || 'Llamada a la acción'}</Button>
          </div>
        )
      case 'image':
        return (
          <div className="border rounded-lg p-4 bg-white">
            <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover rounded" />
              ) : (
                <Image className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{formData.title || 'Título del anuncio'}</h3>
            <p className="text-sm text-gray-600 mt-1">{formData.description || 'Descripción del anuncio...'}</p>
            <Button size="sm" className="mt-2">{formData.ctaText || 'Llamada a la acción'}</Button>
          </div>
        )
      case 'video':
        return (
          <div className="border rounded-lg p-4 bg-white">
            <div className="w-full h-32 bg-black rounded mb-3 flex items-center justify-center">
              {formData.videoUrl ? (
                <video src={formData.videoUrl} className="w-full h-full object-cover rounded" controls />
              ) : (
                <Video className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{formData.title || 'Título del anuncio'}</h3>
            <p className="text-sm text-gray-600 mt-1">{formData.description || 'Descripción del anuncio...'}</p>
            <Button size="sm" className="mt-2">{formData.ctaText || 'Llamada a la acción'}</Button>
          </div>
        )
      case 'banner':
        return (
          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{formData.title || 'Título del banner'}</h3>
                <p className="text-sm opacity-90">{formData.description || 'Descripción del banner...'}</p>
              </div>
              <Button size="sm" variant="secondary">{formData.ctaText || 'Acción'}</Button>
            </div>
          </div>
        )
      case 'carousel':
        return (
          <div className="border rounded-lg p-4 bg-white">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full h-16 bg-gray-200 rounded flex items-center justify-center">
                  <Image className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
            <h3 className="font-semibold text-gray-900">{formData.title || 'Título del carrusel'}</h3>
            <p className="text-sm text-gray-600 mt-1">{formData.description || 'Descripción del carrusel...'}</p>
            <Button size="sm" className="mt-2">{formData.ctaText || 'Ver más'}</Button>
          </div>
        )
      default:
        return <div className="text-center text-gray-500">Selecciona un tipo de anuncio</div>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Vista Previa</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {getPreview()}
      </CardContent>
    </Card>
  )
}

export default function CrearAnuncioPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedAdType, setSelectedAdType] = useState<AdType>('text')
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    ctaText: '',
    ctaUrl: '',
    adType: 'text',
    imageUrl: '',
    videoUrl: '',
    images: [],
    targetAudience: [],
    placementType: 'card',
    categories: [],
    budget: 0,
    dailyBudget: 0,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    setFormData(prev => ({ ...prev, adType: selectedAdType }))
  }, [selectedAdType])

  const handleInputChange = (field: keyof AdFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil de usuario",
        variant: "destructive"
      })
      return
    }

    if (!formData.title || !formData.description || !formData.ctaText || !formData.ctaUrl) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      })
      return
    }

    const userPlan = userProfile.subscriptionPlan || 'basic'
    const creditCost = stripeService.calculateAdCreditCost(selectedAdType, userPlan)

    if (!stripeService.canCreateAdType(selectedAdType, userPlan)) {
      toast({
        title: "Plan insuficiente",
        description: `Este tipo de anuncio requiere un plan superior`,
        variant: "destructive"
      })
      return
    }

    if (userProfile.credits < creditCost) {
      toast({
        title: "Créditos insuficientes",
        description: `Necesitas ${creditCost} créditos para crear este anuncio`,
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/anunciante/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.uid,
          creditsUsed: creditCost,
          subscriptionPlan: userPlan
        }),
      })

      if (response.ok) {
        toast({
          title: "¡Anuncio creado!",
          description: "Tu anuncio ha sido enviado para revisión",
        })
        router.push('/dashboard')
      } else {
        throw new Error('Error creando el anuncio')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el anuncio",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || !userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const userPlan = userProfile.subscriptionPlan || 'basic'
  const creditCost = stripeService.calculateAdCreditCost(selectedAdType, userPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Anuncio</h1>
            <p className="text-gray-600">Crea un anuncio efectivo para promocionar tu negocio</p>
          </div>

          {/* Credits status */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-blue-800 font-medium">
                      Plan actual: {SUBSCRIPTION_PLANS[userPlan].name}
                    </p>
                    <p className="text-blue-600 text-sm">
                      {userProfile.credits} créditos disponibles
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Costo: {creditCost === 999 ? 'No disponible' : `${creditCost} créditos`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Select ad type */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                <span>Selecciona el tipo de anuncio</span>
              </CardTitle>
              <CardDescription>
                Cada tipo de anuncio tiene diferentes características y costos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdTypeSelector 
                selectedType={selectedAdType}
                onSelect={setSelectedAdType}
                userPlan={userPlan}
              />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Step 2: Configure ad */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    <span>Configura tu anuncio</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        placeholder="Ej: Restaurante La Parrilla - Comida Colombiana"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe tu negocio y lo que ofreces..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ctaText">Texto del botón *</Label>
                        <Input
                          id="ctaText"
                          placeholder="Ej: Contactar"
                          value={formData.ctaText}
                          onChange={(e) => handleInputChange('ctaText', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ctaUrl">URL del enlace *</Label>
                        <Input
                          id="ctaUrl"
                          type="url"
                          placeholder="https://mi-negocio.com"
                          value={formData.ctaUrl}
                          onChange={(e) => handleInputChange('ctaUrl', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media content based on ad type */}
                  {(selectedAdType === 'image' || selectedAdType === 'banner') && (
                    <div>
                      <Label htmlFor="imageUrl">URL de la imagen</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      />
                    </div>
                  )}

                  {selectedAdType === 'video' && (
                    <div>
                      <Label htmlFor="videoUrl">URL del video</Label>
                      <Input
                        id="videoUrl"
                        type="url"
                        placeholder="https://ejemplo.com/video.mp4"
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Targeting */}
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Segmentación</span>
                    </h3>

                    <div>
                      <Label htmlFor="categories">Categoría</Label>
                      <Select onValueChange={(value) => handleInputChange('categories', [value])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restaurantes">Restaurantes</SelectItem>
                          <SelectItem value="servicios-legales">Servicios Legales</SelectItem>
                          <SelectItem value="inmobiliario">Inmobiliario</SelectItem>
                          <SelectItem value="educacion">Educación</SelectItem>
                          <SelectItem value="salud">Salud</SelectItem>
                          <SelectItem value="transporte">Transporte</SelectItem>
                          <SelectItem value="comercio">Comercio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="placement">Ubicación del anuncio</Label>
                      <Select onValueChange={(value) => handleInputChange('placementType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Tarjeta en listados</SelectItem>
                          <SelectItem value="banner">Banner principal</SelectItem>
                          <SelectItem value="sidebar">Barra lateral</SelectItem>
                          <SelectItem value="featured">Destacado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-6 space-y-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !stripeService.canCreateAdType(selectedAdType, userPlan) || userProfile.credits < creditCost}
                      className="w-full"
                    >
                      {loading ? (
                        "Creando anuncio..."
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Crear Anuncio ({creditCost === 999 ? 'No disponible' : `${creditCost} créditos`})
                        </>
                      )}
                    </Button>
                    
                    {!stripeService.canCreateAdType(selectedAdType, userPlan) && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Este tipo de anuncio requiere el plan {userPlan === 'basic' ? 'Premium o Destacado' : 'Destacado'}.
                          <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push('/anunciante/suscripcion')}>
                            Actualizar plan
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    {userProfile.credits < creditCost && creditCost !== 999 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No tienes suficientes créditos. Necesitas {creditCost} créditos para crear este anuncio.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 3: Preview */}
            <div>
              <div className="sticky top-8">
                <AdPreview formData={formData} adType={selectedAdType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}