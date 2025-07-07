import { NextRequest } from 'next/server'
import { getUserFromRequest, isAdmin } from '@/lib/auth/replit-auth'
import { aiService } from '@/lib/ai-service'
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

const improvementSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  type: z.enum(['structure', 'seo', 'readability', 'comprehensive']).optional().default('comprehensive')
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
    const validation = improvementSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    const { content, type } = validation.data
    
    // Generate content structure and improvements
    const structure = await aiService.generateContentStructure(content)
    
    // Generate improvement suggestions based on type
    let improvements = {}
    
    if (type === 'comprehensive' || type === 'seo') {
      improvements = {
        ...improvements,
        seo: {
          title: 'SEO optimizations needed',
          suggestions: [
            'Add more specific keywords related to Colombian migration',
            'Include location-specific terms (Madrid, Barcelona, Valencia)',
            'Use action-oriented headings',
            'Add meta description optimization suggestions'
          ]
        }
      }
    }
    
    if (type === 'comprehensive' || type === 'readability') {
      improvements = {
        ...improvements,
        readability: {
          title: 'Readability improvements',
          suggestions: [
            'Break down long paragraphs into shorter ones',
            'Use more bullet points and numbered lists',
            'Add transitional phrases between sections',
            'Include more examples and real-life scenarios'
          ]
        }
      }
    }
    
    if (type === 'comprehensive' || type === 'structure') {
      improvements = {
        ...improvements,
        structure: structure
      }
    }
    
    return successResponse({
      type,
      improvements,
      generatedAt: new Date().toISOString()
    }, 'Content improvement analysis completed')
    
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