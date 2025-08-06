import { db } from "./db";
import { eq, desc, and, like, gte, sql } from "drizzle-orm";
import {
  users,
  customers,
  products,
  categories,
  suppliers,
  orders,
  orderItems,
  cart,
  wishlist,
  reviews,
  inventoryTransactions,
  shopSettings
} from "@shared/schema";

import type {
  User,
  Customer,
  Product,
  InsertUser,
  InsertCustomer,
  InsertProduct
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Customer management
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(insertCustomer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

  // Product management
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Quotation management (placeholder for now)
  getQuotations(filters?: { status?: string; customer?: string }): Promise<any[]>;
  getSalesOrders(filters?: { status?: string; customer?: string }): Promise<any[]>;
  getJobOrders(filters?: { customer?: string }): Promise<any[]>;
  getPriceLists(): Promise<any[]>;
  getWarehouses(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

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

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [customer] = await db.update(customers).set(updates).where(eq(customers.id, id)).returning();
    return customer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
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

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getProductPrice(productId: string, priceListId: string): Promise<number> {
    // Implementation for VLOOKUP price functionality
    // This would typically query a price_list_items table or similar
    return 0; // Placeholder
  }

  // Price list management
  async getPriceLists(): Promise<PriceList[]> {
    return await db.select().from(priceLists).orderBy(desc(priceLists.createdAt));
  }

  async getPriceList(id: string): Promise<PriceList | undefined> {
    const [priceList] = await db.select().from(priceLists).where(eq(priceLists.id, id));
    return priceList || undefined;
  }

  async createPriceList(insertPriceList: InsertPriceList): Promise<PriceList> {
    const [priceList] = await db.insert(priceLists).values(insertPriceList).returning();
    return priceList;
  }

  async updatePriceList(id: string, updates: Partial<InsertPriceList>): Promise<PriceList> {
    const [priceList] = await db.update(priceLists).set(updates).where(eq(priceLists.id, id)).returning();
    return priceList;
  }

  async deletePriceList(id: string): Promise<void> {
    await db.delete(priceLists).where(eq(priceLists.id, id));
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

  async getQuotationWithItems(id: string): Promise<(Quotation & { items: QuotationItem[] }) | undefined> {
    const quotation = await this.getQuotation(id);
    if (!quotation) return undefined;
    
    const items = await this.getQuotationItems(id);
    return { ...quotation, items };
  }

  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    const [quotation] = await db.insert(quotations).values(insertQuotation).returning();
    return quotation;
  }

  async updateQuotation(id: string, updates: Partial<InsertQuotation>): Promise<Quotation> {
    const [quotation] = await db.update(quotations).set(updates).where(eq(quotations.id, id)).returning();
    return quotation;
  }

  async deleteQuotation(id: string): Promise<void> {
    await db.delete(quotations).where(eq(quotations.id, id));
  }

  async duplicateQuotation(id: string): Promise<Quotation> {
    const original = await this.getQuotationWithItems(id);
    if (!original) throw new Error("Quotation not found");
    
    // Create new quotation with incremented number
    const newQuotation = await this.createQuotation({
      quotationNumber: `${original.quotationNumber}-COPY`,
      revisionNumber: "R0",
      customerCode: original.customerCode,
      country: original.country,
      priceListId: original.priceListId,
      paymentMethod: original.paymentMethod,
      shippingMethod: original.shippingMethod,
      shippingFee: original.shippingFee,
      bankCharge: original.bankCharge,
      discount: original.discount,
      others: original.others,
      subtotal: original.subtotal,
      total: original.total,
      customerServiceInstructions: original.customerServiceInstructions,
      status: "draft"
    });

    // Duplicate items
    for (const item of original.items) {
      await this.createQuotationItem({
        quotationId: newQuotation.id,
        productId: item.productId,
        productName: item.productName,
        specification: item.specification,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      });
    }

    return newQuotation;
  }

  // Quotation items management
  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    return await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
  }

  async createQuotationItem(insertQuotationItem: InsertQuotationItem): Promise<QuotationItem> {
    const [item] = await db.insert(quotationItems).values(insertQuotationItem).returning();
    return item;
  }

  async updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem> {
    const [item] = await db.update(quotationItems).set(updates).where(eq(quotationItems.id, id)).returning();
    return item;
  }

  async deleteQuotationItem(id: string): Promise<void> {
    await db.delete(quotationItems).where(eq(quotationItems.id, id));
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

  async getSalesOrderWithItems(id: string): Promise<(SalesOrder & { items: SalesOrderItem[] }) | undefined> {
    const salesOrder = await this.getSalesOrder(id);
    if (!salesOrder) return undefined;
    
    const items = await this.getSalesOrderItems(id);
    return { ...salesOrder, items };
  }

  async createSalesOrder(insertSalesOrder: InsertSalesOrder): Promise<SalesOrder> {
    const [salesOrder] = await db.insert(salesOrders).values(insertSalesOrder).returning();
    return salesOrder;
  }

  async updateSalesOrder(id: string, updates: Partial<InsertSalesOrder>): Promise<SalesOrder> {
    const [salesOrder] = await db.update(salesOrders).set(updates).where(eq(salesOrders.id, id)).returning();
    return salesOrder;
  }

  async deleteSalesOrder(id: string): Promise<void> {
    await db.delete(salesOrders).where(eq(salesOrders.id, id));
  }

  async confirmSalesOrder(id: string): Promise<SalesOrder> {
    const [salesOrder] = await db.update(salesOrders)
      .set({ isConfirmed: true })
      .where(eq(salesOrders.id, id))
      .returning();
    return salesOrder;
  }

  // Sales order items management
  async getSalesOrderItems(salesOrderId: string): Promise<SalesOrderItem[]> {
    return await db.select().from(salesOrderItems).where(eq(salesOrderItems.salesOrderId, salesOrderId));
  }

  async createSalesOrderItem(insertSalesOrderItem: InsertSalesOrderItem): Promise<SalesOrderItem> {
    const [item] = await db.insert(salesOrderItems).values(insertSalesOrderItem).returning();
    return item;
  }

  async updateSalesOrderItem(id: string, updates: Partial<InsertSalesOrderItem>): Promise<SalesOrderItem> {
    const [item] = await db.update(salesOrderItems).set(updates).where(eq(salesOrderItems.id, id)).returning();
    return item;
  }

  async deleteSalesOrderItem(id: string): Promise<void> {
    await db.delete(salesOrderItems).where(eq(salesOrderItems.id, id));
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

  async getJobOrderWithItems(id: string): Promise<(JobOrder & { items: JobOrderItem[] }) | undefined> {
    const jobOrder = await this.getJobOrder(id);
    if (!jobOrder) return undefined;
    
    const items = await this.getJobOrderItems(id);
    return { ...jobOrder, items };
  }

  async createJobOrder(insertJobOrder: InsertJobOrder): Promise<JobOrder> {
    const [jobOrder] = await db.insert(jobOrders).values(insertJobOrder).returning();
    return jobOrder;
  }

  async updateJobOrder(id: string, updates: Partial<InsertJobOrder>): Promise<JobOrder> {
    const [jobOrder] = await db.update(jobOrders).set(updates).where(eq(jobOrders.id, id)).returning();
    return jobOrder;
  }

  async deleteJobOrder(id: string): Promise<void> {
    await db.delete(jobOrders).where(eq(jobOrders.id, id));
  }

  // Job order items management
  async getJobOrderItems(jobOrderId: string): Promise<JobOrderItem[]> {
    return await db.select().from(jobOrderItems).where(eq(jobOrderItems.jobOrderId, jobOrderId));
  }

  async createJobOrderItem(insertJobOrderItem: InsertJobOrderItem): Promise<JobOrderItem> {
    const [item] = await db.insert(jobOrderItems).values(insertJobOrderItem).returning();
    return item;
  }

  async updateJobOrderItem(id: string, updates: Partial<InsertJobOrderItem>): Promise<JobOrderItem> {
    const [item] = await db.update(jobOrderItems).set(updates).where(eq(jobOrderItems.id, id)).returning();
    return item;
  }

  async deleteJobOrderItem(id: string): Promise<void> {
    await db.delete(jobOrderItems).where(eq(jobOrderItems.id, id));
  }

  async updateJobOrderItemShipment(itemId: string, shipmentNumber: number, quantity: number): Promise<JobOrderItem> {
    const updates = { [`shipment${shipmentNumber}`]: quantity } as any;
    const [item] = await db.update(jobOrderItems).set(updates).where(eq(jobOrderItems.id, itemId)).returning();
    return item;
  }

  // Warehouse management
  async getWarehouses(): Promise<Warehouse[]> {
    return await db.select().from(warehouses).orderBy(desc(warehouses.createdAt));
  }

  async getWarehouse(id: string): Promise<Warehouse | undefined> {
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.id, id));
    return warehouse || undefined;
  }

  async createWarehouse(insertWarehouse: InsertWarehouse): Promise<Warehouse> {
    const [warehouse] = await db.insert(warehouses).values(insertWarehouse).returning();
    return warehouse;
  }

  async updateWarehouse(id: string, updates: Partial<InsertWarehouse>): Promise<Warehouse> {
    const [warehouse] = await db.update(warehouses).set(updates).where(eq(warehouses.id, id)).returning();
    return warehouse;
  }

  async deleteWarehouse(id: string): Promise<void> {
    await db.delete(warehouses).where(eq(warehouses.id, id));
  }

  // Inventory management
  async getInventoryItems(warehouseId?: string): Promise<InventoryItem[]> {
    let query = db.select().from(inventoryItems);
    
    if (warehouseId) {
      query = query.where(eq(inventoryItems.warehouseId, warehouseId));
    }
    
    return await query.orderBy(desc(inventoryItems.createdAt));
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item || undefined;
  }

  async createInventoryItem(insertInventoryItem: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db.insert(inventoryItems).values(insertInventoryItem).returning();
    return item;
  }

  async updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const [item] = await db.update(inventoryItems).set(updates).where(eq(inventoryItems.id, id)).returning();
    return item;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
  }

  // Production receipts
  async getProductionReceipts(): Promise<ProductionReceipt[]> {
    return await db.select().from(productionReceipts).orderBy(desc(productionReceipts.createdAt));
  }

  async createProductionReceipt(insertProductionReceipt: InsertProductionReceipt): Promise<ProductionReceipt> {
    const [receipt] = await db.insert(productionReceipts).values(insertProductionReceipt).returning();
    return receipt;
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  // Customer payments
  async getCustomerPayments(): Promise<CustomerPayment[]> {
    return await db.select().from(customerPayments).orderBy(desc(customerPayments.createdAt));
  }

  async createCustomerPayment(insertCustomerPayment: InsertCustomerPayment): Promise<CustomerPayment> {
    const [payment] = await db.insert(customerPayments).values(insertCustomerPayment).returning();
    return payment;
  }

  // Shipments
  async getShipments(): Promise<Shipment[]> {
    return await db.select().from(shipments).orderBy(desc(shipments.createdAt));
  }

  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const [shipment] = await db.insert(shipments).values(insertShipment).returning();
    return shipment;
  }
}

export const storage = new DatabaseStorage();