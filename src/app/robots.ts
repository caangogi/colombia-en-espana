import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/anunciante-dashboard/',
          '/anunciante/',
          '/api/',
          '/_next/',
          '/private/',
          '/.well-known/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/anunciante-dashboard/', 
          '/anunciante/',
          '/api/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://colombiaenespana.com/sitemap.xml',
    host: 'https://colombiaenespana.com',
  }
}