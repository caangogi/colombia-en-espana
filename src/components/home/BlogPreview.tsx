'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowRight, BookOpen } from 'lucide-react'

export default function BlogPreview() {
  // Sample blog posts - in real app this would come from API
  const featuredPosts = [
    {
      id: 1,
      title: 'Cómo Obtener el NIE en España: Guía Completa 2025',
      excerpt: 'Todo lo que necesitas saber sobre el Número de Identificación de Extranjero, desde la solicitud hasta la renovación.',
      category: 'Trámites y Documentación',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      publishedAt: '2025-01-01',
      readTime: '8 min'
    },
    {
      id: 2,
      title: 'Mejores Ciudades de España para Colombianos',
      excerpt: 'Descubre las ciudades españolas más acogedoras para la comunidad colombiana, con mejores oportunidades laborales.',
      category: 'Vida Práctica',
      imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      publishedAt: '2024-12-28',
      readTime: '6 min'
    },
    {
      id: 3,
      title: 'Cómo Conseguir Trabajo en España desde Colombia',
      excerpt: 'Estrategias efectivas para encontrar empleo antes de llegar a España, incluyendo portales web y networking.',
      category: 'Trabajo y Empleo',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      publishedAt: '2024-12-25',
      readTime: '10 min'
    }
  ]

  const categoryColors = {
    'Trámites y Documentación': 'bg-blue-100 text-blue-800',
    'Vida Práctica': 'bg-green-100 text-green-800',
    'Trabajo y Empleo': 'bg-purple-100 text-purple-800',
    'Vivienda': 'bg-orange-100 text-orange-800',
    'Educación': 'bg-red-100 text-red-800'
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-colombian-yellow/10 text-colombian-yellow border-colombian-yellow/20">
            <BookOpen className="w-4 h-4 mr-2" />
            Recursos y Guías
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red bg-clip-text text-transparent">
            Blog Colombia en España
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente informado con nuestras guías actualizadas, consejos prácticos y experiencias reales de colombianos en España.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post, index) => (
            <Card key={post.id} className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
              index === 1 ? 'lg:scale-105' : ''
            }`}>
              <div className="relative overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={categoryColors[post.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}>
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl leading-tight group-hover:text-colombian-blue transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full group-hover:bg-colombian-blue/10 group-hover:text-colombian-blue" asChild>
                  <Link href={`/blog/${post.id}`}>
                    Leer más
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-colombian-blue mb-2">150+</div>
            <div className="text-gray-600">Artículos Publicados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-colombian-blue mb-2">50K+</div>
            <div className="text-gray-600">Lectores Mensuales</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-colombian-blue mb-2">9</div>
            <div className="text-gray-600">Categorías</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-colombian-blue mb-2">100%</div>
            <div className="text-gray-600">Contenido Actualizado</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">
              Ver Todos los Artículos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}