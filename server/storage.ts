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
  inventoryTransactions,
  productionReceipts,
  invoices,
  paymentRecords,
  emailSettings
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
  InventoryTransaction,
  InsertInventoryTransaction,
  Invoice,
  InsertInvoice,
  PaymentRecord,
  InsertPaymentRecord,
  ProductionReceipt,
  InsertProductionReceipt,
  EmailSettings,
  InsertEmailSettings
} from "@shared/schema";

export interface IStorage {
  // Customer Management
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  
  // Staff Management
  getStaff(): Promise<Staff[]>;
  getStaffById(id: string): Promise<Staff | null>;
  getStaffByEmail(email: string): Promise<Staff | null>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaff(id: string): Promise<void>;
  
  // Product Management
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Category Management
  getCategories(): Promise<any[]>;
  
  // Supplier Management
  getSuppliers(): Promise<any[]>;
  
  // Warehouse Management
  getWarehouses(): Promise<Warehouse[]>;
  getWarehouseById(id: string): Promise<Warehouse | null>;
  createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse>;
  updateWarehouse(id: string, warehouse: Partial<InsertWarehouse>): Promise<Warehouse>;
  
  // Price List Management
  getPriceLists(): Promise<PriceList[]>;
  getPriceListById(id: string): Promise<PriceList | null>;
  createPriceList(priceList: InsertPriceList): Promise<PriceList>;
  updatePriceList(id: string, priceList: Partial<InsertPriceList>): Promise<PriceList>;
  
  // Manufacturing Workflow - Quotations
  getQuotations(): Promise<Quotation[]>;
  getQuotationById(id: string): Promise<Quotation | null>;
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  updateQuotation(id: string, quotation: Partial<InsertQuotation>): Promise<Quotation>;
  deleteQuotation(id: string): Promise<void>;
  getQuotationItems(quotationId: string): Promise<QuotationItem[]>;
  
  // Manufacturing Workflow - Sales Orders
  getSalesOrders(): Promise<SalesOrder[]>;
  getSalesOrderById(id: string): Promise<SalesOrder | null>;
  createSalesOrder(salesOrder: InsertSalesOrder): Promise<SalesOrder>;
  updateSalesOrder(id: string, salesOrder: Partial<InsertSalesOrder>): Promise<SalesOrder>;
  getSalesOrderItems(salesOrderId: string): Promise<SalesOrderItem[]>;
  getSalesOrderCountForMonth(year: number, month: number): Promise<number>;
  updateInventoryReservations(salesOrderId: string): Promise<void>;
  cancelRelatedJobOrders(salesOrderId: string): Promise<void>;
  releaseReservedStock(salesOrderId: string): Promise<void>;
  
  // Manufacturing Workflow - Job Orders
  getJobOrders(): Promise<JobOrder[]>;
  getJobOrderById(id: string): Promise<JobOrder | null>;
  createJobOrder(jobOrder: InsertJobOrder): Promise<JobOrder>;
  updateJobOrder(id: string, jobOrder: Partial<InsertJobOrder>): Promise<JobOrder>;
  deleteJobOrder(id: string): Promise<void>;
  getJobOrderItems(jobOrderId: string): Promise<JobOrderItem[]>;
  updateJobOrderItemShipped(id: string, shippedAt: Date): Promise<JobOrderItem>;
  
  // Financial Management
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  
  // Payment Management
  getPaymentRecords(): Promise<PaymentRecord[]>;
  getPaymentRecordById(id: string): Promise<PaymentRecord | null>;
  createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord>;
  updatePaymentRecord(id: string, payment: Partial<InsertPaymentRecord>): Promise<PaymentRecord>;
  getPendingPayments(): Promise<PaymentRecord[]>;
  getPaymentStats(): Promise<any>;
  
