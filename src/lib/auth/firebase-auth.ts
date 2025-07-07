import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { adminAuth } from '../firebase-admin'
import { UserProfileService } from '../firestore-service'
import { UserProfile } from '../firestore-schemas'

export interface AuthResult {
  success: boolean
  user?: {
    uid: string
    email?: string
    displayName?: string
  }
  userProfile?: UserProfile
  error?: string
}

/**
 * Get user from Firebase token in Authorization header
 * Validates the token and returns user info with profile
 */
export async function getUserFromFirebaseToken(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Missing or invalid authorization header'
      }
    }

    const token = authHeader.replace('Bearer ', '')
    
    try {
      // Verify the token with Firebase Admin
      const decodedToken = await adminAuth.verifyIdToken(token)
      
      // Get user profile from Firestore
      const userProfile = await UserProfileService.getUserProfile(decodedToken.uid)
      
      if (!userProfile) {
        return {
          success: false,
          error: 'User profile not found'
        }
      }

      return {
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name
        },
        userProfile
      }
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError)
      return {
        success: false,
        error: 'Invalid or expired token'
      }
    }
  } catch (error) {
    console.error('Error in getUserFromFirebaseToken:', error)
    return {
      success: false,
      error: 'Internal authentication error'
    }
  }
}

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
 * Get user from Firebase token in Server Component context
 * Uses Next.js headers() function for server-side authentication
 */
export async function getUserFromHeaders(): Promise<AuthResult> {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Missing or invalid authorization header'
      }
    }

    const token = authHeader.replace('Bearer ', '')
    
    try {
      // Verify the token with Firebase Admin
      const decodedToken = await adminAuth.verifyIdToken(token)
      
      // Get user profile from Firestore
      const userProfile = await UserProfileService.getUserProfile(decodedToken.uid)
      
      if (!userProfile) {
        return {
          success: false,
          error: 'User profile not found'
        }
      }

      return {
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name
        },
        userProfile
      }
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError)
      return {
        success: false,
        error: 'Invalid or expired token'
      }
    }
  } catch (error) {
    console.error('Error in getUserFromHeaders:', error)
    return {
      success: false,
      error: 'Internal authentication error'
    }
  }
}

/**
 * Middleware helper to require authentication (for API routes)
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authResult = await getUserFromFirebaseToken(request)
  
  if (!authResult.success) {
    return authResult
  }
  
  return authResult
}

/**
 * Server Component helper to require authentication
 */
export async function requireServerAuth(): Promise<{ user: { uid: string; email?: string; displayName?: string }, userProfile: UserProfile }> {
  const authResult = await getUserFromHeaders()
  
  if (!authResult.success || !authResult.user || !authResult.userProfile) {
    throw new Error(authResult.error || 'Authentication failed')
  }
  
  return {
    user: authResult.user,
    userProfile: authResult.userProfile
  }
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