import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(), // Changed from jsonb to text for compatibility
    expire: timestamp("expire").notNull(),
  }
);

// Updated users table for Replit Auth
export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(), // Changed to text for Replit user ID
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("user"), // user, admin, anunciante
  // Stripe integration fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"), // active, inactive, past_due, canceled
  subscriptionPlan: text("subscription_plan"), // basic, premium, featured
  // Credits system
  credits: integer("credits").default(0),
  monthlyCredits: integer("monthly_credits").default(0),
  creditsResetDate: timestamp("credits_reset_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status", { enum: ["borrador", "publicado", "archivado", "revision"] }).default("borrador").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  rating: text("rating").notNull(), // Changed from decimal to text to match usage
  imageUrl: text("image_url").notNull(),
  websiteUrl: text("website_url"),
  address: text("address"),
  category: text("category").notNull().default("restaurant"), // restaurant, food_store, service
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  email: text("email").notNull(),
  packageInterest: text("package_interest"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  keywords: text("keywords").array(),
  imageUrl: text("image_url").notNull(),
  usedInBlogPost: boolean("used_in_blog_post").default(false),
  blogPostId: integer("blog_post_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business listings for anunciantes
export const businessListings = pgTable("business_listings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id
  businessName: text("business_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Restaurant, Legal Services, Real Estate, etc.
  subcategory: text("subcategory"), // Migration, Rental, etc.
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  
  // Address and location
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  province: text("province"),
  googleMapsUrl: text("google_maps_url"),
  
  // Social media
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  linkedin: text("linkedin"),
  whatsapp: text("whatsapp"),
  
  // Business details
  logoUrl: text("logo_url"),
  images: text("images").array().default([]), // Gallery images
  openingHours: json("opening_hours"), // JSON with daily hours
  specialties: text("specialties").array().default([]),
  languages: text("languages").array().default([]),
  
  // Promotion and visibility
  ctaText: text("cta_text"),
  ctaUrl: text("cta_url"),
  specialOffer: text("special_offer"),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  
  // Metrics
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  
  // Status and subscription
  status: text("status", { enum: ["pending", "active", "suspended", "expired"] }).default("pending"),
  subscriptionPlan: text("subscription_plan", { enum: ["basic", "premium", "destacado"] }).default("basic"),
  subscriptionExpiry: timestamp("subscription_expiry"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media files table for storing uploaded images, videos, documents
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  businessId: integer("business_id").references(() => businessListings.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  type: text("type", { enum: ["image", "video", "document", "audio"] }).notNull(),
  category: text("category"), // logo, gallery, document, etc.
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business reviews and ratings
export const businessReviews = pgTable("business_reviews", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businessListings.id),
  reviewerName: text("reviewer_name").notNull(),
  reviewerEmail: text("reviewer_email"),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans and payments
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("EUR"),
  duration: integer("duration_days").notNull(), // Duration in days
  features: text("features").array().default([]),
  maxImages: integer("max_images").default(5),
  isFeatured: boolean("is_featured").default(false),
  priority: integer("priority").default(0), // Higher priority = better placement
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Credit transactions for business subscriptions and advertising
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  advertisementId: integer("advertisement_id").references(() => advertisements.id),
  amount: integer("amount").notNull(), // Credits amount (positive for granted, negative for spent)
  type: text("type", { enum: ["granted", "spent", "refund", "bonus"] }).notNull(),
  source: text("source").notNull(), // subscription, manual, promotion, ad_click, etc.
  description: text("description"),
  subscriptionId: text("subscription_id"), // Stripe subscription ID if applicable
  metadata: json("metadata"), // Additional context (boost_multiplier, time_slot, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// Business subscriptions and payments
export const businessSubscriptions = pgTable("business_subscriptions", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(), // References business_listings.id
  planId: integer("plan_id").notNull(), // References subscription_plans.id
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status", { enum: ["active", "inactive", "canceled", "past_due"] }).default("inactive"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business analytics and tracking
export const businessAnalytics = pgTable("business_analytics", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(), // References business_listings.id
  date: timestamp("date").notNull(),
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  contactClicks: integer("contact_clicks").default(0),
  websiteClicks: integer("website_clicks").default(0),
  socialClicks: integer("social_clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Advertisements - separate model from business listings
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(), // References business_listings.id
  
  // Advertisement content
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  ctaText: text("cta_text").notNull(),
  ctaUrl: text("cta_url").notNull(),
  
  // Targeting and placement
  targetAudience: text("target_audience").array().default([]), // ["colombianos", "estudiantes", "profesionales"]
  placementType: text("placement_type", { 
    enum: ["banner", "card", "featured", "sidebar", "popup"] 
  }).default("card"),
  categories: text("categories").array().default([]), // Where to show the ad
  
  // Bidding and priority
  bidAmount: decimal("bid_amount", { precision: 10, scale: 2 }).default("0.00"), // For auction system
  priority: integer("priority").default(0), // Manual priority override
  budget: decimal("budget", { precision: 10, scale: 2 }), // Total budget
  dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }), // Daily spending limit
  
  // Scheduling
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  
  // Performance metrics
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  spent: decimal("spent", { precision: 10, scale: 2 }).default("0.00"),
  
  // Status and approval
  status: text("status", { 
    enum: ["draft", "pending", "approved", "rejected", "paused", "expired"] 
  }).default("draft"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Replit Auth user schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true,
});

// Business schemas
export const insertBusinessListingSchema = createInsertSchema(businessListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessReviewSchema = createInsertSchema(businessReviews).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessSubscriptionSchema = createInsertSchema(businessSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessAnalyticsSchema = createInsertSchema(businessAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  impressions: true,
  clicks: true,
  conversions: true,
  spent: true,
  createdAt: true,
  updatedAt: true,
});

// Media file schemas
export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;

// Business types
export type InsertBusinessListing = z.infer<typeof insertBusinessListingSchema>;
export type BusinessListing = typeof businessListings.$inferSelect;
export type InsertBusinessReview = z.infer<typeof insertBusinessReviewSchema>;
export type BusinessReview = typeof businessReviews.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertBusinessSubscription = z.infer<typeof insertBusinessSubscriptionSchema>;
export type BusinessSubscription = typeof businessSubscriptions.$inferSelect;
export type InsertBusinessAnalytics = z.infer<typeof insertBusinessAnalyticsSchema>;
export type BusinessAnalytics = typeof businessAnalytics.$inferSelect;

// Media types
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;

// Removed duplicate creditTransactions table - using the first definition above

// Smart bidding campaigns
export const biddingCampaigns = pgTable("bidding_campaigns", {
  id: serial("id").primaryKey(),
  advertisementId: integer("advertisement_id").notNull().references(() => advertisements.id),
  userId: text("user_id").notNull().references(() => users.id),
  baseBid: decimal("base_bid", { precision: 10, scale: 2 }).notNull(), // Base bid amount
  maxBid: decimal("max_bid", { precision: 10, scale: 2 }).notNull(), // Maximum bid limit
  dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }).notNull(),
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
  targetAudience: json("target_audience"), // Geographic, demographic targeting
  smartSettings: json("smart_settings"), // AI optimization settings
  status: text("status").notNull().default("active"), // active, paused, completed, budget_exhausted
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  performanceMetrics: json("performance_metrics"), // CTR, conversion rate, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Smart boost events (for intelligent timing)
export const smartBoosts = pgTable("smart_boosts", {
  id: serial("id").primaryKey(),
  advertisementId: integer("advertisement_id").notNull().references(() => advertisements.id),
  campaignId: integer("campaign_id").references(() => biddingCampaigns.id),
  boostType: text("boost_type").notNull(), // time_based, competition_based, performance_based
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).notNull(), // e.g., 1.5x boost
  timeSlot: text("time_slot"), // morning, afternoon, evening, peak_hours
  targetMetric: text("target_metric"), // clicks, views, conversions
  creditsUsed: integer("credits_used").notNull(),
  effectiveness: decimal("effectiveness", { precision: 5, scale: 4 }), // Success rate 0-1
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Payment transactions
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  stripeInvoiceId: text("stripe_invoice_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("eur"),
  status: text("status").notNull(), // succeeded, pending, failed, canceled
  type: text("type").notNull(), // subscription, credits_purchase, ad_campaign
  description: text("description"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform revenue analytics
export const revenueAnalytics = pgTable("revenue_analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  subscriptionRevenue: decimal("subscription_revenue", { precision: 10, scale: 2 }).default("0.00"),
  creditsRevenue: decimal("credits_revenue", { precision: 10, scale: 2 }).default("0.00"),
  advertisingRevenue: decimal("advertising_revenue", { precision: 10, scale: 2 }).default("0.00"),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
  activeSubscriptions: integer("active_subscriptions").default(0),
  newSubscriptions: integer("new_subscriptions").default(0),
  canceledSubscriptions: integer("canceled_subscriptions").default(0),
  totalCreditsUsed: integer("total_credits_used").default(0),
  totalAdImpressions: integer("total_ad_impressions").default(0),
  totalAdClicks: integer("total_ad_clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertBiddingCampaignSchema = createInsertSchema(biddingCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSmartBoostSchema = createInsertSchema(smartBoosts).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
});

// Product/Service Configuration Tables
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["package", "service"] }).notNull(), // package = paquete, service = servicio individual
  description: text("description").notNull(),
  priceEur: decimal("price_eur", { precision: 10, scale: 2 }).notNull(),
  priceCop: decimal("price_cop", { precision: 12, scale: 0 }).notNull(),
  features: json("features").$type<string[]>().notNull().default([]),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  stripeProductId: text("stripe_product_id"), // ID del producto en Stripe
  stripePriceId: text("stripe_price_id"), // ID del precio en Stripe
  category: text("category"), // esencial, integral, vip para paquetes
  unit: text("unit").default("once"), // once, day, month para facturación
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Purchase Records
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  // Customer information (captured during checkout)
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerCountry: text("customer_country").notNull(),
  customerCity: text("customer_city"),
  // Payment information
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(), // EUR o COP
  status: text("status", { enum: ["pending", "completed", "failed", "refunded"] }).default("pending").notNull(),
  // Additional customer preferences/notes
  notes: text("notes"),
  preferredLanguage: text("preferred_language").default("es"),
  // Service delivery tracking
  serviceStatus: text("service_status", { enum: ["not_started", "in_progress", "completed", "cancelled"] }).default("not_started"),
  assignedConsultant: text("assigned_consultant"),
  completionDate: timestamp("completion_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase Communication Log
export const purchaseCommunications = pgTable("purchase_communications", {
  id: serial("id").primaryKey(),
  purchaseId: integer("purchase_id").notNull().references(() => purchases.id),
  type: text("type", { enum: ["email", "whatsapp", "call", "note"] }).notNull(),
  direction: text("direction", { enum: ["inbound", "outbound"] }).notNull(),
  content: text("content").notNull(),
  sentBy: text("sent_by"), // staff member name
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for product tables
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseCommunicationSchema = createInsertSchema(purchaseCommunications).omit({
  id: true,
  createdAt: true,
});

// Additional types for new tables
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type BiddingCampaign = typeof biddingCampaigns.$inferSelect;
export type InsertBiddingCampaign = z.infer<typeof insertBiddingCampaignSchema>;
export type SmartBoost = typeof smartBoosts.$inferSelect;
export type InsertSmartBoost = z.infer<typeof insertSmartBoostSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type PurchaseCommunication = typeof purchaseCommunications.$inferSelect;
export type InsertPurchaseCommunication = z.infer<typeof insertPurchaseCommunicationSchema>;
