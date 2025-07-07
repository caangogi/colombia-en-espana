import { NextRequest, NextResponse } from 'next/server'
import { AdvertisementService, UserProfileService } from '@/lib/firestore-services'
import { CreateAdvertisement } from '@/lib/firestore-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, creditsUsed, subscriptionPlan, ...adData } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!adData.title || !adData.description || !adData.ctaText || !adData.ctaUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, ctaText, ctaUrl' },
        { status: 400 }
      )
    }

    // Get user profile to check credits
    const userProfile = await UserProfileService.getUserProfile(userId)
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user has enough credits
    if (userProfile.credits < creditsUsed) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    // Create the advertisement data
    const advertisementData: CreateAdvertisement = {
      businessId: '', // Will be set after creating business if needed
      userId,
      title: adData.title,
      description: adData.description,
      ctaText: adData.ctaText,
      ctaUrl: adData.ctaUrl,
      adType: adData.adType || 'text',
      imageUrl: adData.imageUrl || undefined,
      videoUrl: adData.videoUrl || undefined,
      images: adData.images || [],
      targetAudience: adData.targetAudience || [],
      placementType: adData.placementType || 'card',
      categories: adData.categories || [],
      bidAmount: adData.budget || 0,
      budget: adData.budget || undefined,
      dailyBudget: adData.dailyBudget || undefined,
      creditsUsed,
      startDate: adData.startDate ? new Date(adData.startDate) : undefined,
      endDate: adData.endDate ? new Date(adData.endDate) : undefined,
      subscriptionPlan: subscriptionPlan || 'basic',
      status: 'pending' // Pending approval
    }

    // Create the advertisement
    const advertisement = await AdvertisementService.createAdvertisement(advertisementData)

    // Deduct credits from user profile
    await UserProfileService.updateUserProfile(userId, {
      credits: userProfile.credits - creditsUsed
    })

    return NextResponse.json({
      success: true,
      advertisement,
      message: 'Advertisement created successfully and sent for approval'
    })

  } catch (error) {
    console.error('Error creating advertisement:', error)
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get all advertisements for the user
    const advertisements = await AdvertisementService.getAdvertisementsByUserId(userId)

    return NextResponse.json({
      success: true,
      advertisements
    })

  } catch (error) {
    console.error('Error fetching advertisements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    )
  }
}