import { z } from 'zod'

// Collections definition
export const COLLECTIONS = {
  USER_PROFILES: 'userProfiles',
  BUSINESS_LISTINGS: 'businessListings',
  ADVERTISEMENTS: 'advertisements',
  BLOG_POSTS: 'blogPosts',
  CONTACT_SUBMISSIONS: 'contactSubmissions',
  CLIENT_RECORDS: 'clientRecords', // New collection for service/package clients
} as const

// User Profile Schema
export const userProfileSchema = z.object({
  id: z.string(),
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  role: z.enum(['guest', 'admin', 'anunciante']).default('guest'),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  isActive: z.boolean().default(true),
  preferences: z.record(z.unknown()).optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  subscriptionStatus: z.enum(['active', 'inactive', 'cancelled', 'past_due']).optional(),
  subscriptionPlan: z.enum(['basic', 'premium', 'featured']).optional(),
  credits: z.number().default(0),
})

export type UserProfile = z.infer<typeof userProfileSchema>
export type CreateUserProfile = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>

// Business Listing Schema
export const businessListingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().optional(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  country: z.string().default('España'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  logoUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional(),
  operatingHours: z.record(z.string()).optional(),
  specialOffers: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type BusinessListing = z.infer<typeof businessListingSchema>
export type CreateBusinessListing = Omit<BusinessListing, 'id' | 'createdAt' | 'updatedAt'>

// Advertisement Schema
export const advertisementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  businessId: z.string(),
  type: z.enum(['basic', 'premium', 'featured']),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),
  targetAudience: z.object({
    location: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([]),
    ageRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  }).optional(),
  budget: z.object({
    daily: z.number().optional(),
    total: z.number().optional(),
  }).optional(),
  schedule: z.object({
    startDate: z.date(),
    endDate: z.date().optional(),
    isAlwaysActive: z.boolean().default(false),
  }),
  metrics: z.object({
    views: z.number().default(0),
    clicks: z.number().default(0),
    conversions: z.number().default(0),
  }).default({}),
  status: z.enum(['pending', 'active', 'paused', 'expired', 'rejected']).default('pending'),
  creditsUsed: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Advertisement = z.infer<typeof advertisementSchema>
export type CreateAdvertisement = Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>

// Blog Post Schema
export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  authorId: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  readingTime: z.number().optional(),
  views: z.number().default(0),
  likes: z.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
})

export type BlogPost = z.infer<typeof blogPostSchema>
export type CreateBlogPost = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>

// Contact Submission Schema
export const contactSubmissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  type: z.enum(['general', 'support', 'business', 'partnership']).default('general'),
  status: z.enum(['pending', 'read', 'responded', 'closed']).default('pending'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  assignedTo: z.string().optional(),
  responseNotes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>
export type CreateContactSubmission = Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt'>

// Cliente Schema para servicios/paquetes (sin cuenta de usuario)
export const ClientRecordSchema = z.object({
  id: z.string().optional(),
  // Datos personales
  personalInfo: z.object({
    firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(9, 'Teléfono debe tener al menos 9 dígitos'),
    documentType: z.enum(['passport', 'cedula', 'nie', 'dni']),
    documentNumber: z.string().min(1, 'Número de documento requerido'),
    nationality: z.string().min(2, 'Nacionalidad requerida'),
    birthDate: z.string().optional(),
  }),
  
  // Información de contacto
  contactInfo: z.object({
    address: z.string().min(10, 'Dirección completa requerida'),
    city: z.string().min(2, 'Ciudad requerida'),
    province: z.string().min(2, 'Provincia requerida'),
    postalCode: z.string().min(1, 'Código postal requerido'),
    country: z.string().min(2, 'País requerido'),
    preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
    whatsappNumber: z.string().optional(),
  }),
  
  // Información del servicio/paquete
  serviceInfo: z.object({
    type: z.enum(['package', 'service']),
    packageId: z.string().optional(), // Para paquetes: 'esencial', 'integral', 'bip'
    serviceId: z.string().optional(), // Para servicios individuales
    serviceName: z.string(),
    serviceDescription: z.string().optional(),
    price: z.number().positive('Precio debe ser positivo'),
    currency: z.enum(['EUR', 'USD']),
    urgency: z.enum(['normal', 'urgent', 'express']).optional(),
    additionalNotes: z.string().optional(),
  }),
  
  // Información migratoria (opcional)
  migrationInfo: z.object({
    currentCountry: z.string().optional(),
    plannedArrivalDate: z.string().optional(),
    migrationPurpose: z.enum(['work', 'study', 'family', 'business', 'other']).optional(),
    hasEUCitizenship: z.boolean().optional(),
    previousSpainVisits: z.boolean().optional(),
    spokenLanguages: z.array(z.string()).optional(),
  }).optional(),
  
  // Datos de Stripe (se agregan después del pago)
  stripeData: z.object({
    customerId: z.string(),
    sessionId: z.string(),
    paymentIntentId: z.string(),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
    amountPaid: z.number(),
    currency: z.string(),
    paymentMethod: z.string().optional(),
    receiptUrl: z.string().optional(),
    invoiceUrl: z.string().optional(),
    paymentDate: z.string(), // ISO date string
  }).optional(),
  
  // Metadatos del sistema
  metadata: z.object({
    createdAt: z.string(), // ISO date string
    updatedAt: z.string(), // ISO date string
    source: z.enum(['web', 'mobile', 'admin']).default('web'),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    referralSource: z.string().optional(),
    status: z.enum(['pending', 'processing', 'completed', 'cancelled']).default('pending'),
    assignedAgent: z.string().optional(), // Para asignar a un agente específico
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  }),
})

export type ClientRecord = z.infer<typeof ClientRecordSchema>

// Schema para crear cliente (sin campos opcionales del sistema)
export const CreateClientSchema = ClientRecordSchema.omit({
  id: true,
  stripeData: true,
  metadata: true,
}).extend({
  metadata: z.object({
    source: z.enum(['web', 'mobile', 'admin']).default('web'),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    referralSource: z.string().optional(),
  }).optional(),
})

export type CreateClientData = z.infer<typeof CreateClientSchema>

// Schema para actualizar con datos de Stripe
export const UpdateClientStripeSchema = z.object({
  stripeData: ClientRecordSchema.shape.stripeData,
  metadata: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
    updatedAt: z.string(),
  }),
})

