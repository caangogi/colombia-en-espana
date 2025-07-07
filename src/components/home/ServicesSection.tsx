'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button-simple'
import { Card, CardContent } from '@/components/ui/card-simple'
import ServiceCheckout from '@/components/checkout/ServiceCheckout'

// Iconos SVG simples para cada servicio
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>
)

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
)

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
  </svg>
)

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4M20,18H4V12H20V18M20,8H4V6H20V8Z"/>
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
  </svg>
)

const AirplaneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.56,3.44C21.15,4.03 21.15,4.97 20.56,5.56L5.56,20.56C4.97,21.15 4.03,21.15 3.44,20.56C2.85,19.97 2.85,19.03 3.44,18.44L18.44,3.44C19.03,2.85 19.97,2.85 20.56,3.44M14.5,6L16.5,4H20V7.5L18,9.5L14.5,6M10,10.5L4,16.5L7.5,20L13.5,14L10,10.5Z"/>
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
  </svg>
)

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<{id: string, type: 'service'} | null>(null)
  
  const services = [
    {
      id: "asesoria_inicial",
      icon: UserIcon,
      title: "Asesoría Inicial",
      price: "€150",
      priceCol: "$645.000 COP",
      description: "Consulta personalizada de 2 horas para evaluar tu caso y crear plan de migración",
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "nie",
      icon: DocumentIcon,
      title: "Gestión NIE/TIE",
      price: "€400",
      priceCol: "$1.700.000 COP",
      description: "Tramitación completa de documentos de identificación para extranjeros",
      borderColor: "border-green-500",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      id: "busqueda_vivienda",
      icon: HomeIcon,
      title: "Búsqueda Vivienda",
      price: "€350",
      priceCol: "$1.505.000 COP",
      description: "Búsqueda personalizada de apartamentos y apoyo en contratos de alquiler",
      borderColor: "border-yellow-500",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      id: "cuenta_bancaria",
      icon: CreditCardIcon,
      title: "Cuenta Bancaria",
      price: "€200",
      priceCol: "$860.000 COP",
      description: "Acompañamiento para apertura de cuenta bancaria y gestión inicial",
      borderColor: "border-red-500",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
    {
      id: "seguro_salud",
      icon: ShieldIcon,
      title: "Seguro de Salud",
      price: "€180",
      priceCol: "$774.000 COP",
      description: "Asesoramiento y contratación de seguro médico privado",
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "recogida_aeropuerto",
      icon: AirplaneIcon,
      title: "Recogida Aeropuerto",
      price: "€120",
      priceCol: "$516.000 COP",
      description: "Servicio de bienvenida y traslado desde el aeropuerto a tu alojamiento",
      borderColor: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      id: "alojamiento_temporal",
      icon: MapPinIcon,
      title: "Alojamiento Temporal",
      price: "€80/día",
      priceCol: "$344.000 COP/día",
      description: "Hospedaje en apartamentos seguros mientras encuentras tu vivienda definitiva",
      borderColor: "border-orange-500",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
      id: "soporte_24_7",
      icon: ClockIcon,
      title: "Soporte 24/7",
      price: "€300/mes",
      priceCol: "$1.290.000 COP/mes",
      description: "Asistencia telefónica y WhatsApp las 24 horas durante tu primer mes",
      borderColor: "border-teal-500",
      buttonColor: "bg-teal-600 hover:bg-teal-700"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-8">
            Contrata servicios específicos según tus necesidades particulares
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className={`${service.borderColor} border-2 hover:shadow-lg transition-shadow duration-300`}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4`}>
                    <service.icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  
                  {/* Precios */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {service.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.priceCol}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <Button 
                    className={`w-full text-white ${service.buttonColor}`}
                    onClick={() => setSelectedService({id: service.id, type: 'service'})}
                  >
                    Contratar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Modal de Checkout */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ServiceCheckout
              itemId={selectedService.id}
              type={selectedService.type}
              onClose={() => setSelectedService(null)}
            />
          </div>
        </div>
      )}
    </section>
  )
}