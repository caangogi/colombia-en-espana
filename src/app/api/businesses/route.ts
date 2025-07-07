import { NextRequest } from 'next/server'
import { storage } from '@/lib/storage'
import { 
  successResponse, 
  handleApiError,
  methodNotAllowedResponse 
} from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const province = searchParams.get('province')
    const search = searchParams.get('search')
    
    let businesses = await storage.getBusinessListings()
    
    // Filter by category if provided
    if (category && category !== 'all') {
      businesses = businesses.filter(business => business.category === category)
    }
    
    // Filter by province if provided
    if (province && province !== 'all') {
      businesses = businesses.filter(business => business.province === province)
    }
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase()
      businesses = businesses.filter(business => 
        business.businessName.toLowerCase().includes(searchLower) ||
        business.description?.toLowerCase().includes(searchLower)
      )
    }
    
    // Only return active businesses for public API
    const activeBusinesses = businesses.filter(business => 
      business.status === 'active'
    )
    
    return successResponse(activeBusinesses)
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