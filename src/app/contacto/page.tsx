import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Consulta Gratuita | Colombia en España',
  description: 'Contáctanos para una consulta gratuita sobre tu proceso migratorio a España. Agenda tu cita con Jennifer Mendoza, experta en migración Colombia-España.',
  keywords: ['contacto migración España', 'consulta gratuita migración', 'asesoría migratoria Colombia', 'Jennifer Mendoza migración'],
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: 'info@colombiaenespana.com',
    description: 'Respuesta en 24 horas'
  },
  {
    icon: Phone,
    title: 'Teléfono',
    details: '+34 XXX XXX XXX',
    description: 'Lunes a Viernes: 9:00 - 18:00'
  },
  {
    icon: MapPin,
    title: 'Ubicación',
    details: 'Madrid, España',
    description: 'Citas presenciales disponibles'
  },
  {
    icon: Clock,
    title: 'Horarios',
    details: 'Lun - Vie: 9:00 - 18:00',
    description: 'Sáb: 10:00 - 14:00'
  }
]

const services = [
  'Consulta inicial gratuita',
  'Asesoría para visa de estudiante',
  'Asesoría para visa de trabajo',
  'Trámites de NIE',
  'Búsqueda de empleo',
  'Homologación de títulos',
  'Asesoría fiscal',
  'Integración cultural',
  'Otro'
]

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-colombian-blue to-colombian-red text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Agenda tu consulta gratuita de 30 minutos
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <div className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-6 h-6" />
                <span>Respuesta garantizada en 24 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Solicita tu Consulta Gratuita</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo en las próximas 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos *</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Tus apellidos"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        placeholder="+57 XXX XXX XXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Servicio de Interés *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el servicio que te interesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service, index) => (
                          <SelectItem key={index} value={service.toLowerCase().replace(/\s+/g, '-')}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentSituation">Situación Actual</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="¿Cuál es tu situación actual?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colombia">Vivo en Colombia</SelectItem>
                        <SelectItem value="espana-turistico">Estoy en España con visa turística</SelectItem>
                        <SelectItem value="espana-estudiante">Estoy en España con visa de estudiante</SelectItem>
                        <SelectItem value="espana-trabajo">Estoy en España con visa de trabajo</SelectItem>
                        <SelectItem value="espana-residencia">Tengo residencia en España</SelectItem>
                        <SelectItem value="otro">Otra situación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Cuéntanos tu caso *</Label>
                    <Textarea 
                      id="message"
                      placeholder="Describe brevemente tu situación actual, tus objetivos y cualquier pregunta específica que tengas..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredContact">Método de Contacto Preferido</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="¿Cómo prefieres que te contactemos?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Teléfono</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="videocall">Videollamada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-colombian-blue hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Consulta
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    * Campos obligatorios. Tu información está protegida y no será compartida con terceros.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="bg-colombian-blue/10 p-3 rounded-full">
                          <info.icon className="w-5 h-5 text-colombian-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{info.title}</h3>
                          <p className="text-gray-700">{info.details}</p>
                          <p className="text-sm text-gray-500">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* About Jennifer */}
              <Card className="bg-gradient-to-br from-colombian-blue to-colombian-red text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Jennifer Mendoza</CardTitle>
                  <CardDescription className="text-blue-100">
                    Especialista en Migración Colombia-España
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">JM</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-100">✓ Más de 5 años de experiencia</p>
                      <p className="text-blue-100">✓ 500+ familias asesoradas</p>
                      <p className="text-blue-100">✓ 95% tasa de éxito</p>
                      <p className="text-blue-100">✓ Especializada en procesos Colombia-España</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">¿La consulta inicial es realmente gratuita?</h4>
                      <p className="text-sm text-gray-600">Sí, ofrecemos 30 minutos de consulta gratuita para evaluar tu caso.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">¿Cuánto tiempo tarda el proceso?</h4>
                      <p className="text-sm text-gray-600">Depende del tipo de visa, pero generalmente entre 2-6 meses.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">¿Ofrecen servicios presenciales?</h4>
                      <p className="text-sm text-gray-600">Sí, tenemos oficina en Madrid para citas presenciales.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}