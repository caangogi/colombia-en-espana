'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, Users, Heart } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'María González',
      location: 'Madrid, España',
      previousLocation: 'Bogotá, Colombia',
      rating: 5,
      content: 'Jennifer y su equipo me ayudaron con todo el proceso de migración. Desde el primer día hasta que conseguí mi NIE, siempre estuvieron disponibles. Ahora trabajo en Madrid y mi familia está feliz aquí.',
      package: 'Integral',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      date: '2024-11-15',
      verified: true
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      location: 'Barcelona, España',
      previousLocation: 'Medellín, Colombia',
      rating: 5,
      content: 'El paquete VIP valió cada euro. Me recibieron en el aeropuerto, me ayudaron con el apartamento y hasta me conectaron con otros colombianos. El proceso fue muy fluido.',
      package: 'VIP',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      date: '2024-10-28',
      verified: true
    },
    {
      id: 3,
      name: 'Ana Sofía Herrera',
      location: 'Valencia, España',
      previousLocation: 'Cali, Colombia',
      rating: 5,
      content: 'Excelente servicio. Me orientaron paso a paso para conseguir trabajo antes de llegar. Cuando llegué a Valencia ya tenía entrevistas agendadas. Recomiendo 100%.',
      package: 'Integral',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      date: '2024-12-02',
      verified: true
    },
    {
      id: 4,
      name: 'Diego Morales',
      location: 'Sevilla, España',
      previousLocation: 'Cartagena, Colombia',
      rating: 5,
      content: 'La asesoría fue increíble. Jennifer me explicó todo sobre el sistema de salud, educación para mis hijos y los trámites necesarios. Mi familia se adaptó muy rápido.',
      package: 'Esencial',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      date: '2024-09-20',
      verified: true
    }
  ]

  const packageColors = {
    'Esencial': 'bg-green-100 text-green-800',
    'Integral': 'bg-blue-100 text-blue-800',
    'VIP': 'bg-purple-100 text-purple-800'
  }

  return (
    <section className="py-20 bg-gradient-to-br from-colombian-blue/5 to-colombian-yellow/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white/80 text-colombian-blue border-colombian-blue/20">
            <Heart className="w-4 h-4 mr-2" />
            Testimonios Reales
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red bg-clip-text text-transparent">
            Historias de Éxito
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 500 familias colombianas han cumplido su sueño de vivir en España con nuestro acompañamiento. Estas son algunas de sus experiencias.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              index % 2 === 0 ? 'lg:mt-8' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{testimonial.location}</span>
                      <span className="mx-2">•</span>
                      <span>desde {testimonial.previousLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Badge className={packageColors[testimonial.package as keyof typeof packageColors]}>
                        {testimonial.package}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-colombian-blue/20" />
                  <blockquote className="text-gray-700 italic leading-relaxed pl-6">
                    "{testimonial.content}"
                  </blockquote>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 text-right">
                  {new Date(testimonial.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-colombian-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-colombian-blue" />
            </div>
            <div className="text-2xl font-bold text-colombian-blue mb-1">500+</div>
            <div className="text-gray-600 text-sm">Familias Asesoradas</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-1">4.9/5</div>
            <div className="text-gray-600 text-sm">Calificación Promedio</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
            <div className="text-gray-600 text-sm">Tasa de Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-colombian-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Quote className="w-8 h-8 text-colombian-red" />
            </div>
            <div className="text-2xl font-bold text-colombian-red mb-1">200+</div>
            <div className="text-gray-600 text-sm">Testimonios Publicados</div>
          </div>
        </div>

        {/* Video Testimonials Preview */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              También en Video
            </h3>
            <p className="text-gray-600 mb-6">
              Escucha directamente de nuestros clientes sus experiencias completas de migración a España.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center group hover:bg-gray-300 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-4 border-l-gray-800 border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center group hover:bg-gray-300 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-4 border-l-gray-800 border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center group hover:bg-gray-300 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-4 border-l-gray-800 border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}