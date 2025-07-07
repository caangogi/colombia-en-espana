import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  UserProfile, 
  BusinessListing, 
  Advertisement,
  BlogPost,
  ContactSubmission,
  CreateUserProfile,
  CreateBusinessListing,
  CreateAdvertisement,
  CreateBlogPost,
  CreateContactSubmission,
  COLLECTIONS,
  userProfileSchema,
  businessListingSchema,
  advertisementSchema,
  blogPostSchema,
  contactSubmissionSchema
} from './firestore-schemas'

// Helper function to convert Firestore timestamps to dates
const convertTimestamps = (data: any) => {
  const converted = { ...data }
  for (const key in converted) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate()
    }
  }
  return converted
}

// Helper function to generate unique IDs
const generateId = () => doc(collection(db, 'temp')).id

// User Profile Service
export class UserProfileService {
  static async createProfile(userId: string, profileData: CreateUserProfile): Promise<UserProfile> {
    try {
      const now = new Date()
      const profile: UserProfile = {
        id: userId,
        ...profileData,
        createdAt: now,
        updatedAt: now,
      }

      // Validate the profile data
      const validatedProfile = userProfileSchema.parse(profile)
      
      // Prepare document data without serverTimestamp for better reliability
      const docData = {
        ...validatedProfile,
        createdAt: now,
        updatedAt: now,
      }

      console.log('📝 Creating user profile:', { userId, email: profileData.email, role: profileData.role })
      
      await setDoc(doc(db, COLLECTIONS.USERS, userId), docData)
      
      console.log('✅ User profile created successfully')
      return validatedProfile
    } catch (error) {
      console.error('❌ Error creating user profile:', error)
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('offline')) {
          throw new Error('No hay conexión a internet. Intenta nuevamente.')
        }
        if (error.message.includes('permission')) {
          throw new Error('Permisos insuficientes. Verifica la configuración de Firebase.')
        }
        if (error.message.includes('quota')) {
          throw new Error('Límite de Firebase alcanzado. Contacta al administrador.')
        }
      }
      
      throw new Error('Error al crear el perfil. Intenta nuevamente.')
    }
  }

  // Alias for backward compatibility
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getProfile(userId)
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('🔍 Getting user profile for:', userId)
      
      const docRef = doc(db, COLLECTIONS.USERS, userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = convertTimestamps(docSnap.data())
        const profile = userProfileSchema.parse({ id: docSnap.id, ...data })
        console.log('✅ Profile found:', { id: profile.id, email: profile.email, role: profile.role })
        return profile
      }
      
      console.log('📭 No profile found for user:', userId)
      return null
    } catch (error) {
      console.error('❌ Error getting user profile:', error)
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('offline')) {
          throw new Error('No hay conexión a internet. Intenta nuevamente.')
        }
        if (error.message.includes('permission')) {
          throw new Error('Permisos insuficientes para leer el perfil.')
        }
      }
      
      throw new Error('Error al obtener el perfil de usuario.')
    }
  }

  // Alias for backward compatibility
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    return this.updateProfile(userId, updates)
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  }

  static async updateRole(userId: string, role: UserProfile['role']): Promise<void> {
    try {
      await this.updateProfile(userId, { role })
    } catch (error) {
      console.error('Error updating user role:', error)
      throw new Error('Failed to update user role')
    }
  }

  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.updateProfile(userId, { lastLoginAt: new Date() })
    } catch (error) {
      console.error('Error updating last login:', error)
      // Don't throw error for last login update failures
    }
  }

  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return userProfileSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting all users:', error)
      throw new Error('Failed to get users')
    }
  }

  static async getUsersByRole(role: UserProfile['role']): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS), 
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return userProfileSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting users by role:', error)
      throw new Error('Failed to get users by role')
    }
  }
}

