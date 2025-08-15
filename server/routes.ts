import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth-service";
import { generateSalesOrderHTML, generateJobOrderHTML } from "./pdf-generator";
import { aiImageService, type ImageGenerationRequest } from "./ai-image-service";
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
  insertCustomerPaymentSchema,
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
  // Root health check endpoint for deployment services (quick response for health checks)
  app.get("/", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      message: "Hibla Manufacturing System is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      version: "1.0.0"
    });
  });

  // Health endpoint for deployment services
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Middleware for JSON parsing
  app.use(express.json());

  // ==============================================
  // AUTHENTICATION ROUTES
  // ==============================================
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        req.session.user = result.user;
        res.json({ success: true, user: result.user });
      } else {
        res.status(401).json({ error: result.error || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
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
      const payments = await storage.getCustomerPayments();
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
}