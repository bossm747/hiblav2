import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ========================================
// CORE MANUFACTURING BUSINESS ENTITIES
// ========================================

// B2B Manufacturing Customers
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerCode: text("customer_code").notNull().unique(), // e.g., ABA, ABC, etc.
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(),
  country: text("country").notNull(),
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
  paymentTerms: text("payment_terms"), // NET30, COD, etc.
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  preferredShipping: text("preferred_shipping"), // DHL, UPS, FedEx, Agent, Pick Up
  priceCategory: text("price_category").default("REGULAR"), // NEW, REGULAR, PREMIER, CUSTOM
  priceListId: varchar("price_list_id").references(() => priceLists.id),
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

// Staff Management System
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

// Suppliers
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

// Products for Hair Manufacturing
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // e.g., "8\" Machine Weft Single Drawn, STRAIGHT"
  description: text("description"),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  hairType: text("hair_type").notNull().default("human"), // human hair only for Hibla
  texture: text("texture"), // straight, wavy, curly, kinky
  length: integer("length"), // in inches
  color: text("color"),
  weight: text("weight"), // in grams
  sku: text("sku").unique(),
  unit: text("unit").default("pcs"), // pcs, bundles, closures, frontals
  // Pricing system
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(), // Regular customer price
  srp: decimal("srp", { precision: 10, scale: 2 }), // Suggested Retail Price
  // Multi-warehouse inventory
  ngWarehouse: decimal("ng_warehouse", { precision: 10, scale: 2 }).default("0"),
  phWarehouse: decimal("ph_warehouse", { precision: 10, scale: 2 }).default("0"),
  reservedWarehouse: decimal("reserved_warehouse", { precision: 10, scale: 2 }).default("0"),
  redWarehouse: decimal("red_warehouse", { precision: 10, scale: 2 }).default("0"),
  adminWarehouse: decimal("admin_warehouse", { precision: 10, scale: 2 }).default("0"),
  wipWarehouse: decimal("wip_warehouse", { precision: 10, scale: 2 }).default("0"),
  lowStockThreshold: decimal("low_stock_threshold", { precision: 10, scale: 2 }).default("5"),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  images: text("images").array(),
  featuredImage: text("featured_image"),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================================
// PRICING MANAGEMENT SYSTEM
// ========================================

