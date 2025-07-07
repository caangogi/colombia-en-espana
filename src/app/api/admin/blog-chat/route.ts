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

const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1, 'Message content cannot be empty')
  })).min(1, 'At least one message is required')
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
    const validation = chatMessageSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    const { messages } = validation.data
    
    // Process chat with AI
    const aiResponse = await aiService.chatWithAI(messages)
    
    return successResponse({
      response: aiResponse,
      timestamp: new Date().toISOString()
    }, 'Chat processed successfully')
    
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