  // Inventory Management
  getInventoryTransactions(): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  
  // Production Management
  getProductionReceipts(): Promise<ProductionReceipt[]>;
  createProductionReceipt(receipt: InsertProductionReceipt): Promise<ProductionReceipt>;
  
  // Email Settings
  getEmailSettings(): Promise<EmailSettings | null>;
  updateEmailSettings(settings: Partial<InsertEmailSettings>): Promise<EmailSettings>;
  
  // Dashboard Analytics
  getDashboardStats(): Promise<any>;
}

// Manufacturing-focused storage implementation
export class Storage implements IStorage {
  // Customer Management
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }
  
  async getCustomerById(id: string): Promise<Customer | null> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  
  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return updatedCustomer;
  }
  
  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }
  
  // Staff Management
  async getStaff(): Promise<Staff[]> {
    return await db.select().from(staff).orderBy(desc(staff.createdAt));
  }
  
  async getStaffById(id: string): Promise<Staff | null> {
    const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
    return result[0] || null;
  }
  
  async getStaffByEmail(email: string): Promise<Staff | null> {
    const result = await db.select().from(staff).where(eq(staff.email, email)).limit(1);
    return result[0] || null;
  }
  
  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffData).returning();
    return newStaff;
  }
  
  async updateStaff(id: string, staffData: Partial<InsertStaff>): Promise<Staff> {
    const [updatedStaff] = await db.update(staff).set(staffData).where(eq(staff.id, id)).returning();
    return updatedStaff;
  }
  
  async deleteStaff(id: string): Promise<void> {
    await db.delete(staff).where(eq(staff.id, id));
  }
  
  // Product Management
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }
  
  async getProductById(id: string): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
  
  // Warehouse Management
  async getWarehouses(): Promise<Warehouse[]> {
    return await db.select().from(warehouses).orderBy(desc(warehouses.createdAt));
  }
  
  async getWarehouseById(id: string): Promise<Warehouse | null> {
    const result = await db.select().from(warehouses).where(eq(warehouses.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse> {
    const [newWarehouse] = await db.insert(warehouses).values(warehouse).returning();
    return newWarehouse;
  }
  
  async updateWarehouse(id: string, warehouse: Partial<InsertWarehouse>): Promise<Warehouse> {
    const [updatedWarehouse] = await db.update(warehouses).set(warehouse).where(eq(warehouses.id, id)).returning();
    return updatedWarehouse;
  }
  
  // Category and Supplier Management (basic implementations)
  async getCategories(): Promise<any[]> {
    return await db.select().from(categories).orderBy(categories.displayOrder);
  }
  
  async getSuppliers(): Promise<any[]> {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }
  
  // Price List Management
  async getPriceLists(): Promise<PriceList[]> {
    return await db.select().from(priceLists).orderBy(priceLists.displayOrder);
  }
  
  async getPriceListById(id: string): Promise<PriceList | null> {
    const result = await db.select().from(priceLists).where(eq(priceLists.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createPriceList(priceList: InsertPriceList): Promise<PriceList> {
    const [newPriceList] = await db.insert(priceLists).values(priceList).returning();
    return newPriceList;
  }
  
  async updatePriceList(id: string, priceList: Partial<InsertPriceList>): Promise<PriceList> {
    const [updatedPriceList] = await db.update(priceLists).set(priceList).where(eq(priceLists.id, id)).returning();
    return updatedPriceList;
  }
  
  // Manufacturing Workflow - Quotations
  async getQuotations(): Promise<Quotation[]> {
    return await db.select().from(quotations).orderBy(desc(quotations.createdAt));
  }
  
  async getQuotationById(id: string): Promise<Quotation | null> {
    const result = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createQuotation(quotation: InsertQuotation): Promise<Quotation> {
    const [newQuotation] = await db.insert(quotations).values(quotation).returning();
    return newQuotation;
  }
  
  async updateQuotation(id: string, quotation: Partial<InsertQuotation>): Promise<Quotation> {
    const [updatedQuotation] = await db.update(quotations).set(quotation).where(eq(quotations.id, id)).returning();
    return updatedQuotation;
  }
  
  async deleteQuotation(id: string): Promise<void> {
    await db.delete(quotations).where(eq(quotations.id, id));
  }
  
  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    return await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
  }
  
  // Sales Orders
  async getSalesOrders(): Promise<SalesOrder[]> {
    return await db.select().from(salesOrders).orderBy(desc(salesOrders.createdAt));
  }

  async getSalesOrderCountForMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(salesOrders)
      .where(and(
        gte(salesOrders.createdAt, startDate),
        lte(salesOrders.createdAt, endDate)
      ));
    
    return result[0]?.count || 0;
  }

  async updateInventoryReservations(salesOrderId: string): Promise<void> {
    // This would update inventory reservations based on sales order items
    console.log(`Updating inventory reservations for sales order: ${salesOrderId}`);
  }

  async cancelRelatedJobOrders(salesOrderId: string): Promise<void> {
    // This would cancel all job orders related to the sales order
    console.log(`Cancelling job orders for sales order: ${salesOrderId}`);
  }

  async releaseReservedStock(salesOrderId: string): Promise<void> {
    // This would release reserved stock back to available inventory
    console.log(`Releasing reserved stock for sales order: ${salesOrderId}`);
  }
  
  async getSalesOrderById(id: string): Promise<SalesOrder | null> {
    const result = await db.select().from(salesOrders).where(eq(salesOrders.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createSalesOrder(salesOrder: InsertSalesOrder): Promise<SalesOrder> {
    const [newSalesOrder] = await db.insert(salesOrders).values(salesOrder).returning();
    return newSalesOrder;
  }
  
  async updateSalesOrder(id: string, salesOrder: Partial<InsertSalesOrder>): Promise<SalesOrder> {
    const [updatedSalesOrder] = await db.update(salesOrders).set(salesOrder).where(eq(salesOrders.id, id)).returning();
    return updatedSalesOrder;
  }
  
  async getSalesOrderItems(salesOrderId: string): Promise<SalesOrderItem[]> {
    return await db.select().from(salesOrderItems).where(eq(salesOrderItems.salesOrderId, salesOrderId));
  }
  
  // Job Orders
  async getJobOrders(): Promise<JobOrder[]> {
    return await db.select().from(jobOrders).orderBy(desc(jobOrders.createdAt));
  }
  
  async getJobOrderById(id: string): Promise<JobOrder | null> {
    const result = await db.select().from(jobOrders).where(eq(jobOrders.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createJobOrder(jobOrder: InsertJobOrder): Promise<JobOrder> {
    const [newJobOrder] = await db.insert(jobOrders).values(jobOrder).returning();
    return newJobOrder;
  }
  
  async updateJobOrder(id: string, jobOrder: Partial<InsertJobOrder>): Promise<JobOrder> {
    const [updatedJobOrder] = await db.update(jobOrders).set(jobOrder).where(eq(jobOrders.id, id)).returning();
    return updatedJobOrder;
  }
  
  async deleteJobOrder(id: string): Promise<void> {
    await db.delete(jobOrders).where(eq(jobOrders.id, id));
  }
  
  async getJobOrderItems(jobOrderId: string): Promise<JobOrderItem[]> {
    return await db.select().from(jobOrderItems).where(eq(jobOrderItems.jobOrderId, jobOrderId));
  }
  
  async updateJobOrderItemShipped(id: string, shippedAt: Date): Promise<JobOrderItem> {
    const [updatedItem] = await db.update(jobOrderItems)
      .set({ shippedAt })
      .where(eq(jobOrderItems.id, id))
      .returning();
    return updatedItem;
  }
  
  // Financial Management
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }
  
  async getInvoiceById(id: string): Promise<Invoice | null> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }
  
  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db.update(invoices).set(invoice).where(eq(invoices.id, id)).returning();
    return updatedInvoice;
  }
  
  // Payment Management
  async getPaymentRecords(): Promise<PaymentRecord[]> {
    return await db.select().from(paymentRecords).orderBy(desc(paymentRecords.createdAt));
  }
  
  async getPaymentRecordById(id: string): Promise<PaymentRecord | null> {
    const result = await db.select().from(paymentRecords).where(eq(paymentRecords.id, id)).limit(1);
    return result[0] || null;
  }
  
  async createPaymentRecord(payment: InsertPaymentRecord): Promise<PaymentRecord> {
    const [newPayment] = await db.insert(paymentRecords).values(payment).returning();
    return newPayment;
  }

  async updatePaymentRecord(id: string, payment: Partial<InsertPaymentRecord>): Promise<PaymentRecord> {
    const [updatedPayment] = await db.update(paymentRecords)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(paymentRecords.id, id))
      .returning();
    return updatedPayment;
  }

  async getPendingPayments(): Promise<PaymentRecord[]> {
    return await db.select().from(paymentRecords)
      .where(eq(paymentRecords.status, 'submitted'))
      .orderBy(desc(paymentRecords.createdAt));
  }

  async getPaymentStats(): Promise<any> {
    const [stats] = await db.select({
      totalSubmissions: sql<number>`count(*) filter (where status = 'submitted')`,
      totalVerified: sql<number>`count(*) filter (where status = 'verified')`,
      totalRejected: sql<number>`count(*) filter (where status = 'rejected')`,
      todaySubmissions: sql<number>`count(*) filter (where date(created_at) = current_date and status = 'submitted')`,
      pendingVerification: sql<number>`count(*) filter (where status = 'submitted')`,
      totalAmount: sql<number>`coalesce(sum(amount::numeric), 0)`,
    }).from(paymentRecords);
    return stats;
  }
  
  // Inventory Management
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return await db.select().from(inventoryTransactions).orderBy(desc(inventoryTransactions.createdAt));
  }
  
  async createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const [newTransaction] = await db.insert(inventoryTransactions).values(transaction).returning();
    return newTransaction;
  }
  
  // Production Management
  async getProductionReceipts(): Promise<ProductionReceipt[]> {
    return await db.select().from(productionReceipts).orderBy(desc(productionReceipts.createdAt));
  }
  
  async createProductionReceipt(receipt: InsertProductionReceipt): Promise<ProductionReceipt> {
    const [newReceipt] = await db.insert(productionReceipts).values(receipt).returning();
    return newReceipt;
  }
  
  // Email Settings
  async getEmailSettings(): Promise<EmailSettings | null> {
    const result = await db.select().from(emailSettings).limit(1);
    return result[0] || null;
  }
  
  async updateEmailSettings(settings: Partial<InsertEmailSettings>): Promise<EmailSettings> {
    const [updatedSettings] = await db.update(emailSettings)
      .set(settings)
      .where(eq(emailSettings.id, "default"))
      .returning();
    return updatedSettings;
  }
  

  
  async deletePriceList(id: string): Promise<void> {
    await db.delete(priceLists).where(eq(priceLists.id, id));
  }

  // Dashboard Analytics
  async getDashboardStats(): Promise<any> {
    const [customerCount] = await db.select({ count: sql<number>`count(*)` }).from(customers);
    const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const [quotationCount] = await db.select({ count: sql<number>`count(*)` }).from(quotations);
    const [salesOrderCount] = await db.select({ count: sql<number>`count(*)` }).from(salesOrders);
    const [jobOrderCount] = await db.select({ count: sql<number>`count(*)` }).from(jobOrders);
    
    return {
      customers: customerCount.count,
      products: productCount.count,
      quotations: quotationCount.count,
      salesOrders: salesOrderCount.count,
      jobOrders: jobOrderCount.count,
    };
  }
}

export const storage = new Storage();