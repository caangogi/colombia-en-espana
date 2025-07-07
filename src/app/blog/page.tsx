import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Guía Completa de Migración | Colombia en España',
  description: 'Descubre artículos especializados sobre migración de Colombia a España. Guías paso a paso, consejos prácticos y experiencias reales para tu proceso migratorio.',
  keywords: ['blog migración España', 'guía migración Colombia', 'visa España', 'NIE España', 'vivir en España'],
}

const blogPosts = [
  {
    id: 1,
    title: 'Guía Completa para Obtener la Visa de Estudiante en España',
    excerpt: 'Todo lo que necesitas saber sobre el proceso de solicitud de visa de estudiante, documentos requeridos y tiempos de procesamiento.',
    category: 'Visas',
    author: 'Jennifer Mendoza',
    date: '2024-01-15',
    readTime: '8 min',
    image: '/api/placeholder/400/250',
    featured: true
  },
  {
    id: 2,
    title: 'Cómo Conseguir Trabajo en España: Estrategias Efectivas',
    excerpt: 'Descubre las mejores estrategias para encontrar empleo en España, desde la búsqueda hasta la entrevista de trabajo.',
    category: 'Empleo',
    author: 'Jennifer Mendoza',
    date: '2024-01-10',
    readTime: '6 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: 3,
    title: 'NIE en España: Proceso Completo y Documentos Necesarios',
    excerpt: 'Guía detallada sobre cómo obtener el NIE (Número de Identificación de Extranjero) en España paso a paso.',
    category: 'Trámites',
    author: 'Jennifer Mendoza',
    date: '2024-01-08',
    readTime: '10 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: 4,
    title: 'Mejores Ciudades para Vivir en España como Colombiano',
    excerpt: 'Conoce las ciudades españolas más amigables para colombianos, considerando costo de vida, oportunidades laborales y calidad de vida.',
    category: 'Vida en España',
    author: 'Jennifer Mendoza',
    date: '2024-01-05',
    readTime: '7 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: 5,
    title: 'Homologación de Títulos Universitarios en España',
    excerpt: 'Proceso completo para homologar tu título universitario colombiano en España y acceder a mejores oportunidades laborales.',
    category: 'Educación',
    author: 'Jennifer Mendoza',
    date: '2024-01-03',
    readTime: '12 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: 6,
    title: 'Sistema de Salud en España: Todo lo que Debes Saber',
    excerpt: 'Comprende cómo funciona el sistema de salud español, cómo acceder a los servicios médicos y qué documentos necesitas.',
    category: 'Salud',
    author: 'Jennifer Mendoza',
    date: '2024-01-01',
    readTime: '9 min',
    image: '/api/placeholder/400/250',
    featured: false
  }
]

const categories = [
  { name: 'Todos', count: 6 },
  { name: 'Visas', count: 1 },
  { name: 'Empleo', count: 1 },
  { name: 'Trámites', count: 1 },
  { name: 'Vida en España', count: 1 },
  { name: 'Educación', count: 1 },
  { name: 'Salud', count: 1 }
]

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-colombian-blue to-colombian-red text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog de Migración
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Guías, consejos y experiencias reales para tu proceso migratorio a España
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(1).map((category, index) => (
                <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Artículo Destacado</h2>
                <Card className="overflow-hidden shadow-lg">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge className="bg-colombian-blue text-white">
                          {featuredPost.category}
                        </Badge>
                        <Badge variant="outline">Destacado</Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredPost.date).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                      <Button className="bg-colombian-blue hover:bg-blue-700">
                        Leer Artículo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Regular Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Todos los Artículos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="aspect-video">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-colombian-red text-white text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Leer Más
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <span className="text-gray-700">{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-colombian-blue to-colombian-red text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Mantente Actualizado</CardTitle>
                  <CardDescription className="text-blue-100">
                    Recibe los últimos artículos y consejos sobre migración
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-colombian-blue hover:bg-gray-100"
                    asChild
                  >
                    <Link href="/contacto">
                      Suscribirme
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}