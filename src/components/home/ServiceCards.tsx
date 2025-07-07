'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ServiceCards() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">Asesoría Inicial</h3>
          <p className="text-2xl font-bold text-green-600 mb-1">€150</p>
          <p className="text-sm text-gray-500 mb-3">$645,000 COP</p>
          <p className="text-sm text-gray-600 mb-4">
            Consulta personalizada de 2 horas para evaluar tu caso
          </p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/checkout?productId=4'}
          >
            Contratar
          </Button>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">Gestión NIE/TIE</h3>
          <p className="text-2xl font-bold text-blue-600 mb-1">€400</p>
          <p className="text-sm text-gray-500 mb-3">$1,720,000 COP</p>
          <p className="text-sm text-gray-600 mb-4">
            Tramitación completa de documentos de identificación
          </p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/checkout?productId=5'}
          >
            Contratar
          </Button>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">Búsqueda Vivienda</h3>
          <p className="text-2xl font-bold text-purple-600 mb-1">€350</p>
          <p className="text-sm text-gray-500 mb-3">$1,505,000 COP</p>
          <p className="text-sm text-gray-600 mb-4">
            Búsqueda personalizada y apoyo en contratos
          </p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/checkout?productId=6'}
          >
            Contratar
          </Button>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">Soporte 24/7</h3>
          <p className="text-2xl font-bold text-red-600 mb-1">€300</p>
          <p className="text-sm text-gray-500 mb-3">$1,290,000/mes</p>
          <p className="text-sm text-gray-600 mb-4">
            Asistencia telefónica y WhatsApp 24 horas
          </p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/checkout?productId=11'}
          >
            Contratar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}