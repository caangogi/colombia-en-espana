'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserProfile } from '@/lib/firestore-schemas'
import { User } from 'firebase/auth'
import { 
  Crown, 
  Store, 
  User as UserIcon, 
  Settings, 
  BarChart3, 
  FileText, 
  CreditCard,
  Plus,
  Eye,
  Edit,
  Calendar
} from 'lucide-react'

interface RoleBasedDashboardProps {
  user: User
  userProfile: UserProfile
}

export default function RoleBasedDashboard({ user, userProfile }: RoleBasedDashboardProps) {
  const getRoleIcon = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-5 h-5 text-yellow-600" />
      case 'anunciante':
        return <Store className="w-5 h-5 text-blue-600" />
      default:
        return <UserIcon className="w-5 h-5 text-gray-600" />
    }
  }

  // Admin Dashboard
  if (userProfile.role === 'admin') {
    return (
      <div className="space-y-6">
        {/* Admin Header */}
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRoleIcon(userProfile.role)}
              Panel de Administración
            </CardTitle>
            <CardDescription>
              Control total del sistema Colombia en España
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Gestión de Blog
              </CardTitle>
              <CardDescription>
                Crear, editar y administrar artículos del blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Gestionar Blog
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="w-5 h-5" />
                Negocios
              </CardTitle>
              <CardDescription>
                Aprobar y gestionar negocios registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Negocios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                Estadísticas y métricas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="w-5 h-5" />
                Usuarios
              </CardTitle>
              <CardDescription>
                Gestionar usuarios y roles del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Gestionar Usuarios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" />
                Suscripciones
              </CardTitle>
              <CardDescription>
                Gestionar planes y pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Suscripciones
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-5 h-5" />
                Configuración
              </CardTitle>
              <CardDescription>
                Configuración general del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Anunciante Dashboard
  if (userProfile.role === 'anunciante') {
    return (
      <div className="space-y-6">
        {/* Anunciante Header */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRoleIcon(userProfile.role)}
              Panel de Anunciante
            </CardTitle>
            <CardDescription>
              Gestiona tu negocio y publicidad en Colombia en España
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userProfile.credits}</div>
                <div className="text-sm text-gray-600">Créditos disponibles</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userProfile.monthlyCredits}</div>
                <div className="text-sm text-gray-600">Créditos mensuales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anunciante Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Mi Negocio
              </CardTitle>
              <CardDescription>
                Gestiona la información de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Ver Perfil de Negocio
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Editar Información
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Publicidad
              </CardTitle>
              <CardDescription>
                Crea y gestiona tus anuncios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => window.location.href = '/anunciante/crear-anuncio'}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Anuncio
              </Button>
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Estadísticas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Suscripción
              </CardTitle>
              <CardDescription>
                Gestiona tu plan de suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plan actual:</span>
                  <Badge variant="outline">
                    {userProfile.subscriptionPlan || 'Básico'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Estado:</span>
                  <Badge variant={userProfile.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                    {userProfile.subscriptionStatus || 'Inactivo'}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/anunciante/suscripcion'}>
                  Gestionar Suscripción
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>
                Resumen de actividad de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Perfil creado recientemente</div>
                <div>• Listo para crear anuncios</div>
                <div>• {userProfile.credits} créditos disponibles</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Guest Dashboard
  return (
    <div className="space-y-6">
      {/* Guest Header */}
      <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRoleIcon(userProfile.role)}
            Panel de Usuario
          </CardTitle>
          <CardDescription>
            Bienvenido a Colombia en España
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Guest Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Explorar Contenido
            </CardTitle>
            <CardDescription>
              Accede a nuestros recursos y guías
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Ver Blog
            </Button>
            <Button variant="outline" className="w-full">
              Explorar Servicios
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              ¿Tienes un Negocio?
            </CardTitle>
            <CardDescription>
              Únete como anunciante y promociona tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Convertirse en Anunciante
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Profile Info Component
export function ProfileInfoCard({ user, userProfile }: RoleBasedDashboardProps) {
  const getRoleIcon = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-5 h-5 text-yellow-600" />
      case 'anunciante':
        return <Store className="w-5 h-5 text-blue-600" />
      default:
        return <UserIcon className="w-5 h-5 text-gray-600" />
    }
  }

  const getRoleColor = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'anunciante':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Información del Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-colombian-blue to-colombian-red rounded-full flex items-center justify-center text-white font-bold text-xl">
            {(userProfile?.firstName || user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">
              {userProfile?.firstName && userProfile?.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : user.displayName || user.email}
            </div>
            <div className="text-gray-600">{userProfile?.email || user.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getRoleColor(userProfile.role)}>
                <span className="flex items-center gap-1">
                  {getRoleIcon(userProfile.role)}
                  {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                </span>
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-sm text-gray-600">Miembro desde</div>
            <div className="font-medium">
              {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('es-ES') : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Último acceso</div>
            <div className="font-medium">
              {userProfile?.lastLoginAt ? new Date(userProfile.lastLoginAt).toLocaleDateString('es-ES') : 'Ahora'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}