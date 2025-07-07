import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/firebase-auth'
import { UserProfileService, BusinessListingService, AdvertisementService, BlogPostService, ContactSubmissionService } from '@/lib/firestore-service'

export async function GET(request: NextRequest) {
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
    
    // Get all data for statistics from Firestore
    const [blogPosts, allUsers, contactSubmissions, businessListings, advertisements] = await Promise.all([
      BlogPostService.getAllBlogPosts(),
      UserProfileService.getAllUsers(),
      ContactSubmissionService.getAllContactSubmissions(),
      BusinessListingService.getAllBusinessListings(),
      AdvertisementService.getAllAdvertisements()
    ])
    
    // Calculate blog post statistics by status
    const blogStats = {
      total: blogPosts.length,
      published: blogPosts.filter(post => post.status === 'published').length,
      draft: blogPosts.filter(post => post.status === 'draft').length,
      archived: blogPosts.filter(post => post.status === 'archived').length
    }
    
    // Calculate blog post statistics by category
    const categoryStats = blogPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Calculate user statistics by role
    const userStats = {
      total: allUsers.length,
      admin: allUsers.filter(user => user.role === 'admin').length,
      anunciante: allUsers.filter(user => user.role === 'anunciante').length,
      guest: allUsers.filter(user => user.role === 'guest').length
    }
    
    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentActivity = {
      newBlogPosts: blogPosts.filter(post => 
        post.createdAt && new Date(post.createdAt) > thirtyDaysAgo
      ).length,
      newUsers: allUsers.filter(user => 
        user.createdAt && new Date(user.createdAt) > thirtyDaysAgo
      ).length,
      newContactSubmissions: contactSubmissions.filter(submission => 
        submission.createdAt && new Date(submission.createdAt) > thirtyDaysAgo
      ).length,
      newBusinessListings: businessListings.filter(business => 
        business.createdAt && new Date(business.createdAt) > thirtyDaysAgo
      ).length,
      newAdvertisements: advertisements.filter(ad => 
        ad.createdAt && new Date(ad.createdAt) > thirtyDaysAgo
      ).length
    }
    
    const stats = {
      overview: {
        totalBlogPosts: blogPosts.length,
        totalUsers: allUsers.length,
        totalContactSubmissions: contactSubmissions.length,
        totalBusinessListings: businessListings.length,
        totalAdvertisements: advertisements.length
      },
      blogStats,
      categoryStats,
      userStats,
      recentActivity,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
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