export type UpdateClientStripeData = z.infer<typeof UpdateClientStripeSchema>

// Configuración de servicios y paquetes
export const SERVICE_CONFIG = {
  packages: {
    esencial: {
      id: 'esencial',
      name: 'Paquete Esencial',
      description: 'Servicios básicos para tu llegada a España',
      price: 500,
      currency: 'EUR' as const,
      services: [
        'Asesoría inicial personalizada',
        'Documentación para visado',
        'Guía de homologación de títulos',
        'Orientación laboral básica'
      ]
    },
    integral: {
      id: 'integral',
      name: 'Paquete Integral',
      description: 'Solución completa para tu migración',
      price: 1500,
      currency: 'EUR' as const,
      services: [
        'Todo lo incluido en Esencial',
        'Gestión completa de visado',
        'Homologación de títulos',
        'Búsqueda de empleo asistida',
        'Asesoría fiscal y bancaria',
        'Orientación de vivienda'
      ]
    },
    bip: {
      id: 'bip',
      name: 'Paquete BIP',
      description: 'Experiencia premium con acompañamiento VIP',
      price: 2500,
      currency: 'EUR' as const,
      services: [
        'Todo lo incluido en Integral',
        'Acompañamiento personalizado',
        'Gestor dedicado',
        'Servicios de traducción',
        'Networking profesional',
        'Soporte 24/7 durante 6 meses'
      ]
    }
  },
  
  services: {
    consultoria: {
      id: 'consultoria',
      name: 'Consultoría Migratoria',
      description: 'Asesoría personalizada para tu proceso migratorio',
      price: 150,
      currency: 'EUR' as const,
      duration: '2 horas'
    },
    documentacion: {
      id: 'documentacion',
      name: 'Gestión de Documentación',
      description: 'Preparación y gestión de documentos oficiales',
      price: 250,
      currency: 'EUR' as const,
      duration: '1-2 semanas'
    },
    homologacion: {
      id: 'homologacion',
      name: 'Homologación de Títulos',
      description: 'Proceso completo de homologación de títulos académicos',
      price: 400,
      currency: 'EUR' as const,
      duration: '2-4 meses'
    },
    empleabilidad: {
      id: 'empleabilidad',
      name: 'Orientación Laboral',
      description: 'Búsqueda de empleo y orientación profesional',
      price: 200,
      currency: 'EUR' as const,
      duration: '1 mes'
    },
    fiscal: {
      id: 'fiscal',
      name: 'Asesoría Fiscal',
      description: 'Orientación fiscal y apertura de cuentas bancarias',
      price: 180,
      currency: 'EUR' as const,
      duration: '1 sesión + seguimiento'
    },
    vivienda: {
      id: 'vivienda',
      name: 'Orientación de Vivienda',
      description: 'Búsqueda y gestión de alojamiento en España',
      price: 200,
      currency: 'EUR' as const,
      duration: '2 semanas'
    }
  }
} as const

// Tipos derivados
export type PackageId = keyof typeof SERVICE_CONFIG.packages
export type ServiceId = keyof typeof SERVICE_CONFIG.services
export type PackageInfo = typeof SERVICE_CONFIG.packages[PackageId]
export type ServiceInfo = typeof SERVICE_CONFIG.services[ServiceId]