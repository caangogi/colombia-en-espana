'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';

export default function AnuncianteDashboardPage() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && userProfile && userProfile.role !== 'anunciante') {
      router.push('/dashboard');
    }
  }, [user, userProfile, loading, router]);

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

  if (userProfile && userProfile.role !== 'anunciante') {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Anunciante</h1>
          <p className="text-gray-600">Gestiona tu negocio y promociones</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      {userProfile ? (
        <RoleBasedDashboard user={user} userProfile={userProfile} />
      ) : (
        <Alert>
          <AlertDescription>
            No se pudo cargar tu perfil. Por favor, intenta cerrar sesión y volver a iniciar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}