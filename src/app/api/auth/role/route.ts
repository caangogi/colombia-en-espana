import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/firebase-auth'
import { UserProfileService } from '@/lib/firestore-service'
import { z } from 'zod'

const roleUpdateSchema = z.object({
  userId: z.string(),
  role: z.enum(['guest', 'admin', 'anunciante'])
})

export async function PUT(request: NextRequest) {
  try {
    // Require admin role
    const authResult = await requireRole(request, 'admin')
    
    if (!authResult.success) {
      return NextResponse.json({ 
        error: authResult.error || 'Unauthorized' 
      }, { 
        status: authResult.error?.includes('permissions') ? 403 : 401 
      })
    }
    
    const body = await request.json()
    
    // Validate input
    const validation = roleUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.message 
      }, { 
        status: 400 
      })
    }
    
    const { userId, role } = validation.data
    
    // Get target user
    const targetUser = await UserProfileService.getUserProfile(userId)
    if (!targetUser) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { 
        status: 404 
      })
    }
    
    // Update user role
    await UserProfileService.updateRole(userId, role)
    
    // Get updated user
    const updatedUser = await UserProfileService.getUserProfile(userId)
    
    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role
      }
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}