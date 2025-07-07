import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Award, Heart, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros - Jennifer Mendoza | Colombia en España',
  description: 'Conoce a Jennifer Mendoza, especialista en migración Colombia-España con más de 5 años de experiencia ayudando a familias colombianas a cumplir su sueño de vivir en España.',
  keywords: ['Jennifer Mendoza migración', 'especialista migración Colombia España', 'asesoría migratoria', 'expertos migración'],
}

const stats = [
  {
    icon: Users,
    number: '500+',
    label: 'Familias Asesoradas',
    description: 'Exitosamente establecidas en España'
  },
  {
    icon: Award,
    number: '95%',
    label: 'Tasa de Éxito',
    description: 'En procesos migratorios completados'
  },
  {
    icon: Target,
    number: '5+',
    label: 'Años de Experiencia',
    description: 'Especializados en Colombia-España'
  },
  {
    icon: Heart,
    number: '100%',
    label: 'Compromiso',
    description: 'Con cada familia que asesoramos'
  }
]

const values = [
  {
    icon: CheckCircle,
    title: 'Transparencia',
    description: 'Información clara y honesta sobre todos los procesos, costos y tiempos reales.'
  },
  {
    icon: Users,
    title: 'Acompañamiento Personal',
    description: 'Atención personalizada desde el primer contacto hasta tu establecimiento en España.'
  },
  {
    icon: Award,
    title: 'Experiencia Comprobada',
    description: 'Años de experiencia y cientos de casos exitosos nos avalan.'
  },
  {
    icon: Heart,
    title: 'Compromiso Genuino',
    description: 'Tu éxito es nuestro éxito. Trabajamos hasta lograr tus objetivos.'
  }
]

const testimonials = [
  {
    name: 'María González',
    location: 'Madrid, España',
    text: 'Jennifer nos acompañó en todo el proceso. Su profesionalismo y dedicación fueron clave para que nuestra familia pudiera establecerse exitosamente en Madrid.',
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    location: 'Barcelona, España',
    text: 'Excelente servicio. Me ayudaron no solo con los trámites sino también con la integración cultural. Recomiendo sus servicios al 100%.',
    rating: 5
  },
  {
    name: 'Ana Martínez',
    location: 'Valencia, España',
    text: 'Gracias a Colombia en España pude conseguir mi visa de trabajo y ahora tengo una vida próspera en Valencia. Jennifer es una profesional excepcional.',
    rating: 5
  }
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-colombian-blue to-colombian-red text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nosotros
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Tu socio de confianza para el sueño de vivir en España
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-colombian-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-colombian-blue" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* About Jennifer */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Conoce a Jennifer Mendoza
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Soy Jennifer Mendoza, fundadora de Colombia en España y especialista en procesos migratorios 
                entre Colombia y España con más de 5 años de experiencia ayudando a familias colombianas 
                a cumplir su sueño de vivir en España.
              </p>
              <p>
                Mi pasión por ayudar a otros colombianos nació de mi propia experiencia migratoria. 
                Entiendo los desafíos, las dudas y las esperanzas que conlleva este proceso, y es por eso 
                que me dedico completamente a brindar el mejor acompañamiento posible.
              </p>
              <p>
                A lo largo de estos años, he desarrollado una metodología única que combina conocimiento 
                técnico actualizado, acompañamiento emocional y una red de contactos que facilita la 
                integración de mis clientes en España.
              </p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certificaciones y Experiencia</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Especialista en Derecho Migratorio Europeo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Certificada en Asesoría Migratoria Internacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Miembro del Colegio de Asesores Migratorios de España</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Más de 500 casos exitosos documentados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Jennifer's Photo Placeholder */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-to-br from-colombian-blue/20 to-colombian-red/20 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-4xl font-bold text-colombian-blue">JM</span>
                    </div>
                    <div className="text-xl font-semibold">Jennifer Mendoza</div>
                    <div className="text-sm">Especialista en Migración</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los principios que guían nuestro trabajo y definen nuestra forma de acompañarte
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-colombian-red/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-colombian-red" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Historias reales de familias que han logrado su sueño de vivir en España
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="text-colombian-blue font-medium">
                    {testimonial.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-colombian-blue to-colombian-red text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Comenzar tu Aventura?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Agenda tu consulta gratuita y da el primer paso hacia tu nueva vida en España
          </p>
          <Button size="lg" className="bg-white text-colombian-blue hover:bg-gray-100" asChild>
            <Link href="/contacto">
              Consulta Gratuita
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}