import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define API routes that should be handled by the Express server
const API_ROUTES = [
  '/api/',
  '/auth/',
]

// Define static asset routes that should pass through
const STATIC_ROUTES = [
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/images/',
  '/icons/',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let API routes and static assets pass through
  if (
    API_ROUTES.some(route => pathname.startsWith(route)) ||
    STATIC_ROUTES.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next()
  }

  // For now, let all routes pass through while we fix the navigation
  return NextResponse.next()
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes handled by Express)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}