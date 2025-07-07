import { NextRequest } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth/replit-auth'
import { aiService } from '@/lib/ai-service'
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
import { z } from 'zod'

const blogGenerationSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  tone: z.enum(['formal', 'friendly', 'informative']),
  length: z.enum(['short', 'medium', 'long']),
  autoSave: z.boolean().optional().default(false)
})

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
    const validation = blogGenerationSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    const { autoSave, ...generationRequest } = validation.data
    
    // Generate blog content using AI
    const generatedContent = await aiService.generateBlogContent(generationRequest)
    
    let savedPost = null
    
    // Auto-save to database if requested
    if (autoSave) {
      savedPost = await storage.createBlogPost({
        title: generatedContent.title,
        slug: generatedContent.slug,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        category: generatedContent.category,
        status: 'borrador', // Always start as draft
        imageUrl: generatedContent.imageUrl || null,
        contentStructure: null,
        styling: null
      })
    }
    
    return successResponse({
      generated: generatedContent,
      saved: savedPost,
      autoSaved: autoSave
    }, 'Blog content generated successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Handle unsupported methods
export async function GET() {
  return methodNotAllowedResponse(['POST'])
}

export async function PUT() {
  return methodNotAllowedResponse(['POST'])
}

export async function DELETE() {
  return methodNotAllowedResponse(['POST'])
}

export async function PATCH() {
  return methodNotAllowedResponse(['POST'])
}