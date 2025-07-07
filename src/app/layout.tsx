import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/navigation/Header'
import Footer from '@/components/navigation/Footer'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Colombia en España - Servicios de Migración y Asesoría Integral',
  description: 'Expertos en migración para colombianos que desean vivir en España. Asesoría completa para visas, NIE, residencia, trabajo y integración cultural. Más de 500 familias asesoradas exitosamente.',
  keywords: ['migración Colombia España', 'visa España colombianos', 'NIE España', 'residencia España', 'trabajo España', 'asesoría migratoria', 'colombianos en España'],
  authors: [{ name: 'Jennifer Mendoza', url: 'https://colombiaenespana.com' }],
  creator: 'Colombia en España',
  publisher: 'Colombia en España',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://colombiaenespana.com',
    title: 'Colombia en España - Tu Guía de Migración a España',
    description: 'Servicios profesionales de migración para colombianos. Asesoría integral desde trámites hasta integración cultural en España.',
    siteName: 'Colombia en España',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Colombia en España - Servicios de Migración',
    description: 'Tu socio de confianza para migrar a España. Más de 500 familias asesoradas exitosamente.',
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}