// Tiered Pricing System
export const priceLists = pgTable("price_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "New Customer", "Regular Customer", "Premier Customer"
  code: text("code").notNull().unique(), // "NEW", "REGULAR", "PREMIER", "CUSTOM"
  description: text("description"),
  priceMultiplier: decimal("price_multiplier", { precision: 5, scale: 4 }).default("1.0000"), // 1.15 for new, 1.0 for regular, 0.85 for premier
  isDefault: boolean("is_default").default(false), // Regular Customer should be default
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================================
// MANUFACTURING WORKFLOW SYSTEM
// ========================================

// Quotations (Step 1)
export const quotations = pgTable("quotations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationNumber: text("quotation_number").notNull().unique(),
  revisionNumber: text("revision_number").default("R0"),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  customerCode: text("customer_code").notNull(),
  country: text("country").notNull(),
  priceListId: varchar("price_list_id").references(() => priceLists.id),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 }).default("0"),
  bankCharge: decimal("bank_charge", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  others: decimal("others", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"), // bank, agent, money transfer, cash
  shippingMethod: text("shipping_method"), // DHL, UPS, Fed Ex, Agent, Pick Up
  customerServiceInstructions: text("customer_service_instructions"),
  status: text("status").default("draft"), // draft, sent, accepted, expired
  createdBy: varchar("created_by").references(() => staff.id).notNull(),
  createdByInitials: text("created_by_initials"),
  attachments: text("attachments").array(),
  validUntil: timestamp("valid_until"),
  canRevise: boolean("can_revise").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quotation Items
export const quotationItems = pgTable("quotation_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: varchar("quotation_id").references(() => quotations.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  specification: text("specification"),
  quantity: decimal("quantity", { precision: 10, scale: 1 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sales Orders (Step 2)
export const salesOrders = pgTable("sales_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  salesOrderNumber: text("sales_order_number").notNull().unique(), // Format: 2025.08.001
  revisionNumber: text("revision_number").default("R1"),
  quotationId: varchar("quotation_id").references(() => quotations.id),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  customerCode: text("customer_code").notNull(),
  country: text("country").notNull(),
  orderDate: timestamp("order_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  shippingMethod: text("shipping_method"),
  paymentMethod: text("payment_method"),
  createdBy: text("created_by").notNull(), // Creator initials
  // Pricing fields
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingChargeUsd: decimal("shipping_charge_usd", { precision: 12, scale: 2 }).default("0"),
  bankChargeUsd: decimal("bank_charge_usd", { precision: 12, scale: 2 }).default("0"),
  discountUsd: decimal("discount_usd", { precision: 12, scale: 2 }).default("0"),
  others: decimal("others", { precision: 12, scale: 2 }).default("0"),
  pleasePayThisAmountUsd: decimal("please_pay_this_amount_usd", { precision: 12, scale: 2 }).notNull(),
  customerServiceInstructions: text("customer_service_instructions"),
  status: text("status").default("draft"), // draft, confirmed, cancelled
  isConfirmed: boolean("is_confirmed").default(false),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sales Order Items
export const salesOrderItems = pgTable("sales_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  specification: text("specification"),
  quantity: decimal("quantity", { precision: 10, scale: 1 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job Orders (Step 3)
export const jobOrders = pgTable("job_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobOrderNumber: text("job_order_number").notNull().unique(), // Format: 2025.08.001
  revisionNumber: text("revision_number").default("R1"),
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  customerCode: text("customer_code").notNull(),
  date: timestamp("date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  createdBy: text("created_by").notNull(),
  productionDate: timestamp("production_date"),
  nameSignature: text("name_signature"),
  received: text("received"),
  orderInstructions: text("order_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job Order Items
export const jobOrderItems = pgTable("job_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobOrderId: varchar("job_order_id").references(() => jobOrders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  specification: text("specification"),
  quantity: decimal("quantity", { precision: 10, scale: 1 }).notNull(),
  // Shipment tracking columns
  shipment1: decimal("shipment_1", { precision: 10, scale: 2 }).default("0"),
  shipment2: decimal("shipment_2", { precision: 10, scale: 2 }).default("0"),
  shipment3: decimal("shipment_3", { precision: 10, scale: 2 }).default("0"),
  shipment4: decimal("shipment_4", { precision: 10, scale: 2 }).default("0"),
  shipment5: decimal("shipment_5", { precision: 10, scale: 2 }).default("0"),
  shipment6: decimal("shipment_6", { precision: 10, scale: 2 }).default("0"),
  shipment7: decimal("shipment_7", { precision: 10, scale: 2 }).default("0"),
  shipment8: decimal("shipment_8", { precision: 10, scale: 2 }).default("0"),
  // Calculated fields
  shipped: decimal("shipped", { precision: 10, scale: 2 }).default("0"),
  reserved: decimal("reserved", { precision: 10, scale: 2 }).default("0"),
  ready: decimal("ready", { precision: 10, scale: 2 }).default("0"),
  toProduce: decimal("to_produce", { precision: 10, scale: 2 }).default("0"),
  orderBalance: decimal("order_balance", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================================
// WAREHOUSE & INVENTORY MANAGEMENT
// ========================================

// Warehouse Locations
export const warehouses = pgTable("warehouses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // NG, PH, RESERVED, RED, ADMIN, WIP
  name: text("name").notNull(),
  description: text("description"),
  managerId: varchar("manager_id").references(() => staff.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory Transactions
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  warehouseId: varchar("warehouse_id").references(() => warehouses.id).notNull(),
  movementType: text("movement_type").notNull(), // deposit, withdrawal, transfer, adjustment
  quantity: decimal("quantity", { precision: 10, scale: 1 }).notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  reason: text("reason"),
  reference: text("reference"), // sales order number, job order number
  referenceType: text("reference_type"), // sales_order, job_order, manual
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id),
  jobOrderId: varchar("job_order_id").references(() => jobOrders.id),
  fromWarehouseId: varchar("from_warehouse_id").references(() => warehouses.id),
  toWarehouseId: varchar("to_warehouse_id").references(() => warehouses.id),
  staffId: varchar("staff_id").references(() => staff.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Production Receipts
export const productionReceipts = pgTable("production_receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  receiptNumber: text("receipt_number").notNull().unique(),
  jobOrderId: varchar("job_order_id").references(() => jobOrders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantityProduced: decimal("quantity_produced", { precision: 10, scale: 1 }).notNull(),
  warehouseId: varchar("warehouse_id").references(() => warehouses.id).notNull(),
  productionDate: timestamp("production_date").notNull(),
  qualityStatus: text("quality_status").default("pending"), // pending, approved, rejected
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => staff.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================================
// FINANCIAL OPERATIONS
// ========================================

// Invoices
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  customerCode: text("customer_code").notNull(),
  country: text("country").notNull(),
  dueDate: timestamp("due_date").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 }).default("0"),
  bankCharge: decimal("bank_charge", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  others: decimal("others", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"),
  shippingMethod: text("shipping_method"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, overdue
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0"),
  paidAt: timestamp("paid_at"),
  createdBy: varchar("created_by").references(() => staff.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Records - Enhanced for Internal Staff Workflow
export const paymentRecords = pgTable("payment_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentNumber: text("payment_number").notNull().unique(),
  invoiceId: varchar("invoice_id").references(() => invoices.id).notNull(),
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  customerCode: text("customer_code").notNull(),
  // Payment Details
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // bank_transfer, agent, cash, mobile_payment
  referenceNumber: text("reference_number"),
  paymentDate: timestamp("payment_date").notNull(),
  // Payment Proof Management
  paymentProofImages: text("payment_proof_images").array(), // URLs to uploaded proof images
  uploadedBy: varchar("uploaded_by").references(() => staff.id).notNull(), // Customer support staff
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  // Verification Workflow
  status: text("status").default("submitted"), // submitted, verified, rejected, cancelled
  verifiedBy: varchar("verified_by").references(() => staff.id), // Finance team staff
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  verificationNotes: text("verification_notes"),
  // Additional Details
  notes: text("notes"),
  bankName: text("bank_name"),
  senderName: text("sender_name"),
  receiptNumber: text("receipt_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================================
// EMAIL SETTINGS
// ========================================

export const emailSettings = pgTable("email_settings", {
  id: varchar("id").primaryKey().default("default"),
  enabled: boolean("enabled").default(false),
  smtpHost: varchar("smtp_host", { length: 255 }).default("smtp.hostinger.com"),
  smtpPort: integer("smtp_port").default(465),
  smtpSecure: boolean("smtp_secure").default(true),
  smtpUsername: varchar("smtp_username", { length: 255 }),
  smtpPassword: varchar("smtp_password", { length: 255 }),
  fromEmail: varchar("from_email", { length: 255 }),
  fromName: varchar("from_name", { length: 255 }).default("Hibla Filipino Hair"),
  replyToEmail: varchar("reply_to_email", { length: 255 }),
  // Notification settings
  sendPaymentNotifications: boolean("send_payment_notifications").default(true),
  sendInvoiceNotifications: boolean("send_invoice_notifications").default(true),
  sendQuotationNotifications: boolean("send_quotation_notifications").default(true),
  sendOrderNotifications: boolean("send_order_notifications").default(true),
  sendShipmentNotifications: boolean("send_shipment_notifications").default(true),
  // Additional recipients
  ccEmails: text("cc_emails"), // Comma-separated list
  bccEmails: text("bcc_emails"), // Comma-separated list
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================================
// SCHEMA EXPORTS & TYPES
// ========================================

// Insert Schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  totalOrders: true,
  totalSpent: true,
  lastOrder: true,
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
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertPriceListSchema = createInsertSchema(priceLists).omit({
  id: true,
  createdAt: true,
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({
  id: true,
  createdAt: true,
});

export const insertSalesOrderSchema = createInsertSchema(salesOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSalesOrderItemSchema = createInsertSchema(salesOrderItems).omit({
  id: true,
  createdAt: true,
});

export const insertJobOrderSchema = createInsertSchema(jobOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobOrderItemSchema = createInsertSchema(jobOrderItems).omit({
  id: true,
  createdAt: true,
});

export const insertWarehouseSchema = createInsertSchema(warehouses).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertProductionReceiptSchema = createInsertSchema(productionReceipts).omit({
  id: true,
  createdAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentRecordSchema = createInsertSchema(paymentRecords).omit({
  id: true,
  uploadedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Type Exports
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
export type PriceList = typeof priceLists.$inferSelect;
export type InsertPriceList = z.infer<typeof insertPriceListSchema>;
export type Quotation = typeof quotations.$inferSelect;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type QuotationItem = typeof quotationItems.$inferSelect;
export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;
export type SalesOrder = typeof salesOrders.$inferSelect;
export type InsertSalesOrder = z.infer<typeof insertSalesOrderSchema>;
export type SalesOrderItem = typeof salesOrderItems.$inferSelect;
export type InsertSalesOrderItem = z.infer<typeof insertSalesOrderItemSchema>;
export type JobOrder = typeof jobOrders.$inferSelect;
export type InsertJobOrder = z.infer<typeof insertJobOrderSchema>;
export type JobOrderItem = typeof jobOrderItems.$inferSelect;
export type InsertJobOrderItem = z.infer<typeof insertJobOrderItemSchema>;
export type Warehouse = typeof warehouses.$inferSelect;
export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type ProductionReceipt = typeof productionReceipts.$inferSelect;
export type InsertProductionReceipt = z.infer<typeof insertProductionReceiptSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = z.infer<typeof insertPaymentRecordSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
// Removed old CustomerPayment - replaced with PaymentRecord
export type EmailSettings = typeof emailSettings.$inferSelect;
export type InsertEmailSettings = typeof emailSettings.$inferInsert;

// ========================================
// RELATIONS
// ========================================

export const customersRelations = relations(customers, ({ many }) => ({
  quotations: many(quotations),
  salesOrders: many(salesOrders),
  paymentRecords: many(paymentRecords),
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
  quotations: many(quotations),
  invoices: many(invoices),
  paymentRecords: many(paymentRecords),
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
  quotationItems: many(quotationItems),
  salesOrderItems: many(salesOrderItems),
  jobOrderItems: many(jobOrderItems),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  priceList: one(priceLists, {
    fields: [quotations.priceListId],
    references: [priceLists.id],
  }),
  createdByStaff: one(staff, {
    fields: [quotations.createdBy],
    references: [staff.id],
  }),
  quotationItems: many(quotationItems),
  salesOrders: many(salesOrders),
}));

export const salesOrdersRelations = relations(salesOrders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [salesOrders.customerId],
    references: [customers.id],
  }),
  quotation: one(quotations, {
    fields: [salesOrders.quotationId],
    references: [quotations.id],
  }),
  salesOrderItems: many(salesOrderItems),
  jobOrders: many(jobOrders),
  invoices: many(invoices),
}));

export const jobOrdersRelations = relations(jobOrders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [jobOrders.customerId],
    references: [customers.id],
  }),
  salesOrder: one(salesOrders, {
    fields: [jobOrders.salesOrderId],
    references: [salesOrders.id],
  }),
  jobOrderItems: many(jobOrderItems),
  productionReceipts: many(productionReceipts),
}));

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  product: one(products, {
    fields: [inventoryTransactions.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventoryTransactions.warehouseId],
    references: [warehouses.id],
  }),
  staff: one(staff, {
    fields: [inventoryTransactions.staffId],
    references: [staff.id],
  }),
  salesOrder: one(salesOrders, {
    fields: [inventoryTransactions.salesOrderId],
    references: [salesOrders.id],
  }),
  jobOrder: one(jobOrders, {
    fields: [inventoryTransactions.jobOrderId],
    references: [jobOrders.id],
  }),
}));