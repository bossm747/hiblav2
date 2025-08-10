import { db } from "./db";
import { eq, desc, and, like, gte, lte, sql } from "drizzle-orm";
import {
  customers,
  categories,
  products,
  quotations,
  quotationItems,
  salesOrders,
  salesOrderItems,
  jobOrders,
  jobOrderItems,
  priceLists,
  warehouses,
  staff,
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
  stylistReviews
} from "@shared/schema";

import type {
  Customer,
  Product,
  Quotation,
  QuotationItem,
  SalesOrder,
  SalesOrderItem,
  JobOrder,
  JobOrderItem,
  PriceList,
  Warehouse,
  InsertCustomer,
  InsertProduct,
  InsertQuotation,
  InsertQuotationItem,
  InsertSalesOrder,
  InsertSalesOrderItem,
  InsertJobOrder,
  InsertJobOrderItem,
  InsertPriceList,
  InsertWarehouse,
  Staff,
  InsertStaff,
  Supplier,
  InsertSupplier,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  Cart,
  InsertCart,
  Wishlist,
  InsertWishlist,
  Review,
  InsertReview,
  InventoryTransaction,
  InsertInventoryTransaction,
  ShopSettings,
  InsertShopSettings,
  Client,
  InsertClient,
  Service,
  InsertService,
  Appointment,
  InsertAppointment,
  StaffSchedule,
  InsertStaffSchedule,
  Stylist,
  InsertStylist,
  CustomerPreferences,
  InsertCustomerPreferences,
  StylistRecommendation,
  InsertStylistRecommendation,
  StylistReview,
  InsertStylistReview
} from "@shared/schema";

export interface IStorage {
  // Customer management
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByCode(customerCode: string): Promise<Customer | undefined>;
  createCustomer(insertCustomer: InsertCustomer): Promise<Customer>;

  // Category management
  getCategories(): Promise<any[]>;
  getCategory(id: string): Promise<any | undefined>;
  createCategory(insertCategory: any): Promise<any>;
  updateCategory(id: string, data: any): Promise<any>;

  // Product management
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;

  // Price list management
  getPriceLists(): Promise<PriceList[]>;
  getPriceList(id: string): Promise<PriceList | undefined>;
  getPriceListByCode(code: string): Promise<PriceList | undefined>;
  createPriceList(insertPriceList: InsertPriceList): Promise<PriceList>;
  updatePriceList(id: string, data: Partial<InsertPriceList>): Promise<PriceList | undefined>;
  deletePriceList(id: string): Promise<boolean>;

  // Warehouse management
  getWarehouses(): Promise<Warehouse[]>;
  createWarehouse(insertWarehouse: InsertWarehouse): Promise<Warehouse>;

  // Quotation management
  getQuotations(filters?: { status?: string; customer?: string }): Promise<Quotation[]>;
  getQuotation(id: string): Promise<Quotation | undefined>;
  getLatestQuotation(): Promise<Quotation | undefined>;
  createQuotation(insertQuotation: InsertQuotation): Promise<Quotation>;
  createQuotationItem(insertQuotationItem: InsertQuotationItem): Promise<QuotationItem>;
  getQuotationItems(quotationId: string): Promise<QuotationItem[]>;

  // Price list management
  getAllPriceLists(): Promise<any[]>;
  getProductPriceLists(productId?: string, priceListId?: string): Promise<any[]>;
  createProductPriceList(data: any): Promise<any>;
  bulkUpdateProductPrices(data: any): Promise<number>;
  createPriceList(data: any): Promise<any>;
  ensurePriceListsExist(): Promise<void>;

  // Sales order management
  getSalesOrders(filters?: { status?: string; customer?: string }): Promise<SalesOrder[]>;
  getSalesOrder(id: string): Promise<SalesOrder | undefined>;
  createSalesOrder(insertSalesOrder: InsertSalesOrder): Promise<SalesOrder>;

