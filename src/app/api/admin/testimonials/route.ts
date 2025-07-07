import { NextRequest } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth/replit-auth'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
  parseJsonBody,
  validationError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'
import { insertTestimonialSchema } from '@/shared/schema'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAdmin(user)) {
      return forbiddenResponse()
    }
    
    const testimonials = await storage.getTestimonials()
    
    return successResponse(testimonials)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAdmin(user)) {
      return forbiddenResponse()
    }
    
    const body = await parseJsonBody(request)
    
    // Validate input
    const validation = insertTestimonialSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    // Create testimonial
    const testimonial = await storage.createTestimonial(validation.data)
    
    return successResponse(testimonial, 'Testimonial created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle unsupported methods
export async function PUT() {
  return methodNotAllowedResponse(['GET', 'POST'])
}

export async function DELETE() {
  return methodNotAllowedResponse(['GET', 'POST'])
}

export async function PATCH() {
  return methodNotAllowedResponse(['GET', 'POST'])
}