'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, CreditCard, BarChart3, Users, Eye, Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DashboardData {
  user: {
    name: string
    email: string
    role: string
    subscriptionStatus?: string
    subscriptionPlan?: string
    monthlyCredits?: number
    creditsUsed?: number
  }
  business?: {
    id: number
    name: string
    category: string
    status: string
    province: string
    city: string
    description: string
    phone: string
    email: string
    website?: string
  }
  analytics: {
    totalAds: number
    activeAds: number
    pendingAds: number
    pausedAds: number
    totalCreditsUsed: number
  }
  recentActivity: {
    newAds: number
    creditsSpent: number
  }
  advertisements: Array<{
    id: number
    title: string
    description: string
    status: string
    adType: string
    targetAudience: string
    budget: number
    createdAt: string
  }>
}

export default function AnuncianteDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/anunciante/dashboard', {
        credentials: 'include'
      })
      
      if (response.status === 401) {
        router.push('/login')
        return
      }
      
      if (response.status === 403) {
        toast({
          title: "Acceso Denegado",
          description: "No tienes permisos para acceder al panel de anunciante",
          variant: "destructive"
        })
        router.push('/')
        return
      }
      
      if (!response.ok) {
        throw new Error('Error loading dashboard data')
      }
      
      const result = await response.json()
      setData(result.data)
    } catch (error) {
      console.error('Dashboard error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      paused: 'outline',
      expired: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const getSubscriptionBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Sin Suscripción</Badge>
    
    const variants = {
      active: 'default',
      pending: 'secondary',
      canceled: 'destructive',
      payment_failed: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error al cargar el dashboard
            </h1>
            <Button onClick={fetchDashboardData}>Reintentar</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Anunciante
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona tu negocio y anuncios en Colombia en España
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anuncios Activos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.analytics.activeAds}</div>
              <p className="text-xs text-muted-foreground">
                de {data.analytics.totalAds} totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos Disponibles</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(data.user.monthlyCredits || 0) - (data.user.creditsUsed || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                de {data.user.monthlyCredits || 0} mensuales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado Suscripción</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getSubscriptionBadge(data.user.subscriptionStatus)}
              </div>
              <p className="text-xs text-muted-foreground">
                Plan {data.user.subscriptionPlan || 'Ninguno'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anuncios Pendientes</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.analytics.pendingAds}</div>
              <p className="text-xs text-muted-foreground">
                esperando aprobación
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="resumen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="negocio">Mi Negocio</TabsTrigger>
            <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
            <TabsTrigger value="suscripcion">Suscripción</TabsTrigger>
            <TabsTrigger value="ayuda">Ayuda</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Overview */}
              {data.business ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Mi Negocio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{data.business.name}</h3>
                        <p className="text-sm text-muted-foreground">{data.business.category}</p>
                      </div>
                      <div>
                        <p className="text-sm">{data.business.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{data.business.city}, {data.business.province}</p>
                        </div>
                        <div>
                          {getStatusBadge(data.business.status)}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push('/anunciante/negocio')}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Mi Negocio</CardTitle>
                    <CardDescription>
                      Crea el perfil de tu negocio para comenzar a publicar anuncios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => router.push('/anunciante/negocio')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Perfil de Negocio
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimos 30 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nuevos anuncios creados</span>
                      <Badge>{data.recentActivity.newAds}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Créditos utilizados</span>
                      <Badge variant="outline">{data.recentActivity.creditsSpent}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="negocio">
            <Card>
              <CardHeader>
                <CardTitle>Gestión del Negocio</CardTitle>
                <CardDescription>
                  Administra la información de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push('/anunciante/negocio')}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Ir a Gestión de Negocio
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anuncios">
            <Card>
              <CardHeader>
                <CardTitle>Mis Anuncios</CardTitle>
                <CardDescription>
                  Gestiona tus anuncios publicitarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push('/anunciante/anuncios')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Anuncio
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suscripcion">
            <Card>
              <CardHeader>
                <CardTitle>Mi Suscripción</CardTitle>
                <CardDescription>
                  Gestiona tu plan de suscripción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Plan actual:</span>
                    <Badge>{data.user.subscriptionPlan || 'Ninguno'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Estado:</span>
                    {getSubscriptionBadge(data.user.subscriptionStatus)}
                  </div>
                  <Button onClick={() => router.push('/anunciante/suscripcion')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Suscripción
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ayuda">
            <Card>
              <CardHeader>
                <CardTitle>Centro de Ayuda</CardTitle>
                <CardDescription>
                  Recursos y soporte para anunciantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Si necesitas ayuda con tu cuenta de anunciante, puedes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Revisar nuestras guías paso a paso</li>
                    <li>Contactar a nuestro equipo de soporte</li>
                    <li>Consultar las preguntas frecuentes</li>
                  </ul>
                  <Button variant="outline">
                    Contactar Soporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}