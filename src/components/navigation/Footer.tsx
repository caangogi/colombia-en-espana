'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navigation = {
    servicios: [
      { name: 'Paquete Esencial', href: '/paquetes#esencial' },
      { name: 'Paquete Integral', href: '/paquetes#integral' },
      { name: 'Paquete VIP', href: '/paquetes#vip' },
      { name: 'Consulta Gratuita', href: '/contacto' },
    ],
    recursos: [
      { name: 'Blog y Guías', href: '/blog' },
      { name: 'Cultura Española', href: '/cultura' },
      { name: 'Directorio de Negocios', href: '/negocios' },
      { name: 'Testimonios', href: '#testimonios' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '/acerca' },
      { name: 'Jennifer Mendoza', href: '/acerca#jennifer' },
      { name: 'Términos de Servicio', href: '/terminos' },
      { name: 'Política de Privacidad', href: '/privacidad' },
    ],
    tramites: [
      { name: 'NIE y TIE', href: '/blog/categoria/tramites' },
      { name: 'Visas y Residencia', href: '/blog/categoria/visas' },
      { name: 'Búsqueda de Trabajo', href: '/blog/categoria/trabajo' },
      { name: 'Vivienda en España', href: '/blog/categoria/vivienda' },
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/colombiaenespana' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/colombiaenespana' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@colombiaenespana' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/colombiaenespana' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-lg font-bold text-colombian-blue">CE</span>
                </div>
              </div>
              <span className="text-xl font-bold">Colombia en España</span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Tu socio de confianza para hacer realidad el sueño de vivir en España. 
              Más de 500 familias colombianas han confiado en nosotros.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-colombian-blue" />
                <span>Madrid, España</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-colombian-blue" />
                <span>+34 XXX XXX XXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-colombian-blue" />
                <span>info@colombiaenespana.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-colombian-blue" />
                <span>Lun - Vie: 9:00 - 18:00 CET</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-colombian-blue hover:border-colombian-blue hover:text-white"
                  asChild
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-4 h-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-colombian-yellow">Servicios</h3>
              <ul className="space-y-3">
                {navigation.servicios.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-colombian-yellow">Recursos</h3>
              <ul className="space-y-3">
                {navigation.recursos.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-colombian-yellow">Trámites</h3>
              <ul className="space-y-3">
                {navigation.tramites.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-colombian-yellow">Empresa</h3>
              <ul className="space-y-3">
                {navigation.empresa.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-colombian-yellow via-colombian-blue to-colombian-red bg-clip-text text-transparent">
              Mantente Informado
            </h3>
            <p className="text-gray-300 mb-6">
              Recibe las últimas noticias sobre migración, guías actualizadas y ofertas especiales directamente en tu email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Tu email aquí"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-colombian-blue focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-colombian-blue to-colombian-red hover:opacity-90 px-6">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Colombia en España. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        className="fixed bottom-8 right-8 bg-colombian-blue hover:bg-colombian-blue/90 text-white rounded-full w-12 h-12 shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </Button>
    </footer>
  )
}