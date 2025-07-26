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
  getOrders(): Promise<Order[]>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Cart
  getCartItems(customerId: string): Promise<Cart[]>;
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

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
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
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set({ 
      ...product, 
      updatedAt: new Date() 
    }).where(eq(products.id, id)).returning();
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

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
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
  async getCartItems(customerId: string): Promise<Cart[]> {
    return await db.select().from(cart).where(eq(cart.customerId, customerId));
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
      const [updated] = await db.update(shopSettings).set({ 
        ...settings,
        updatedAt: new Date() 
      }).where(eq(shopSettings.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(shopSettings).values({
        shopEmail: settings.shopEmail || 'info@hibla.com',
        ...settings
      }).returning();
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
}

export const storage = new DatabaseStorage();