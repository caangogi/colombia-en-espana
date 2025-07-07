import { UserProfile } from '../firestore-schemas'

/**
 * Get redirect URL based on user role
 */
export function getRedirectUrl(userProfile: UserProfile | null): string {
  if (!userProfile) {
    return '/login'
  }

  switch (userProfile.role) {
    case 'admin':
      return '/admin'
    case 'anunciante':
      return '/anunciante/dashboard'
    case 'guest':
    default:
      return '/dashboard'
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(userProfile: UserProfile | null, role: UserProfile['role']): boolean {
  return userProfile?.role === role
}

/**
 * Check if user is admin
 */
export function isAdmin(userProfile: UserProfile | null): boolean {
  return userProfile?.role === 'admin'
}

/**
 * Check if user is anunciante
 */
export function isAnunciante(userProfile: UserProfile | null): boolean {
  return userProfile?.role === 'anunciante'
}

/**
 * Check if user is guest
 */
export function isGuest(userProfile: UserProfile | null): boolean {
  return userProfile?.role === 'guest'
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserProfile['role']): string {
  switch (role) {
    case 'admin':
      return 'Administrador'
    case 'anunciante':
      return 'Anunciante'
    case 'guest':
      return 'Usuario'
    default:
      return 'Usuario'
  }
}