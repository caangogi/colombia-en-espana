import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, getUserFromRequest, isAuthenticated, isAdmin, isAnunciante } from '@/lib/auth/replit-auth'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Create standardized API responses
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  return {
    success,
    ...(data !== undefined && { data }),
    ...(error && { error }),
    ...(message && { message }),
  }
}

// Success response helper
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json(createApiResponse(true, data, undefined, message))
}

// Error response helper
export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json(createApiResponse(false, undefined, error), { status })
}

// Validation error response
export function validationError(message: string) {
  return errorResponse(`Validation error: ${message}`, 400)
}

// Unauthorized response
export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401)
}

// Forbidden response
export function forbiddenResponse() {
  return errorResponse('Forbidden', 403)
}

// Not found response
export function notFoundResponse(resource: string = 'Resource') {
  return errorResponse(`${resource} not found`, 404)
}

// Internal server error response
export function serverErrorResponse(message: string = 'Internal server error') {
  return errorResponse(message, 500)
}

// Method not allowed response
export function methodNotAllowedResponse(allowedMethods: string[] = []) {
  const response = errorResponse('Method not allowed', 405)
  if (allowedMethods.length > 0) {
    response.headers.set('Allow', allowedMethods.join(', '))
  }
  return response
}

// Authentication middleware for API routes
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }

    return await handler(request, user)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return serverErrorResponse('Authentication failed')
  }
}

// Admin-only middleware
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (user.role !== 'admin') {
      return forbiddenResponse()
    }
    return await handler(req, user)
  })
}

// Anunciante-only middleware
export async function withAnuncianteAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (user.role !== 'anunciante' && user.role !== 'admin') {
      return forbiddenResponse()
    }
    return await handler(req, user)
  })
}

// Parse JSON body with error handling
export async function parseJsonBody(request: NextRequest) {
  try {
    return await request.json()
  } catch (error) {
    throw new Error('Invalid JSON body')
  }
}

// Validate required fields
export function validateRequiredFields(body: any, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => !body[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
}

// Handle API errors consistently
export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return errorResponse(error.message)
  }
  
  return serverErrorResponse()
}

// CORS headers for API routes
export function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Handle OPTIONS requests for CORS
export function handleOptions() {
  const response = new NextResponse(null, { status: 200 })
  return addCorsHeaders(response)
}

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map()

export function rateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000) {
  const now = Date.now()
  const userRequests = rateLimitMap.get(identifier) || { count: 0, resetTime: now + windowMs }
  
  if (now > userRequests.resetTime) {
    userRequests.count = 1
    userRequests.resetTime = now + windowMs
  } else {
    userRequests.count++
  }
  
  rateLimitMap.set(identifier, userRequests)
  
  if (userRequests.count > maxRequests) {
    throw new Error('Rate limit exceeded')
  }
}