// Business Listing Service
export class BusinessListingService {
  static async createListing(userId: string, listingData: CreateBusinessListing): Promise<BusinessListing> {
    try {
      const id = generateId()
      const now = new Date()
      
      const listing: BusinessListing = {
        id,
        userId,
        businessName: listingData.businessName,
        description: listingData.description,
        category: listingData.category,
        subcategory: listingData.subcategory,
        email: listingData.email,
        phone: listingData.phone,
        website: listingData.website,
        address: listingData.address,
        city: listingData.city,
        postalCode: listingData.postalCode,
        province: listingData.province,
        googleMapsUrl: listingData.googleMapsUrl,
        facebook: listingData.facebook,
        instagram: listingData.instagram,
        twitter: listingData.twitter,
        linkedin: listingData.linkedin,
        whatsapp: listingData.whatsapp,
        logoUrl: listingData.logoUrl,
        images: listingData.images || [],
        openingHours: listingData.openingHours,
        specialties: listingData.specialties || [],
        languages: listingData.languages || [],
        ctaText: listingData.ctaText,
        ctaUrl: listingData.ctaUrl,
        specialOffer: listingData.specialOffer,
        isVerified: listingData.isVerified || false,
        isFeatured: listingData.isFeatured || false,
        viewCount: 0,
        clickCount: 0,
        status: listingData.status || 'pending',
        subscriptionPlan: listingData.subscriptionPlan || 'basic',
        subscriptionExpiry: listingData.subscriptionExpiry,
        createdAt: now,
        updatedAt: now,
      }

      const validatedListing = businessListingSchema.parse(listing)
      
      await setDoc(doc(db, COLLECTIONS.BUSINESS_LISTINGS, id), {
        ...validatedListing,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return validatedListing
    } catch (error) {
      console.error('Error creating business listing:', error)
      throw new Error('Failed to create business listing')
    }
  }

  static async getListing(listingId: string): Promise<BusinessListing | null> {
    try {
      const docRef = doc(db, COLLECTIONS.BUSINESS_LISTINGS, listingId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = convertTimestamps(docSnap.data())
        return businessListingSchema.parse({ id: docSnap.id, ...data })
      }
      
      return null
    } catch (error) {
      console.error('Error getting business listing:', error)
      throw new Error('Failed to get business listing')
    }
  }

  // Alias for backward compatibility
  static async getBusinessListingsByUserId(userId: string): Promise<BusinessListing[]> {
    return this.getUserListings(userId)
  }

  static async getUserListings(userId: string): Promise<BusinessListing[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BUSINESS_LISTINGS), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return businessListingSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting user listings:', error)
      throw new Error('Failed to get user listings')
    }
  }

  static async getActiveListings(): Promise<BusinessListing[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BUSINESS_LISTINGS), 
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return businessListingSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting active listings:', error)
      throw new Error('Failed to get active listings')
    }
  }

  static async updateListing(listingId: string, updates: Partial<BusinessListing>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.BUSINESS_LISTINGS, listingId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating business listing:', error)
      throw new Error('Failed to update business listing')
    }
  }

  static async deleteListing(listingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BUSINESS_LISTINGS, listingId))
    } catch (error) {
      console.error('Error deleting business listing:', error)
      throw new Error('Failed to delete business listing')
    }
  }
}

// Contact Submission Service
export class ContactSubmissionService {
  static async submitContact(submissionData: CreateContactSubmission): Promise<ContactSubmission> {
    try {
      const id = generateId()
      const now = new Date()
      
      const submission: ContactSubmission = {
        id,
        ...submissionData,
        createdAt: now,
      }

      const validatedSubmission = contactSubmissionSchema.parse(submission)
      
      await setDoc(doc(db, COLLECTIONS.CONTACT_SUBMISSIONS, id), {
        ...validatedSubmission,
        createdAt: serverTimestamp(),
      })

      return validatedSubmission
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw new Error('Failed to submit contact form')
    }
  }

  static async getSubmissions(): Promise<ContactSubmission[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CONTACT_SUBMISSIONS), 
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return contactSubmissionSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting contact submissions:', error)
      throw new Error('Failed to get contact submissions')
    }
  }

  static async updateSubmissionStatus(
    submissionId: string, 
    status: ContactSubmission['status']
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CONTACT_SUBMISSIONS, submissionId)
      await updateDoc(docRef, { status })
    } catch (error) {
      console.error('Error updating submission status:', error)
      throw new Error('Failed to update submission status')
    }
  }
}

// Blog Post Service (for admin management)
export class BlogPostService {
  static async createPost(postData: CreateBlogPost): Promise<BlogPost> {
    try {
      const id = generateId()
      const now = new Date()
      
      const post: BlogPost = {
        id,
        ...postData,
        createdAt: now,
        updatedAt: now,
      }

      const validatedPost = blogPostSchema.parse(post)
      
      await setDoc(doc(db, COLLECTIONS.BLOG_POSTS, id), {
        ...validatedPost,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return validatedPost
    } catch (error) {
      console.error('Error creating blog post:', error)
      throw new Error('Failed to create blog post')
    }
  }

  static async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BLOG_POSTS), 
        where('status', '==', 'publicado'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return blogPostSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting published posts:', error)
      throw new Error('Failed to get published posts')
    }
  }

  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      const q = query(collection(db, COLLECTIONS.BLOG_POSTS), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return blogPostSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting all posts:', error)
      throw new Error('Failed to get all posts')
    }
  }

  static async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.BLOG_POSTS, postId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw new Error('Failed to update blog post')
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BLOG_POSTS, postId))
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw new Error('Failed to delete blog post')
    }
  }
}

