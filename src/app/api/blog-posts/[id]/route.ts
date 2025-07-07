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
    const postId = parseInt(params.id)
    
    if (isNaN(postId)) {
      return notFoundResponse('Blog post')
    }
    
    const post = await storage.getBlogPost(postId)
    
    if (!post) {
      return notFoundResponse('Blog post')
    }
    
    // Only return published posts for public API
    if (post.status !== 'publicado') {
      return notFoundResponse('Blog post')
    }
    
    return successResponse(post)
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