import { db } from "./db";
import { eq, desc, and, like, gte, sql } from "drizzle-orm";
import {
  customers,
  categories,
  staff,
  products,
  suppliers,
  orders,
  orderItems,
  cart,
  wishlist,
  reviews,
  inventoryTransactions,
  shopSettings,
  clients,
  services,
  appointments,
  staffSchedules,
  stylists,
  customerPreferences,
  stylistRecommendations,
  stylistReviews,
  paymentMethods,
  paymentProofs,
  type Customer,
  type InsertCustomer,
  type Category,
  type InsertCategory,
  type Staff,
  type InsertStaff,
  type Product,
  type InsertProduct,
  type Supplier,
  type InsertSupplier,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Cart,
  type InsertCart,
  type Wishlist,
  type InsertWishlist,
  type Review,
  type InsertReview,
  type InventoryTransaction,
  type InsertInventoryTransaction,
  type ShopSettings,
  type InsertShopSettings,
  type Client,
  type InsertClient,
  type Service,
  type InsertService,
  type Appointment,
  type InsertAppointment,
  type StaffSchedule,
  type InsertStaffSchedule,
  type Stylist,
  type InsertStylist,
  type CustomerPreferences,
  type InsertCustomerPreferences,
  type StylistRecommendation,
  type InsertStylistRecommendation,
  type StylistReview,
  type InsertStylistReview,
  type PaymentMethod,
  type InsertPaymentMethod,
  type PaymentProof,
  type InsertPaymentProof,
  loyaltyPointsHistory,
  stylingChallenges,
  challengeParticipations,
  achievements,
  customerAchievements,
  loyaltyRewards,
  rewardRedemptions,
  type LoyaltyPointsHistory,
  type InsertLoyaltyPointsHistory,
  type StylingChallenge,
  type InsertStylingChallenge,
  type ChallengeParticipation,
  type InsertChallengeParticipation,
  type Achievement,
  type InsertAchievement,
  type CustomerAchievement,
  type InsertCustomerAchievement,
  type LoyaltyReward,
  type InsertLoyaltyReward,
  type RewardRedemption,
  type InsertRewardRedemption,
} from "@shared/schema";

export interface IStorage {
  // Customers
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  // Categories
  getCategory(id: string): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Staff
  getStaff(id: string): Promise<Staff | undefined>;
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<boolean>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Suppliers
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(filters?: { status?: string; customerId?: string; limit?: number }): Promise<Order[]>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  updateOrderStatus(id: string, update: { status?: string; paymentStatus?: string; trackingNumber?: string }): Promise<Order | undefined>;
  getOrderStats(): Promise<{ totalOrders: number; totalRevenue: number; pendingOrders: number; shippedOrders: number }>;
  getRecentOrders(limit: number): Promise<Order[]>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Cart
  getCartItems(customerId: string): Promise<(Cart & { product: Product })[]>;
  addToCart(item: InsertCart): Promise<Cart>;
  updateCartItem(id: string, quantity: number): Promise<Cart | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(customerId: string): Promise<boolean>;

