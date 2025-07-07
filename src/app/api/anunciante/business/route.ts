import { NextRequest } from 'next/server'
import { getUserFromRequest, isAnunciante } from '@/lib/auth/replit-auth'
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
import { insertBusinessListingSchema } from '@/shared/schema'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAnunciante(user) && user.role !== 'admin') {
      return forbiddenResponse()
    }
    
    // Get user's business listing
    const business = await storage.getBusinessListingByUserId(user.id)
    
    if (!business) {
      return successResponse(null, 'No business found for user')
    }
    
    return successResponse(business)
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
    
    if (!isAnunciante(user) && user.role !== 'admin') {
      return forbiddenResponse()
    }
    
    // Check if user already has a business
    const existingBusiness = await storage.getBusinessListingByUserId(user.id)
    if (existingBusiness) {
      return validationError('User already has a business listing. Use PUT to update.')
    }
    
    const body = await parseJsonBody(request)
    
    // Validate input
    const validation = insertBusinessListingSchema.safeParse({
      ...body,
      userId: user.id,
      status: 'pending' // New businesses start as pending
    })
    
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    // Create business listing
    const business = await storage.createBusinessListing(validation.data)
    
    return successResponse(business, 'Business listing created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAnunciante(user) && user.role !== 'admin') {
      return forbiddenResponse()
    }
    
    // Get existing business
    const existingBusiness = await storage.getBusinessListingByUserId(user.id)
    if (!existingBusiness) {
      return validationError('No business found for user. Use POST to create.')
    }
    
    const body = await parseJsonBody(request)
    
    // Validate input (exclude userId to prevent changes)
    const validation = insertBusinessListingSchema.omit({ userId: true }).safeParse(body)
    
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    // Update business listing
    const updatedBusiness = await storage.updateBusinessListing(existingBusiness.id, validation.data)
    
    if (!updatedBusiness) {
      return validationError('Failed to update business listing')
    }
    
    return successResponse(updatedBusiness, 'Business listing updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAnunciante(user) && user.role !== 'admin') {
      return forbiddenResponse()
    }
    
    // Get existing business
    const existingBusiness = await storage.getBusinessListingByUserId(user.id)
    if (!existingBusiness) {
      return validationError('No business found for user')
    }
    
    // Delete business listing
    const deleted = await storage.deleteBusinessListing(existingBusiness.id)
    
    if (!deleted) {
      return validationError('Failed to delete business listing')
    }
    
    return successResponse(
      { id: existingBusiness.id }, 
      'Business listing deleted successfully'
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle unsupported methods
export async function PATCH() {
  return methodNotAllowedResponse(['GET', 'POST', 'PUT', 'DELETE'])
}