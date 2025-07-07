import { UserProfile } from '@/lib/firestore-schemas'

/**
 * Determines the appropriate redirect URL based on user role
 */
export function getRedirectUrlForRole(role: UserProfile['role'], defaultUrl: string = '/dashboard'): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'anunciante':
      return '/anunciante-dashboard'
    case 'guest':
    default:
      return defaultUrl
  }
}

/**
 * Checks if a route exists based on available pages
 */
export function isValidRoute(route: string): boolean {
  const validRoutes = [
    '/',
    '/dashboard',
    '/admin',
    '/anunciante-dashboard',
    '/blog',
    '/nosotros',
    '/paquetes',
    '/cultura',
    '/contacto',
    '/negocios',
    '/login',
    '/signup'
  ]
  
  return validRoutes.includes(route)
}

/**
 * Gets safe redirect URL, fallback to dashboard if route doesn't exist
 */
export function getSafeRedirectUrl(role: UserProfile['role'], preferredUrl?: string): string {
  if (preferredUrl && isValidRoute(preferredUrl)) {
    return preferredUrl
  }
  
  const roleBasedUrl = getRedirectUrlForRole(role)
  return isValidRoute(roleBasedUrl) ? roleBasedUrl : '/dashboard'
}