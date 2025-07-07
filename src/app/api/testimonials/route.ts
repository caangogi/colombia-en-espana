import { NextRequest } from 'next/server'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  handleApiError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const testimonials = await storage.getTestimonials()
    return successResponse(testimonials)
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle unsupported methods
export async function POST() {
  return methodNotAllowedResponse(['GET'])
}

export async function PUT() {
  return methodNotAllowedResponse(['GET'])
}

export async function DELETE() {
  return methodNotAllowedResponse(['GET'])
}

export async function PATCH() {
  return methodNotAllowedResponse(['GET'])
}