// Advertisement Service
export class AdvertisementService {
  static async createAdvertisement(advertisementData: CreateAdvertisement): Promise<Advertisement> {
    try {
      const id = generateId()
      const now = new Date()
      
      const advertisement: Advertisement = {
        id,
        businessId: advertisementData.businessId,
        userId: advertisementData.userId,
        title: advertisementData.title,
        description: advertisementData.description,
        type: advertisementData.type,
        content: advertisementData.content,
        imageUrls: advertisementData.imageUrls || [],
        videoUrl: advertisementData.videoUrl,
        targetAudience: advertisementData.targetAudience,
        placement: advertisementData.placement,
        startDate: advertisementData.startDate,
        endDate: advertisementData.endDate,
        budget: advertisementData.budget,
        costPerClick: advertisementData.costPerClick,
        maxDailyBudget: advertisementData.maxDailyBudget,
        status: advertisementData.status || 'pending',
        isActive: advertisementData.isActive || true,
        priority: advertisementData.priority || 1,
        metrics: {
          views: 0,
          clicks: 0,
          conversions: 0,
          spent: 0
        },
        createdAt: now,
        updatedAt: now,
      }

      const validatedAdvertisement = advertisementSchema.parse(advertisement)
      
      await setDoc(doc(db, COLLECTIONS.ADVERTISEMENTS, id), {
        ...validatedAdvertisement,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return validatedAdvertisement
    } catch (error) {
      console.error('Error creating advertisement:', error)
      throw new Error('Failed to create advertisement')
    }
  }

  static async getAdvertisement(advertisementId: string): Promise<Advertisement | null> {
    try {
      const docRef = doc(db, COLLECTIONS.ADVERTISEMENTS, advertisementId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = convertTimestamps(docSnap.data())
        return advertisementSchema.parse({ id: docSnap.id, ...data })
      }
      
      return null
    } catch (error) {
      console.error('Error getting advertisement:', error)
      throw new Error('Failed to get advertisement')
    }
  }

  static async getAdvertisementsByBusinessId(businessId: string): Promise<Advertisement[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ADVERTISEMENTS),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return advertisementSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting advertisements by business ID:', error)
      throw new Error('Failed to get advertisements')
    }
  }

  static async getAdvertisementsByUserId(userId: string): Promise<Advertisement[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ADVERTISEMENTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return advertisementSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting advertisements by user ID:', error)
      throw new Error('Failed to get advertisements')
    }
  }

  static async getActiveAdvertisements(): Promise<Advertisement[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ADVERTISEMENTS),
        where('status', '==', 'approved'),
        where('isActive', '==', true),
        orderBy('priority', 'desc'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return advertisementSchema.parse({ id: doc.id, ...data })
      })
    } catch (error) {
      console.error('Error getting active advertisements:', error)
      throw new Error('Failed to get active advertisements')
    }
  }

  static async updateAdvertisement(advertisementId: string, updates: Partial<Advertisement>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.ADVERTISEMENTS, advertisementId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating advertisement:', error)
      throw new Error('Failed to update advertisement')
    }
  }

  static async deleteAdvertisement(advertisementId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ADVERTISEMENTS, advertisementId))
    } catch (error) {
      console.error('Error deleting advertisement:', error)
      throw new Error('Failed to delete advertisement')
    }
  }
}

// Analytics Service
export class AnalyticsService {
  static async trackBusinessView(businessId: string): Promise<void> {
    try {
      const business = await BusinessListingService.getListing(businessId)
      if (business) {
        await BusinessListingService.updateListing(businessId, {
          viewCount: business.viewCount + 1
        })
      }
    } catch (error) {
      console.error('Error tracking business view:', error)
      // Don't throw error for analytics failures
    }
  }

  static async trackBusinessClick(businessId: string): Promise<void> {
    try {
      const business = await BusinessListingService.getListing(businessId)
      if (business) {
        await BusinessListingService.updateListing(businessId, {
          clickCount: business.clickCount + 1
        })
      }
    } catch (error) {
      console.error('Error tracking business click:', error)
      // Don't throw error for analytics failures
    }
  }
}

// Role initialization helper
export const initializeUserWithRole = async (
  userId: string, 
  email: string, 
  role: UserProfile['role'] = 'guest'
): Promise<UserProfile> => {
  try {
    // Check if user already exists
    const existingProfile = await UserProfileService.getProfile(userId)
    
    if (existingProfile) {
      // Update last login and return existing profile
      await UserProfileService.updateLastLogin(userId)
      return existingProfile
    }

    // Create new profile
    const newProfile = await UserProfileService.createProfile(userId, {
      email,
      role,
      credits: role === 'anunciante' ? 100 : 0, // Give initial credits to anunciantes
      monthlyCredits: role === 'anunciante' ? 100 : 0,
    })

    return newProfile
  } catch (error) {
    console.error('Error initializing user with role:', error)
    throw new Error('Failed to initialize user profile')
  }
}