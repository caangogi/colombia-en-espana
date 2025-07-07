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
import { insertBlogPostSchema } from '@/shared/schema'

export async function GET(
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
    
    const post = await storage.getBlogPost(postId)
    
    if (!post) {
      return notFoundResponse('Blog post')
    }
    
    return successResponse(post)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
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
    const validation = insertBlogPostSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    // Update blog post
    const updatedPost = await storage.updateBlogPost(postId, validation.data)
    
    if (!updatedPost) {
      return notFoundResponse('Blog post')
    }
    
    return successResponse(updatedPost, 'Blog post updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
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
    
    const deleted = await storage.deleteBlogPost(postId)
    
    if (!deleted) {
      return notFoundResponse('Blog post')
    }
    
    return successResponse(
      { id: postId }, 
      'Blog post deleted successfully'
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle unsupported methods
export async function POST() {
  return methodNotAllowedResponse(['GET', 'PUT', 'DELETE'])
}

export async function PATCH() {
  return methodNotAllowedResponse(['GET', 'PUT', 'DELETE'])
}