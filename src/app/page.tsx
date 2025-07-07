import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import PackageCards from '@/components/home/PackageCards'
import ServicesSection from '@/components/home/ServicesSection'
import ProcessSection from '@/components/home/ProcessSection'
import BlogPreview from '@/components/home/BlogPreview'
import Testimonials from '@/components/home/Testimonials'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Colombia en España",
  "description": "Servicios profesionales de migración para colombianos que desean vivir en España",
  "url": "https://colombiaenespana.com",
  "logo": "https://colombiaenespana.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+34-XXX-XXX-XXX",
    "contactType": "customer service",
    "availableLanguage": ["Spanish", "English"]
  },
  "founder": {
    "@type": "Person",
    "name": "Jennifer Mendoza",
    "jobTitle": "Especialista en Migración"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Spain"
  },
  "serviceType": [
    "Asesoría de Migración",
    "Trámites de Visa",
    "Orientación Laboral",
    "Integración Cultural"
  ]
}

export const metadata: Metadata = {
  title: 'Colombia en España - Servicios de Migración y Asesoría Integral',
  description: 'Expertos en migración para colombianos que desean vivir en España. Asesoría completa para visas, NIE, residencia, trabajo y integración cultural. Más de 500 familias asesoradas exitosamente.',
  keywords: ['migración Colombia España', 'visa España colombianos', 'NIE España', 'residencia España', 'trabajo España', 'asesoría migratoria', 'colombianos en España'],
  openGraph: {
    title: 'Colombia en España - Tu Guía de Migración a España',
    description: 'Servicios profesionales de migración para colombianos. Asesoría integral desde trámites hasta integración cultural en España.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://colombiaenespana.com',
    siteName: 'Colombia en España',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Colombia en España - Servicios de Migración',
    description: 'Tu socio de confianza para migrar a España. Más de 500 familias asesoradas exitosamente.',
  },
}

export default function Home() {
  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />
        
        {/* About Section - Jennifer Mendoza */}
        <AboutSection />
        
        {/* Package/Services Section */}
        <PackageCards />
        
        {/* Individual Services Section */}
        <ServicesSection />
        
        {/* Process Step by Step Section */}
        <ProcessSection />
        
        {/* Blog Preview Section */}
        <BlogPreview />
        
        {/* Testimonials Section */}
        <Testimonials />
      </main>
    </>
  )
}