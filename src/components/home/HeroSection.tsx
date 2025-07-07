'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, MapPin, Users, Clock } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Madrid skyline background with overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Madrid skyline" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Colombian flag colored overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-colombian-yellow/10 via-colombian-blue/10 to-colombian-red/10"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red p-1 drop-shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-colombian-blue">CE</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
          Tu viaje a España <br />
          <span className="text-colombian-yellow">empieza aquí</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-lg">
          Acompañamiento integral para colombianos que sueñan con vivir en España. 
          Desde trámites hasta integración cultural.
        </p>

        {/* Stats badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Users className="w-4 h-4 mr-2" />
            +500 Familias Asesoradas
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <MapPin className="w-4 h-4 mr-2" />
            Presencia en Madrid
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Clock className="w-4 h-4 mr-2" />
            Soporte 24/7
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-colombian-blue to-colombian-red hover:opacity-90 text-white font-semibold px-8 py-4 text-lg"
            asChild
          >
            <Link href="/contacto">
              Consulta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
            asChild
          >
            <Link href="/paquetes">
              Ver Paquetes
            </Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  )
}