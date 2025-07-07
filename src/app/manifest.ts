import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Colombia en España - Tu guía migratoria',
    short_name: 'Colombia en España',
    description: 'Plataforma integral de apoyo para colombianos que migran a España',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FFD100',
    icons: [
      {
        src: '/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['migration', 'community', 'services'],
    lang: 'es',
    scope: '/',
    orientation: 'portrait-primary',
  }
}