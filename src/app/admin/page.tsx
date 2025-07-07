'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Store, 
  BarChart3, 
  Settings, 
  Star, 
  AlertCircle, 
  TrendingUp,
  Edit3,
  Sparkles,
  PlusCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalBusinesses: number;
  totalRevenue: number;
  blogStats: {
    published: number;
    drafts: number;
    pending: number;
    archived: number;
  };
}

export default function AdminDashboard() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !userProfile || userProfile.role !== 'admin')) {
      router.push('/login');
      return;
    }
    
    if (user && userProfile && userProfile.role === 'admin') {
      loadDashboardStats();
    }
  }, [user, loading, router]);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !userProfile || userProfile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona el contenido y usuarios de Colombia en España
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBlogs || 0}</div>
              <p className="text-xs text-muted-foreground">
                Artículos publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negocios</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBusinesses || 0}</div>
              <p className="text-xs text-muted-foreground">
                Empresas registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats?.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">
                Ingresos totales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Blog Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestión de Blog
              </CardTitle>
              <CardDescription>
                Herramientas avanzadas para crear y administrar contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Blog Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats?.blogStats?.published || 0}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Publicados</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats?.blogStats?.drafts || 0}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Borradores</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/admin/blog/generator')}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Sparkles className="h-4 w-4" />
                  Asistente IA
                </Button>
                
                <Button 
                  onClick={() => router.push('/admin/blog/generator')}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Generador IA
                </Button>
                
                <Button 
                  onClick={() => router.push('/admin/blog')}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Nueva Entrada
                </Button>
                
                <Button 
                  onClick={() => router.push('/admin/blog')}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Administrar Blogs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estadísticas del Blog
              </CardTitle>
              <CardDescription>
                Rendimiento del contenido y analíticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Blog Status Distribution */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Publicados</span>
                    <Badge variant="secondary">{stats?.blogStats?.published || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Borradores</span>
                    <Badge variant="outline">{stats?.blogStats?.drafts || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En Revisión</span>
                    <Badge variant="outline">{stats?.blogStats?.pending || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Archivados</span>
                    <Badge variant="outline">{stats?.blogStats?.archived || 0}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => router.push('/admin/analytics')}
                    variant="outline" 
                    className="w-full"
                  >
                    Ver Analíticas Completas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gestiona usuarios y roles del sistema
              </p>
              <Button 
                onClick={() => router.push('/admin/roles')}
                variant="outline" 
                className="w-full"
              >
                Gestionar Roles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Anunciantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Administra negocios y anuncios
              </p>
              <Button 
                onClick={() => router.push('/admin/businesses')}
                variant="outline" 
                className="w-full"
              >
                Ver Negocios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configuración del sistema
              </p>
              <Button 
                onClick={() => router.push('/admin/settings')}
                variant="outline" 
                className="w-full"
              >
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}