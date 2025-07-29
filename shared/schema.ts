import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Customers table (replacing clients)
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(), // for customer login
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastOrder: timestamp("last_order"),
  status: text("status").default("active"), // active, inactive, suspended
  emailVerified: boolean("email_verified").default(false),
  loyaltyPoints: integer("loyalty_points").default(0),
  loyaltyTier: text("loyalty_tier").default("bronze"), // bronze, silver, gold, platinum
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: varchar("parent_id"), // for subcategories
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin/Staff table (simplified for e-commerce)
export const staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // admin, manager, staff
  permissions: text("permissions").array(), // manage_products, manage_orders, view_reports, etc.
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table optimized for hair extensions
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  hairType: text("hair_type").notNull(), // human, synthetic, blend
  texture: text("texture"), // straight, wavy, curly, kinky
  length: integer("length"), // in inches
  color: text("color"),
  weight: text("weight"), // in grams
  sku: text("sku").unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }), // for showing discounts
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  currentStock: integer("current_stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  images: text("images").array(), // multiple product images
  featuredImage: text("featured_image"),
  tags: text("tags").array(),
  features: jsonb("features").$type<string[]>(), // bullet points for product features
  careInstructions: text("care_instructions"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  soldCount: integer("sold_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled, refunded
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"), // cod, gcash, maya, card, bank_transfer
  shippingMethod: text("shipping_method"), // standard, express, pickup
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").$type<{
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  }>(),
  billingAddress: jsonb("billing_address").$type<{
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  }>(),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(), // Store at time of order
  productImage: text("product_image"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of order
  quantity: integer("quantity").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping Cart
export const cart = pgTable("cart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist
export const wishlist = pgTable("wishlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  images: text("images").array(),
  isVerified: boolean("is_verified").default(false), // verified purchase
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  type: text("type").notNull(), // purchase, sale, adjustment, return
  quantity: integer("quantity").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  reason: text("reason"),
  reference: text("reference"), // order number, purchase order, etc.
  staffId: varchar("staff_id").references(() => staff.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Methods Configuration
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // gcash, cod, bank_transfer
  isActive: boolean("is_active").default(true),
  displayName: text("display_name").notNull(),
  description: text("description"),
  config: jsonb("config").$type<{
    gcashNumber?: string;
    gcashName?: string;
    qrCodeUrl?: string;
    instructions?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Proofs/Screenshots
export const paymentProofs = pgTable("payment_proofs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  paymentMethod: text("payment_method").notNull(),
  referenceNumber: text("reference_number"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  proofImageUrl: text("proof_image_url"),
  customerNotes: text("customer_notes"),
  status: text("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  approvedBy: varchar("approved_by").references(() => staff.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loyalty Points History
export const loyaltyPointsHistory = pgTable("loyalty_points_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  points: integer("points").notNull(), // positive for earning, negative for spending
  pointsType: text("points_type").notNull(), // purchase, challenge, bonus, redemption
  description: text("description").notNull(),
  referenceId: varchar("reference_id"), // order ID, challenge ID, etc.
  referenceType: text("reference_type"), // order, challenge, manual, etc.
  expiryDate: timestamp("expiry_date"), // points expiry (if applicable)
  createdAt: timestamp("created_at").defaultNow(),
});

// Hair Styling Challenges
export const stylingChallenges = pgTable("styling_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(), // installation, styling, maintenance, color
  pointsReward: integer("points_reward").notNull(),
  timeLimit: integer("time_limit"), // in days, null for unlimited
  requirements: jsonb("requirements").$type<{
    products?: string[]; // product IDs required
    minSpend?: number; // minimum purchase amount
    actions?: string[]; // specific actions needed
  }>(),
  instructions: text("instructions").array(), // step-by-step instructions
  tips: text("tips").array(), // helpful tips
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxParticipants: integer("max_participants"), // null for unlimited
  currentParticipants: integer("current_participants").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Challenge Participation
export const challengeParticipations = pgTable("challenge_participations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  challengeId: varchar("challenge_id").references(() => stylingChallenges.id).notNull(),
  status: text("status").default("started"), // started, submitted, completed, failed
  submissionText: text("submission_text"),
  submissionImages: text("submission_images").array(),
  submissionDate: timestamp("submission_date"),
  completionDate: timestamp("completion_date"),
  pointsEarned: integer("points_earned").default(0),
  feedback: text("feedback"), // admin feedback
  rating: integer("rating"), // 1-5 stars for submission quality
  startedAt: timestamp("started_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievement System
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // purchase, challenge, social, milestone
  iconUrl: text("icon_url"),
  badgeColor: text("badge_color").default("#6366f1"), // hex color for badge
  pointsReward: integer("points_reward").notNull(),
  requirements: jsonb("requirements").$type<{
    totalSpent?: number;
    totalOrders?: number;
    challengesCompleted?: number;
    referrals?: number;
    socialShares?: number;
    consecutivePurchases?: number;
  }>(),
  isSecret: boolean("is_secret").default(false), // hidden until unlocked
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Achievements
export const customerAchievements = pgTable("customer_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  pointsEarned: integer("points_earned").notNull(),
  isNew: boolean("is_new").default(true), // for showing notification badge
});

// Loyalty Rewards/Redemptions
export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // discount, product, shipping, exclusive
  pointsCost: integer("points_cost").notNull(),
  discountType: text("discount_type"), // percentage, fixed, free_shipping
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
  productId: varchar("product_id").references(() => products.id), // for product rewards
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"), // null for unlimited
  currentUses: integer("current_uses").default(0),
  tierRequirement: text("tier_requirement"), // bronze, silver, gold, platinum
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Reward Redemptions
export const rewardRedemptions = pgTable("reward_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  rewardId: varchar("reward_id").references(() => loyaltyRewards.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  pointsUsed: integer("points_used").notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  status: text("status").default("active"), // active, used, expired
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
});

// Shop Settings
export const shopSettings = pgTable("shop_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopName: text("shop_name").notNull().default("Hibla Filipino Hair"),
  shopEmail: text("shop_email").notNull(),
  shopPhone: text("shop_phone"),
  shopAddress: text("shop_address"),
  logoUrl: text("logo_url"),
  currency: text("currency").default("PHP"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("12"), // VAT
  shippingPolicy: text("shipping_policy"),
  returnPolicy: text("return_policy"),
  privacyPolicy: text("privacy_policy"),
  termsConditions: text("terms_conditions"),
  socialLinks: jsonb("social_links").$type<{
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert Schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  totalOrders: true,
  totalSpent: true,
  lastOrder: true,
  emailVerified: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  lastLogin: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  viewCount: true,
  soldCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertCartSchema = createInsertSchema(cart).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  helpfulCount: true,
  createdAt: true,
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertShopSettingsSchema = createInsertSchema(shopSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Loyalty System Insert Schemas
export const insertLoyaltyPointsHistorySchema = createInsertSchema(loyaltyPointsHistory).omit({
  id: true,
  createdAt: true,
});

export const insertStylingChallengeSchema = createInsertSchema(stylingChallenges).omit({
  id: true,
  currentParticipants: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeParticipationSchema = createInsertSchema(challengeParticipations).omit({
  id: true,
  pointsEarned: true,
  startedAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerAchievementSchema = createInsertSchema(customerAchievements).omit({
  id: true,
  unlockedAt: true,
  isNew: true,
});

export const insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards).omit({
  id: true,
  currentUses: true,
  createdAt: true,
});

export const insertRewardRedemptionSchema = createInsertSchema(rewardRedemptions).omit({
  id: true,
  redeemedAt: true,
});

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Cart = typeof cart.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type ShopSettings = typeof shopSettings.$inferSelect;
export type InsertShopSettings = z.infer<typeof insertShopSettingsSchema>;

// Loyalty System Types
export type LoyaltyPointsHistory = typeof loyaltyPointsHistory.$inferSelect;
export type InsertLoyaltyPointsHistory = z.infer<typeof insertLoyaltyPointsHistorySchema>;
export type StylingChallenge = typeof stylingChallenges.$inferSelect;
export type InsertStylingChallenge = z.infer<typeof insertStylingChallengeSchema>;
export type ChallengeParticipation = typeof challengeParticipations.$inferSelect;
export type InsertChallengeParticipation = z.infer<typeof insertChallengeParticipationSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type CustomerAchievement = typeof customerAchievements.$inferSelect;
export type InsertCustomerAchievement = z.infer<typeof insertCustomerAchievementSchema>;
export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;
export type InsertRewardRedemption = z.infer<typeof insertRewardRedemptionSchema>;

// Stylists table for AI recommendation engine
export const stylists = pgTable("stylists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  bio: text("bio"),
  specialties: text("specialties").array(), // hair-extensions, coloring, cutting, styling, etc.
  experience: integer("experience").default(0), // years of experience
  certification: text("certification").array(), // certifications held
  languages: text("languages").array().default(sql`ARRAY['English', 'Filipino']`),
  workingHours: jsonb("working_hours").$type<{
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  }>(),
  location: text("location"), // Quezon City, Manila, Cebu, etc.
  priceRange: text("price_range"), // budget, mid-range, premium
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalReviews: integer("total_reviews").default(0),
  profileImage: text("profile_image"),
  portfolioImages: text("portfolio_images").array(),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  joinDate: timestamp("join_date").defaultNow(),
  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer preferences for AI matching
export const customerPreferences = pgTable("customer_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  hairType: text("hair_type"), // straight, wavy, curly, coily
  hairLength: text("hair_length"), // short, medium, long
  hairGoals: text("hair_goals").array(), // length, volume, color-change, maintenance, etc.
  preferredStyle: text("preferred_style").array(), // natural, glamorous, edgy, classic, etc.
  budgetRange: text("budget_range"), // budget, mid-range, premium
  preferredLocation: text("preferred_location"),
  preferredLanguage: text("preferred_language").array(),
  sessionType: text("session_type"), // consultation, installation, maintenance, styling
  urgency: text("urgency"), // flexible, within-week, urgent
  previousExperience: text("previous_experience"), // beginner, intermediate, expert
  specialNeeds: text("special_needs").array(), // sensitive-scalp, allergies, etc.
  communicationStyle: text("communication_style"), // detailed, brief, visual
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stylist recommendations generated by AI
export const stylistRecommendations = pgTable("stylist_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  stylistId: varchar("stylist_id").references(() => stylists.id).notNull(),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }).notNull(), // 0-100 compatibility score
  matchReason: text("match_reason").notNull(), // AI explanation for the match
  strengths: text("strengths").array(), // what makes this stylist a good match
  considerations: text("considerations").array(), // things to consider
  recommendedServices: text("recommended_services").array(),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  aiModel: text("ai_model").default("gpt-4o"),
  aiPrompt: text("ai_prompt"),
  status: text("status").default("active"), // active, viewed, contacted, booked, declined
  customerFeedback: text("customer_feedback"),
  feedbackRating: integer("feedback_rating"), // 1-5 rating of recommendation quality
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stylist reviews for reputation system
export const stylistReviews = pgTable("stylist_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stylistId: varchar("stylist_id").references(() => stylists.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  serviceType: text("service_type"), // consultation, installation, styling, etc.
  pros: text("pros").array(),
  cons: text("cons").array(),
  recommendToFriends: boolean("recommend_to_friends").default(true),
  beforeImages: text("before_images").array(),
  afterImages: text("after_images").array(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  stylistResponse: text("stylist_response"),
  stylistResponseDate: timestamp("stylist_response_date"),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for stylist system
export const insertStylistSchema = createInsertSchema(stylists).omit({
  id: true,
  rating: true,
  totalReviews: true,
  joinDate: true,
  lastActive: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerPreferencesSchema = createInsertSchema(customerPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStylistRecommendationSchema = createInsertSchema(stylistRecommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStylistReviewSchema = createInsertSchema(stylistReviews).omit({
  id: true,
  helpfulCount: true,
  createdAt: true,
});

// Type exports
export type Stylist = typeof stylists.$inferSelect;
export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type CustomerPreferences = typeof customerPreferences.$inferSelect;
export type InsertCustomerPreferences = z.infer<typeof insertCustomerPreferencesSchema>;
export type StylistRecommendation = typeof stylistRecommendations.$inferSelect;
export type InsertStylistRecommendation = z.infer<typeof insertStylistRecommendationSchema>;
export type StylistReview = typeof stylistReviews.$inferSelect;
export type InsertStylistReview = z.infer<typeof insertStylistReviewSchema>;

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  cart: many(cart),
  wishlist: many(wishlist),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  subcategories: many(categories),
  products: many(products),
}));

export const staffRelations = relations(staff, ({ many }) => ({
  inventoryTransactions: many(inventoryTransactions),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  inventoryTransactions: many(inventoryTransactions),
  orderItems: many(orderItems),
  cart: many(cart),
  wishlist: many(wishlist),
  reviews: many(reviews),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  customer: one(customers, {
    fields: [cart.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  customer: one(customers, {
    fields: [wishlist.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  product: one(products, {
    fields: [inventoryTransactions.productId],
    references: [products.id],
  }),
  staff: one(staff, {
    fields: [inventoryTransactions.staffId],
    references: [staff.id],
  }),
}));

// Email Marketing Campaigns
export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  audience: text("audience").notNull(), // all_clients, recent_clients, vip_clients, uploaded_leads
  status: text("status").notNull().default("draft"), // draft, scheduled, sent, cancelled
  scheduledDate: timestamp("scheduled_date"),
  sentDate: timestamp("sent_date"),
  recipientCount: integer("recipient_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Campaign = typeof campaigns.$inferSelect;

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  recipientCount: true,
  openCount: true,
  clickCount: true,
  sentDate: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

// Email Leads (from CSV uploads)
export const emailLeads = pgTable("email_leads", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  source: text("source").default("csv_upload"), // csv_upload, manual, integration
  tags: text("tags").array(),
  subscribed: boolean("subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type EmailLead = typeof emailLeads.$inferSelect;

export const insertEmailLeadSchema = createInsertSchema(emailLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmailLead = z.infer<typeof insertEmailLeadSchema>;

// Payment Method Types
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;
export type PaymentProof = typeof paymentProofs.$inferSelect;
export type InsertPaymentProof = typeof paymentProofs.$inferInsert;

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentProofSchema = createInsertSchema(paymentProofs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Salon/Spa Specific Tables

// Clients table (for spa/salon clients - different from e-commerce customers)
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  dateOfBirth: text("date_of_birth"), // stored as string for privacy
  notes: text("notes"),
  preferredStaff: varchar("preferred_staff"),
  allergies: text("allergies").array(),
  skinType: text("skin_type"), // oily, dry, combination, sensitive
  hairType: text("hair_type"), // straight, wavy, curly, coily
  lastVisit: timestamp("last_visit"),
  totalVisits: integer("total_visits").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("active"), // active, inactive, blacklisted
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // massage, facial, body-treatment, hair, nail-care
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  staffRequired: integer("staff_required").default(1),
  isActive: boolean("is_active").default(true),
  imageUrl: text("image_url"),
  instructions: text("instructions"), // pre/post care instructions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  serviceId: varchar("service_id").references(() => services.id).notNull(),
  staffId: varchar("staff_id").references(() => staff.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  time: text("time").notNull(), // HH:MM format
  duration: integer("duration").notNull(), // in minutes
  status: text("status").notNull().default("confirmed"), // confirmed, completed, cancelled, no-show
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, partial
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Staff Schedules table
export const staffSchedules = pgTable("staff_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").references(() => staff.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  isAvailable: boolean("is_available").default(true),
  breakStart: text("break_start"), // HH:MM format
  breakEnd: text("break_end"), // HH:MM format
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas for Salon Tables
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  lastVisit: true,
  totalVisits: true,
  totalSpent: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  reminderSent: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStaffScheduleSchema = createInsertSchema(staffSchedules).omit({
  id: true,
  createdAt: true,
});

// Types for Salon Tables
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type StaffSchedule = typeof staffSchedules.$inferSelect;
export type InsertStaffSchedule = z.infer<typeof insertStaffScheduleSchema>;

// Relations for Salon Tables
export const clientsRelations = relations(clients, ({ many }) => ({
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  staff: one(staff, {
    fields: [appointments.staffId],
    references: [staff.id],
  }),
}));

export const staffSchedulesRelations = relations(staffSchedules, ({ one }) => ({
  staff: one(staff, {
    fields: [staffSchedules.staffId],
    references: [staff.id],
  }),
}));