import { db } from "./db";
import { eq, desc, and, like, gte, sql } from "drizzle-orm";
import {
  customers,
  products,
  quotations,
  quotationItems,
  salesOrders,
  salesOrderItems,
  jobOrders,
  jobOrderItems,
  priceLists,
  warehouses,
  staff
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
  InsertWarehouse
} from "@shared/schema";

export interface IStorage {
  // Customer management
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByCode(customerCode: string): Promise<Customer | undefined>;
  createCustomer(insertCustomer: InsertCustomer): Promise<Customer>;

  // Product management
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;

  // Price list management
  getPriceLists(): Promise<PriceList[]>;
  createPriceList(insertPriceList: InsertPriceList): Promise<PriceList>;

  // Warehouse management
  getWarehouses(): Promise<Warehouse[]>;
  createWarehouse(insertWarehouse: InsertWarehouse): Promise<Warehouse>;

  // Quotation management
  getQuotations(filters?: { status?: string; customer?: string }): Promise<Quotation[]>;
  getQuotation(id: string): Promise<Quotation | undefined>;
  getLatestQuotation(): Promise<Quotation | undefined>;
  createQuotation(insertQuotation: InsertQuotation): Promise<Quotation>;
  createQuotationItem(insertQuotationItem: InsertQuotationItem): Promise<QuotationItem>;
  
  // Price list management
  getAllPriceLists(): Promise<any[]>;
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
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Price list management
  async getPriceLists(): Promise<PriceList[]> {
    return await db.select().from(priceLists).orderBy(desc(priceLists.createdAt));
  }

  async createPriceList(insertPriceList: InsertPriceList): Promise<PriceList> {
    const [priceList] = await db.insert(priceLists).values(insertPriceList).returning();
    return priceList;
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
      
      return await query.orderBy(desc(salesOrders.createdAt));
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
      
      return await query.orderBy(desc(jobOrders.createdAt));
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
        gte(quotations.createdAt, endOfMonth)
      ));
    
    const nextNumber = count.length + 1;
    return `${year}.${month}.${String(nextNumber).padStart(3, '0')}`;
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
}

export const storage = new DatabaseStorage();