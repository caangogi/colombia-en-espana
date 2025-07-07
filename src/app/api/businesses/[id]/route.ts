import { NextRequest } from 'next/server'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  notFoundResponse,
  handleApiError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = parseInt(params.id)
    
    if (isNaN(businessId)) {
      return notFoundResponse('Business')
    }
    
    const business = await storage.getBusinessListing(businessId)
    
    if (!business) {
      return notFoundResponse('Business')
    }
    
    // Only return active businesses for public API
    if (business.status !== 'active') {
      return notFoundResponse('Business')
    }
    
    return successResponse(business)
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