'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RoleBasedDashboard, { ProfileInfoCard } from '@/components/dashboard/RoleBasedDashboard';

export default function DashboardPage() {
  const { user, userProfile, loading, logout, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Bienvenido, {userProfile?.firstName || user.displayName || user.email}!
            </h1>
            <p className="text-gray-600">Panel de Control - Colombia en España</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información de Usuario
            </CardTitle>
            <CardDescription>
              Detalles de tu cuenta y perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Rol</label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <Badge variant={userProfile?.role === 'admin' ? 'default' : 'secondary'}>
                    {userProfile?.role || 'user'}
                  </Badge>
                </div>
              </div>
            </div>

            {user.photoURL && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Foto de Perfil</label>
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-specific Content */}
        {hasRole('admin') && (
          <Card>
            <CardHeader>
              <CardTitle>Panel de Administrador</CardTitle>
              <CardDescription>
                Funciones administrativas del sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Tienes acceso administrativo completo al sistema.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col" onClick={() => router.push('/admin/blog')}>
                  <span className="font-medium">Gestionar Blog</span>
                  <span className="text-sm opacity-80">Posts y contenido</span>
                </Button>
                
                <Button className="h-20 flex-col" onClick={() => router.push('/admin/users')}>
                  <span className="font-medium">Usuarios</span>
                  <span className="text-sm opacity-80">Gestión de usuarios</span>
                </Button>
                
                <Button className="h-20 flex-col" onClick={() => router.push('/admin/businesses')}>
                  <span className="font-medium">Negocios</span>
                  <span className="text-sm opacity-80">Directorio empresarial</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasRole('anunciante') && (
          <Card>
            <CardHeader>
              <CardTitle>Panel de Anunciante</CardTitle>
              <CardDescription>
                Gestiona tu negocio y anuncios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col" onClick={() => router.push('/anunciante-dashboard')}>
                  <span className="font-medium">Mi Negocio</span>
                  <span className="text-sm opacity-80">Perfil empresarial</span>
                </Button>
                
                <Button className="h-20 flex-col" onClick={() => router.push('/anunciante/ads')}>
                  <span className="font-medium">Mis Anuncios</span>
                  <span className="text-sm opacity-80">Gestión de publicidad</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* General Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Explorar Servicios</CardTitle>
            <CardDescription>
              Accede a los servicios de Colombia en España
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col" onClick={() => router.push('/blog')}>
                <span className="font-medium">Blog</span>
                <span className="text-xs opacity-70">Artículos y guías</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col" onClick={() => router.push('/packages')}>
                <span className="font-medium">Paquetes</span>
                <span className="text-xs opacity-70">Servicios de migración</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col" onClick={() => router.push('/businesses')}>
                <span className="font-medium">Negocios</span>
                <span className="text-xs opacity-70">Directorio empresarial</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col" onClick={() => router.push('/contact')}>
                <span className="font-medium">Contacto</span>
                <span className="text-xs opacity-70">Consulta gratuita</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}