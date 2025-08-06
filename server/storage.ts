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
  warehouses
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
  createQuotation(insertQuotation: InsertQuotation): Promise<Quotation>;
  createQuotationItem(insertQuotationItem: InsertQuotationItem): Promise<QuotationItem>;

  // Sales order management
  getSalesOrders(filters?: { status?: string; customer?: string }): Promise<SalesOrder[]>;
  getSalesOrder(id: string): Promise<SalesOrder | undefined>;
  createSalesOrder(insertSalesOrder: InsertSalesOrder): Promise<SalesOrder>;

  // Job order management
  getJobOrders(filters?: { customer?: string }): Promise<JobOrder[]>;
  getJobOrder(id: string): Promise<JobOrder | undefined>;
  createJobOrder(insertJobOrder: InsertJobOrder): Promise<JobOrder>;
}

export class DatabaseStorage implements IStorage {
  // Customer management
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(insertCustomer).returning();
    return customer;
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
      query = query.where(eq(quotations.status, filters.status));
    }
    if (filters?.customer) {
      query = query.where(eq(quotations.customerCode, filters.customer));
    }
    
    return await query.orderBy(desc(quotations.createdAt));
  }

  async getQuotation(id: string): Promise<Quotation | undefined> {
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, id));
    return quotation || undefined;
  }

  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    const [quotation] = await db.insert(quotations).values(insertQuotation).returning();
    return quotation;
  }

  async createQuotationItem(insertQuotationItem: InsertQuotationItem): Promise<QuotationItem> {
    const [item] = await db.insert(quotationItems).values(insertQuotationItem).returning();
    return item;
  }

  // Sales order management
  async getSalesOrders(filters?: { status?: string; customer?: string }): Promise<SalesOrder[]> {
    let query = db.select().from(salesOrders);
    
    if (filters?.customer) {
      query = query.where(eq(salesOrders.customerCode, filters.customer));
    }
    
    return await query.orderBy(desc(salesOrders.createdAt));
  }

  async getSalesOrder(id: string): Promise<SalesOrder | undefined> {
    const [salesOrder] = await db.select().from(salesOrders).where(eq(salesOrders.id, id));
    return salesOrder || undefined;
  }

  async createSalesOrder(insertSalesOrder: InsertSalesOrder): Promise<SalesOrder> {
    const [salesOrder] = await db.insert(salesOrders).values(insertSalesOrder).returning();
    return salesOrder;
  }

  // Job order management
  async getJobOrders(filters?: { customer?: string }): Promise<JobOrder[]> {
    let query = db.select().from(jobOrders);
    
    if (filters?.customer) {
      query = query.where(eq(jobOrders.customerCode, filters.customer));
    }
    
    return await query.orderBy(desc(jobOrders.dateCreated));
  }

  async getJobOrder(id: string): Promise<JobOrder | undefined> {
    const [jobOrder] = await db.select().from(jobOrders).where(eq(jobOrders.id, id));
    return jobOrder || undefined;
  }

  async createJobOrder(insertJobOrder: InsertJobOrder): Promise<JobOrder> {
    const [jobOrder] = await db.insert(jobOrders).values(insertJobOrder).returning();
    return jobOrder;
  }
}

export const storage = new DatabaseStorage();