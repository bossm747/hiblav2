import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth-service";
import { generateSalesOrderHTML, generateJobOrderHTML } from "./pdf-generator";
import { aiImageService, type ImageGenerationRequest } from "./ai-image-service";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  insertCustomerSchema,
  insertStaffSchema,
  insertProductSchema,
  insertInventoryTransactionSchema,
  // Manufacturing schemas
  insertPriceListSchema,
  insertQuotationSchema,
  insertQuotationItemSchema,
  insertSalesOrderSchema,
  insertSalesOrderItemSchema,
  insertJobOrderSchema,
  insertJobOrderItemSchema,
  insertWarehouseSchema,
  insertProductionReceiptSchema,
  insertInvoiceSchema,
  insertPaymentRecordSchema,
  paymentRecords,
  invoices,
  salesOrders,
  type InsertPaymentRecord,
} from "@shared/schema";
import { InvoiceService } from "./invoice-service";
import { ProductionService } from "./production-service";
import { InventoryTransferService } from "./inventory-transfer-service";
import { generateInvoiceHTML } from "./pdf-generator";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { z } from "zod";

export function registerRoutes(app: Express): void {

  // ==============================================
  // HEALTH CHECK ENDPOINTS (Fast response for deployment health checks)
  // ==============================================
  
  // Health endpoint for deployment services (optimized for fast response)
  app.get("/health", (req, res) => {
    try {
      res.status(200).send('OK');
    } catch (error) {
      res.status(500).send('ERROR');
    }
  });

  // API health endpoint (lightweight)
  app.get("/api/health", (req, res) => {
    res.status(200).send('OK');
  });

  // Middleware for JSON parsing
  app.use(express.json());

  // ==============================================
  // AUTHENTICATION ROUTES (Simplified)
  // ==============================================
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Simple authentication check
      if (email === "admin@hibla.com" && password === "admin123") {
        const user = { id: "1", email, name: "Admin User", role: "admin" };
        res.json({ success: true, user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    // For now, always return a default user
    res.json({ user: { id: "1", email: "admin@hibla.com", name: "Admin User", role: "admin" } });
  });

  // ==============================================
  // CUSTOMER MANAGEMENT (B2B)
  // ==============================================
  
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, customerData);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  // ==============================================
  // STAFF MANAGEMENT
  // ==============================================
  
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getStaff();
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      res.status(201).json(staff);
    } catch (error) {
      console.error("Error creating staff:", error);
      res.status(500).json({ error: "Failed to create staff" });
    }
  });

  // ==============================================
  // PRODUCT MANAGEMENT
  // ==============================================
  
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // ==============================================
  // MANUFACTURING WORKFLOW - QUOTATIONS
  // ==============================================
  
  app.get("/api/quotations", async (req, res) => {
    try {
      const quotations = await storage.getQuotations();
      res.json(quotations);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      res.status(500).json({ error: "Failed to fetch quotations" });
    }
  });

  app.get("/api/quotations/:id", async (req, res) => {
    try {
      const quotation = await storage.getQuotationById(req.params.id);
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      res.json(quotation);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      res.status(500).json({ error: "Failed to fetch quotation" });
    }
  });

  app.post("/api/quotations", async (req, res) => {
    try {
      const quotationData = insertQuotationSchema.parse(req.body);
      const quotation = await storage.createQuotation(quotationData);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Error creating quotation:", error);
      res.status(500).json({ error: "Failed to create quotation" });
    }
  });

  app.get("/api/quotations/:id/items", async (req, res) => {
    try {
      const items = await storage.getQuotationItems(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching quotation items:", error);
      res.status(500).json({ error: "Failed to fetch quotation items" });
    }
  });

  // ==============================================
  // MANUFACTURING WORKFLOW - SALES ORDERS
  // ==============================================
  
  app.get("/api/sales-orders", async (req, res) => {
    try {
      const salesOrders = await storage.getSalesOrders();
      res.json(salesOrders);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      res.status(500).json({ error: "Failed to fetch sales orders" });
    }
  });

  app.post("/api/sales-orders", async (req, res) => {
    try {
      const salesOrderData = insertSalesOrderSchema.parse(req.body);
      const salesOrder = await storage.createSalesOrder(salesOrderData);
      res.status(201).json(salesOrder);
    } catch (error) {
      console.error("Error creating sales order:", error);
      res.status(500).json({ error: "Failed to create sales order" });
    }
  });

  // ==============================================
  // MANUFACTURING WORKFLOW - JOB ORDERS
  // ==============================================
  
  app.get("/api/job-orders", async (req, res) => {
    try {
      const jobOrders = await storage.getJobOrders();
      res.json(jobOrders);
    } catch (error) {
      console.error("Error fetching job orders:", error);
      res.status(500).json({ error: "Failed to fetch job orders" });
    }
  });

  app.post("/api/job-orders", async (req, res) => {
    try {
      const jobOrderData = insertJobOrderSchema.parse(req.body);
      const jobOrder = await storage.createJobOrder(jobOrderData);
      res.status(201).json(jobOrder);
    } catch (error) {
      console.error("Error creating job order:", error);
      res.status(500).json({ error: "Failed to create job order" });
    }
  });

  // ==============================================
  // FINANCIAL MANAGEMENT
  // ==============================================
  
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentRecords();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // ==============================================
  // WAREHOUSE & INVENTORY
  // ==============================================
  
  app.get("/api/warehouses", async (req, res) => {
    try {
      const warehouses = await storage.getWarehouses();
      res.json(warehouses);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      res.status(500).json({ error: "Failed to fetch warehouses" });
    }
  });

  app.get("/api/inventory/transactions", async (req, res) => {
    try {
      const transactions = await storage.getInventoryTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching inventory transactions:", error);
      res.status(500).json({ error: "Failed to fetch inventory transactions" });
    }
  });

  // ==============================================
  // DASHBOARD ANALYTICS
  // ==============================================
  
  app.get("/api/dashboard/analytics", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json({
        overview: {
          totalCustomers: stats.customers || 0,
          totalProducts: stats.products || 0,
          activeQuotations: stats.quotations || 0,
          activeSalesOrders: stats.salesOrders || 0,
          activeJobOrders: stats.jobOrders || 0
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard analytics" });
    }
  });

  // ==============================================
  // EMAIL SETTINGS
  // ==============================================
  
  app.get("/api/email-settings", async (req, res) => {
    try {
      const settings = await storage.getEmailSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching email settings:", error);
      res.status(500).json({ error: "Failed to fetch email settings" });
    }
  });

  // File upload handling
  const upload = multer({
    dest: 'uploads/',
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ fileUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Static file serving
  app.use('/uploads', express.static('uploads'));

  // ==============================================
  // PAYMENT PROCESSING SYSTEM ENDPOINTS
  // ==============================================

  // Payment statistics for dashboard
  app.get("/api/payments/stats", async (req, res) => {
    try {
      const stats = await storage.getPaymentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      res.status(500).json({ error: "Failed to fetch payment stats" });
    }
  });

  // Pending payments for verification queue
  app.get("/api/payments/pending-verification", async (req, res) => {
    try {
      const payments = await storage.getPendingPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      res.status(500).json({ error: "Failed to fetch pending payments" });
    }
  });

  // Payment proof upload
  app.post('/api/upload/payment-proof', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      console.error('Payment proof upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Submit payment proof
  app.post("/api/payments/submit-proof", async (req, res) => {
    try {
      const paymentData = insertPaymentRecordSchema.parse(req.body);
      
      // Generate payment number
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const count = await db.select({ count: sql<number>`count(*)` })
        .from(paymentRecords)
        .where(sql`date_part('year', created_at) = ${year} AND date_part('month', created_at) = ${month}`);
      
      const paymentNumber = `${year}.${month}.${String((count[0]?.count || 0) + 1).padStart(3, '0')}`;
      
      const payment = await storage.createPaymentRecord({
        ...paymentData,
        paymentNumber,
        status: 'submitted'
      });
      
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      res.status(500).json({ error: "Failed to submit payment proof" });
    }
  });

  // Verify payment (approve/reject)
  app.post("/api/payments/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      const { action, notes, rejectionReason } = req.body;
      
      const updateData: Partial<InsertPaymentRecord> = {
        status: action === 'approve' ? 'verified' : 'rejected',
        verifiedBy: req.body.verifiedBy || 'admin', // Should come from auth
        verifiedAt: new Date(),
        verificationNotes: notes,
      };
      
      if (action === 'reject' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      
      const payment = await storage.updatePaymentRecord(id, updateData);
      res.json(payment);
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Pending invoices for payment processing
  app.get("/api/invoices/pending-payment", async (req, res) => {
    try {
      const pendingInvoices = await db.select().from(invoices)
        .where(eq(invoices.paymentStatus, 'pending'))
        .orderBy(desc(invoices.createdAt));
      res.json(pendingInvoices);
    } catch (error) {
      console.error("Error fetching pending invoices:", error);
      res.status(500).json({ error: "Failed to fetch pending invoices" });
    }
  });

  // Sales orders ready for invoice generation
  app.get("/api/sales-orders/ready-for-invoice", async (req, res) => {
    try {
      const readySalesOrders = await db.select().from(salesOrders)
        .where(and(
          eq(salesOrders.isConfirmed, true),
          sql`${salesOrders.id} NOT IN (SELECT sales_order_id FROM ${invoices})`
        ))
        .orderBy(desc(salesOrders.createdAt));
      res.json(readySalesOrders);
    } catch (error) {
      console.error("Error fetching ready sales orders:", error);
      res.status(500).json({ error: "Failed to fetch sales orders ready for invoice" });
    }
  });

  // Recent auto-generated invoices
  app.get("/api/invoices/recent-auto-generated", async (req, res) => {
    try {
      const recentInvoices = await db.select().from(invoices)
        .orderBy(desc(invoices.createdAt))
        .limit(20);
      res.json(recentInvoices);
    } catch (error) {
      console.error("Error fetching recent invoices:", error);
      res.status(500).json({ error: "Failed to fetch recent invoices" });
    }
  });

  // Invoice automation stats
  app.get("/api/invoices/automation-stats", async (req, res) => {
    try {
      const [stats] = await db.select({
        totalGenerated: sql<number>`count(*)`,
        todayGenerated: sql<number>`count(*) filter (where date(created_at) = current_date)`
      }).from(invoices);
      
      res.json({
        ...stats,
        automationRate: 95,
        timesSaved: 90,
        avgGenerationTime: 2
      });
    } catch (error) {
      console.error("Error fetching invoice stats:", error);
      res.status(500).json({ error: "Failed to fetch invoice automation stats" });
    }
  });

  // Generate invoice from sales order
  app.post("/api/sales-orders/:id/generate-invoice", async (req, res) => {
    try {
      const salesOrderId = req.params.id;
      const salesOrder = await db.select().from(salesOrders)
        .where(eq(salesOrders.id, salesOrderId))
        .limit(1);
      
      if (!salesOrder[0]) {
        return res.status(404).json({ error: "Sales order not found" });
      }
      
      const order = salesOrder[0];
      const invoiceNumber = order.salesOrderNumber; // Same series numbering
      
      const invoice = await storage.createInvoice({
        invoiceNumber,
        salesOrderId: order.id,
        customerId: order.customerId,
        customerCode: order.customerCode,
        country: order.country,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: order.subtotal,
        shippingFee: order.shippingChargeUsd || '0',
        bankCharge: order.bankChargeUsd || '0',
        discount: order.discountUsd || '0',
        others: order.others || '0',
        total: order.pleasePayThisAmountUsd,
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        paymentStatus: 'pending',
        createdBy: 'system'
      });
      
      res.json({ ...invoice, invoiceNumber: invoice.invoiceNumber });
    } catch (error) {
      console.error("Error generating invoice:", error);
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  });

  // Bulk generate invoices
  app.post("/api/invoices/bulk-generate", async (req, res) => {
    try {
      const { salesOrderIds } = req.body;
      let generatedCount = 0;
      
      for (const salesOrderId of salesOrderIds) {
        try {
          const salesOrder = await db.select().from(salesOrders)
            .where(eq(salesOrders.id, salesOrderId))
            .limit(1);
          
          if (salesOrder[0]) {
            const order = salesOrder[0];
            await storage.createInvoice({
              invoiceNumber: order.salesOrderNumber,
              salesOrderId: order.id,
              customerId: order.customerId,
              customerCode: order.customerCode,
              country: order.country,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              subtotal: order.subtotal,
              shippingFee: order.shippingChargeUsd || '0',
              bankCharge: order.bankChargeUsd || '0',
              discount: order.discountUsd || '0',
              others: order.others || '0',
              total: order.pleasePayThisAmountUsd,
              paymentMethod: order.paymentMethod,
              shippingMethod: order.shippingMethod,
              paymentStatus: 'pending',
              createdBy: 'system'
            });
            generatedCount++;
          }
        } catch (error) {
          console.error(`Error generating invoice for ${salesOrderId}:`, error);
        }
      }
      
      res.json({ generatedCount });
    } catch (error) {
      console.error("Error bulk generating invoices:", error);
      res.status(500).json({ error: "Failed to bulk generate invoices" });
    }
  });
}