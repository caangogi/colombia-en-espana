import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Paquetes de Migración | Colombia en España',
  description: 'Descubre nuestros paquetes de asesoría migratoria para colombianos que desean vivir en España. Desde trámites básicos hasta servicios VIP completos.',
  keywords: ['paquetes migración España', 'asesoría migratoria Colombia', 'servicios migración', 'visa España', 'NIE España'],
}

const packages = [
  {
    name: 'Paquete Esencial',
    price: '€500',
    priceCol: '$2,500,000',
    description: 'Para quienes buscan orientación básica en su proceso migratorio',
    features: [
      'Consulta inicial personalizada (2 horas)',
      'Revisión de documentos requeridos',
      'Guía paso a paso para visa',
      'Lista de documentos necesarios',
      'Soporte vía email por 30 días'
    ],
    popular: false,
    color: 'border-gray-200'
  },
  {
    name: 'Paquete Integral',
    price: '€1,200',
    priceCol: '$6,000,000',
    description: 'Acompañamiento completo en todo el proceso migratorio',
    features: [
      'Todo lo incluido en el Paquete Esencial',
      'Asesoría para búsqueda de empleo',
      'Apoyo en trámites de NIE y empadronamiento',
      'Orientación sobre vivienda',
      'Guía de integración cultural',
      'Soporte telefónico por 90 días',
      'Revisión de contratos laborales'
    ],
    popular: true,
    color: 'border-colombian-blue'
  },
  {
    name: 'Paquete VIP',
    price: '€2,500',
    priceCol: '$12,500,000',
    description: 'Servicio premium con acompañamiento personalizado',
    features: [
      'Todo lo incluido en el Paquete Integral',
      'Acompañamiento presencial en Madrid',
      'Gestión personalizada de trámites',
      'Conexión con red de contactos profesionales',
      'Asesoría fiscal y tributaria',
      'Soporte prioritario 24/7 por 6 meses',
      'Seguimiento post-llegada durante 1 año'
    ],
    popular: false,
    color: 'border-colombian-red'
  }
]

export default function PaquetesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-colombian-blue to-colombian-red text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Paquetes de Migración a España
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Elige el nivel de acompañamiento que necesitas para tu proceso migratorio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-100">Más de</div>
                <div className="text-2xl font-bold">500 familias</div>
                <div className="text-sm text-blue-100">asesoradas exitosamente</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-100">Tasa de éxito</div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-blue-100">en procesos migratorios</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <Card key={index} className={`relative ${pkg.color} ${pkg.popular ? 'ring-2 ring-colombian-blue shadow-2xl transform scale-105' : 'shadow-lg'}`}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-colombian-blue text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Más Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{pkg.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">{pkg.description}</CardDescription>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-colombian-blue">{pkg.price}</div>
                  <div className="text-lg text-gray-600">{pkg.priceCol} COP</div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${pkg.popular ? 'bg-colombian-blue hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                  asChild
                >
                  <Link href="/contacto">
                    Contratar Ahora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿No estás seguro qué paquete elegir?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Agenda una consulta gratuita de 30 minutos para conocer tu situación específica
            </p>
            <Button size="lg" className="bg-colombian-yellow text-black hover:bg-yellow-500" asChild>
              <Link href="/contacto">
                Consulta Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}