  // Wishlist
  getWishlistItems(customerId: string): Promise<Wishlist[]>;
  addToWishlist(item: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(id: string): Promise<boolean>;

  // Reviews
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Inventory
  getInventoryTransactions(): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;

  // Shop Settings
  getShopSettings(): Promise<ShopSettings | undefined>;
  updateShopSettings(settings: Partial<InsertShopSettings>): Promise<ShopSettings>;

  // Additional Inventory Management
  getLowStockProducts(): Promise<Product[]>;
  getProductInventoryTransactions(productId: string): Promise<InventoryTransaction[]>;
  getInventoryTransactionsByProduct(productId: string): Promise<InventoryTransaction[]>;

  // POS Operations
  getDailySales(date: string): Promise<Order[]>;

  // Salon/Spa Clients
  getClient(id: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // Services
  getService(id: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  getAppointmentsByStaff(staffId: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  // Staff Schedules
  getStaffSchedule(id: string): Promise<StaffSchedule | undefined>;
  getStaffSchedules(): Promise<StaffSchedule[]>;
  getStaffScheduleByStaffAndDate(staffId: string, date: string): Promise<StaffSchedule | undefined>;
  createStaffSchedule(schedule: InsertStaffSchedule): Promise<StaffSchedule>;
  updateStaffSchedule(id: string, schedule: Partial<InsertStaffSchedule>): Promise<StaffSchedule | undefined>;
  deleteStaffSchedule(id: string): Promise<boolean>;

  // Stylist Management
  getStylist(id: string): Promise<Stylist | undefined>;
  getStylists(): Promise<Stylist[]>;
  getActiveStylists(): Promise<Stylist[]>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  updateStylist(id: string, stylist: Partial<InsertStylist>): Promise<Stylist | undefined>;
  deleteStylist(id: string): Promise<boolean>;
  getStylistsByLocation(location: string): Promise<Stylist[]>;
  getStylistsBySpecialty(specialty: string): Promise<Stylist[]>;

  // Customer Preferences
  getCustomerPreferences(customerId: string): Promise<CustomerPreferences | undefined>;
  createCustomerPreferences(preferences: InsertCustomerPreferences): Promise<CustomerPreferences>;
  updateCustomerPreferences(customerId: string, preferences: Partial<InsertCustomerPreferences>): Promise<CustomerPreferences | undefined>;

  // Stylist Recommendations
  getStylistRecommendations(customerId: string): Promise<StylistRecommendation[]>;
  createStylistRecommendation(recommendation: InsertStylistRecommendation): Promise<StylistRecommendation>;
  updateRecommendationStatus(id: string, status: string, feedback?: string, rating?: number): Promise<StylistRecommendation | undefined>;

  // Stylist Reviews
  getStylistReviews(stylistId: string): Promise<StylistReview[]>;
  createStylistReview(review: InsertStylistReview): Promise<StylistReview>;
  updateStylistRating(stylistId: string): Promise<void>;

  // Payment Methods
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  getActivePaymentMethods(): Promise<PaymentMethod[]>;
  updatePaymentMethod(id: string, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod | null>;
  deletePaymentMethod(id: string): Promise<boolean>;

  // Payment Proofs
  createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof>;
  getPaymentProofs(status?: string): Promise<PaymentProof[]>;
  getPaymentProof(id: string): Promise<PaymentProof | null>;
  updatePaymentProofStatus(id: string, status: string, adminNotes?: string, staffId?: string): Promise<PaymentProof | null>;

  // Loyalty Points System
  getCustomerLoyaltyPoints(customerId: string): Promise<number>;
  addLoyaltyPoints(customerId: string, points: number, pointsType: string, description: string, referenceId?: string, referenceType?: string): Promise<LoyaltyPointsHistory>;
  deductLoyaltyPoints(customerId: string, points: number, description: string, referenceId?: string): Promise<LoyaltyPointsHistory>;
  getLoyaltyPointsHistory(customerId: string): Promise<LoyaltyPointsHistory[]>;
  updateCustomerLoyaltyTier(customerId: string): Promise<void>;

  // Styling Challenges
  getStylingChallenges(isActive?: boolean): Promise<StylingChallenge[]>;
  getStylingChallenge(id: string): Promise<StylingChallenge | undefined>;
  createStylingChallenge(challenge: InsertStylingChallenge): Promise<StylingChallenge>;
  updateStylingChallenge(id: string, updates: Partial<InsertStylingChallenge>): Promise<StylingChallenge>;
  joinChallenge(customerId: string, challengeId: string): Promise<ChallengeParticipation>;
  submitChallenge(participationId: string, submissionText: string, submissionImages: string[]): Promise<ChallengeParticipation>;
  getCustomerChallenges(customerId: string): Promise<(ChallengeParticipation & { challenge: StylingChallenge })[]>;
  getChallengeParticipations(challengeId: string): Promise<(ChallengeParticipation & { customer: Customer })[]>;

  // Achievements
  getAchievements(isActive?: boolean): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getCustomerAchievements(customerId: string): Promise<(CustomerAchievement & { achievement: Achievement })[]>;
  checkAndUnlockAchievements(customerId: string): Promise<CustomerAchievement[]>;
  markAchievementAsViewed(customerId: string, achievementId: string): Promise<void>;

  // Loyalty Rewards
  getLoyaltyRewards(isActive?: boolean, tierRequirement?: string): Promise<LoyaltyReward[]>;
  createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward>;
  redeemLoyaltyReward(customerId: string, rewardId: string): Promise<RewardRedemption>;
  getCustomerRedemptions(customerId: string): Promise<(RewardRedemption & { reward: LoyaltyReward })[]>;
}

export class DatabaseStorage implements IStorage {
  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async createCustomer(customer: InsertCustomer & { id?: string }): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer as any).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updated] = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Category methods
  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.displayOrder, categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Staff methods
  async getStaff(id: string): Promise<Staff | undefined> {
    const [staffMember] = await db.select().from(staff).where(eq(staff.id, id));
    return staffMember;
  }

  async getAllStaff(): Promise<Staff[]> {
    return await db.select().from(staff).orderBy(staff.name);
  }

  async createStaff(staffMember: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffMember).returning();
    return newStaff;
  }

  async updateStaff(id: string, staffMember: Partial<InsertStaff>): Promise<Staff | undefined> {
    const [updated] = await db.update(staff).set(staffMember).where(eq(staff.id, id)).returning();
    return updated;
  }

  async deleteStaff(id: string): Promise<boolean> {
    const result = await db.delete(staff).where(eq(staff.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (product) {
      // Increment view count
      await db.update(products).set({ viewCount: sql`${products.viewCount} + 1` }).where(eq(products.id, id));
    }
    return product;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.isFeatured, true), eq(products.isActive, true))).limit(8);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(
      and(
        eq(products.isActive, true),
        like(products.name, `%${query}%`)
      )
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values([product as any]).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set({ 
      ...product, 
      updatedAt: new Date() 
    } as any).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Supplier methods
  async getSupplier(id: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  async updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [updated] = await db.update(suppliers).set(supplier).where(eq(suppliers.id, id)).returning();
    return updated;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrders(filters?: { status?: string; customerId?: string; limit?: number }): Promise<Order[]> {
    const whereConditions = [];

    if (filters?.status) {
      whereConditions.push(eq(orders.status, filters.status));
    }
    if (filters?.customerId) {
      whereConditions.push(eq(orders.customerId, filters.customerId));
    }

    let query = db.select().from(orders);

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions)) as any;
    }

    query = query.orderBy(desc(orders.createdAt)) as any;

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    return await query;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const [newOrder] = await db.insert(orders).values({ ...order, orderNumber }).returning();

    // Update customer stats
    await db.update(customers).set({
      totalOrders: sql`${customers.totalOrders} + 1`,
      totalSpent: sql`${customers.totalSpent} + ${order.total}`,
      lastOrder: new Date()
    }).where(eq(customers.id, order.customerId));

    return newOrder;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ ...order, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async updateOrderStatus(id: string, update: { status?: string; paymentStatus?: string; trackingNumber?: string }): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ 
      ...update, 
      updatedAt: new Date() 
    }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getOrderStats(): Promise<{ totalOrders: number; totalRevenue: number; pendingOrders: number; shippedOrders: number }> {
    const [stats] = await db.select({
      totalOrders: sql<number>`count(*)`.as('totalOrders'),
      totalRevenue: sql<number>`sum(cast(${orders.total} as decimal))`.as('totalRevenue'),
      pendingOrders: sql<number>`sum(case when ${orders.status} = 'pending' then 1 else 0 end)`.as('pendingOrders'),
      shippedOrders: sql<number>`sum(case when ${orders.status} = 'shipped' then 1 else 0 end)`.as('shippedOrders')
    }).from(orders);

    return {
      totalOrders: stats.totalOrders || 0,
      totalRevenue: stats.totalRevenue || 0,
      pendingOrders: stats.pendingOrders || 0,
      shippedOrders: stats.shippedOrders || 0
    };
  }

  async getRecentOrders(limit: number): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  }

