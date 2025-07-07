import { NextRequest } from 'next/server'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  handleApiError,
  parseJsonBody,
  validationError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'
import { insertContactSubmissionSchema } from '@/shared/schema'

export async function GET(request: NextRequest) {
  try {
    // For security, contact submissions should only be accessible by admins
    // This endpoint returns empty array for public access
    // Admin access should be handled by /api/admin/contact-submissions
    return successResponse([])
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody(request)
    
    // Validate input
    const validation = insertContactSubmissionSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.message)
    }
    
    // Create contact submission
    const submission = await storage.createContactSubmission(validation.data)
    
    return successResponse(
      { 
        id: submission.id,
        message: 'Contact submission received successfully' 
      }, 
      'Contact form submitted successfully'
    )
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