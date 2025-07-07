// Re-export from firebase-auth for backward compatibility
export { getUserFromFirebaseToken as getUserFromToken } from './auth/firebase-auth'
export type { AuthResult } from './auth/firebase-auth'

/**
 * Check if user has specific role
 */
export function hasRole(userProfile: UserProfile, role: UserProfile['role']): boolean {
  return userProfile.role === role
}

/**
 * Check if user is admin
 */
export function isAdmin(userProfile: UserProfile): boolean {
  return userProfile.role === 'admin'
}

/**
 * Check if user is anunciante
 */
export function isAnunciante(userProfile: UserProfile): boolean {
  return userProfile.role === 'anunciante'
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authResult = await getUserFromToken(request)
  
  if (!authResult.success) {
    return authResult
  }
  
  return authResult
}

/**
 * Middleware helper to require specific role
 */
export async function requireRole(request: NextRequest, requiredRole: UserProfile['role']): Promise<AuthResult> {
  const authResult = await requireAuth(request)
  
  if (!authResult.success || !authResult.userProfile) {
    return authResult
  }
  
  if (!hasRole(authResult.userProfile, requiredRole) && !isAdmin(authResult.userProfile)) {
    return {
      success: false,
      error: 'Insufficient permissions'
    }
  }
  
  return authResult
}

/**
 * Middleware helper to require anunciante or admin role
 */
export async function requireAnuncianteOrAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await requireAuth(request)
  
  if (!authResult.success || !authResult.userProfile) {
    return authResult
  }
  
  if (!isAnunciante(authResult.userProfile) && !isAdmin(authResult.userProfile)) {
    return {
      success: false,
      error: 'Access restricted to advertisers and administrators'
    }
  }
  
  return authResult
}