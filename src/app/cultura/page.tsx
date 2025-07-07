import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Music, Utensils, Calendar, Users, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cultura Colombiana en España | Colombia en España',
  description: 'Descubre la vibrante cultura colombiana en España. Eventos, restaurantes, música y comunidad para mantener viva la conexión con Colombia.',
  keywords: ['cultura colombiana España', 'colombianos en España', 'eventos Colombia España', 'restaurantes colombianos España'],
}

const musicGenres = [
  {
    name: 'Salsa',
    description: 'El ritmo que une corazones colombianos en España',
    color: 'bg-red-500',
    icon: '💃'
  },
  {
    name: 'Vallenato',
    description: 'Las historias de nuestra tierra en cada acordeón',
    color: 'bg-yellow-500',
    icon: '🎵'
  },
  {
    name: 'Cumbia',
    description: 'La tradición que baila en nuestros corazones',
    color: 'bg-blue-500',
    icon: '🥁'
  },
  {
    name: 'Reggaetón',
    description: 'El ritmo moderno que conquista España',
    color: 'bg-green-500',
    icon: '🎤'
  }
]

const events = [
  {
    title: 'Festival de Independencia Colombia',
    date: '20 de Julio',
    location: 'Madrid - Parque del Retiro',
    description: 'Celebración anual de la independencia colombiana con música, danza y gastronomía típica.',
    type: 'Nacional'
  },
  {
    title: 'Feria de las Flores Madrid',
    date: 'Agosto',
    location: 'Madrid - Plaza Mayor',
    description: 'Recreamos la famosa Feria de las Flores de Medellín en el corazón de Madrid.',
    type: 'Cultural'
  },
  {
    title: 'Noche de Vallenatos',
    date: 'Primer viernes de cada mes',
    location: 'Barcelona - Casa Colombia',
    description: 'Veladas musicales dedicadas al vallenato y la música folclórica colombiana.',
    type: 'Musical'
  },
  {
    title: 'Domingo de Sancocho',
    date: 'Domingos alternos',
    location: 'Valencia - Parque Central',
    description: 'Reuniones comunitarias donde compartimos el sancocho tradicional colombiano.',
    type: 'Gastronómico'
  }
]

const restaurants = [
  {
    name: 'Bogotá Gourmet',
    city: 'Madrid',
    specialty: 'Ajiaco, Bandeja Paisa',
    rating: 4.8,
    address: 'Calle Mayor 45, Madrid',
    description: 'El sabor auténtico de Colombia en el centro de Madrid'
  },
  {
    name: 'Cartagena Sabor',
    city: 'Barcelona',
    specialty: 'Arepas, Ceviche',
    rating: 4.7,
    address: 'Passeig de Gràcia 123, Barcelona',
    description: 'Cocina costeña colombiana en Barcelona'
  },
  {
    name: 'Medellín Express',
    city: 'Valencia',
    specialty: 'Empanadas, Churros',
    rating: 4.6,
    address: 'Calle Colón 78, Valencia',
    description: 'Comida rápida colombiana con calidad gourmet'
  },
  {
    name: 'Cali Rumba',
    city: 'Sevilla',
    specialty: 'Sancocho, Tamales',
    rating: 4.9,
    address: 'Calle Sierpes 234, Sevilla',
    description: 'Donde la salsa y el sabor se encuentran'
  }
]

const communities = [
  {
    city: 'Madrid',
    members: '15,000+',
    description: 'La comunidad colombiana más grande de España',
    activities: ['Grupos de WhatsApp', 'Eventos mensuales', 'Red profesional'],
    contact: 'madrid@comunidadcolombianaes.com'
  },
  {
    city: 'Barcelona',
    members: '8,500+',
    description: 'Comunidad activa con enfoque cultural y profesional',
    activities: ['Clases de baile', 'Networking', 'Actividades familiares'],
    contact: 'barcelona@comunidadcolombianaes.com'
  },
  {
    city: 'Valencia',
    members: '4,200+',
    description: 'Grupo unido que preserva nuestras tradiciones',
    activities: ['Cenas comunitarias', 'Deportes', 'Apoyo mutuo'],
    contact: 'valencia@comunidadcolombianaes.com'
  }
]

export default function CulturaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cultura Colombiana en España
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Mantén viva la conexión con nuestra hermosa Colombia
            </p>
            <div className="flex justify-center items-center gap-2 text-6xl">
              <span>🇨🇴</span>
              <span className="text-4xl">❤️</span>
              <span>🇪🇸</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Music Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Música</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los ritmos que nos conectan con el alma colombiana
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {musicGenres.map((genre, index) => (
              <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-16 ${genre.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {genre.icon}
                  </div>
                  <CardTitle className="text-xl">{genre.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{genre.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Eventos Culturales</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebraciones que mantienen viva nuestra identidad
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-colombian-blue text-white">
                      {event.type}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {event.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Restaurants Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sabores de Colombia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Restaurantes donde encontrarás el auténtico sabor de casa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{restaurant.city}</Badge>
                    <div className="flex items-center text-yellow-500">
                      <span className="text-sm font-semibold">{restaurant.rating}</span>
                      <span className="ml-1">⭐</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {restaurant.specialty}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-2">{restaurant.description}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {restaurant.address}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Communities Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comunidades Colombianas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecta con otros colombianos en las principales ciudades de España
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {communities.map((community, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="w-5 h-5 text-colombian-blue" />
                    {community.city}
                  </CardTitle>
                  <CardDescription>
                    <span className="font-semibold text-lg text-colombian-red">{community.members}</span> miembros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{community.description}</p>
                  <div className="space-y-2 mb-4">
                    {community.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-colombian-yellow rounded-full mr-2"></span>
                        {activity}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Contactar Comunidad
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-colombian-blue to-colombian-red text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">¿Quieres Conectar con la Comunidad?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Te ayudamos a integrarte en la vibrante comunidad colombiana en España
          </p>
          <Button size="lg" className="bg-white text-colombian-blue hover:bg-gray-100" asChild>
            <Link href="/contacto">
              Más Información
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}