  // Job order management
  getJobOrders(filters?: { customer?: string }): Promise<JobOrder[]>;
  getJobOrder(id: string): Promise<JobOrder | undefined>;
  createJobOrder(insertJobOrder: InsertJobOrder): Promise<JobOrder>;
  getJobOrdersWithItems(filters?: { 
    dateFrom?: string; 
    dateTo?: string; 
    customer?: string; 
    item?: string; 
  }): Promise<any[]>;

  // Staff management
  getAllStaff(): Promise<any[]>;
  createStaff(data: any): Promise<any>;
  updateStaff(id: string, data: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<boolean>;
  
  // Supplier management
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;
  
  // Order management
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getCustomerOrders(customerId: string): Promise<Order[]>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getOrderStats(): Promise<any>;
  getRecentOrders(limit: number): Promise<Order[]>;
  getDailySales(date: string): Promise<Order[]>;
  
  // Cart management
  getCartItems(customerId: string): Promise<any[]>;
  addToCart(item: InsertCart): Promise<Cart>;
  updateCartItem(id: string, quantity: number): Promise<Cart | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(customerId: string): Promise<boolean>;
  
  // Wishlist management
  getWishlistItems(customerId: string): Promise<Wishlist[]>;
  addToWishlist(item: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(id: string): Promise<boolean>;
  
  // Reviews
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Inventory management
  getInventoryTransactions(): Promise<InventoryTransaction[]>;
  getInventoryTransactionsByProduct(productId: string): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  getLowStockProducts(): Promise<Product[]>;
  getProductInventoryTransactions(productId: string): Promise<InventoryTransaction[]>;
  
  // Shop settings
  getShopSettings(): Promise<ShopSettings | undefined>;
  updateShopSettings(settings: Partial<InsertShopSettings>): Promise<ShopSettings>;
  
  // Product search
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  
  // Salon/Spa - Clients
  getClient(id: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  
  // Salon/Spa - Services
  getService(id: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Salon/Spa - Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  getAppointmentsByStaff(staffId: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  
  // Staff schedules
  getStaffSchedule(id: string): Promise<StaffSchedule | undefined>;
  getStaffSchedules(): Promise<StaffSchedule[]>;
  getStaffScheduleByStaffAndDate(staffId: string, date: string): Promise<StaffSchedule | undefined>;
  createStaffSchedule(schedule: InsertStaffSchedule): Promise<StaffSchedule>;
  updateStaffSchedule(id: string, schedule: Partial<InsertStaffSchedule>): Promise<StaffSchedule | undefined>;
  deleteStaffSchedule(id: string): Promise<boolean>;
  
  // Stylist management
  getStylist(id: string): Promise<Stylist | undefined>;
  getStylists(): Promise<Stylist[]>;
  getActiveStylists(): Promise<Stylist[]>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  updateStylist(id: string, stylist: Partial<InsertStylist>): Promise<Stylist | undefined>;
  deleteStylist(id: string): Promise<boolean>;
  getStylistsByLocation(location: string): Promise<Stylist[]>;
  getStylistsBySpecialty(specialty: string): Promise<Stylist[]>;
  
  // Customer preferences
  getCustomerPreferences(customerId: string): Promise<CustomerPreferences | undefined>;
  createCustomerPreferences(preferences: InsertCustomerPreferences): Promise<CustomerPreferences>;
  updateCustomerPreferences(customerId: string, preferences: Partial<InsertCustomerPreferences>): Promise<CustomerPreferences | undefined>;
  
  // Stylist recommendations
  getStylistRecommendations(customerId: string): Promise<StylistRecommendation[]>;
  createStylistRecommendation(recommendation: InsertStylistRecommendation): Promise<StylistRecommendation>;
  updateRecommendationStatus(id: string, status: string, feedback?: string, rating?: number): Promise<StylistRecommendation | undefined>;
  
  // Additional methods for quotations and sales orders
  getQuotationsByCustomer(customerCode: string): Promise<Quotation[]>;
  getQuotationsByStatus(status: string): Promise<Quotation[]>;
  updateQuotation(id: string, quotation: Partial<InsertQuotation>): Promise<Quotation | undefined>;
  deleteQuotation(id: string): Promise<boolean>;
  deleteQuotationItems(quotationId: string): Promise<boolean>;
  
  getSalesOrdersByCustomer(customerCode: string): Promise<SalesOrder[]>;
  getSalesOrdersByStatus(status: string): Promise<SalesOrder[]>;
  getLatestSalesOrderForMonth(yearMonth: string): Promise<SalesOrder | undefined>;
  updateSalesOrder(id: string, salesOrder: Partial<InsertSalesOrder>): Promise<SalesOrder | undefined>;
  getSalesOrderItems(salesOrderId: string): Promise<SalesOrderItem[]>;
  createSalesOrderItem(item: InsertSalesOrderItem): Promise<SalesOrderItem>;
  
  getJobOrderItems(jobOrderId: string): Promise<JobOrderItem[]>;
  createJobOrderItem(item: InsertJobOrderItem): Promise<JobOrderItem>;
  updateJobOrder(id: string, jobOrder: Partial<InsertJobOrder>): Promise<JobOrder | undefined>;

  // Analytics methods
  getManufacturingStats(): Promise<any>;
  getSummaryReport(filters: {
    dateFrom?: string;
    dateTo?: string;
    customerCode?: string;
    orderItems?: string;
  }): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Category management implementation
  async getCategories(): Promise<any[]> {
    try {
      return await db.select().from(categories).orderBy(categories.name);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getCategory(id: string): Promise<any | undefined> {
    try {
      const [result] = await db.select().from(categories).where(eq(categories.id, id));
      return result || undefined;
    } catch (error) {
      console.error('Error fetching category:', error);
      return undefined;
    }
  }

  async createCategory(insertCategory: any): Promise<any> {
    try {
      const [result] = await db.insert(categories).values(insertCategory).returning();
      return result;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: string, data: any): Promise<any> {
    try {
      const [result] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
      return result;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Customer management
  async getCustomers(): Promise<Customer[]> {
    try {
      return await db.select().from(customers).orderBy(desc(customers.createdAt));
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    try {
      const [customer] = await db.select().from(customers).where(eq(customers.id, id));
      return customer || undefined;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return undefined;
    }
  }

  async getCustomerByCode(customerCode: string): Promise<Customer | undefined> {
    try {
      const [customer] = await db.select().from(customers).where(eq(customers.customerCode, customerCode));
      return customer || undefined;
    } catch (error) {
      console.error('Error fetching customer by code:', error);
      return undefined;
    }
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    try {
      // Ensure all required fields have values
      const customerData = {
        customerCode: insertCustomer.customerCode,
        name: insertCustomer.name,
        email: insertCustomer.email,
        password: insertCustomer.password || "temp-password-default",
        phone: insertCustomer.phone || "",
        country: insertCustomer.country,
        status: insertCustomer.status || "active",
        address: insertCustomer.address || null,
        city: insertCustomer.city || null,
        postalCode: insertCustomer.postalCode || null,
        totalOrders: 0,
        totalSpent: "0.00",
        lastOrder: null,
        emailVerified: false,
        paymentTerms: insertCustomer.paymentTerms || null,
        creditLimit: insertCustomer.creditLimit || null,
        preferredShipping: insertCustomer.preferredShipping || null
      };

      console.log('Creating customer with complete data:', customerData);
      const [customer] = await db.insert(customers).values(customerData).returning();
      console.log('Customer created successfully:', customer.id);
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Product management
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      console.log('Looking for product with ID:', id);
      const [product] = await db.select().from(products).where(eq(products.id, id));
      console.log('Found product:', product);
      return product || undefined;
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const [product] = await db.update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();
      return product || undefined;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await db.delete(categories).where(eq(categories.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Price list management
  async getPriceLists(): Promise<PriceList[]> {
    return await db.select().from(priceLists).orderBy(desc(priceLists.createdAt));
  }

  async getPriceList(id: string): Promise<PriceList | undefined> {
    const [priceList] = await db.select().from(priceLists).where(eq(priceLists.id, id));
    return priceList || undefined;
  }

  async getPriceListByCode(code: string): Promise<PriceList | undefined> {
    const [priceList] = await db.select().from(priceLists).where(eq(priceLists.code, code));
    return priceList || undefined;
  }

  async createPriceList(insertPriceList: InsertPriceList): Promise<PriceList> {
    const priceListData = {
      ...insertPriceList,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const [priceList] = await db.insert(priceLists).values(priceListData).returning();
    return priceList;
  }

  async updatePriceList(id: string, data: Partial<InsertPriceList>): Promise<PriceList | undefined> {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    const [priceList] = await db
      .update(priceLists)
      .set(updateData)
      .where(eq(priceLists.id, id))
      .returning();
    return priceList || undefined;
  }

  async deletePriceList(id: string): Promise<boolean> {
    try {
      // Check if price list is in use by customers
      const customersUsingPriceList = await db
        .select()
        .from(customers)
        .where(eq(customers.priceListId, id))
        .limit(1);

      if (customersUsingPriceList.length > 0) {
        throw new Error("Cannot delete price list that is in use by customers");
      }

      const result = await db.delete(priceLists).where(eq(priceLists.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting price list:', error);
      throw error;
    }
  }

  // Warehouse management
  async getWarehouses(): Promise<Warehouse[]> {
    return await db.select().from(warehouses).orderBy(desc(warehouses.createdAt));
  }

  async createWarehouse(insertWarehouse: InsertWarehouse): Promise<Warehouse> {
    const [warehouse] = await db.insert(warehouses).values(insertWarehouse).returning();
    return warehouse;
  }

  // Quotation management
  async getQuotations(filters?: { status?: string; customer?: string }): Promise<Quotation[]> {
    let query = db.select().from(quotations);

    if (filters?.status) {
      query = query.where(eq(quotations.status, filters.status)) as any;
    }
    if (filters?.customer) {
      query = query.where(eq(quotations.customerCode, filters.customer)) as any;
    }

    return await query.orderBy(desc(quotations.createdAt));
  }

  async getQuotation(id: string): Promise<Quotation | undefined> {
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, id));
    return quotation || undefined;
  }

  async getLatestQuotation(): Promise<Quotation | undefined> {
    try {
      const [quotation] = await db.select().from(quotations).orderBy(desc(quotations.createdAt)).limit(1);
      return quotation || undefined;
    } catch (error) {
      console.error('Error fetching latest quotation:', error);
      return undefined;
    }
  }

  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    // Generate quotation number if not provided
    const quotationData = {
      ...insertQuotation,
      quotationNumber: insertQuotation.quotationNumber || await this.generateQuotationNumber(),
    };
    const [quotation] = await db.insert(quotations).values(quotationData).returning();
    return quotation;
  }

  async createQuotationItem(insertQuotationItem: InsertQuotationItem): Promise<QuotationItem> {
    const [item] = await db.insert(quotationItems).values(insertQuotationItem).returning();
    return item;
  }

  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    try {
      const items = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
      return items || [];
    } catch (error) {
      console.error('Error fetching quotation items:', error);
      return [];
    }
  }

  // Sales order management
  async getSalesOrders(filters?: { status?: string; customer?: string }): Promise<SalesOrder[]> {
    try {
      let query = db.select().from(salesOrders);

      if (filters?.status) {
        query = query.where(eq(salesOrders.status, filters.status)) as any;
      }
      if (filters?.customer) {
        query = query.where(eq(salesOrders.customerCode, filters.customer)) as any;
      }

      const result = await query.orderBy(desc(salesOrders.createdAt));
      return result || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      throw new Error('Failed to fetch sales orders');
    }
  }

  async getSalesOrder(id: string): Promise<SalesOrder | undefined> {
    try {
      const [salesOrder] = await db.select().from(salesOrders).where(eq(salesOrders.id, id));
      return salesOrder || undefined;
    } catch (error) {
      console.error('Error fetching sales order:', error);
      return undefined;
    }
  }

  async createSalesOrder(insertSalesOrder: InsertSalesOrder): Promise<SalesOrder> {
    try {
      const salesOrderData = {
        ...insertSalesOrder,
        salesOrderNumber: insertSalesOrder.salesOrderNumber || await this.generateSalesOrderNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const [salesOrder] = await db.insert(salesOrders).values(salesOrderData).returning();
      return salesOrder;
    } catch (error) {
      console.error('Error creating sales order:', error);
      throw new Error('Failed to create sales order');
    }
  }

  // Job order management
  async getJobOrders(filters?: { customer?: string }): Promise<JobOrder[]> {
    try {
      let query = db.select().from(jobOrders);

      if (filters?.customer) {
        query = query.where(eq(jobOrders.customerCode, filters.customer)) as any;
      }

      const result = await query.orderBy(desc(jobOrders.createdAt));
      return result || [];
    } catch (error) {
      console.error('Error fetching job orders:', error);
      throw new Error('Failed to fetch job orders');
    }
  }

  async getJobOrder(id: string): Promise<JobOrder | undefined> {
    try {
      const [jobOrder] = await db.select().from(jobOrders).where(eq(jobOrders.id, id));
      return jobOrder || undefined;
    } catch (error) {
      console.error('Error fetching job order:', error);
      return undefined;
    }
  }

  async createJobOrder(insertJobOrder: InsertJobOrder): Promise<JobOrder> {
    try {
      const jobOrderData = {
        ...insertJobOrder,
        jobOrderNumber: insertJobOrder.jobOrderNumber || await this.generateJobOrderNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const [jobOrder] = await db.insert(jobOrders).values(jobOrderData).returning();
      return jobOrder;
    } catch (error) {
      console.error('Error creating job order:', error);
      throw new Error('Failed to create job order');
    }
  }

  async getJobOrdersWithItems(filters?: { 
    dateFrom?: string; 
    dateTo?: string; 
    customer?: string; 
    item?: string; 
  }): Promise<any[]> {
    try {
    let query = db.select({
      id: jobOrders.id,
      jobOrderNumber: jobOrders.jobOrderNumber,
      customerCode: jobOrders.customerCode,
      dueDate: jobOrders.dueDate,
      dateCreated: jobOrders.createdAt,
      createdAt: jobOrders.createdAt,
      // Job order item fields
      itemId: jobOrderItems.id,
      productName: jobOrderItems.productName,
      specification: jobOrderItems.specification,
      quantity: jobOrderItems.quantity,
      ready: jobOrderItems.ready,
      toProduce: jobOrderItems.toProduce,
      reserved: jobOrderItems.reserved,
      shipped: jobOrderItems.shipped,
    })
    .from(jobOrders)
    .leftJoin(jobOrderItems, eq(jobOrders.id, jobOrderItems.jobOrderId));

    // Apply filters
    const conditions = [];

    if (filters?.dateFrom) {
      conditions.push(gte(jobOrders.createdAt, new Date(filters.dateFrom)));
    }

    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      conditions.push(sql`${jobOrders.createdAt} <= ${toDate}`);
    }

    if (filters?.customer) {
      conditions.push(eq(jobOrders.customerCode, filters.customer));
    }

    if (filters?.item) {
      conditions.push(like(jobOrderItems.productName, `%${filters.item}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query.orderBy(desc(jobOrders.createdAt));

    // Group results by job order
    const grouped = results.reduce((acc: any, row: any) => {
      const jobOrderId = row.id;

      if (!acc[jobOrderId]) {
        acc[jobOrderId] = {
          id: row.id,
          jobOrderNumber: row.jobOrderNumber,
          customerCode: row.customerCode,
          dueDate: row.dueDate,
          dateCreated: row.dateCreated,
          items: []
        };
      }

      if (row.itemId) {
        acc[jobOrderId].items.push({
          id: row.itemId,
          productName: row.productName,
          specification: row.specification,
          quantity: row.quantity,
          ready: row.ready,
          toProduce: row.toProduce,
          reserved: row.reserved,
          shipped: row.shipped
        });
      }

      return acc;
    }, {});

    return Object.values(grouped);
    } catch (error) {
      console.error('Error fetching job orders with items:', error);
      throw new Error('Failed to fetch job orders with items');
    }
  }

  // Add missing getManufacturingStats method
  async getManufacturingStats(): Promise<any> {
    try {
      const [quotations, salesOrders, jobOrders, products, warehouses] = await Promise.all([
        this.getQuotations(),
        this.getSalesOrders(),
        this.getJobOrders(),
        this.getProducts(),
        this.getWarehouses()
      ]);

      const totalRevenue = salesOrders.reduce((sum, so) => sum + parseFloat(so.pleasePayThisAmountUsd || '0'), 0);

      return {
        totalQuotations: quotations.length,
        pendingQuotations: quotations.filter(q => q.status === 'pending').length,
        approvedQuotations: quotations.filter(q => q.status === 'approved').length,
        totalSalesOrders: salesOrders.length,
        confirmedSalesOrders: salesOrders.filter(so => so.status === 'confirmed').length,
        totalJobOrders: jobOrders.length,
        activeJobOrders: jobOrders.filter(jo => jo.status === 'active' || jo.status === 'in_progress').length,
        totalProducts: products.length,
        totalWarehouses: warehouses.length,
        revenue: totalRevenue,
        averageOrderValue: salesOrders.length > 0 ? totalRevenue / salesOrders.length : 0
      };
    } catch (error) {
      console.error('Error fetching manufacturing stats:', error);
      throw new Error('Failed to fetch manufacturing stats');
    }
  }

  // Staff management methods
  async getAllStaff(): Promise<any[]> {
    try {
      const staffList = await db.select().from(staff);
      return staffList.length > 0 ? staffList : await this.ensureDefaultStaffExists();
    } catch (error) {
      console.error('Error getting staff:', error);
      return await this.ensureDefaultStaffExists();
    }
  }

  async ensureDefaultStaffExists(): Promise<any[]> {
    try {
      const defaultStaff = {
        id: "staff-admin-001",
        name: "Admin User",
        email: "admin@hibla.com",
        password: "temp-admin-password",
        role: "admin",
        permissions: ["manage_quotations", "manage_orders", "view_reports"],
        isActive: true
      };

      // Try to insert, ignore if already exists
      const [staffMember] = await db.insert(staff).values(defaultStaff).returning().catch(() => [defaultStaff]);
      console.log('Default staff ensured:', staffMember.id);
      return [staffMember];
    } catch (error) {
      console.error('Error creating default staff:', error);
      // Return mock data if database insert fails
      return [{
        id: "staff-admin-001",
        name: "Admin User",
        email: "admin@hibla.com",
        role: "admin",
        isActive: true
      }];
    }
  }

  // Price Lists management
  async getAllPriceLists(): Promise<any[]> {
    try {
      const lists = await db.select().from(priceLists);
      return lists;
    } catch (error) {
      // Return default price lists if none exist
      return [
        { id: "price-list-a", name: "A", description: "Price List A" },
        { id: "price-list-b", name: "B", description: "Price List B" },
        { id: "price-list-c", name: "C", description: "Price List C" },
        { id: "price-list-d", name: "D", description: "Price List D" }
      ];
    }
  }

  async createPriceList(data: any): Promise<any> {
    try {
      const [priceList] = await db.insert(priceLists).values(data).returning();
      return priceList;
    } catch (error) {
      console.error('Error creating price list:', error);
      throw error;
    }
  }

  async ensurePriceListsExist(): Promise<void> {
    try {
      const existing = await db.select().from(priceLists);

      if (existing.length === 0) {
        // Create default price lists
        const defaultLists = [
          { name: "A", description: "Price List A", isActive: true },
          { name: "B", description: "Price List B", isActive: true },
          { name: "C", description: "Price List C", isActive: true },
          { name: "D", description: "Price List D", isActive: true }
        ];

        for (const list of defaultLists) {
          await db.insert(priceLists).values(list);
        }

        console.log('Default price lists created');
      }
    } catch (error) {
      console.error('Error ensuring price lists exist:', error);
    }
  }

  async createStaff(data: any): Promise<any> {
    // Return created staff - in real implementation, insert to staff table
    return {
      id: "staff-" + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Add missing getSummaryReport method
  async getSummaryReport(filters: {
    dateFrom?: string;
    dateTo?: string;
    customerCode?: string;
    orderItems?: string;
  }): Promise<any> {
    try {
      const jobOrdersWithItems = await this.getJobOrdersWithItems({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        customer: filters.customerCode,
        item: filters.orderItems
      });

      const summary = {
        totalOrders: jobOrdersWithItems.length,
        totalItems: jobOrdersWithItems.reduce((sum, order) => sum + order.items.length, 0),
        ordersByCustomer: {},
        itemsByProduct: {},
        orders: jobOrdersWithItems
      };

      // Group by customer
      jobOrdersWithItems.forEach(order => {
        if (!summary.ordersByCustomer[order.customerCode]) {
          summary.ordersByCustomer[order.customerCode] = 0;
        }
        summary.ordersByCustomer[order.customerCode]++;
      });

      // Group by product
      jobOrdersWithItems.forEach(order => {
        order.items.forEach(item => {
          if (!summary.itemsByProduct[item.productName]) {
            summary.itemsByProduct[item.productName] = 0;
          }
          summary.itemsByProduct[item.productName] += item.quantity;
        });
      });

      return summary;
    } catch (error) {
      console.error('Error generating summary report:', error);
      throw new Error('Failed to generate summary report');
    }
  }
  // Generate unique numbers for entities
  private async generateQuotationNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Get count of quotations for this month
    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0);

    const count = await db.select().from(quotations)
      .where(and(
        gte(quotations.createdAt, startOfMonth),
        lte(quotations.createdAt, endOfMonth)
      ));

    const nextNumber = count.length + 1;
    const timestamp = Date.now().toString().slice(-3);
    return `${year}.${month}.${String(nextNumber).padStart(3, '0')}-${timestamp}`;
  }

  private async generateSalesOrderNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0);

    const count = await db.select().from(salesOrders)
      .where(and(
        gte(salesOrders.createdAt, startOfMonth),
        gte(salesOrders.createdAt, endOfMonth)
      ));

    const nextNumber = count.length + 1;
    return `${year}.${month}.${String(nextNumber).padStart(3, '0')}`;
  }

  private async generateJobOrderNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0);

    const count = await db.select().from(jobOrders)
      .where(and(
        gte(jobOrders.createdAt, startOfMonth),
        gte(jobOrders.createdAt, endOfMonth)
      ));

    const nextNumber = count.length + 1;
    return `JO${year}${month}${String(nextNumber).padStart(3, '0')}`;
  }

  // Price Management methods
  async getAllPriceLists(): Promise<PriceList[]> {
    try {
      const result = await db.select().from(priceLists).where(eq(priceLists.isActive, true));
      return result || [];
    } catch (error) {
      console.error('Error fetching price lists:', error);
      throw new Error('Failed to fetch price lists');
    }
  }

  async getProductPriceLists(productId?: string, priceListId?: string): Promise<any[]> {
    try {
      // Return empty array for now since productPriceLists table doesn't exist yet
      // This is for the Price Management showcase demonstration
      return [];
    } catch (error) {
      console.error('Error fetching product price lists:', error);
      throw new Error('Failed to fetch product price lists');
    }
  }

  async createProductPriceList(data: any): Promise<any> {
    try {
      // Placeholder implementation for showcase
      // Would create entry in productPriceLists table in real implementation
      return { id: 'placeholder', ...data };
    } catch (error) {
      console.error('Error creating product price list:', error);
      throw new Error('Failed to create product price list');
    }
  }

  // Apply bulk pricing changes to all products
  async applyBulkPricing(data: {
    priceListId: string;
    action: 'add' | 'discount';
    percentage: number;
  }): Promise<{ updatedProducts: number }> {
    try {
      const { priceListId, action, percentage } = data;
      
      // Get all products
      const allProducts = await db.select().from(products);
      
      // Calculate new price multiplier for the price list
      const multiplier = action === 'add' 
        ? 1 + (percentage / 100)  // Add percentage (e.g., 15% increase = 1.15)
        : 1 - (percentage / 100); // Discount percentage (e.g., 15% discount = 0.85)
      
      // Update the price list multiplier
      await db
        .update(priceLists)
        .set({ priceMultiplier: multiplier.toString() })
        .where(eq(priceLists.id, priceListId));
      
      console.log(`Bulk pricing applied: ${action} ${percentage}% (multiplier: ${multiplier}) to price list ${priceListId}`);
      
      return {
        updatedProducts: allProducts.length
      };
    } catch (error) {
      console.error('Error applying bulk pricing:', error);
      throw new Error('Failed to apply bulk pricing');
    }
  }

  // Apply custom pricing to individual products
  async applyCustomPricing(data: {
    priceListId: string;
    customPrices: {[productId: string]: number};
  }): Promise<{ updatedProducts: number }> {
    try {
      const { priceListId, customPrices } = data;
      let updatedCount = 0;
      
      // For each custom price, we would typically create/update productPriceLists entries
      // For showcase purposes, we'll update the product SRP directly
      for (const [productId, customPrice] of Object.entries(customPrices)) {
        if (customPrice > 0) {
          await db
            .update(products)
            .set({ srp: customPrice.toString() })
            .where(eq(products.id, productId));
          updatedCount++;
        }
      }
      
      console.log(`Custom pricing applied to ${updatedCount} products for price list ${priceListId}`);
      
      return {
        updatedProducts: updatedCount
      };
    } catch (error) {
      console.error('Error applying custom pricing:', error);
      throw new Error('Failed to apply custom pricing');
    }
  }

  async createPriceList(data: any): Promise<any> {
    try {
      const [priceList] = await db
        .insert(priceLists)
        .values({
          ...data,
          priceMultiplier: data.priceMultiplier.toString(),
        })
        .returning();
      return priceList;
    } catch (error) {
      console.error('Error creating price list:', error);
      throw new Error('Failed to create price list');
    }
  }

  async updatePriceList(id: string, data: any): Promise<any> {
    try {
      const [updatedPriceList] = await db
        .update(priceLists)
        .set({
          ...data,
          priceMultiplier: data.priceMultiplier.toString(),
        })
        .where(eq(priceLists.id, id))
        .returning();
      
      if (!updatedPriceList) {
        throw new Error('Price list not found');
      }
      
      return updatedPriceList;
    } catch (error) {
      console.error('Error updating price list:', error);
      throw new Error('Failed to update price list');
    }
  }

  async deletePriceList(id: string): Promise<void> {
    try {
      // Check if it's the default price list
      const [priceList] = await db
        .select()
        .from(priceLists)
        .where(eq(priceLists.id, id))
        .limit(1);
      
      if (!priceList) {
        throw new Error('Price list not found');
      }
      
      if (priceList.isDefault) {
        throw new Error('Cannot delete the default price list');
      }
      
      // Delete the price list
      await db
        .delete(priceLists)
        .where(eq(priceLists.id, id));
      
      console.log(`Price list ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting price list:', error);
      throw new Error('Failed to delete price list');
    }
  }

}

export const storage = new DatabaseStorage();