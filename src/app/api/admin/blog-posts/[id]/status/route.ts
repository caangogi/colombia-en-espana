import { NextRequest } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth/replit-auth'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
  parseJsonBody,
  validationError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'
import { z } from 'zod'

const statusUpdateSchema = z.object({
  status: z.enum(['borrador', 'publicado', 'archivado', 'revision'])
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAdmin(user)) {
      return forbiddenResponse()
    }
    
    const postId = parseInt(params.id)
    
    if (isNaN(postId)) {
      return notFoundResponse('Blog post')
    }
    
    const body = await parseJsonBody(request)
    
    // Validate input
    const validation = statusUpdateSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    const { status } = validation.data
    
    // Update blog post status
    const updated = await storage.updateBlogPostStatus(postId, status)
    
    if (!updated) {
      return notFoundResponse('Blog post')
    }
    
    return successResponse(
      { 
        id: postId, 
        status: status 
      }, 
      `Blog post status updated to ${status}`
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle unsupported methods
export async function GET() {
  return methodNotAllowedResponse(['PATCH'])
}

export async function POST() {
  return methodNotAllowedResponse(['PATCH'])
}

export async function PUT() {
  return methodNotAllowedResponse(['PATCH'])
}

export async function DELETE() {
  return methodNotAllowedResponse(['PATCH'])
}