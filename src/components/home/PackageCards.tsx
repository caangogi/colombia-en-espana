'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button-simple'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-simple'
import { Badge } from '@/components/ui/badge-simple'
import { useState } from 'react'
import ServiceCheckout from '@/components/checkout/ServiceCheckout'
import { PackageId } from '@/lib/firestore-schemas'

// Simple icon components
const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function PackageCards() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageId | null>(null)
  
  const packages = [
    {
      id: 'esencial',
      name: 'Esencial',
      price: '€500',
      priceCOP: '$2,150,000 COP',
      description: 'Perfecto para comenzar tu proceso migratorio con lo fundamental',
      features: [
        'Asesoría inicial personalizada (2 horas)',
        'Revisión completa de documentos',
        'Guía detallada de trámites básicos',
        'Lista de verificación personalizada',
        'Soporte por WhatsApp (horario laboral)',
        'Recursos digitales descargables'
      ],
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600'
    },
    {
      id: 'integral',
      name: 'Integral',
      price: '€1,500',
      priceCOP: '$6,450,000 COP',
      description: 'Acompañamiento completo durante todo tu proceso de migración',
      features: [
        'Todo lo del paquete Esencial',
        'Gestión completa de trámites oficiales',
        'Acompañamiento personal en citas importantes',
        'Búsqueda y orientación de vivienda',
        'Orientación laboral y preparación de CV',
        'Soporte telefónico prioritario',
        'Guía de integración cultural',
        'Seguimiento mensual por 6 meses'
      ],
      popular: true,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      id: 'bip',
      name: 'VIP',
      price: '€2,500',
      priceCOP: '$10,750,000 COP',
      description: 'Servicio premium con atención personalizada y exclusiva',
      features: [
        'Todo lo del paquete Integral',
        'Gestor personal asignado exclusivamente',
        'Atención prioritaria 24/7 todos los días',
        'Networking con comunidad colombiana',
        'Acompañamiento en primeros 30 días',
        'Orientación para apertura de empresa',
        'Acceso a eventos exclusivos',
        'Seguimiento por 12 meses',
        'Consultas ilimitadas por 1 año'
      ],
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-600'
    }
  ]

  const handlePackageSelect = (packageId: PackageId) => {
    console.log('Package selected:', packageId)
    setSelectedPackage(packageId)
    setShowCheckout(true)
    console.log('Show checkout state:', true)
  }

  return (
    <>
      {showCheckout && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ServiceCheckout
              type="package"
              itemId={selectedPackage}
              onClose={() => {
                setShowCheckout(false)
                setSelectedPackage(null)
              }}
            />
          </div>
        </div>
      )}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-colombian-blue/10 text-colombian-blue border-colombian-blue/20">
            Nuestros Servicios
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red bg-clip-text text-transparent">
            Paquetes de Migración
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el paquete que mejor se adapte a tus necesidades. Todos incluyen garantía de satisfacción y soporte especializado.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <Card key={index} className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
              pkg.popular ? 'ring-2 ring-colombian-blue shadow-xl scale-105' : 'hover:shadow-lg'
            }`}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-colombian-blue to-colombian-red text-white px-4 py-1 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-2xl font-bold ${pkg.textColor}`}>
                    {pkg.name}
                  </CardTitle>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  {pkg.description}
                </CardDescription>
                <div className="pt-4">
                  <div className={`text-4xl font-bold ${pkg.textColor}`}>
                    {pkg.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {pkg.priceCOP}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`w-5 h-5 ${pkg.textColor} mr-3 mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white font-semibold py-3 text-base group`}
                  onClick={() => handlePackageSelect(pkg.id as PackageId)}
                >
                  Elegir {pkg.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Sin compromisos • Consulta inicial gratuita
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            ¿No estás seguro cuál es el mejor para ti?
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contacto">
              Solicita una consulta gratuita
            </Link>
          </Button>
        </div>
      </div>
    </section>
    </>
  )
}