  // Order Items methods
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();

    // Update product sold count and stock
    await db.update(products).set({
      soldCount: sql`${products.soldCount} + ${item.quantity}`,
      currentStock: sql`${products.currentStock} - ${item.quantity}`
    }).where(eq(products.id, item.productId));

    return newItem;
  }

  // Cart methods
  async getCartItems(customerId: string): Promise<(Cart & { product: Product })[]> {
    return await db
      .select({
        id: cart.id,
        customerId: cart.customerId,
        productId: cart.productId,
        quantity: cart.quantity,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        product: products
      })
      .from(cart)
      .innerJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.customerId, customerId));
  }

  async addToCart(item: InsertCart): Promise<Cart> {
    // Check if item already exists in cart
    const [existing] = await db.select().from(cart).where(
      and(eq(cart.customerId, item.customerId), eq(cart.productId, item.productId))
    );

    if (existing) {
      // Update quantity
      const [updated] = await db.update(cart).set({
        quantity: sql`${cart.quantity} + ${item.quantity}`,
        updatedAt: new Date()
      }).where(eq(cart.id, existing.id)).returning();
      return updated;
    }

    const [newItem] = await db.insert(cart).values(item).returning();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<Cart | undefined> {
    const [updated] = await db.update(cart).set({ quantity, updatedAt: new Date() }).where(eq(cart.id, id)).returning();
    return updated;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cart).where(eq(cart.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(customerId: string): Promise<boolean> {
    const result = await db.delete(cart).where(eq(cart.customerId, customerId));
    return (result.rowCount ?? 0) > 0;
  }

  // Wishlist methods
  async getWishlistItems(customerId: string): Promise<Wishlist[]> {
    return await db.select().from(wishlist).where(eq(wishlist.customerId, customerId));
  }

  async addToWishlist(item: InsertWishlist): Promise<Wishlist> {
    const [newItem] = await db.insert(wishlist).values(item).returning();
    return newItem;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    const result = await db.delete(wishlist).where(eq(wishlist.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Reviews methods
  async getProductReviews(productId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Inventory methods
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return await db.select().from(inventoryTransactions).orderBy(desc(inventoryTransactions.createdAt));
  }

  async createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const [newTransaction] = await db.insert(inventoryTransactions).values(transaction).returning();

    // Update product stock based on transaction type
    if (transaction.type === 'purchase' || transaction.type === 'return') {
      await db.update(products).set({
        currentStock: sql`${products.currentStock} + ${transaction.quantity}`
      }).where(eq(products.id, transaction.productId));
    } else if (transaction.type === 'sale' || transaction.type === 'adjustment') {
      await db.update(products).set({
        currentStock: sql`${products.currentStock} - ${transaction.quantity}`
      }).where(eq(products.id, transaction.productId));
    }

    return newTransaction;
  }

  // Shop Settings methods
  async getShopSettings(): Promise<ShopSettings | undefined> {
    const [settings] = await db.select().from(shopSettings).limit(1);
    return settings;
  }

  async updateShopSettings(settings: Partial<InsertShopSettings>): Promise<ShopSettings> {
    const existing = await this.getShopSettings();

    if (existing) {
      const updateData: any = { 
        ...settings,
        updatedAt: new Date() 
      };
      const [updated] = await db.update(shopSettings).set(updateData).where(eq(shopSettings.id, existing.id)).returning();
      return updated;
    } else {
      const insertData: any = {
        shopEmail: settings.shopEmail || 'info@hibla.com',
        ...settings
      };
      const [created] = await db.insert(shopSettings).values([insertData]).returning();
      return created;
    }
  }

  // Additional Inventory Management methods
  async getLowStockProducts(): Promise<Product[]> {
    return await db.select().from(products).where(
      and(
        eq(products.isActive, true),
        sql`${products.currentStock} <= ${products.lowStockThreshold}`
      )
    );
  }

  async getProductInventoryTransactions(productId: string): Promise<InventoryTransaction[]> {
    return await db.select().from(inventoryTransactions)
      .where(eq(inventoryTransactions.productId, productId))
      .orderBy(desc(inventoryTransactions.createdAt));
  }

  async getInventoryTransactionsByProduct(productId: string): Promise<InventoryTransaction[]> {
    return await db.select().from(inventoryTransactions)
      .where(eq(inventoryTransactions.productId, productId))
      .orderBy(desc(inventoryTransactions.createdAt));
  }

  // POS Operations
  async getDailySales(date: string): Promise<Order[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await db.select().from(orders).where(
      and(
        gte(orders.createdAt, startDate),
        sql`${orders.createdAt} <= ${endDate}`,
        eq(orders.status, "completed")
      )
    ).orderBy(desc(orders.createdAt));
  }

  // Client methods
  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db.update(clients).set({
      ...client,
      updatedAt: new Date()
    }).where(eq(clients.id, id)).returning();
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Service methods
  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.name);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db.select().from(services).where(
      and(eq(services.category, category), eq(services.isActive, true))
    );
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set({
      ...service,
      updatedAt: new Date()
    }).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Appointment methods
  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.clientId, clientId)).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByStaff(staffId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.staffId, staffId)).orderBy(appointments.date, appointments.time);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.date, date)).orderBy(appointments.time);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();

    // Update client stats
    await db.update(clients).set({
      totalVisits: sql`${clients.totalVisits} + 1`,
      totalSpent: sql`${clients.totalSpent} + ${appointment.totalAmount}`,
      lastVisit: new Date()
    }).where(eq(clients.id, appointment.clientId));

    return newAppointment;
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set({
      ...appointment,
      updatedAt: new Date()
    }).where(eq(appointments.id, id)).returning();
    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Staff Schedule methods
  async getStaffSchedule(id: string): Promise<StaffSchedule | undefined> {
    const [schedule] = await db.select().from(staffSchedules).where(eq(staffSchedules.id, id));
    return schedule;
  }

  async getStaffSchedules(): Promise<StaffSchedule[]> {
    return await db.select().from(staffSchedules).orderBy(staffSchedules.date, staffSchedules.startTime);
  }

  async getStaffScheduleByStaffAndDate(staffId: string, date: string): Promise<StaffSchedule | undefined> {
    const [schedule] = await db.select().from(staffSchedules).where(
      and(eq(staffSchedules.staffId, staffId), eq(staffSchedules.date, date))
    );
    return schedule;
  }

  async createStaffSchedule(schedule: InsertStaffSchedule): Promise<StaffSchedule> {
    const [newSchedule] = await db.insert(staffSchedules).values(schedule).returning();
    return newSchedule;
  }

  async updateStaffSchedule(id: string, schedule: Partial<InsertStaffSchedule>): Promise<StaffSchedule | undefined> {
    const [updated] = await db.update(staffSchedules).set(schedule).where(eq(staffSchedules.id, id)).returning();
    return updated;
  }

  async deleteStaffSchedule(id: string): Promise<boolean> {
    const result = await db.delete(staffSchedules).where(eq(staffSchedules.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Stylist Management Methods
  async getStylist(id: string): Promise<Stylist | undefined> {
    const [stylist] = await db.select().from(stylists).where(eq(stylists.id, id));
    return stylist;
  }

  async getStylists(): Promise<Stylist[]> {
    return await db.select().from(stylists).orderBy(desc(stylists.rating), desc(stylists.totalReviews));
  }

  async getActiveStylists(): Promise<Stylist[]> {
    return await db.select().from(stylists)
      .where(and(eq(stylists.isActive, true), eq(stylists.isVerified, true)))
      .orderBy(desc(stylists.rating), desc(stylists.totalReviews));
  }

  async createStylist(stylist: InsertStylist): Promise<Stylist> {
    const [newStylist] = await db.insert(stylists).values([stylist as any]).returning();
    return newStylist;
  }

  async updateStylist(id: string, stylist: Partial<InsertStylist>): Promise<Stylist | undefined> {
    const [updated] = await db.update(stylists)
      .set({ ...stylist, updatedAt: new Date() } as any)
      .where(eq(stylists.id, id))
      .returning();
    return updated;
  }

  async deleteStylist(id: string): Promise<boolean> {
    const [deleted] = await db.update(stylists)
      .set({ isActive: false })
      .where(eq(stylists.id, id))
      .returning();
    return !!deleted;
  }

  async getStylistsByLocation(location: string): Promise<Stylist[]> {
    return await db.select().from(stylists)
      .where(and(
        eq(stylists.isActive, true),
        eq(stylists.isVerified, true),
        like(stylists.location, `%${location}%`)
      ))
      .orderBy(desc(stylists.rating));
  }

  async getStylistsBySpecialty(specialty: string): Promise<Stylist[]> {
    return await db.select().from(stylists)
      .where(and(
        eq(stylists.isActive, true),
        eq(stylists.isVerified, true),
        sql`${stylists.specialties} @> ARRAY[${specialty}]`
      ))
      .orderBy(desc(stylists.rating));
  }

  // Customer Preferences Methods
  async getCustomerPreferences(customerId: string): Promise<CustomerPreferences | undefined> {
    const [preferences] = await db.select().from(customerPreferences)
      .where(eq(customerPreferences.customerId, customerId));
    return preferences;
  }

  async createCustomerPreferences(preferences: InsertCustomerPreferences): Promise<CustomerPreferences> {
    const [newPreferences] = await db.insert(customerPreferences).values(preferences).returning();
    return newPreferences;
  }

  async updateCustomerPreferences(customerId: string, preferences: Partial<InsertCustomerPreferences>): Promise<CustomerPreferences | undefined> {
    const [updated] = await db.update(customerPreferences)
      .set({ ...preferences, updatedAt: new Date() })
      .where(eq(customerPreferences.customerId, customerId))
      .returning();
    return updated;
  }

  // Stylist Recommendations Methods
  async getStylistRecommendations(customerId: string): Promise<StylistRecommendation[]> {
    return await db.select().from(stylistRecommendations)
      .where(eq(stylistRecommendations.customerId, customerId))
      .orderBy(desc(stylistRecommendations.matchScore), desc(stylistRecommendations.createdAt));
  }

  async createStylistRecommendation(recommendation: InsertStylistRecommendation): Promise<StylistRecommendation> {
    const [newRecommendation] = await db.insert(stylistRecommendations).values(recommendation).returning();
    return newRecommendation;
  }

  async updateRecommendationStatus(id: string, status: string, feedback?: string, rating?: number): Promise<StylistRecommendation | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (feedback) updateData.customerFeedback = feedback;
    if (rating) updateData.feedbackRating = rating;

    const [updated] = await db.update(stylistRecommendations)
      .set(updateData)
      .where(eq(stylistRecommendations.id, id))
      .returning();
    return updated;
  }

  // Stylist Reviews Methods
  async getStylistReviews(stylistId: string): Promise<StylistReview[]> {
    return await db.select().from(stylistReviews)
      .where(eq(stylistReviews.stylistId, stylistId))
      .orderBy(desc(stylistReviews.createdAt));
  }

  async createStylistReview(review: InsertStylistReview): Promise<StylistReview> {
    const [newReview] = await db.insert(stylistReviews).values(review).returning();

    // Update stylist rating after creating review
    await this.updateStylistRating(review.stylistId);

    return newReview;
  }

  async updateStylistRating(stylistId: string): Promise<void> {
    // Calculate average rating and total reviews
    const result = await db.select({
      avgRating: sql<string>`AVG(${stylistReviews.rating})`,
      totalReviews: sql<string>`COUNT(*)`
    }).from(stylistReviews)
      .where(eq(stylistReviews.stylistId, stylistId));

    const { avgRating, totalReviews } = result[0];

    if (avgRating && totalReviews) {
      await db.update(stylists)
        .set({
          rating: parseFloat(avgRating).toFixed(2),
          totalReviews: parseInt(totalReviews),
          updatedAt: new Date()
        })
        .where(eq(stylists.id, stylistId));
    }
  }

  // Payment method management
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const result = await db.insert(paymentMethods).values(method).returning();
    return result[0];
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods).orderBy(desc(paymentMethods.createdAt));
  }

  async getActivePaymentMethods(): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods)
      .where(eq(paymentMethods.isActive, true))
      .orderBy(desc(paymentMethods.createdAt));
  }

  async updatePaymentMethod(id: string, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod | null> {
    const result = await db.update(paymentMethods)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentMethods.id, id))
      .returning();
    return result[0] || null;
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    const result = await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Payment proof management
  async createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof> {
    const result = await db.insert(paymentProofs).values([proof]).returning();
    return result[0];
  }

  async getPaymentProofs(status?: string): Promise<PaymentProof[]> {
    let query = db.select().from(paymentProofs);
    if (status) {
      query = query.where(eq(paymentProofs.status, status)) as any;
    }
    return await query.orderBy(desc(paymentProofs.createdAt));
  }

  async getPaymentProof(id: string): Promise<PaymentProof | null> {
    const result = await db.select().from(paymentProofs).where(eq(paymentProofs.id, id));
    return result[0] || null;
  }

  async updatePaymentProofStatus(id: string, status: string, adminNotes?: string, staffId?: string): Promise<PaymentProof | null> {
    const updates: any = { 
      status, 
      updatedAt: new Date() 
    };

    if (adminNotes) updates.adminNotes = adminNotes;
    if (staffId) updates.approvedBy = staffId;
    if (status === 'approved') updates.approvedAt = new Date();

    const result = await db.update(paymentProofs)
      .set(updates)
      .where(eq(paymentProofs.id, id))
      .returning();
    return result[0] || null;
  }

  // Loyalty Points System Implementation
  async getCustomerLoyaltyPoints(customerId: string): Promise<number> {
    const [customer] = await db.select({ loyaltyPoints: customers.loyaltyPoints })
      .from(customers)
      .where(eq(customers.id, customerId));
    return customer?.loyaltyPoints || 0;
  }

  async addLoyaltyPoints(customerId: string, points: number, pointsType: string, description: string, referenceId?: string, referenceType?: string): Promise<LoyaltyPointsHistory> {
    const [history] = await db.insert(loyaltyPointsHistory).values({
      customerId,
      points,
      pointsType,
      description,
      referenceId,
      referenceType,
    }).returning();

    // Update customer's total loyalty points
    await db.update(customers)
      .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${points}` })
      .where(eq(customers.id, customerId));

    // Update loyalty tier
    await this.updateCustomerLoyaltyTier(customerId);

    return history;
  }

  async deductLoyaltyPoints(customerId: string, points: number, description: string, referenceId?: string): Promise<LoyaltyPointsHistory> {
    const [history] = await db.insert(loyaltyPointsHistory).values({
      customerId,
      points: -points, // negative for deduction
      pointsType: 'redemption',
      description,
      referenceId,
      referenceType: 'redemption',
    }).returning();

    // Update customer's total loyalty points
    await db.update(customers)
      .set({ loyaltyPoints: sql`${customers.loyaltyPoints} - ${points}` })
      .where(eq(customers.id, customerId));

    // Update loyalty tier
    await this.updateCustomerLoyaltyTier(customerId);

    return history;
  }

  async getLoyaltyPointsHistory(customerId: string): Promise<LoyaltyPointsHistory[]> {
    return await db.select().from(loyaltyPointsHistory)
      .where(eq(loyaltyPointsHistory.customerId, customerId))
      .orderBy(desc(loyaltyPointsHistory.createdAt));
  }

  async updateCustomerLoyaltyTier(customerId: string): Promise<void> {
    const [customer] = await db.select({ loyaltyPoints: customers.loyaltyPoints })
      .from(customers)
      .where(eq(customers.id, customerId));

    if (!customer) return;

    let tier = 'bronze';
    const points = customer.loyaltyPoints || 0;

    if (points >= 10000) tier = 'platinum';
    else if (points >= 5000) tier = 'gold';
    else if (points >= 2000) tier = 'silver';

    await db.update(customers)
      .set({ loyaltyTier: tier })
      .where(eq(customers.id, customerId));
  }

  // Styling Challenges Implementation
  async getStylingChallenges(isActive?: boolean): Promise<StylingChallenge[]> {
    let query = db.select().from(stylingChallenges);
    if (isActive !== undefined) {
      query = query.where(eq(stylingChallenges.isActive, isActive)) as any;
    }
    return await query.orderBy(desc(stylingChallenges.createdAt));
  }

  async getStylingChallenge(id: string): Promise<StylingChallenge | undefined> {
    const [challenge] = await db.select().from(stylingChallenges)
      .where(eq(stylingChallenges.id, id));
    return challenge;
  }

  async createStylingChallenge(challenge: InsertStylingChallenge): Promise<StylingChallenge> {
    const [newChallenge] = await db.insert(stylingChallenges).values([challenge as any]).returning();
    return newChallenge;
  }

  async updateStylingChallenge(id: string, updates: Partial<InsertStylingChallenge>): Promise<StylingChallenge> {
    const [updated] = await db.update(stylingChallenges)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(stylingChallenges.id, id))
      .returning();
    return updated;
  }

  async joinChallenge(customerId: string, challengeId: string): Promise<ChallengeParticipation> {
    // Check if customer already joined
    const existing = await db.select().from(challengeParticipations)
      .where(and(
        eq(challengeParticipations.customerId, customerId),
        eq(challengeParticipations.challengeId, challengeId)
      ));

    if (existing.length > 0) {
      throw new Error('Already joined this challenge');
    }

    // Increment challenge participant count
    await db.update(stylingChallenges)
      .set({ currentParticipants: sql`${stylingChallenges.currentParticipants} + 1` })
      .where(eq(stylingChallenges.id, challengeId));

    const [participation] = await db.insert(challengeParticipations).values({
      customerId,
      challengeId,
      status: 'started',
    }).returning();

    return participation;
  }

  async submitChallenge(participationId: string, submissionText: string, submissionImages: string[]): Promise<ChallengeParticipation> {
    const [updated] = await db.update(challengeParticipations)
      .set({
        submissionText,
        submissionImages,
        submissionDate: new Date(),
        status: 'submitted',
        updatedAt: new Date(),
      })
      .where(eq(challengeParticipations.id, participationId))
      .returning();

    return updated;
  }

  async getCustomerChallenges(customerId: string): Promise<(ChallengeParticipation & { challenge: StylingChallenge })[]> {
    const results = await db.select({
      id: challengeParticipations.id,
      customerId: challengeParticipations.customerId,
      challengeId: challengeParticipations.challengeId,
      status: challengeParticipations.status,
      submissionText: challengeParticipations.submissionText,
      submissionImages: challengeParticipations.submissionImages,
      submissionDate: challengeParticipations.submissionDate,
      completionDate: challengeParticipations.completionDate,
      pointsEarned: challengeParticipations.pointsEarned,
      feedback: challengeParticipations.feedback,
      rating: challengeParticipations.rating,
      startedAt: challengeParticipations.startedAt,
      updatedAt: challengeParticipations.updatedAt,
      challenge: stylingChallenges,
    })
    .from(challengeParticipations)
    .innerJoin(stylingChallenges, eq(challengeParticipations.challengeId, stylingChallenges.id))
    .where(eq(challengeParticipations.customerId, customerId))
    .orderBy(desc(challengeParticipations.startedAt));

    return results as (ChallengeParticipation & { challenge: StylingChallenge })[];
  }

  async getChallengeParticipations(challengeId: string): Promise<(ChallengeParticipation & { customer: Customer })[]> {
    const results = await db.select({
      id: challengeParticipations.id,
      customerId: challengeParticipations.customerId,
      challengeId: challengeParticipations.challengeId,
      status: challengeParticipations.status,
      submissionText: challengeParticipations.submissionText,
      submissionImages: challengeParticipations.submissionImages,
      submissionDate: challengeParticipations.submissionDate,
      completionDate: challengeParticipations.completionDate,
      pointsEarned: challengeParticipations.pointsEarned,
      feedback: challengeParticipations.feedback,
      rating: challengeParticipations.rating,
      startedAt: challengeParticipations.startedAt,
      updatedAt: challengeParticipations.updatedAt,
      customer: customers,
    })
    .from(challengeParticipations)
    .innerJoin(customers, eq(challengeParticipations.customerId, customers.id))
    .where(eq(challengeParticipations.challengeId, challengeId))
    .orderBy(desc(challengeParticipations.startedAt));

    return results as (ChallengeParticipation & { customer: Customer })[];
  }

  // Achievements Implementation
  async getAchievements(isActive?: boolean): Promise<Achievement[]> {
    let query = db.select().from(achievements);
    if (isActive !== undefined) {
      query = query.where(eq(achievements.isActive, isActive)) as any;
    }
    return await query.orderBy(achievements.category, achievements.name);
  }

  async getCustomerAchievements(customerId: string): Promise<(CustomerAchievement & { achievement: Achievement })[]> {
    const results = await db.select({
      id: customerAchievements.id,
      customerId: customerAchievements.customerId,
      achievementId: customerAchievements.achievementId,
      unlockedAt: customerAchievements.unlockedAt,
      pointsEarned: customerAchievements.pointsEarned,
      isNew: customerAchievements.isNew,
      achievement: achievements,
    })
    .from(customerAchievements)
    .innerJoin(achievements, eq(customerAchievements.achievementId, achievements.id))
    .where(eq(customerAchievements.customerId, customerId))
    .orderBy(desc(customerAchievements.unlockedAt));

    return results as (CustomerAchievement & { achievement: Achievement })[];
  }

  async checkAndUnlockAchievements(customerId: string): Promise<CustomerAchievement[]> {
    const customer = await this.getCustomer(customerId);
    if (!customer) return [];

    const allAchievements = await this.getAchievements(true);
    const customerAchievementsList = await this.getCustomerAchievements(customerId);
    const unlockedIds = customerAchievementsList.map(ca => ca.achievementId);

    const newAchievements: CustomerAchievement[] = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.includes(achievement.id)) continue;

      let shouldUnlock = false;
      const reqs = achievement.requirements as any;

      if (reqs.totalSpent && parseFloat(customer.totalSpent || '0') >= reqs.totalSpent) {
        shouldUnlock = true;
      }
      if (reqs.totalOrders && (customer.totalOrders ?? 0) >= reqs.totalOrders) {
        shouldUnlock = true;
      }
      if (reqs.challengesCompleted) {
        const completedChallenges = await db.select()
          .from(challengeParticipations)
          .where(and(
            eq(challengeParticipations.customerId, customerId),
            eq(challengeParticipations.status, 'completed')
          ));
        if (completedChallenges.length >= reqs.challengesCompleted) {
          shouldUnlock = true;
        }
      }

      if (shouldUnlock) {
        const [newAchievement] = await db.insert(customerAchievements).values({
          customerId,
          achievementId: achievement.id,
          pointsEarned: achievement.pointsReward,
        }).returning();

        // Add loyalty points for achievement
        await this.addLoyaltyPoints(
          customerId,
          achievement.pointsReward,
          'achievement',
          `Achievement unlocked: ${achievement.name}`,
          achievement.id,
          'achievement'
        );

        newAchievements.push(newAchievement);
      }
    }

    return newAchievements;
  }

  async markAchievementAsViewed(customerId: string, achievementId: string): Promise<void> {
    await db.update(customerAchievements)
      .set({ isNew: false })
      .where(and(
        eq(customerAchievements.customerId, customerId),
        eq(customerAchievements.achievementId, achievementId)
      ));
  }

  // Loyalty Rewards Implementation
  async getLoyaltyRewards(isActive?: boolean, tierRequirement?: string): Promise<LoyaltyReward[]> {
    let query = db.select().from(loyaltyRewards);
    const conditions = [];

    if (isActive !== undefined) {
      conditions.push(eq(loyaltyRewards.isActive, isActive));
    }
    if (tierRequirement) {
      conditions.push(eq(loyaltyRewards.tierRequirement, tierRequirement));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(loyaltyRewards.pointsCost);
  }

  async redeemLoyaltyReward(customerId: string, rewardId: string): Promise<RewardRedemption> {
    const [reward] = await db.select().from(loyaltyRewards)
      .where(eq(loyaltyRewards.id, rewardId));

    if (!reward) {
      throw new Error('Reward not found');
    }

    const customerPoints = await this.getCustomerLoyaltyPoints(customerId);
    if (customerPoints < reward.pointsCost) {
      throw new Error('Insufficient points');
    }

    // Check usage limits
    if (reward.maxUses && (reward.currentUses ?? 0) >= reward.maxUses) {
      throw new Error('Reward usage limit reached');
    }

    // Deduct points
    await this.deductLoyaltyPoints(
      customerId,
      reward.pointsCost,
      `Redeemed: ${reward.name}`,
      reward.id
    );

    // Increment usage count
    await db.update(loyaltyRewards)
      .set({ currentUses: sql`${loyaltyRewards.currentUses} + 1` })
      .where(eq(loyaltyRewards.id, rewardId));

    // Create redemption record
    const [redemption] = await db.insert(rewardRedemptions).values({
      customerId,
      rewardId,
      pointsUsed: reward.pointsCost,
      discountAmount: reward.discountValue,
      expiresAt: reward.validUntil,
    }).returning();

    return redemption;
  }

  async getCustomerRedemptions(customerId: string): Promise<(RewardRedemption & { reward: LoyaltyReward })[]> {
    const results = await db.select({
      id: rewardRedemptions.id,
      customerId: rewardRedemptions.customerId,
      rewardId: rewardRedemptions.rewardId,
      orderId: rewardRedemptions.orderId,
      pointsUsed: rewardRedemptions.pointsUsed,
      discountAmount: rewardRedemptions.discountAmount,
      status: rewardRedemptions.status,
      usedAt: rewardRedemptions.usedAt,
      expiresAt: rewardRedemptions.expiresAt,
      redeemedAt: rewardRedemptions.redeemedAt,
      reward: loyaltyRewards,
    })
    .from(rewardRedemptions)
    .innerJoin(loyaltyRewards, eq(rewardRedemptions.rewardId, loyaltyRewards.id))
    .where(eq(rewardRedemptions.customerId, customerId))
    .orderBy(desc(rewardRedemptions.redeemedAt));

    return results as (RewardRedemption & { reward: LoyaltyReward })[];
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values([achievement as any]).returning();
    return newAchievement;
  }

  async createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const [newReward] = await db.insert(loyaltyRewards).values([reward]).returning();
    return newReward;
  }

  // NexusPay transaction management
  async createNexusPayTransaction(transaction: any): Promise<any> {
    const result = await db.insert(nexusPayTransactions).values([transaction]).returning();
    return result[0];
  }

  async getNexusPayTransactions(orderId?: string): Promise<any[]> {
    let query = db.select().from(nexusPayTransactions);
    if (orderId) {
      query = query.where(eq(nexusPayTransactions.orderId, orderId)) as any;
    }
    return await query.orderBy(desc(nexusPayTransactions.createdAt));
  }

  async getNexusPayTransaction(id: string): Promise<any | null> {
    const result = await db.select().from(nexusPayTransactions).where(eq(nexusPayTransactions.id, id));
    return result[0] || null;
  }

  async updateNexusPayTransaction(id: string, updates: any): Promise<any | null> {
    const result = await db.update(nexusPayTransactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(nexusPayTransactions.id, id))
      .returning();
    return result[0] || null;
  }

  async updateNexusPayTransactionByOrderId(orderId: string, updates: any): Promise<any | null> {
    const result = await db.update(nexusPayTransactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(nexusPayTransactions.orderId, orderId))
      .returning();
    return result[0] || null;
  }
}

export const storage = new DatabaseStorage();