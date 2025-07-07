import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Phone, Mail, Globe, Star, Clock, Filter } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Directorio de Negocios Colombianos | Colombia en España',
  description: 'Descubre negocios y servicios colombianos en España. Directorio completo de empresas, profesionales y servicios para la comunidad colombiana.',
  keywords: ['negocios colombianos España', 'directorio empresas Colombia España', 'servicios colombianos España', 'empresarios colombianos'],
}

const categories = [
  'Todos los Negocios',
  'Restaurantes',
  'Servicios Legales',
  'Inmobiliarias',
  'Consultoría',
  'Salud y Belleza',
  'Educación',
  'Tecnología',
  'Comercio',
  'Servicios Financieros'
]

const cities = [
  'Todas las Ciudades',
  'Madrid',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Bilbao',
  'Málaga',
  'Zaragoza'
]

const businesses = [
  {
    id: 1,
    name: 'Mendoza & Asociados',
    category: 'Servicios Legales',
    city: 'Madrid',
    description: 'Especialistas en derecho migratorio y asesoría legal para colombianos en España.',
    address: 'Calle Gran Vía 45, Madrid',
    phone: '+34 XXX XXX XXX',
    email: 'info@mendozaasociados.es',
    website: 'www.mendozaasociados.es',
    rating: 4.9,
    reviews: 127,
    hours: 'Lun-Vie: 9:00-18:00',
    languages: ['Español', 'Inglés'],
    services: ['Visa de Trabajo', 'Reagrupación Familiar', 'NIE', 'Nacionalidad'],
    featured: true,
    logo: '⚖️'
  },
  {
    id: 2,
    name: 'Inmobiliaria Bogotá España',
    category: 'Inmobiliarias',
    city: 'Madrid',
    description: 'Tu hogar en España comienza aquí. Especialistas en vivienda para colombianos.',
    address: 'Avenida de América 123, Madrid',
    phone: '+34 XXX XXX XXX',
    email: 'contacto@bogotaespana.com',
    website: 'www.bogotaespana.com',
    rating: 4.7,
    reviews: 89,
    hours: 'Lun-Sáb: 10:00-19:00',
    languages: ['Español'],
    services: ['Alquiler', 'Compra-Venta', 'Asesoría Legal', 'Financiación'],
    featured: false,
    logo: '🏠'
  },
  {
    id: 3,
    name: 'TechCaribe Solutions',
    category: 'Tecnología',
    city: 'Barcelona',
    description: 'Desarrollo de software y soluciones tecnológicas con sabor colombiano.',
    address: 'Passeig de Gràcia 88, Barcelona',
    phone: '+34 XXX XXX XXX',
    email: 'hola@techcaribe.es',
    website: 'www.techcaribe.es',
    rating: 4.8,
    reviews: 56,
    hours: 'Lun-Vie: 9:00-17:00',
    languages: ['Español', 'Inglés', 'Catalán'],
    services: ['Desarrollo Web', 'Apps Móviles', 'Consultoría IT', 'Marketing Digital'],
    featured: false,
    logo: '💻'
  },
  {
    id: 4,
    name: 'Restaurante Paisa Gourmet',
    category: 'Restaurantes',
    city: 'Valencia',
    description: 'Auténtica comida antioqueña en el corazón de Valencia.',
    address: 'Calle Colón 45, Valencia',
    phone: '+34 XXX XXX XXX',
    email: 'reservas@paisagourmet.es',
    website: 'www.paisagourmet.es',
    rating: 4.6,
    reviews: 234,
    hours: 'Mar-Dom: 13:00-23:00',
    languages: ['Español'],
    services: ['Comida para Llevar', 'Delivery', 'Eventos', 'Catering'],
    featured: false,
    logo: '🍽️'
  },
  {
    id: 5,
    name: 'Consultora Medellín Business',
    category: 'Consultoría',
    city: 'Barcelona',
    description: 'Consultoría empresarial especializada en expansión de negocios Colombia-España.',
    address: 'Rambla Catalunya 67, Barcelona',
    phone: '+34 XXX XXX XXX',
    email: 'info@medellinbusiness.es',
    website: 'www.medellinbusiness.es',
    rating: 4.9,
    reviews: 78,
    hours: 'Lun-Vie: 8:30-18:30',
    languages: ['Español', 'Inglés', 'Portugués'],
    services: ['Plan de Negocios', 'Expansión Internacional', 'Financiación', 'Marketing'],
    featured: true,
    logo: '📊'
  },
  {
    id: 6,
    name: 'Centro Médico Cartagena',
    category: 'Salud y Belleza',
    city: 'Madrid',
    description: 'Atención médica integral con profesionales colombianos en España.',
    address: 'Calle Serrano 156, Madrid',
    phone: '+34 XXX XXX XXX',
    email: 'citas@centrocartagena.es',
    website: 'www.centrocartagena.es',
    rating: 4.8,
    reviews: 145,
    hours: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
    languages: ['Español', 'Inglés'],
    services: ['Medicina General', 'Especialidades', 'Odontología', 'Estética'],
    featured: false,
    logo: '🏥'
  }
]

export default function NegociosPage() {
  const featuredBusinesses = businesses.filter(business => business.featured)
  const regularBusinesses = businesses.filter(business => !business.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-colombian-blue to-colombian-red text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Directorio de Negocios Colombianos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Conecta con empresarios y profesionales colombianos en España
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-100">Más de</div>
                <div className="text-2xl font-bold">200 negocios</div>
                <div className="text-sm text-blue-100">registrados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-100">En</div>
                <div className="text-2xl font-bold">15 ciudades</div>
                <div className="text-sm text-blue-100">de España</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar negocios..." 
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city, index) => (
                    <SelectItem key={index} value={city.toLowerCase().replace(/\s+/g, '-')}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-colombian-blue hover:bg-blue-700">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Negocios Destacados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredBusinesses.map((business) => (
                <Card key={business.id} className="overflow-hidden shadow-lg border-l-4 border-l-colombian-yellow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{business.logo}</div>
                        <div>
                          <CardTitle className="text-xl">{business.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-colombian-blue text-white text-xs">
                              {business.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {business.city}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Destacado
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">{business.rating}</span>
                        <span className="text-xs text-gray-500">({business.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{business.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {business.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {business.hours}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {business.phone}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Servicios:</h4>
                      <div className="flex flex-wrap gap-1">
                        {business.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-colombian-blue hover:bg-blue-700">
                        <Phone className="w-4 h-4 mr-1" />
                        Llamar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Globe className="w-4 h-4 mr-1" />
                        Web
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Businesses */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Todos los Negocios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBusinesses.map((business) => (
              <Card key={business.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-2xl">{business.logo}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{business.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {business.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{business.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{business.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {business.address}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {business.hours}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {business.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {business.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{business.services.length - 2} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="w-3 h-3 mr-1" />
                      Contactar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Globe className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-colombian-blue to-colombian-red text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un Negocio?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a nuestro directorio y conecta con la comunidad colombiana en España
          </p>
          <Button size="lg" className="bg-white text-colombian-blue hover:bg-gray-100" asChild>
            <Link href="/contacto">
              Registrar mi Negocio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}