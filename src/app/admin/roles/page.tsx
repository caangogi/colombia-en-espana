'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Crown, Store, User as UserIcon, ArrowLeft } from 'lucide-react'
import { UserProfile } from '@/lib/firestore-schemas'
import { UserProfileService } from '@/lib/firestore-service'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function AdminRolesPage() {
  const { user, userProfile, loading, isAdmin, refreshProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [updatingRoles, setUpdatingRoles] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (!loading && userProfile && !isAdmin()) {
      router.push('/dashboard')
      return
    }
  }, [user, userProfile, loading, isAdmin, router])

  useEffect(() => {
    const loadUsers = async () => {
      if (userProfile && isAdmin()) {
        try {
          const allUsers = await UserProfileService.getAllUsers()
          setUsers(allUsers)
        } catch (error) {
          console.error('Error loading users:', error)
          toast({
            title: 'Error',
            description: 'No se pudieron cargar los usuarios',
            variant: 'destructive',
          })
        } finally {
          setLoadingUsers(false)
        }
      }
    }

    loadUsers()
  }, [userProfile, isAdmin])

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    setUpdatingRoles(prev => [...prev, userId])
    
    try {
      await UserProfileService.updateRole(userId, newRole)
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

      // Refresh current user profile if changing own role
      if (userId === user?.uid) {
        await refreshProfile()
      }

      toast({
        title: 'Éxito',
        description: 'Rol actualizado correctamente',
      })
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol',
        variant: 'destructive',
      })
    } finally {
      setUpdatingRoles(prev => prev.filter(id => id !== userId))
    }
  }

  const getRoleIcon = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'anunciante':
        return <Store className="w-4 h-4 text-blue-600" />
      default:
        return <UserIcon className="w-4 h-4 text-gray-600" />
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

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertDescription>
              No tienes permisos para acceder a esta página.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
            <p className="text-gray-600">Administra los roles de los usuarios del sistema</p>
          </div>
        </div>

        {/* Admin Warning */}
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription>
            <strong>Panel de Administración:</strong> Puedes cambiar los roles de cualquier usuario, incluido el tuyo propio. 
            Ten cuidado al modificar roles de administrador.
          </AlertDescription>
        </Alert>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Usuarios del Sistema ({users.length})
            </CardTitle>
            <CardDescription>
              Lista de todos los usuarios registrados con sus roles actuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando usuarios...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((userItem) => (
                  <div 
                    key={userItem.id} 
                    className="flex items-center justify-between p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-colombian-blue to-colombian-red rounded-full flex items-center justify-center text-white font-bold">
                        {(userItem.firstName || userItem.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {userItem.firstName && userItem.lastName 
                            ? `${userItem.firstName} ${userItem.lastName}`
                            : userItem.email}
                        </div>
                        <div className="text-sm text-gray-600">{userItem.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(userItem.role)}>
                            <span className="flex items-center gap-1">
                              {getRoleIcon(userItem.role)}
                              {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                            </span>
                          </Badge>
                          {userItem.id === user?.uid && (
                            <Badge variant="outline" className="text-xs">
                              Tú
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={userItem.role}
                        onValueChange={(newRole: UserProfile['role']) => 
                          handleRoleChange(userItem.id, newRole)
                        }
                        disabled={updatingRoles.includes(userItem.id)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guest">
                            <span className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4" />
                              Guest
                            </span>
                          </SelectItem>
                          <SelectItem value="anunciante">
                            <span className="flex items-center gap-2">
                              <Store className="w-4 h-4" />
                              Anunciante
                            </span>
                          </SelectItem>
                          <SelectItem value="admin">
                            <span className="flex items-center gap-2">
                              <Crown className="w-4 h-4" />
                              Admin
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {updatingRoles.includes(userItem.id) && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay usuarios registrados
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Descriptions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="w-5 h-5 text-gray-600" />
                Guest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ver contenido público</li>
                <li>• Enviar formularios de contacto</li>
                <li>• Acceso básico al directorio</li>
                <li>• Leer blog</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="w-5 h-5 text-blue-600" />
                Anunciante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Todos los permisos de Guest</li>
                <li>• Crear perfil de negocio</li>
                <li>• Gestionar anuncios</li>
                <li>• Ver estadísticas propias</li>
                <li>• Gestionar suscripciones</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
                Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Todos los permisos anteriores</li>
                <li>• Gestionar usuarios y roles</li>
                <li>• Administrar blog</li>
                <li>• Aprobar negocios</li>
                <li>• Ver analíticas completas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}