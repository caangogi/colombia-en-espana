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
import { insertBlogPostSchema } from '@/shared/schema'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return unauthorizedResponse()
    }
    
    if (!isAdmin(user)) {
      return forbiddenResponse()
    }
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    
    let posts = await storage.getBlogPosts()
    
    // Filter by category if provided
    if (category && category !== 'all') {
      posts = posts.filter(post => post.category === category)
    }
    
    // Filter by status if provided
    if (status && status !== 'all') {
      posts = posts.filter(post => post.status === status)
    }
    
    return successResponse(posts)
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
    const validation = insertBlogPostSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    // Create blog post
    const post = await storage.createBlogPost(validation.data)
    
    return successResponse(post, 'Blog post created successfully')
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