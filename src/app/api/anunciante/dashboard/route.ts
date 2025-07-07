import { NextRequest, NextResponse } from 'next/server'
import { requireAnuncianteOrAdmin } from '@/lib/auth-utils'
import { BusinessListingService, AdvertisementService } from '@/lib/firestore-service'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAnuncianteOrAdmin(request)
    
    if (!authResult.success || !authResult.user || !authResult.userProfile) {
      return NextResponse.json({ 
        error: authResult.error || 'Unauthorized' 
      }, { 
        status: authResult.error?.includes('permissions') ? 403 : 401 
      })
    }
    
    const { user: firebaseUser, userProfile } = authResult
    
    // Get user's business data
    const businessListings = await BusinessListingService.getBusinessListingsByUserId(firebaseUser.uid)
    const business = businessListings.length > 0 ? businessListings[0] : null
    
    // Get user's advertisements
    const advertisements = business ? await AdvertisementService.getAdvertisementsByBusinessId(business.id) : []
    
    // Get subscription info (from user profile)
    const subscriptionInfo = {
      plan: userProfile.subscriptionPlan || 'none',
      status: userProfile.subscriptionStatus || 'inactive',
      credits: userProfile.credits || 0,
      monthlyCredits: userProfile.monthlyCredits || 0,
      creditsResetDate: userProfile.creditsResetDate,
      stripeCustomerId: userProfile.stripeCustomerId,
      stripeSubscriptionId: userProfile.stripeSubscriptionId
    }
    
    // Calculate business metrics
    const metrics = {
      totalAds: advertisements.length,
      activeAds: advertisements.filter(ad => ad.status === 'approved').length,
      pendingAds: advertisements.filter(ad => ad.status === 'pending').length,
      pausedAds: advertisements.filter(ad => ad.status === 'paused').length,
      totalCreditsUsed: 0 // Will be implemented with credit system
    }
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentActivity = {
      newAds: advertisements.filter(ad => 
        ad.createdAt && new Date(ad.createdAt) > thirtyDaysAgo
      ).length,
      creditsSpent: 0 // Will be implemented with credit system
    }
    
    const dashboardData = {
      user: {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || userProfile.name || 'Usuario',
        email: firebaseUser.email || userProfile.email,
        role: userProfile.role
      },
      business,
      subscription: subscriptionInfo,
      advertisements,
      metrics,
      recentActivity,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}