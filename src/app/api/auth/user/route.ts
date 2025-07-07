import { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/replit-auth'
import { 
  successResponse, 
  unauthorizedResponse,
  handleApiError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    return successResponse(user)
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