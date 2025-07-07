import { NextRequest } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth/replit-auth'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAdmin(user)) {
      return forbiddenResponse()
    }
    
    const submissions = await storage.getContactSubmissions()
    
    return successResponse(submissions)
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