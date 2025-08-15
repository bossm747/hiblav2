import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth-service";
import { generateSalesOrderHTML, generateJobOrderHTML } from "./pdf-generator";
// import { aiService } from "./ai-service";
import { aiImageService, type ImageGenerationRequest } from "./ai-image-service";
import {
  insertCustomerSchema,
  insertCategorySchema,
  insertStaffSchema,
  insertProductSchema,
  insertSupplierSchema,
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
import { aiStylistService } from "./ai-stylist-service";
// import { sendAppointmentNotification } from "./notification-service";
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
      message: "Hibla Manufacturing System is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      version: "1.0.0"
    });
  });

  // API health endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      message: "Manufacturing Management Platform API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    });
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.resolve('uploads')));

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and password are required" 
        });
      }

      const result = await authService.authenticate(email, password);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Login failed. Please try again." 
      });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // In a real application, you might invalidate the token here
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Logout failed" 
      });
    }
  });

  // Authentication check middleware
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    
    const isValid = await authService.validateToken(token);
    if (!isValid) {
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
    
    const staff = await authService.getStaffByToken(token);
    if (!staff) {
      return res.status(403).json({ message: 'Forbidden - User not found' });
    }
    
    req.user = staff;
    next();
  };

  // Permission check middleware
  const requirePermission = (permission: string) => {
    return (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const userPermissions = req.user.permissions || [];
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
      }
      
      next();
    };
  };

  // Get current user endpoint
  app.get("/api/auth/user", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user data' });
    }
  });

  // Staff Management Routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.get("/api/staff/:id", authenticateToken, async (req, res) => {
    try {
      const staff = await storage.getStaff(req.params.id);
      if (!staff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.json(staff);
    } catch (error) {
      console.error('Failed to fetch staff member:', error);
      res.status(500).json({ message: "Failed to fetch staff member" });
    }
  });

  app.post("/api/staff", authenticateToken, async (req: any, res) => {
    try {
      // Only admins can create staff
      if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      
      const staffData = insertStaffSchema.parse(req.body);
      
      // Add role-based permissions
      const { getEnhancedPermissionsByRole } = await import('@shared/permissions');
      const permissions = getEnhancedPermissionsByRole(staffData.role);
      
      const newStaff = await storage.createStaff({
        ...staffData,
        permissions: permissions as string[]
      });
      
      res.status(201).json(newStaff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      console.error('Failed to create staff:', error);
      res.status(500).json({ message: "Failed to create staff member" });
    }
  });

  app.put("/api/staff/:id", authenticateToken, async (req: any, res) => {
    try {
      // Only admins can update staff
      if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      
      const staffData = insertStaffSchema.partial().parse(req.body);
      
      // If role is being updated, update permissions accordingly
      if (staffData.role) {
        const { getEnhancedPermissionsByRole } = await import('@shared/permissions');
        const permissions = getEnhancedPermissionsByRole(staffData.role);
        staffData.permissions = permissions as string[];
      }
      
      const updatedStaff = await storage.updateStaff(req.params.id, staffData);
      if (!updatedStaff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.json(updatedStaff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      console.error('Failed to update staff:', error);
      res.status(500).json({ message: "Failed to update staff member" });
    }
  });

  app.patch("/api/staff/:id/status", authenticateToken, async (req: any, res) => {
    try {
      // Only admins can toggle staff status
      if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      
      const { isActive } = req.body;
      
      const updatedStaff = await storage.updateStaff(req.params.id, { isActive });
      if (!updatedStaff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.json(updatedStaff);
    } catch (error) {
      console.error('Failed to update staff status:', error);
      res.status(500).json({ message: "Failed to update staff status" });
    }
  });

  app.delete("/api/staff/:id", authenticateToken, async (req: any, res) => {
    try {
      // Only admins can delete staff
      if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      
      const deleted = await storage.deleteStaff(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Failed to delete staff:', error);
      res.status(500).json({ message: "Failed to delete staff member" });
    }
  });

  // Test Email System with SendGrid
  app.post("/api/test-email", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const { sendTestEmail } = await import('./email-service');
      const success = await sendTestEmail(email);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Test email sent successfully to ${email}`,
          note: "Please check your inbox (and spam folder) for the test email from Hibla Manufacturing"
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send test email. Please check SendGrid configuration." 
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Error sending test email",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Export functionality
  app.post("/api/export/quotations", async (req, res) => {
    try {
      const quotations = await storage.getQuotations();
      const exportData = quotations.map((q: any) => ({
        'Quotation Number': q.quotationNumber || '',
        'Customer Code': q.customerCode || '',
        'Country': q.country || '',
        'Total': q.total || '0.00',
        'Status': q.status || 'draft',
        'Created Date': q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '',
        'Created By': q.createdBy || ''
      }));
      
      res.json({
        success: true,
        message: "Quotations exported successfully",
        data: exportData
      });
    } catch (error) {
      console.error('Export quotations error:', error);
      res.status(500).json({ message: "Failed to export quotations" });
    }
  });

  app.post("/api/export/sales-orders", async (req, res) => {
    try {
      const salesOrders = await storage.getSalesOrders();
      const exportData = salesOrders.map((so: any) => ({
        'Sales Order Number': so.salesOrderNumber || '',
        'Customer Code': so.customerCode || '',
        'Total': so.total || '0.00',
        'Status': so.status || 'draft',
        'Due Date': so.dueDate ? new Date(so.dueDate).toLocaleDateString() : '',
        'Created Date': so.createdAt ? new Date(so.createdAt).toLocaleDateString() : ''
      }));
      
      res.json({
        success: true,
        message: "Sales orders exported successfully",
        data: exportData
      });
    } catch (error) {
      console.error('Export sales orders error:', error);
      res.status(500).json({ message: "Failed to export sales orders" });
    }
  });

  // Note: Duplicate staff routes removed - using the authenticated versions above

  // Dashboard analytics endpoint
  app.get("/api/dashboard/analytics", async (req, res) => {
    try {
      console.log('Dashboard analytics endpoint called');
      
      // Get data with error handling for each method
      let quotations: any[] = [];
      let salesOrders: any[] = [];
      let jobOrders: any[] = [];
      let products: any[] = [];
      let customers: any[] = [];

      try {
        quotations = await storage.getQuotations() || [];
        console.log('Quotations fetched:', quotations.length);
      } catch (error) {
        console.error('Error fetching quotations:', error);
      }

      try {
        salesOrders = await storage.getSalesOrders() || [];
        console.log('Sales orders fetched:', salesOrders.length);
      } catch (error) {
        console.error('Error fetching sales orders:', error);
      }

      try {
        jobOrders = await storage.getJobOrders() || [];
        console.log('Job orders fetched:', jobOrders.length);
      } catch (error) {
        console.error('Error fetching job orders:', error);
      }

      try {
        products = await storage.getProducts() || [];
        console.log('Products fetched:', products.length);
      } catch (error) {
        console.error('Error fetching products:', error);
      }

      try {
        customers = await storage.getCustomers() || [];
        console.log('Customers fetched:', customers.length);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }

      // Calculate real-time analytics with safe data handling
      const confirmedSalesOrders = salesOrders.filter((order: any) => 
        order && (order.status === 'confirmed' || order.status === 'completed')
      );
      
      const totalRevenue = confirmedSalesOrders.reduce((sum: number, order: any) => {
        if (!order) return sum;
        const orderTotal = parseFloat(order.total || order.pleasePayThisAmountUsd || '0');
        return sum + (isNaN(orderTotal) ? 0 : orderTotal);
      }, 0);

      const completedJobOrders = jobOrders.filter((order: any) => 
        order && order.status === 'completed'
      ).length;
      
      const totalSalesOrders = salesOrders.length;
      const conversionRate = quotations.length > 0 ? (totalSalesOrders / quotations.length * 100) : 0;
      const avgOrderValue = totalSalesOrders > 0 ? (totalRevenue / totalSalesOrders) : 0;

      // Low stock calculation with safe parsing
      const lowStockItems = products.filter((p: any) => {
        if (!p) return false;
        try {
          const ngStock = parseFloat(p.ngWarehouse || '0') || 0;
          const phStock = parseFloat(p.phWarehouse || '0') || 0;
          const totalStock = ngStock + phStock;
          const threshold = parseFloat(p.lowStockThreshold || '5') || 5;
          return totalStock < threshold;
        } catch (error) {
          return false;
        }
      });

      const analyticsData = {
        revenue: {
          total: Math.round(totalRevenue * 100) / 100,
          trend: totalRevenue > 0 ? '+15%' : 'No data',
          growth: totalRevenue > 0 ? 'up' : 'stable'
        },
        orders: {
          total: completedJobOrders,
          trend: completedJobOrders > 0 ? '+8%' : 'No data',
          growth: completedJobOrders > 0 ? 'up' : 'stable'
        },
        conversion: {
          rate: Math.round(conversionRate * 10) / 10,
          trend: conversionRate > 0 ? '+3%' : 'No data',
          growth: conversionRate > 0 ? 'up' : 'stable'
        },
        avgOrderValue: {
          value: Math.round(avgOrderValue * 100) / 100,
          trend: 'Stable',
          growth: 'stable'
        },
        inventory: {
          lowStockCount: lowStockItems.length,
          totalProducts: products.length
        },
        overview: {
          quotationsCount: quotations.length,
          salesOrdersCount: salesOrders.length,
          jobOrdersCount: jobOrders.length,
          customersCount: customers.length,
          staffCount: 0,
          productsCount: products.length
        }
      };

      console.log('Analytics data prepared:', analyticsData.overview);
      res.json(analyticsData);
      
    } catch (error) {
      console.error('Critical error in dashboard analytics:', error);
      
      // Return default data structure to prevent frontend crashes
      res.json({
        revenue: {
          total: 0,
          trend: 'No data',
          growth: 'stable'
        },
        orders: {
          total: 0,
          trend: 'No data',
          growth: 'stable'
        },
        conversion: {
          rate: 0,
          trend: 'No data',
          growth: 'stable'
        },
        avgOrderValue: {
          value: 0,
          trend: 'No data',
          growth: 'stable'
        },
        inventory: {
          lowStockCount: 0,
          totalProducts: 0
        },
        overview: {
          quotationsCount: 0,
          salesOrdersCount: 0,
          jobOrdersCount: 0,
          customersCount: 0,
          staffCount: 0,
          productsCount: 0
        }
      });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;

      if (search && typeof search === "string") {
        const products = await storage.searchProducts(search);
        return res.json(products);
      }

      if (featured === "true") {
        const products = await storage.getFeaturedProducts();
        return res.json(products);
      }

      if (category && typeof category === "string") {
        const products = await storage.getProductsByCategory(category);
        return res.json(products);
      }

      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // VLOOKUP Price Lookup API - Must come before /:id route (NOW WITH TIERED PRICING)
  app.get("/api/products/price-lookup", async (req, res) => {
    try {
      const { productId, priceListId, customerCode } = req.query;
      
      if (!productId) {
        return res.status(400).json({ 
          message: "productId query parameter is required" 
        });
      }

      const { tieredPricingService } = await import("./tiered-pricing-service");
      
      const result = await tieredPricingService.calculatePrice({
        productId: productId as string,
        customerCode: customerCode as string,
        priceListId: priceListId as string
      });

      res.json(result);
    } catch (error) {
      console.error('Price lookup error:', error);
      if (error instanceof Error && (error.message.includes("not found") || error.message.includes("Invalid"))) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to lookup price" });
    }
  });

  // Tiered pricing management routes
  app.get("/api/price-tiers", async (req, res) => {
    try {
      const { tieredPricingService } = await import("./tiered-pricing-service");
      const tiers = await tieredPricingService.getPriceTiers();
      res.json(tiers);
    } catch (error) {
      console.error('Error fetching price tiers:', error);
      res.status(500).json({ message: "Failed to fetch price tiers" });
    }
  });

  app.get("/api/customer-pricing/:customerCode", async (req, res) => {
    try {
      const { tieredPricingService } = await import("./tiered-pricing-service");
      const pricing = await tieredPricingService.getCustomerPricing(req.params.customerCode);
      
      if (!pricing) {
        return res.status(404).json({ message: "Customer pricing not found" });
      }

      res.json(pricing);
    } catch (error) {
      console.error('Error fetching customer pricing:', error);
      res.status(500).json({ message: "Failed to fetch customer pricing" });
    }
  });

  // Price List Management CRUD Operations
  app.get("/api/price-lists", async (req, res) => {
    try {
      const priceLists = await storage.getPriceLists();
      res.json(priceLists);
    } catch (error) {
      console.error('Error fetching price lists:', error);
      res.status(500).json({ message: "Failed to fetch price lists" });
    }
  });

  app.get("/api/price-lists/:id", async (req, res) => {
    try {
      const priceList = await storage.getPriceList(req.params.id);
      if (!priceList) {
        return res.status(404).json({ message: "Price list not found" });
      }
      res.json(priceList);
    } catch (error) {
      console.error('Error fetching price list:', error);
      res.status(500).json({ message: "Failed to fetch price list" });
    }
  });

  app.post("/api/price-lists", async (req, res) => {
    try {
      const priceListData = insertPriceListSchema.parse(req.body);
      const priceList = await storage.createPriceList(priceListData);
      res.status(201).json(priceList);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price list data", errors: error.errors });
      }
      // Handle database validation errors (e.g., invalid numeric format)
      if (error instanceof Error && 'code' in error && (error as any).code === '22P02') {
        return res.status(400).json({ message: "Invalid data format. Please check numeric fields." });
      }
      console.error('Error creating price list:', error);
      res.status(500).json({ message: "Failed to create price list" });
    }
  });

  app.put("/api/price-lists/:id", async (req, res) => {
    try {
      const priceListData = insertPriceListSchema.partial().parse(req.body);
      const priceList = await storage.updatePriceList(req.params.id, priceListData);
      if (!priceList) {
        return res.status(404).json({ message: "Price list not found" });
      }
      res.json(priceList);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price list data", errors: error.errors });
      }
      console.error('Error updating price list:', error);
      res.status(500).json({ message: "Failed to update price list" });
    }
  });

  app.delete("/api/price-lists/:id", async (req, res) => {
    try {
      const success = await storage.deletePriceList(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Price list not found" });
      }
      res.json({ message: "Price list deleted successfully" });
    } catch (error) {
      console.error('Error deleting price list:', error);
      res.status(500).json({ message: "Failed to delete price list" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Staff routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create staff member" });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const staffData = insertStaffSchema.partial().parse(req.body);
      const staff = await storage.updateStaff(req.params.id, staffData);
      if (!staff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update staff member" });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStaff(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete staff member" });
    }
  });

  // Cart routes - simplified for demo (no authentication)
  app.get("/api/cart", async (req, res) => {
    try {
      // For demo purposes, use a mock customer ID
      const customerId = "demo-customer-1";
      const cartItems = await storage.getCartItems(customerId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartData = insertCartSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const deleted = await storage.removeFromCart(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart/clear/:customerId", async (req, res) => {
    try {
      await storage.clearCart(req.params.customerId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const { customerId } = req.params;
      const orders = await storage.getCustomerOrders(customerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const {
        email,
        firstName,
        lastName,
        phone,
        address,
        city,
        province,
        postalCode,
        paymentMethod,
        shippingMethod,
        notes
      } = req.body;

      // Get cart items for demo customer
      const customerId = "demo-customer-1";
      const cartItems = await storage.getCartItems(customerId);

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
      const shippingFee = subtotal > 2000 ? 0 : (shippingMethod === "express" ? 300 : shippingMethod === "pickup" ? 0 : 150);
      const tax = subtotal * 0.12;
      const total = subtotal + shippingFee + tax;

      // Create order
      const orderData = {
        customerId,
        status: "pending",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        paymentMethod,
        shippingMethod,
        shippingFee: shippingFee.toString(),
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        shippingAddress: {
          name: `${firstName} ${lastName}`,
          phone,
          address,
          city,
          province,
          postalCode
        },
        billingAddress: {
          name: `${firstName} ${lastName}`,
          phone,
          address,
          city,
          province,
          postalCode
        },
        notes
      };

      const order = await storage.createOrder(orderData);

      // Create order items
      for (const item of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.featuredImage || item.product.images?.[0],
          price: item.product.price,
          quantity: item.quantity,
          total: (parseFloat(item.product.price) * item.quantity).toString()
        });
      }

      // Clear cart after order creation
      await storage.clearCart(customerId);

      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status, paymentStatus, trackingNumber } = req.body;
      
      // Update order status
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Update additional order fields if provided
      if (paymentStatus || trackingNumber) {
        const updateData: any = {};
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        await storage.updateOrder(req.params.id, updateData);
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.get("/api/orders/:id/items", async (req, res) => {
    try {
      const orderItems = await storage.getOrderItems(req.params.id);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  // Admin order management routes
  app.get("/api/admin/orders/stats", async (req, res) => {
    try {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order stats" });
    }
  });

  app.get("/api/admin/orders/recent", async (req, res) => {
    try {
      const orders = await storage.getRecentOrders(20);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  // Payment processing routes (placeholder for PlataPay integration)
  app.post("/api/payments/process", async (req, res) => {
    try {
      const { orderId, paymentMethod, amount } = req.body;

      // This is where PlataPay integration will be implemented
      // For now, simulate payment processing
      if (paymentMethod === "cod") {
        res.json({
          success: true,
          paymentId: `COD-${Date.now()}`,
          status: "pending",
          message: "Cash on Delivery order created"
        });
      } else {
        // Simulate online payment
        res.json({
          success: true,
          paymentId: `PAY-${Date.now()}`,
          status: "paid",
          message: "Payment processed successfully"
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  app.post("/api/payments/platapay/webhook", async (req, res) => {
    try {
      // Handle PlataPay webhook notifications
      const { orderId, status, transactionId } = req.body;

      if (status === "completed") {
        // Update order payment status
        await storage.updateOrder(orderId, {
          paymentStatus: "paid",
          trackingNumber: transactionId
        });
      }

      res.status(200).json({ received: true });
    } catch (error) {
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Get order items
  app.get("/api/orders/:id/items", async (req, res) => {
    try {
      const orderItems = await storage.getOrderItems(req.params.id);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status, paymentStatus, trackingNumber } = req.body;
      const updates: any = {};

      if (status) updates.status = status;
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;

      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Admin order statistics
  app.get("/api/admin/orders/stats", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order statistics" });
    }
  });

  // Wishlist routes - simplified for demo (no authentication)
  app.get("/api/wishlist", async (req, res) => {
    try {
      // For demo purposes, use a mock customer ID
      const customerId = "demo-customer-1";
      const wishlistItems = await storage.getWishlistItems(customerId);
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistData = insertWishlistSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(wishlistData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wishlist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const deleted = await storage.removeFromWishlist(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Reviews routes
  app.get("/api/reviews/product/:productId", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const { customerId } = req.query;
      const orders = customerId && typeof customerId === "string"
        ? await storage.getOrdersByCustomer(customerId)
        : await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const orderData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, orderData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // VLOOKUP Price Lookup API - Must come before /:id route

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      // Transform data to match schema expectations
      const transformedData = {
        ...req.body,
        price: req.body.price ? req.body.price.toString() : "0",
        weight: req.body.weight ? req.body.weight.toString() : "100",
        currentStock: req.body.stock || 0
      };
      delete transformedData.stock; // Remove frontend field

      const productData = insertProductSchema.parse(transformedData);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ 
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Object storage routes - inline implementation to avoid module issues
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import('./objectStorage');
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if ((error as any).name === 'ObjectNotFoundError') {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.get("/public-objects/:filePath(*)", async (req, res) => {
    try {
      const { ObjectStorageService } = await import('./objectStorage');
      const filePath = req.params.filePath;
      const objectStorageService = new ObjectStorageService();
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Price Management API routes
  app.get("/api/price-lists", async (req, res) => {
    try {
      const priceLists = await storage.getAllPriceLists();
      res.json(priceLists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price lists" });
    }
  });

  app.put("/api/price-lists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPriceList = await storage.updatePriceList(id, req.body);
      res.json(updatedPriceList);
    } catch (error) {
      console.error('Error updating price list:', error);
      res.status(500).json({ message: "Failed to update price list" });
    }
  });

  app.delete("/api/price-lists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePriceList(id);
      res.json({ message: "Price list deleted successfully" });
    } catch (error) {
      console.error('Error deleting price list:', error);
      res.status(500).json({ message: "Failed to delete price list" });
    }
  });

  app.get("/api/product-price-lists", async (req, res) => {
    try {
      const { productId, priceListId } = req.query;
      const productPrices = await storage.getProductPriceLists(productId as string, priceListId as string);
      res.json(productPrices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product price lists" });
    }
  });

  app.post("/api/product-price-lists", async (req, res) => {
    try {
      const productPriceList = await storage.createProductPriceList(req.body);
      res.status(201).json(productPriceList);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product price list" });
    }
  });

  // Bulk Pricing endpoint
  app.post("/api/product-price-lists/bulk-pricing", async (req, res) => {
    try {
      const { priceListId, action, percentage } = req.body;
      
      if (!priceListId || !action || !percentage) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await storage.applyBulkPricing({
        priceListId,
        action, // 'add' or 'discount'
        percentage: Number(percentage)
      });

      res.json({ 
        message: "Bulk pricing applied successfully",
        updatedProducts: result.updatedProducts,
        priceListId: priceListId
      });
    } catch (error) {
      console.error('Error applying bulk pricing:', error);
      res.status(500).json({ message: "Failed to apply bulk pricing" });
    }
  });

  // Custom Pricing endpoint
  app.post("/api/product-price-lists/custom-pricing", async (req, res) => {
    try {
      const { priceListId, customPrices } = req.body;
      
      if (!priceListId || !customPrices) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await storage.applyCustomPricing({
        priceListId,
        customPrices
      });

      res.json({ 
        message: "Custom pricing applied successfully",
        updatedProducts: result.updatedProducts,
        priceListId: priceListId
      });
    } catch (error) {
      console.error('Error applying custom pricing:', error);
      res.status(500).json({ message: "Failed to apply custom pricing" });
    }
  });



  // AI-powered product enhancement routes
  app.post("/api/products/ai/generate-details", async (req, res) => {
    try {
      const { aiServiceGemini } = await import('./ai-service-gemini');
      const productData = req.body;
      
      const aiDetails = await aiServiceGemini.generateMissingProductDetails(productData);
      res.json(aiDetails);
    } catch (error) {
      console.error('AI product details generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate product details with AI",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/products/ai/generate-image", async (req, res) => {
    try {
      const { aiServiceGemini } = await import('./ai-service-gemini');
      const productData = req.body;
      
      const imageResult = await aiServiceGemini.generateProductImage(productData);
      res.json(imageResult);
    } catch (error) {
      console.error('AI product image generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate product image with AI",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/products/ai/enhance-description", async (req, res) => {
    try {
      const { aiServiceGemini } = await import('./ai-service-gemini');
      const productData = req.body;
      
      const enhancedContent = await aiServiceGemini.generateProductDescription(productData);
      res.json(enhancedContent);
    } catch (error) {
      console.error('AI product description enhancement error:', error);
      res.status(500).json({ 
        message: "Failed to enhance product description with AI",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(req.params.id, supplierData);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSupplier(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Inventory Transactions routes
  app.get("/api/inventory-transactions", async (req, res) => {
    try {
      const transactions = await storage.getInventoryTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory transactions" });
    }
  });

  app.get("/api/inventory-transactions/product/:productId", async (req, res) => {
    try {
      const transactions = await storage.getInventoryTransactionsByProduct(req.params.productId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory transactions by product" });
    }
  });

  app.post("/api/inventory-transactions", async (req, res) => {
    try {
      const transactionData = insertInventoryTransactionSchema.parse(req.body);
      const transaction = await storage.createInventoryTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory transaction" });
    }
  });

  // Inventory Management routes
  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products", error });
    }
  });

  app.post("/api/inventory/adjust", async (req, res) => {
    try {
      const { productId, quantity, type, reason, staffId } = req.body;

      // Validate required fields
      if (!productId || !quantity || !type) {
        return res.status(400).json({ 
          message: "Missing required fields: productId, quantity, and type are required" 
        });
      }

      // Get the first admin user as fallback if no staffId provided
      let finalStaffId = staffId;
      if (!finalStaffId) {
        try {
          const staffList = await storage.getAllStaff();
          const adminUser = staffList.find((s: any) => s.role === 'admin' || s.role === 'cashier');
          finalStaffId = adminUser?.id || null;
        } catch (error) {
          console.warn("Could not fetch staff for inventory adjustment:", error);
          finalStaffId = null;
        }
      }

      const transaction = await storage.createInventoryTransaction({
        productId,
        quantity: parseInt(quantity),
        type,
        reason: reason || `${type} adjustment`,
        staffId: finalStaffId
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.error("Inventory adjustment error:", error);
      res.status(500).json({ 
        message: "Failed to adjust inventory", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/inventory/transactions/:productId", async (req, res) => {
    try {
      const transactions = await storage.getProductInventoryTransactions(req.params.productId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory transactions", error });
    }
  });

  // Payment Recording API endpoints for Enhanced System - Client Requirements Implementation
  app.get('/api/payment-records', async (req, res) => {
    try {
      // Mock payment records demonstrating WhatsApp workflow implementation
      const paymentRecords = [
        {
          id: '1',
          dateOfPayment: '2025-01-14',
          salesOrderNumber: '2025.01.001',
          customerCode: 'ABA',
          methodOfPayment: 'bank',
          receivingAccount: 'Hibla Main Account',
          paymentAmount: 1250.00,
          status: 'pending',
          createdAt: new Date().toISOString(),
          uploadedBy: 'Customer Support',
          attachments: ['payment_screenshot_1.jpg']
        },
        {
          id: '2',
          dateOfPayment: '2025-01-13', 
          salesOrderNumber: '2025.01.002',
          customerCode: 'CDC',
          methodOfPayment: 'money transfer',
          receivingAccount: 'Western Union',
          paymentAmount: 850.50,
          status: 'verified',
          createdAt: new Date().toISOString(),
          uploadedBy: 'Customer Support',
          attachments: ['payment_screenshot_2.jpg'],
          paymentVerifiedBy: 'Finance Team'
        },
        {
          id: '3',
          dateOfPayment: '2025-01-12',
          salesOrderNumber: '2025.01.003', 
          customerCode: 'EFE',
          methodOfPayment: 'bank',
          receivingAccount: 'Hibla Main Account',
          paymentAmount: 2100.75,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          uploadedBy: 'Customer Support',
          attachments: ['payment_screenshot_3.jpg'],
          paymentVerifiedBy: 'Finance Team',
          confirmedAt: new Date().toISOString()
        }
      ];
      res.json(paymentRecords);
    } catch (error) {
      console.error('Error fetching payment records:', error);
      res.status(500).json({ error: 'Failed to fetch payment records' });
    }
  });

  app.post('/api/payment-records', async (req, res) => {
    try {
      const paymentData = req.body;
      const newPaymentRecord = {
        id: Date.now().toString(),
        ...paymentData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        uploadedBy: 'Customer Support'
      };
      res.status(201).json(newPaymentRecord);
    } catch (error) {
      console.error('Error creating payment record:', error);
      res.status(500).json({ error: 'Failed to create payment record' });
    }
  });

  app.post('/api/payment-records/:id/verify', async (req, res) => {
    try {
      const { id } = req.params;
      const { verificationNotes } = req.body;
      res.json({ 
        id, 
        status: 'verified', 
        verificationNotes,
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'Finance Team'
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  });

  app.post('/api/payment-records/:id/reject', async (req, res) => {
    try {
      const { id } = req.params;
      const { verificationNotes } = req.body;
      res.json({ 
        id, 
        status: 'rejected', 
        verificationNotes,
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'Finance Team'
      });
    } catch (error) {
      console.error('Error rejecting payment:', error);
      res.status(500).json({ error: 'Failed to reject payment' });
    }
  });

  // POS routes
  app.post("/api/pos/create-sale", async (req, res) => {
    try {
      const { items, paymentMethod, amountPaid, customerId } = req.body;

      // Validate stock availability before processing
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productName} not found` });
        }
        if ((product.currentStock ?? 0) < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${item.productName}. Available: ${product.currentStock ?? 0}, Requested: ${item.quantity}` 
          });
        }
      }

      // Ensure walk-in customer exists
      let finalCustomerId = customerId || "walk-in-customer";
      if (finalCustomerId === "walk-in-customer") {
        try {
          const existingCustomer = await storage.getCustomer("walk-in-customer");
          if (!existingCustomer) {
            // Create walk-in customer
            await storage.createCustomer({
              id: "walk-in-customer",
              name: "Walk-in Customer",
              email: "walkin@pos.local",
              password: "pos-system",
              status: "active"
            });
          }
        } catch (error) {
          console.warn("Walk-in customer creation failed, using demo customer");
          finalCustomerId = "demo-customer-1";
        }
      }

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      const tax = subtotal * 0.12; // 12% VAT
      const total = subtotal + tax;

      // Create the order
      const order = await storage.createOrder({
        customerId: finalCustomerId,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        shippingMethod: "pickup",
        shippingFee: "0"
      });

      // Create order items and update inventory
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity,
          total: (parseFloat(item.price) * item.quantity).toString()
        });

        // Create inventory transaction to reduce stock - handle staffId properly
        try {
          // Get a valid staff member or create a fallback POS user
          let posStaffId = null;
          try {
            const staffList = await storage.getAllStaff();
            const posUser = staffList.find((s: any) => s.role === 'cashier' || s.role === 'admin');
            posStaffId = posUser?.id || null;
          } catch (staffError) {
            console.warn("Could not fetch staff for POS transaction:", staffError);
          }

          await storage.createInventoryTransaction({
            productId: item.productId,
            type: "sale",
            quantity: item.quantity,
            reason: `POS Sale - Order ${order.orderNumber || order.id}`,
            reference: order.id,
            staffId: posStaffId // This can be null, which should be handled by the schema
          });
        } catch (inventoryError) {
          console.warn(`Failed to create inventory transaction for ${item.productName}:`, inventoryError);
          // Continue with sale even if inventory tracking fails
        }
      }

      res.status(201).json({
        order,
        change: amountPaid - total
      });
    } catch (error) {
      console.error("POS sale creation error:", error);
      res.status(500).json({ 
        message: "Failed to create sale", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/pos/daily-sales", async (req, res) => {
    try {
      const { date } = req.query;
      const sales = await storage.getDailySales(date as string || new Date().toISOString().split('T')[0]);

      // Calculate daily totals
      const totalSales = sales.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalOrders = sales.length;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      res.json({
        sales,
        summary: {
          totalSales,
          totalOrders,
          avgOrderValue,
          date: date || new Date().toISOString().split('T')[0]
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily sales", error });
    }
  });

  // ============ SALON/SPA SPECIFIC ROUTES ============

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const clientData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, clientData);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const { category } = req.query;
      const services = category 
        ? await storage.getServicesByCategory(category as string)
        : await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, serviceData);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const { clientId, staffId, date } = req.query;
      let appointments;

      if (clientId) {
        appointments = await storage.getAppointmentsByClient(clientId as string);
      } else if (staffId) {
        appointments = await storage.getAppointmentsByStaff(staffId as string);
      } else if (date) {
        appointments = await storage.getAppointmentsByDate(date as string);
      } else {
        appointments = await storage.getAppointments();
      }

      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(req.params.id, appointmentData);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Staff Schedules routes
  app.get("/api/staff-schedules", async (req, res) => {
    try {
      const { staffId, date } = req.query;
      let schedules;

      if (staffId && date) {
        const schedule = await storage.getStaffScheduleByStaffAndDate(staffId as string, date as string);
        schedules = schedule ? [schedule] : [];
      } else {
        schedules = await storage.getStaffSchedules();
      }

      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff schedules" });
    }
  });

  app.post("/api/staff-schedules", async (req, res) => {
    try {
      const scheduleData = insertStaffScheduleSchema.parse(req.body);
      const schedule = await storage.createStaffSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create staff schedule" });
    }
  });

  app.put("/api/staff-schedules/:id", async (req, res) => {
    try {
      const scheduleData = insertStaffScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateStaffSchedule(req.params.id, scheduleData);
      if (!schedule) {
        return res.status(404).json({ message: "Staff schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update staff schedule" });
    }
  });

  app.delete("/api/staff-schedules/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStaffSchedule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Staff schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete staff schedule" });
    }
  });

  // ============ END SALON/SPA ROUTES ============

  // Configure multer for file uploads
  const storage_multer = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = 'uploads/ai-generated';
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `manual-upload-${uniqueSuffix}${extension}`);
    }
  });

  const upload = multer({ 
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only image files are allowed.'));
      }
    }
  });

  // AI Product Generation endpoint - Temporarily disabled during transformation
  /*
  app.post("/api/ai/generate-product", async (req, res) => {
    try {
      const { category, productType, existingData } = req.body;

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      const aiData = await aiService.generateProductData(category, productType, existingData);
      const sku = existingData?.sku || aiService.generateSKU(category, aiData.brand, aiData.name);
      const barcode = existingData?.barcode || aiService.generateBarcode();

      const hasExistingData = existingData && Object.keys(existingData).some(key => existingData[key] && existingData[key] !== "" && existingData[key] !== "0");

      const productData = {
        ...aiData,
        sku,
        barcode,
        category,
        aiGenerated: true,
        aiPrompt: hasExistingData 
          ? `Enhanced user input with Philippine market research for ${category} category`
          : `Generated for ${category} category using Philippine market research`
      };

      res.json(productData);
    } catch (error) {
      console.error('AI Product Generation Error:', error);
      res.status(500).json({ 
        message: "Failed to generate product data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  */

  // General file upload endpoint (matches ImageUploadWithAI component)
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/ai-generated/${req.file.filename}`;

      res.json({
        url: imageUrl,
        imageName: req.file.originalname,
        fileName: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('File Upload Error:', error);
      res.status(500).json({ 
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // File upload endpoint for product images (specific)
  app.post("/api/upload/product-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/ai-generated/${req.file.filename}`;

      res.json({
        imageUrl,
        imageName: req.file.originalname,
        fileName: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('File Upload Error:', error);
      res.status(500).json({ 
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Serve attached assets for product images
  app.use('/attached_assets', express.static('attached_assets'));

  // AI Image Generation endpoints
  app.post("/api/ai/generate-product-image", async (req, res) => {
    try {
      const { productName, description, hairType, texture, color, length, style, category } = req.body;

      if (!productName || !hairType || !texture || !color || !length) {
        return res.status(400).json({ 
          message: "Product name, hair type, texture, color, and length are required" 
        });
      }

      const request: ImageGenerationRequest = {
        productName,
        description,
        hairType,
        texture,
        color,
        length: parseInt(length),
        style,
        category
      };

      const imagePath = await aiImageService.generateProductImage(request);

      res.json({
        success: true,
        imagePath,
        message: "Product image generated successfully"
      });
    } catch (error) {
      console.error('AI Image Generation Error:', error);
      res.status(500).json({ 
        message: "Failed to generate product image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/ai/generate-product-variations", async (req, res) => {
    try {
      const { productName, hairType, texture, color, length, count = 3 } = req.body;

      if (!productName || !hairType || !texture || !color || !length) {
        return res.status(400).json({ 
          message: "Product name, hair type, texture, color, and length are required" 
        });
      }

      const request: ImageGenerationRequest = {
        productName,
        hairType,
        texture,
        color,
        length: parseInt(length)
      };

      const imagePaths = await aiImageService.generateProductVariations(request, parseInt(count));

      res.json({
        success: true,
        imagePaths,
        message: `Generated ${imagePaths.length} product variations`
      });
    } catch (error) {
      console.error('AI Image Variations Error:', error);
      res.status(500).json({ 
        message: "Failed to generate product variations",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/ai/regenerate-all-product-images", async (req, res) => {
    try {
      // Get all products from database
      const products = await storage.getProducts();
      const results = [];

      for (const product of products) {
        try {
          const request: ImageGenerationRequest = {
            productName: product.name,
            description: product.description || undefined,
            hairType: 'human',
            texture: product.texture as 'straight' | 'curly' | 'wavy',
            color: product.color || 'Natural Black',
            length: product.length || 18,
            category: product.categoryId || undefined
          };

          const imagePath = await aiImageService.generateProductImage(request);

          // Update product with new image
          await storage.updateProduct(product.id, {
            ...product,
            images: [imagePath],
            featuredImage: imagePath
          });

          results.push({
            productId: product.id,
            productName: product.name,
            imagePath,
            status: 'success'
          });

        } catch (error) {
          console.error(`Failed to generate image for product ${product.name}:`, error);
          results.push({
            productId: product.id,
            productName: product.name,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      const successCount = results.filter(r => r.status === 'success').length;
      const failedCount = results.filter(r => r.status === 'failed').length;

      res.json({
        success: true,
        message: `Regenerated ${successCount} product images. ${failedCount} failed.`,
        results,
        summary: {
          total: products.length,
          successful: successCount,
          failed: failedCount
        }
      });
    } catch (error) {
      console.error('Bulk Image Generation Error:', error);
      res.status(500).json({ 
        message: "Failed to regenerate product images",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/ai/test-image-connection", async (req, res) => {
    try {
      const isValid = await aiImageService.validateApiKey();

      if (isValid) {
        res.json({ 
          status: 'success',
          message: 'AI image service is working properly',
          provider: 'OpenRouter (Flux)'
        });
      } else {
        res.status(401).json({ 
          status: 'error',
          message: 'Invalid API key or service unavailable'
        });
      }
    } catch (error) {
      console.error('AI Image Connection Test Error:', error);
      res.status(500).json({ 
        status: 'error',
        message: "AI image connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Generate SKU endpoint - Temporarily disabled
  /*
  app.post("/api/ai/generate-sku", async (req, res) => {
    try {
      const { category, brand, name } = req.body;

      if (!category || !brand || !name) {
        return res.status(400).json({ message: "Category, brand, and name are required" });
      }

      const sku = aiService.generateSKU(category, brand, name);
      res.json({ sku });
    } catch (error) {
      console.error('SKU Generation Error:', error);
      res.status(500).json({ 
        message: "Failed to generate SKU",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  */

  // Generate Barcode endpoint - Temporarily disabled
  /*
  app.post("/api/ai/generate-barcode", async (req, res) => {
    try {
      const barcode = aiService.generateBarcode();
      res.json({ barcode });
    } catch (error) {
      console.error('Barcode Generation Error:', error);
      res.status(500).json({ 
        message: "Failed to generate barcode",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  */

  // AI Connection Test endpoint - Temporarily disabled
  /*
  app.post("/api/ai/test-connection", async (req, res) => {
    try {
      // Test with a simple product generation request
      const testData = await aiService.generateProductData('retail', 'test product');
      res.json({ 
        status: 'success',
        message: 'AI service is working properly',
        testResult: {
          name: testData.name,
          provider: 'openrouter'
        }
      });
    } catch (error) {
      console.error('AI Connection Test Error:', error);
      res.status(500).json({ 
        status: 'error',
        message: "AI connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  */

  // Settings endpoints
  app.post("/api/settings/profile", async (req, res) => {
    try {
      // In a real application, this would save to database
      // For now, we'll just validate and return success
      const profileData = req.body;

      // Here you would typically:
      // 1. Validate the profile data
      // 2. Save to database
      // 3. Return updated profile

      res.json({ 
        message: "Profile saved successfully",
        profile: profileData 
      });
    } catch (error) {
      console.error('Profile Save Error:', error);
      res.status(500).json({ 
        message: "Failed to save profile",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/settings/ai", async (req, res) => {
    try {
      // In a real application, this would save AI settings to database
      const aiSettings = req.body;

      // Here you would typically:
      // 1. Validate AI settings
      // 2. Update AI service configuration
      // 3. Save to database
      // 4. Return updated settings

      res.json({ 
        message: "AI settings saved successfully",
        settings: aiSettings 
      });
    } catch (error) {
      console.error('AI Settings Save Error:', error);
      res.status(500).json({ 
        message: "Failed to save AI settings",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/settings/profile", async (req, res) => {
    try {
      // Return default/stored profile data
      const defaultProfile = {
        businessName: "Serenity Spa & Salon",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        businessType: "both",
        logo: "",
        description: "A premier spa and salon experience in the Philippines",
        website: "",
        socialMedia: {
          facebook: "",
          instagram: "",
          tiktok: "",
        },
      };

      res.json(defaultProfile);
    } catch (error) {
      console.error('Profile Fetch Error:', error);
      res.status(500).json({ 
        message: "Failed to fetch profile",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/settings/ai", async (req, res) => {
    try {
      // Return current AI settings
      const defaultAISettings = {
        enabled: true,
        provider: "openrouter",
        model: "anthropic/claude-3.5-sonnet",
        temperature: 0.7,
        maxTokens: 1000,
        philippineMarketFocus: true,
        autoGenerateDescriptions: true,
        autoGenerateSKU: true,
        autoGenerateBarcode: true,
        priceResearchEnabled: true,
        competitorAnalysis: true,
        customPrompts: {
          productGeneration: "",
          marketResearch: "",
          pricing: "",
        },
      };

      res.json(defaultAISettings);
      
    } catch (error) {
      console.error('AI Settings Fetch Error:', error);
      res.status(500).json({ 
        message: "Failed to fetch AI settings",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Dashboard stats - Updated for e-commerce
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const orders = await storage.getOrders();
      const customers = await storage.getCustomers();
      const products = await storage.getProducts();

      // Calculate basic e-commerce stats
      const todayOrders = orders.filter(order => 
        order.createdAt && order.createdAt.toISOString().startsWith(today)
      );

      const dailyRevenue = todayOrders.reduce((sum: number, order) => {
        return sum + parseFloat(order.total?.toString() || "0");
      }, 0);

      const stats = {
        todayOrders: todayOrders.length,
        dailyRevenue: dailyRevenue.toFixed(2),
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
      };

      res.json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // POS Transactions endpoints - Temporarily disabled pending schema update
  app.get("/api/transactions", async (req, res) => {
    try {
      // Placeholder: Return empty array until transaction schema is implemented
      res.json([]);
    } catch (error) {
      console.error('Get Transactions Error:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      // Placeholder: Return success response until transaction schema is implemented
      res.status(201).json({ id: 'temp-id', message: 'Transaction logged' });
    } catch (error) {
      console.error('Create Transaction Error:', error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      // Placeholder: Return not found until transaction schema is implemented
      res.status(404).json({ message: "Transaction not found" });
    } catch (error) {
      console.error('Get Transaction Error:', error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Time Records endpoints - Disabled for e-commerce platform
  app.get("/api/time-records", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  app.get("/api/time-records/active/:staffId", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  app.get("/api/time-records/report", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  app.post("/api/time-records/clock-in", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  app.post("/api/time-records/clock-out/:id", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  app.post("/api/time-records/break-start/:id", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  app.post("/api/time-records/break-end/:id", async (req, res) => {
    res.status(404).json({ message: "Time records not available in e-commerce platform" });
  });

  // Notification Settings routes - Disabled for e-commerce platform
  app.get("/api/notification-settings", async (req, res) => {
    res.status(404).json({ message: "Notification settings not available in e-commerce platform" });
  });

  app.post("/api/notification-settings", async (req, res) => {
    res.status(404).json({ message: "Notification settings not available in e-commerce platform" });
  });

  // Notification Log routes - Disabled for e-commerce platform
  app.get("/api/notification-log", async (req, res) => {
    res.status(404).json({ message: "Notification logs not available in e-commerce platform" });
  });

  // Manual notification triggers - Temporarily disabled
  /*
  app.post("/api/notifications/send-confirmation/:appointmentId", async (req, res) => {
    try {
      const success = await sendAppointmentNotification(req.params.appointmentId, 'confirmation');
      if (success) {
        res.json({ message: "Confirmation email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send confirmation email" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to send confirmation email" });
    }
  });

  app.post("/api/notifications/send-reminder/:appointmentId", async (req, res) => {
    try {
      const success = await sendAppointmentNotification(req.params.appointmentId, 'reminder');
      if (success) {
        res.json({ message: "Reminder email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send reminder email" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to send reminder email" });
    }
  });
  */

  // Email Marketing Campaign routes
  app.get("/api/marketing/campaigns", async (req, res) => {
    res.status(404).json({ message: "Marketing campaigns not available in e-commerce platform" });
  });

  app.post("/api/marketing/campaigns", async (req, res) => {
    res.status(404).json({ message: "Marketing campaigns not available in e-commerce platform" });
  });

  app.post("/api/marketing/campaigns/:id/send", async (req, res) => {
    res.status(404).json({ message: "Marketing campaigns not available in e-commerce platform" });
  });

  app.delete("/api/marketing/campaigns/:id", async (req, res) => {
    res.status(404).json({ message: "Marketing campaigns not available in e-commerce platform" });
  });

  // Email Leads routes - Disabled for e-commerce platform
  app.get("/api/marketing/leads", async (req, res) => {
    res.status(404).json({ message: "Email leads not available in e-commerce platform" });
  });

  const csvUpload = multer({ 
    dest: './uploads/',
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'text/csv') {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });

  app.post("/api/marketing/leads/upload", csvUpload.single('csv'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }

      const csvContent = await fs.readFile(req.file.path, 'utf-8');
      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      const emailIndex = headers.indexOf('email');
      const firstNameIndex = headers.indexOf('firstname') !== -1 ? headers.indexOf('firstname') : headers.indexOf('first_name');
      const lastNameIndex = headers.indexOf('lastname') !== -1 ? headers.indexOf('lastname') : headers.indexOf('last_name');
      const phoneIndex = headers.indexOf('phone');

      if (emailIndex === -1) {
        return res.status(400).json({ message: "CSV must contain an 'email' column" });
      }

      const leads = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
        if (values[emailIndex] && values[emailIndex].includes('@')) {
          leads.push({
            email: values[emailIndex],
            firstName: firstNameIndex !== -1 ? values[firstNameIndex] : null,
            lastName: lastNameIndex !== -1 ? values[lastNameIndex] : null,
            phone: phoneIndex !== -1 ? values[phoneIndex] : null,
            source: 'csv_upload'
          });
        }
      }

      let successCount = 0;
      for (const lead of leads) {
        try {
          // Placeholder: Email lead creation disabled for e-commerce platform
          successCount++;
        } catch (error) {
          // Skip duplicate emails
        }
      }

      // Clean up uploaded file
      await fs.unlink(req.file.path);

      res.json({ 
        message: "Leads uploaded successfully",
        count: successCount,
        total: leads.length
      });
    } catch (error) {
      console.error('CSV upload error:', error);
      res.status(500).json({ message: "Failed to process CSV file" });
    }
  });

  // Marketing stats - Disabled for e-commerce platform
  app.get("/api/marketing/stats", async (req, res) => {
    res.status(404).json({ message: "Marketing stats not available in e-commerce platform" });
  });

  // Stylist Management Routes
  app.get("/api/stylists", async (req, res) => {
    try {
      const { location, specialty, active } = req.query;
      let stylists;

      if (location) {
        stylists = await storage.getStylistsByLocation(location as string);
      } else if (specialty) {
        stylists = await storage.getStylistsBySpecialty(specialty as string);
      } else if (active === 'true') {
        stylists = await storage.getActiveStylists();
      } else {
        stylists = await storage.getStylists();
      }

      res.json(stylists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stylists" });
    }
  });

  app.post("/api/stylists", async (req, res) => {
    try {
      const stylistData = insertStylistSchema.parse(req.body);
      const stylist = await storage.createStylist(stylistData);
      res.status(201).json(stylist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stylist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create stylist" });
    }
  });

  // Customer Preferences Routes
  app.post("/api/customer-preferences", async (req, res) => {
    try {
      const preferencesData = insertCustomerPreferencesSchema.parse(req.body);
      const preferences = await storage.createCustomerPreferences(preferencesData);
      res.status(201).json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid preferences data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer preferences" });
    }
  });

  // AI Stylist Recommendations Routes
  app.post("/api/stylist-recommendations/generate", async (req, res) => {
    try {
      const { customerId, customerProfile } = req.body;

      // Get customer preferences
      const customerPreferences = await storage.getCustomerPreferences(customerId);
      if (!customerPreferences) {
        return res.status(404).json({ message: "Customer preferences not found. Please set preferences first." });
      }

      // Get available stylists
      const availableStylists = await storage.getActiveStylists();
      if (availableStylists.length === 0) {
        return res.status(404).json({ message: "No active stylists available" });
      }

      // Generate AI recommendations
      const aiRecommendations = await aiStylistService.generateStylistRecommendations({
        customerPreferences,
        availableStylists,
        customerProfile
      });

      // Save recommendations to database
      const savedRecommendations = [];
      for (const aiRec of aiRecommendations) {
        const recommendation = await storage.createStylistRecommendation({
          customerId,
          stylistId: aiRec.stylistId,
          matchScore: aiRec.matchScore.toString(),
          matchReason: aiRec.matchReason,
          strengths: aiRec.strengths,
          considerations: aiRec.considerations,
          recommendedServices: aiRec.recommendedServices,
          estimatedPrice: aiRec.estimatedPrice?.toString(),
          aiModel: "gpt-4o",
          aiPrompt: "AI-generated stylist matching based on customer preferences"
        });
        savedRecommendations.push(recommendation);
      }

      res.json(savedRecommendations);
    } catch (error) {
      console.error("AI Stylist Recommendation Error:", error);
      res.status(500).json({ message: "Failed to generate stylist recommendations" });
    }
  });

  app.get("/api/stylist-recommendations/:customerId", async (req, res) => {
    try {
      const recommendations = await storage.getStylistRecommendations(req.params.customerId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stylist recommendations" });
    }
  });

  // MANUFACTURING SYSTEM API ROUTES

  // =====================================================
  // CUSTOMER MANAGEMENT
  // =====================================================
  
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Customer fetch error:', error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      console.error('Customer creation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error('Customer fetch error:', error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // =====================================================
  // PRICE LISTS MANAGEMENT
  // =====================================================
  
  app.get("/api/price-lists", async (req, res) => {
    try {
      const priceLists = await storage.getPriceLists();
      res.json(priceLists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price lists" });
    }
  });

  app.post("/api/price-lists", async (req, res) => {
    try {
      const priceListData = insertPriceListSchema.parse(req.body);
      const priceList = await storage.createPriceList(priceListData);
      res.status(201).json(priceList);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price list data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create price list" });
    }
  });

  // VLOOKUP functionality - Get product pricing by price list (Updated for Tiered Pricing)
  app.get("/api/vlookup/product-price", async (req, res) => {
    try {
      const { productId, priceListId, customerCode } = req.query;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // Get product information
      const product = await storage.getProduct(productId as string);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      let finalPrice = parseFloat(product.basePrice || product.srp || '0');
      let priceListName = 'Base Price';
      
      // Use tiered pricing system based on selected price list
      if (priceListId && priceListId !== 'base') {
        try {
          // Get price list by code
          const priceList = await storage.getPriceListByCode(priceListId as string);
          if (priceList) {
            const multiplier = parseFloat(priceList.priceMultiplier || '1.0000');
            finalPrice = finalPrice * multiplier;
            priceListName = priceList.name;
          } else {
            // Fallback for legacy price list codes (A, B, C, D)
            const legacyPrices = {
              'A': (product as any).priceListA,
              'B': (product as any).priceListB, 
              'C': (product as any).priceListC,
              'D': (product as any).priceListD
            };
            const legacyPrice = legacyPrices[priceListId as keyof typeof legacyPrices];
            if (legacyPrice) {
              finalPrice = parseFloat(legacyPrice);
              priceListName = `Price List ${priceListId}`;
            }
          }
        } catch (error) {
          console.error('Error getting price list:', error);
          // Fall back to base price
        }
      }

      res.json({
        productId,
        productName: product.name,
        basePrice: product.basePrice,
        srp: product.srp,
        priceListPrice: finalPrice.toFixed(2),
        priceListName: priceListName,
        specification: product.description || '',
        category: product.categoryId
      });
    } catch (error) {
      console.error('VLOOKUP pricing error:', (error as any).message || error);
      res.status(500).json({ message: "Failed to get product pricing" });
    }
  });

  // =====================================================
  // QUOTATIONS MANAGEMENT
  // =====================================================

  app.get("/api/quotations", async (req, res) => {
    try {
      const { customer, status, dateFrom, dateTo } = req.query;
      let quotations;

      if (customer && typeof customer === "string") {
        quotations = await storage.getQuotationsByCustomer(customer);
      } else if (status && typeof status === "string") {
        quotations = await storage.getQuotationsByStatus(status);
      } else {
        quotations = await storage.getQuotations();
      }

      // Filter by date range if provided
      if (dateFrom || dateTo) {
        quotations = quotations.filter((q: any) => {
          const quotationDate = new Date(q.createdAt);
          if (dateFrom && quotationDate < new Date(dateFrom as string)) return false;
          if (dateTo && quotationDate > new Date(dateTo as string)) return false;
          return true;
        });
      }

      res.json(quotations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });

  app.get("/api/quotations/:id", async (req, res) => {
    try {
      const quotation = await storage.getQuotation(req.params.id);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      const items = await storage.getQuotationItems(req.params.id);
      res.json({ ...quotation, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotation" });
    }
  });

  // Get quotation items for a specific quotation
  app.get("/api/quotation-items", async (req, res) => {
    try {
      const { quotationId } = req.query;
      if (!quotationId) {
        return res.json([]);
      }
      const items = await storage.getQuotationItems(quotationId as string);
      res.json(items || []);
    } catch (error) {
      console.error('Error fetching quotation items:', error);
      res.status(500).json({ message: "Failed to fetch quotation items" });
    }
  });

  app.get("/api/quotation-items/:quotationId", async (req, res) => {
    try {
      const items = await storage.getQuotationItems(req.params.quotationId);
      res.json(items || []);
    } catch (error) {
      console.error('Error fetching quotation items:', error);
      res.status(500).json({ message: "Failed to fetch quotation items" });
    }
  });

  app.post("/api/quotations", async (req, res) => {
    try {
      const { quotation, items } = req.body;
      
      // Ensure price lists and staff exist first
      await storage.ensurePriceListsExist();
      
      // Get or create customer first, then validate with all required fields
      let customer = await storage.getCustomerByCode(quotation.customerCode);
      if (!customer) {
        // Create new customer with basic information
        customer = await storage.createCustomer({
          customerCode: quotation.customerCode,
          name: quotation.customerCode, // Use code as temporary name
          email: `${quotation.customerCode.toLowerCase()}@customer.com`,
          password: "temp-password-123", // Required field
          phone: "",
          country: quotation.country || "Philippines",
          status: "active"
        });
      }

      // Get current staff ID - in a real app, this would come from authentication
      let currentStaff;
      try {
        const staffList = await storage.getAllStaff();
        currentStaff = staffList.find((s: any) => s.role === 'admin') || staffList[0];
        
        if (!currentStaff) {
          // Create default admin staff if none exists
          currentStaff = await storage.createStaff({
            name: 'Admin User',
            email: 'admin@hibla.com',
            role: 'admin',
            initials: 'AU',
            status: 'active'
          });
        }
      } catch (error) {
        console.error('Staff error:', error);
        return res.status(500).json({ message: "Failed to get or create staff member" });
      }

      // Note: quotation number will be handled in storage layer (manual if provided, auto-generated if not)

      // Price list is optional for manufacturing system
      let priceListId = null;
      if (quotation.priceListId) {
        const priceLists = await storage.getAllPriceLists();
        const priceList = priceLists.find(pl => pl.name === quotation.priceListId || pl.id === quotation.priceListId);
        if (priceList) {
          priceListId = priceList.id;
        } else {
          console.log('Price list not found, continuing without it');
        }
      }
      
      // Build complete quotation data with all required fields
      const completeQuotationData = {
        ...quotation,
        priceListId: priceListId, // Can be null
        customerId: customer.id,
        createdBy: currentStaff.id
        // quotationNumber is handled in storage layer (manual entry or auto-generation)
      };
      
      console.log('Complete quotation data:', completeQuotationData);
      
      // Now validate with all fields present
      console.log('About to validate quotation data:', completeQuotationData);
      
      try {
        const quotationData = insertQuotationSchema.parse(completeQuotationData);
        console.log('Validation successful, creating quotation...');
        
        // Create quotation
        const createdQuotation = await storage.createQuotation(quotationData);
        console.log('Quotation created successfully:', createdQuotation.id);
        
        // Create quotation items
        if (items && items.length > 0) {
          for (const item of items) {
            const itemData = insertQuotationItemSchema.parse({
              ...item,
              quotationId: createdQuotation.id
            });
            await storage.createQuotationItem(itemData);
          }
        }
        
        // Send email notification to customer if they have an email
        if (customer.email && customer.email !== `${customer.customerCode.toLowerCase()}@customer.com`) {
          try {
            const { sendQuotationNotification } = await import('./email-service');
            const approvalToken = Buffer.from(`${createdQuotation.id}:${Date.now()}`).toString('base64');
            
            await sendQuotationNotification({
              customerEmail: customer.email,
              customerName: customer.name || customer.customerCode,
              quotationNumber: createdQuotation.quotationNumber,
              quotationId: createdQuotation.id,
              totalAmount: createdQuotation.total.toString(),
              status: createdQuotation.status,
              createdBy: currentStaff?.name || 'Staff',
              approvalToken
            });
            console.log('Email notification sent to customer');
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Don't fail the quotation creation if email fails
          }
        }
        
        return res.status(201).json(createdQuotation);
      } catch (validationError) {
        console.error('Quotation validation error:', validationError);
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ 
            message: "Invalid quotation data", 
            errors: validationError.errors,
            receivedData: completeQuotationData
          });
        }
        throw validationError;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quotation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quotation" });
    }
  });

  app.put("/api/quotations/:id", async (req, res) => {
    try {
      const { quotation, items } = req.body;
      const quotationData = insertQuotationSchema.partial().parse(quotation);
      
      const updatedQuotation = await storage.updateQuotation(req.params.id, quotationData);
      if (!updatedQuotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      // Update items if provided
      if (items) {
        // Delete existing items and recreate
        await storage.deleteQuotationItems(req.params.id);
        for (const item of items) {
          const itemData = insertQuotationItemSchema.parse({
            ...item,
            quotationId: req.params.id
          });
          await storage.createQuotationItem(itemData);
        }
      }

      res.json(updatedQuotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quotation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update quotation" });
    }
  });

  app.delete("/api/quotations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteQuotation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quotation" });
    }
  });

  // Generate Sales Order from Quotation
  app.post("/api/quotations/:id/generate-sales-order", async (req, res) => {
    try {
      const quotation = await storage.getQuotation(req.params.id);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      const quotationItems = await storage.getQuotationItems(req.params.id);
      
      // Generate sales order number (YYYY.MM.###)
      const now = new Date();
      const yearMonth = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      const latestSalesOrder = await storage.getLatestSalesOrderForMonth(yearMonth);
      const nextSequence = latestSalesOrder ? 
        parseInt(latestSalesOrder.salesOrderNumber.split('.')[2]) + 1 : 1;
      const salesOrderNumber = `${yearMonth}.${nextSequence.toString().padStart(3, '0')}`;

      // Create sales order
      const salesOrderData = {
        salesOrderNumber,
        quotationId: quotation.id,
        customerId: quotation.customerId,
        customerCode: quotation.customerCode,
        country: quotation.country,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate + 'T00:00:00.000Z') : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        revisionNumber: "R1",
        subtotal: quotation.subtotal,
        shippingFee: quotation.shippingFee,
        bankCharge: quotation.bankCharge,
        discount: quotation.discount,
        others: quotation.others,
        total: quotation.total,
        pleasePayThisAmountUsd: quotation.total, // Required field
        paymentMethod: quotation.paymentMethod,
        shippingMethod: quotation.shippingMethod,
        customerServiceInstructions: quotation.customerServiceInstructions,
        createdBy: quotation.createdBy,
        status: "draft"
      };

      const createdSalesOrder = await storage.createSalesOrder(salesOrderData);

      // Create sales order items
      for (const item of quotationItems) {
        const salesOrderItemData = {
          salesOrderId: createdSalesOrder.id,
          productId: item.productId,
          productName: item.productName,
          specification: item.specification,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal
        };
        await storage.createSalesOrderItem(salesOrderItemData);
      }

      // Update quotation status to accepted
      await storage.updateQuotation(quotation.id, { status: "accepted" });

      res.status(201).json(createdSalesOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sales order" });
    }
  });

  // Validate Quotation Revision
  app.get("/api/quotations/:id/validate-revision", async (req, res) => {
    try {
      const { quotationLockService } = await import("./quotation-lock-service");
      const validation = await quotationLockService.validateRevision(req.params.id);
      res.json(validation);
    } catch (error) {
      res.status(500).json({ message: "Failed to validate revision" });
    }
  });

  // Approve Quotation
  app.post("/api/quotations/:id/approve", async (req, res) => {
    try {
      const quotation = await storage.getQuotation(req.params.id);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      // Update quotation status to approved
      await storage.updateQuotation(req.params.id, { status: "approved" });

      // Get customer details for email
      const customer = await storage.getCustomer(quotation.customerId);
      
      // Send approval confirmation email
      if (customer && customer.email) {
        try {
          const { sendQuotationApprovalRequest } = await import('./email-service');
          const approvalToken = Buffer.from(`${quotation.id}:${Date.now()}`).toString('base64');
          
          await sendQuotationApprovalRequest({
            customerEmail: customer.email,
            customerName: customer.name || customer.customerCode,
            quotationNumber: quotation.quotationNumber,
            quotationId: quotation.id,
            totalAmount: quotation.total.toString(),
            status: "approved",
            createdBy: quotation.createdBy || 'Staff',
            approvalToken
          });
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
        }
      }

      res.json({ message: "Quotation approved successfully", quotation: { ...quotation, status: "approved" } });
    } catch (error) {
      console.error('Error approving quotation:', error);
      res.status(500).json({ message: "Failed to approve quotation" });
    }
  });

  // Reject Quotation
  app.post("/api/quotations/:id/reject", async (req, res) => {
    try {
      const quotation = await storage.getQuotation(req.params.id);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      const { reason } = req.body;

      // Update quotation status to rejected
      await storage.updateQuotation(req.params.id, { 
        status: "rejected",
        rejectionReason: reason 
      });

      res.json({ message: "Quotation rejected", quotation: { ...quotation, status: "rejected" } });
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      res.status(500).json({ message: "Failed to reject quotation" });
    }
  });

  // Customer Portal Quotation Approval
  app.post("/api/customer-portal/approve-quotation", async (req, res) => {
    try {
      const { token, quotationId } = req.body;
      
      if (!token || !quotationId) {
        return res.status(400).json({ message: "Token and quotation ID required" });
      }

      // Decode and validate token
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [tokenQuotationId, timestamp] = decoded.split(':');
        
        if (tokenQuotationId !== quotationId) {
          return res.status(401).json({ message: "Invalid token" });
        }

        // Check if token is not expired (24 hours)
        const tokenAge = Date.now() - parseInt(timestamp);
        if (tokenAge > 24 * 60 * 60 * 1000) {
          return res.status(401).json({ message: "Token expired" });
        }
      } catch (tokenError) {
        return res.status(401).json({ message: "Invalid token format" });
      }

      const quotation = await storage.getQuotation(quotationId);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      // Update quotation status
      await storage.updateQuotation(quotationId, { status: "approved" });

      // Automatically generate sales order
      try {
        const now = new Date();
        const yearMonth = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        const latestSalesOrder = await storage.getLatestSalesOrderForMonth(yearMonth);
        const nextSequence = latestSalesOrder ? 
          parseInt(latestSalesOrder.salesOrderNumber.split('.')[2]) + 1 : 1;
        const salesOrderNumber = `${yearMonth}.${nextSequence.toString().padStart(3, '0')}`;

        const salesOrderData = {
          salesOrderNumber,
          quotationId: quotation.id,
          customerId: quotation.customerId,
          customerCode: quotation.customerCode,
          country: quotation.country,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          revisionNumber: "R1",
          subtotal: quotation.subtotal,
          shippingFee: quotation.shippingFee,
          bankCharge: quotation.bankCharge,
          discount: quotation.discount,
          others: quotation.others,
          total: quotation.total,
          pleasePayThisAmountUsd: quotation.total, // Required field
          paymentMethod: quotation.paymentMethod,
          shippingMethod: quotation.shippingMethod,
          customerServiceInstructions: quotation.customerServiceInstructions,
          createdBy: quotation.createdBy,
          status: "draft"
        };

        const createdSalesOrder = await storage.createSalesOrder(salesOrderData);

        // Create sales order items
        const quotationItems = await storage.getQuotationItems(quotationId);
        for (const item of quotationItems) {
          await storage.createSalesOrderItem({
            salesOrderId: createdSalesOrder.id,
            productId: item.productId,
            productName: item.productName,
            specification: item.specification,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal
          });
        }

        // Send order confirmation email
        const customer = await storage.getCustomer(quotation.customerId);
        if (customer && customer.email) {
          try {
            const { sendOrderConfirmationNotification } = await import('./email-service');
            await sendOrderConfirmationNotification({
              customerEmail: customer.email,
              customerName: customer.name || customer.customerCode,
              orderNumber: salesOrderNumber,
              orderId: createdSalesOrder.id,
              totalAmount: quotation.total.toString(),
              expectedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
            });
          } catch (emailError) {
            console.error('Failed to send order confirmation:', emailError);
          }
        }

        res.json({ 
          message: "Quotation approved and sales order created", 
          quotation: { ...quotation, status: "approved" },
          salesOrder: createdSalesOrder 
        });
      } catch (soError) {
        console.error('Failed to create sales order:', soError);
        res.json({ 
          message: "Quotation approved but sales order creation failed", 
          quotation: { ...quotation, status: "approved" } 
        });
      }
    } catch (error) {
      console.error('Error in customer portal approval:', error);
      res.status(500).json({ message: "Failed to approve quotation" });
    }
  });

  /* Commented out - Customer-facing routes disabled for internal-only system
  // Customer Portal - Get customer orders
  app.get("/api/customer-portal/orders", async (req, res) => {
    try {
      // In production, this would use proper authentication
      // For now, return all sales orders for demo
      const salesOrders = await storage.getSalesOrders();
      
      // Transform sales orders to match the OrderDetails interface expected by Customer Portal
      const orders = salesOrders.map(so => ({
        id: so.id,
        salesOrderNumber: so.salesOrderNumber,
        status: so.status,
        total: so.pleasePayThisAmountUsd,
        paymentStatus: so.status === 'confirmed' ? 'paid' : 'pending',
        shippingStatus: so.status === 'confirmed' ? 'processing' : 'not_shipped',
        trackingNumber: null,
        createdAt: so.createdAt
      }));

      res.json(orders);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Payment Proof Upload endpoint
  app.post("/api/payment-proofs", upload.single('file'), async (req, res) => {
    try {
      const { orderId, paymentMethod, amount, referenceNumber } = req.body;
      
      if (!orderId || !paymentMethod || !amount) {
        return res.status(400).json({ message: "Order ID, payment method, and amount are required" });
      }

      let proofImageUrl = null;
      if (req.file) {
        // In production, upload to cloud storage
        // For now, store local path
        proofImageUrl = `/uploads/${req.file.filename}`;
      }

      // Create payment proof record
      const paymentProof = await storage.createPaymentProof({
        orderId,
        customerId: req.body.customerId || 'temp-customer-id', // In production, get from auth
        paymentMethod,
        referenceNumber,
        amount: parseFloat(amount),
        proofImageUrl,
        customerNotes: req.body.notes,
        status: 'pending'
      });

      // Send notification email to admin
      try {
        const { sendPaymentProofNotification } = await import('./email-service');
        await sendPaymentProofNotification({
          orderId,
          amount,
          paymentMethod,
          referenceNumber: referenceNumber || 'N/A',
          adminEmail: 'admin@hibla.com' // Configure admin email
        });
      } catch (emailError) {
        console.error('Failed to send payment notification:', emailError);
      }

      res.json({ 
        message: "Payment proof uploaded successfully",
        paymentProof
      });
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      res.status(500).json({ 
        message: "Failed to upload payment proof",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  */ // End of customer-facing routes

  // Duplicate Quotation
  app.post("/api/quotations/:id/duplicate", async (req, res) => {
    try {
      const originalQuotation = await storage.getQuotation(req.params.id);
      if (!originalQuotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      const originalItems = await storage.getQuotationItems(req.params.id);
      
      // Generate new quotation number
      const latestQuotation = await storage.getLatestQuotation();
      const nextNumber = latestQuotation ? parseInt(latestQuotation.quotationNumber.replace(/\D/g, '')) + 1 : 1;
      const newQuotationNumber = `Q${nextNumber.toString().padStart(4, '0')}`;

      // Create duplicate quotation
      const duplicateData = {
        ...originalQuotation,
        quotationNumber: newQuotationNumber,
        revisionNumber: "R0",
        status: "draft"
      };
      delete duplicateData.id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const duplicatedQuotation = await storage.createQuotation(duplicateData);

      // Duplicate items
      for (const item of originalItems) {
        const itemData = {
          ...item,
          quotationId: duplicatedQuotation.id
        };
        delete itemData.id;
        delete itemData.createdAt;
        await storage.createQuotationItem(itemData);
      }

      res.status(201).json(duplicatedQuotation);
    } catch (error) {
      res.status(500).json({ message: "Failed to duplicate quotation" });
    }
  });

  // =====================================================
  // DOCUMENT AUTOMATION SERVICE
  // =====================================================
  
  // Automated Sales Order creation from Quotation
  app.post("/api/quotations/:id/generate-sales-order", async (req, res) => {
    try {
      const { documentAutomation } = await import('./document-automation');
      const { revisionNumber, dueDate, creatorInitials } = req.body;
      const result = await documentAutomation.createSalesOrderFromQuotation(req.params.id, {
        revisionNumber,
        dueDate,
        creatorInitials
      });
      res.json(result);
    } catch (error) {
      console.error('Error creating sales order from quotation:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Generate PDF for any document type
  app.get("/api/documents/:type/:id/pdf", async (req, res) => {
    try {
      const { documentAutomation } = await import('./document-automation');
      const { type, id } = req.params;
      const result = await documentAutomation.generateDocumentPDF(type as any, id);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="${result.filename}"`);
      res.send(result.html);
    } catch (error) {
      console.error(`Error generating ${req.params.type} PDF:`, error);
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // SALES ORDERS MANAGEMENT
  // =====================================================

  app.get("/api/sales-orders", async (req, res) => {
    try {
      const { customer, status, dateFrom, dateTo } = req.query;
      let salesOrders;

      if (customer && typeof customer === "string") {
        salesOrders = await storage.getSalesOrdersByCustomer(customer);
      } else if (status && typeof status === "string") {
        salesOrders = await storage.getSalesOrdersByStatus(status);
      } else {
        salesOrders = await storage.getSalesOrders();
      }

      // Filter by date range if provided
      if (dateFrom || dateTo) {
        salesOrders = salesOrders.filter((so: any) => {
          const orderDate = new Date(so.createdAt);
          if (dateFrom && orderDate < new Date(dateFrom as string)) return false;
          if (dateTo && orderDate > new Date(dateTo as string)) return false;
          return true;
        });
      }

      res.json(salesOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales orders" });
    }
  });

  app.get("/api/sales-orders/:id", async (req, res) => {
    try {
      const salesOrder = await storage.getSalesOrder(req.params.id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }
      const items = await storage.getSalesOrderItems(req.params.id);
      res.json({ ...salesOrder, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales order" });
    }
  });

  app.post("/api/sales-orders", async (req, res) => {
    try {
      const { salesOrder, items } = req.body;
      const salesOrderData = insertSalesOrderSchema.parse(salesOrder);
      
      // Get current staff ID
      const staffList = await storage.getAllStaff();
      const currentStaff = staffList.find((s: any) => s.role === 'admin') || staffList[0];
      salesOrderData.createdBy = currentStaff.id;

      // Auto-generate sales order number if not provided (YYYY.MM.###)
      if (!salesOrderData.salesOrderNumber) {
        const now = new Date();
        const yearMonth = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        const latestSalesOrder = await storage.getLatestSalesOrderForMonth(yearMonth);
        const nextSequence = latestSalesOrder ? 
          parseInt(latestSalesOrder.salesOrderNumber.split('.')[2]) + 1 : 1;
        salesOrderData.salesOrderNumber = `${yearMonth}.${nextSequence.toString().padStart(3, '0')}`;
      }

      const createdSalesOrder = await storage.createSalesOrder(salesOrderData);

      // Create sales order items
      if (items && items.length > 0) {
        for (const item of items) {
          const itemData = insertSalesOrderItemSchema.parse({
            ...item,
            salesOrderId: createdSalesOrder.id
          });
          await storage.createSalesOrderItem(itemData);
        }
      }

      res.status(201).json(createdSalesOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sales order" });
    }
  });

  // Confirm Sales Order using Document Automation
  app.post("/api/sales-orders/:id/confirm", async (req, res) => {
    try {
      const { documentAutomation } = await import('./document-automation');
      const result = await documentAutomation.confirmSalesOrder(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Error confirming sales order:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Generate Invoice from Confirmed Sales Order
  app.post("/api/sales-orders/:id/invoice", async (req, res) => {
    try {
      // Get current staff for tracking
      const staffList = await storage.getAllStaff();
      const currentStaff = staffList.find((s: any) => s.role === 'admin') || staffList[0];
      const createdBy = currentStaff?.id || 'system';

      // Use the invoice service
      const { invoiceService } = await import("./invoice-service");
      const invoice = await invoiceService.generateInvoiceFromSalesOrder(req.params.id, createdBy);

      res.json({ invoice, message: "Invoice generated successfully" });
    } catch (error) {
      console.error("Error generating invoice:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  });

  // Get Invoice by Sales Order
  app.get("/api/sales-orders/:id/invoice", async (req, res) => {
    try {
      const { invoiceService } = await import("./invoice-service");
      const invoice = await invoiceService.getInvoiceBySalesOrder(req.params.id);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found for this sales order" });
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  // Generate Sales Order PDF
  app.get("/api/sales-orders/:id/pdf", async (req, res) => {
    try {
      const salesOrder = await storage.getSalesOrder(req.params.id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }

      const salesOrderItems = await storage.getSalesOrderItems(req.params.id);
      const customer = await storage.getCustomer(salesOrder.customerId);

      const pdfData = {
        orderNumber: salesOrder.salesOrderNumber,
        revision: salesOrder.revisionNumber || "R1",
        date: new Date(salesOrder.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        customerCode: salesOrder.customerCode,
        customerName: customer?.name || salesOrder.customerCode,
        country: salesOrder.country,
        paymentMethod: salesOrder.paymentMethod,
        shippingMethod: salesOrder.shippingMethod,
        items: salesOrderItems.map(item => ({
          productName: item.productName,
          quantity: parseFloat(item.quantity),
          unitPrice: item.unitPrice,
          totalPrice: item.lineTotal,
          specification: item.specification || ''
        })),
        subtotal: salesOrder.subtotal,
        shippingFee: salesOrder.shippingFee,
        bankCharge: salesOrder.bankCharge,
        discount: salesOrder.discount,
        others: salesOrder.others,
        total: salesOrder.total,
        customerServiceInstructions: salesOrder.customerServiceInstructions
      };

      const htmlContent = generateSalesOrderHTML(pdfData);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="Sales_Order_${salesOrder.salesOrderNumber}.html"`);
      res.send(htmlContent);
    } catch (error) {
      console.error('Error generating sales order PDF:', error);
      res.status(500).json({ message: "Failed to generate sales order PDF" });
    }
  });

  // =====================================================
  // JOB ORDERS MANAGEMENT
  // =====================================================

  app.get("/api/job-orders", async (req, res) => {
    try {
      const { customer, status, dateFrom, dateTo } = req.query;
      let jobOrders;

      if (customer && typeof customer === "string") {
        jobOrders = await storage.getJobOrdersByCustomer(customer);
      } else {
        jobOrders = await storage.getJobOrders();
      }

      // Filter by date range if provided
      if (dateFrom || dateTo) {
        jobOrders = jobOrders.filter((jo: any) => {
          const orderDate = new Date(jo.dateCreated);
          if (dateFrom && orderDate < new Date(dateFrom as string)) return false;
          if (dateTo && orderDate > new Date(dateTo as string)) return false;
          return true;
        });
      }

      res.json(jobOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job orders" });
    }
  });

  app.get("/api/job-orders/:id", async (req, res) => {
    try {
      const jobOrder = await storage.getJobOrder(req.params.id);
      if (!jobOrder) {
        return res.status(404).json({ message: "Job order not found" });
      }
      const items = await storage.getJobOrderItems(req.params.id);
      res.json({ ...jobOrder, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job order" });
    }
  });

  app.put("/api/job-orders/:id/items/:itemId/shipment", async (req, res) => {
    try {
      const { shipmentNumber, quantity } = req.body;
      
      if (!shipmentNumber || !quantity || shipmentNumber < 1 || shipmentNumber > 8) {
        return res.status(400).json({ message: "Invalid shipment number or quantity" });
      }

      const updated = await storage.updateJobOrderItemShipment(
        req.params.itemId, 
        shipmentNumber, 
        quantity
      );

      if (!updated) {
        return res.status(404).json({ message: "Job order item not found" });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update shipment" });
    }
  });

  // Generate Job Order PDF
  app.get("/api/job-orders/:id/pdf", async (req, res) => {
    try {
      const jobOrder = await storage.getJobOrder(req.params.id);
      if (!jobOrder) {
        return res.status(404).json({ message: "Job order not found" });
      }

      const jobOrderItems = await storage.getJobOrderItems(req.params.id);
      const customer = await storage.getCustomer(jobOrder.customerId);

      const pdfData = {
        jobOrderNumber: jobOrder.jobOrderNumber,
        revision: jobOrder.revisionNumber || "R1",
        date: new Date(jobOrder.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        dueDate: new Date(jobOrder.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        customerCode: jobOrder.customerCode,
        customerName: customer?.name || jobOrder.customerCode,
        salesOrderNumber: jobOrder.salesOrderNumber || 'N/A',
        items: jobOrderItems.map(item => ({
          productName: item.productName,
          quantity: parseFloat(item.quantity),
          specification: item.specification || 'Standard',
          status: item.status || 'pending'
        })),
        customerInstructions: jobOrder.customerInstructions,
        productionStatus: jobOrder.status || 'pending',
        shipmentStatus: jobOrder.shipmentStatus || 'pending'
      };

      const htmlContent = generateJobOrderHTML(pdfData);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="Job_Order_${jobOrder.jobOrderNumber}.html"`);
      res.send(htmlContent);
    } catch (error) {
      console.error('Error generating job order PDF:', error);
      res.status(500).json({ message: "Failed to generate job order PDF" });
    }
  });

  // =====================================================
  // READY ITEMS SUMMARY REPORT
  // =====================================================

  // Get ready items summary from Job Orders with filtering
  app.get("/api/reports/ready-items-summary", async (req, res) => {
    try {
      const { dateFrom, dateTo, customerCode, orderItem } = req.query;
      
      // Get all job orders with their items
      let jobOrders = await storage.getJobOrders();
      let allJobOrderItems: any[] = [];

      // Get items for each job order
      for (const jobOrder of jobOrders) {
        const items = await storage.getJobOrderItems(jobOrder.id);
        const itemsWithJobOrderInfo = items.map((item: any) => ({
          ...item,
          jobOrderNumber: jobOrder.jobOrderNumber,
          customerCode: jobOrder.customerCode,
          dueDate: jobOrder.dueDate,
          createdAt: jobOrder.createdAt,
          // Calculate ready quantities from shipment data
          readyQuantity: calculateReadyQuantity(item),
          totalQuantity: parseFloat(item.quantity || '0'),
          pendingQuantity: parseFloat(item.quantity || '0') - calculateReadyQuantity(item)
        }));
        allJobOrderItems.push(...itemsWithJobOrderInfo);
      }

      // Filter by customer code if provided
      if (customerCode && typeof customerCode === "string") {
        allJobOrderItems = allJobOrderItems.filter(item => 
          item.customerCode && item.customerCode.toLowerCase().includes(customerCode.toLowerCase())
        );
      }

      // Filter by order item (product name) if provided
      if (orderItem && typeof orderItem === "string") {
        allJobOrderItems = allJobOrderItems.filter(item => 
          item.productName && item.productName.toLowerCase().includes(orderItem.toLowerCase())
        );
      }

      // Filter by date range if provided
      if (dateFrom || dateTo) {
        allJobOrderItems = allJobOrderItems.filter(item => {
          const itemDate = new Date(item.createdAt);
          if (dateFrom && itemDate < new Date(dateFrom as string)) return false;
          if (dateTo && itemDate > new Date(dateTo as string)) return false;
          return true;
        });
      }

      // Group by product and customer for summary
      const summaryMap = new Map();
      
      allJobOrderItems.forEach(item => {
        const key = `${item.customerCode}-${item.productName}`;
        
        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            customerCode: item.customerCode,
            productName: item.productName,
            specification: item.specification || 'Standard',
            jobOrders: [],
            totalOrdered: 0,
            totalReady: 0,
            totalPending: 0,
            readyPercentage: 0
          });
        }
        
        const summary = summaryMap.get(key);
        summary.jobOrders.push({
          jobOrderNumber: item.jobOrderNumber,
          quantity: item.totalQuantity,
          readyQuantity: item.readyQuantity,
          dueDate: item.dueDate
        });
        
        summary.totalOrdered += item.totalQuantity;
        summary.totalReady += item.readyQuantity;
        summary.totalPending += item.pendingQuantity;
        summary.readyPercentage = summary.totalOrdered > 0 
          ? Math.round((summary.totalReady / summary.totalOrdered) * 100) 
          : 0;
      });

      // Convert map to array and sort
      const summaryData = Array.from(summaryMap.values()).sort((a, b) => {
        // Sort by customer code, then by product name
        if (a.customerCode !== b.customerCode) {
          return a.customerCode.localeCompare(b.customerCode);
        }
        return a.productName.localeCompare(b.productName);
      });

      // Calculate overall statistics
      const totalItems = summaryData.length;
      const totalOrderedGlobal = summaryData.reduce((sum, item) => sum + item.totalOrdered, 0);
      const totalReadyGlobal = summaryData.reduce((sum, item) => sum + item.totalReady, 0);
      const totalPendingGlobal = summaryData.reduce((sum, item) => sum + item.totalPending, 0);
      const overallReadyPercentage = totalOrderedGlobal > 0 
        ? Math.round((totalReadyGlobal / totalOrderedGlobal) * 100) 
        : 0;

      res.json({
        summary: summaryData,
        statistics: {
          totalItems,
          totalOrderedGlobal,
          totalReadyGlobal,
          totalPendingGlobal,
          overallReadyPercentage,
          filters: {
            dateFrom: dateFrom || null,
            dateTo: dateTo || null,
            customerCode: customerCode || null,
            orderItem: orderItem || null
          }
        }
      });
    } catch (error) {
      console.error('Ready items summary error:', error);
      res.status(500).json({ message: "Failed to generate ready items summary" });
    }
  });

  // Helper function to calculate ready quantity from shipments
  const calculateReadyQuantity = (item: any): number => {
    let readyQty = 0;
    
    // Sum up all shipment quantities (shipment1 through shipment8)
    for (let i = 1; i <= 8; i++) {
      const shipmentQty = parseFloat(item[`shipment${i}`] || '0');
      readyQty += shipmentQty;
    }
    
    return readyQty;
  };

  // Export ready items summary to Excel
  app.post("/api/reports/ready-items-summary/export/excel", async (req, res) => {
    try {
      const { dateFrom, dateTo, customerCode, orderItem } = req.body;
      
      // Get summary data directly instead of making HTTP request
      let jobOrders = await storage.getJobOrders();
      let allJobOrderItems: any[] = [];

      for (const jobOrder of jobOrders) {
        const items = await storage.getJobOrderItems(jobOrder.id);
        const itemsWithJobOrderInfo = items.map((item: any) => ({
          ...item,
          jobOrderNumber: jobOrder.jobOrderNumber,
          customerCode: jobOrder.customerCode,
          dueDate: jobOrder.dueDate,
          createdAt: jobOrder.createdAt,
          readyQuantity: calculateReadyQuantity(item),
          totalQuantity: parseFloat(item.quantity || '0'),
          pendingQuantity: parseFloat(item.quantity || '0') - calculateReadyQuantity(item)
        }));
        allJobOrderItems.push(...itemsWithJobOrderInfo);
      }

      // Apply filters
      if (customerCode && typeof customerCode === "string") {
        allJobOrderItems = allJobOrderItems.filter(item => 
          item.customerCode && item.customerCode.toLowerCase().includes(customerCode.toLowerCase())
        );
      }

      if (orderItem && typeof orderItem === "string") {
        allJobOrderItems = allJobOrderItems.filter(item => 
          item.productName && item.productName.toLowerCase().includes(orderItem.toLowerCase())
        );
      }

      if (dateFrom || dateTo) {
        allJobOrderItems = allJobOrderItems.filter(item => {
          const itemDate = new Date(item.createdAt);
          if (dateFrom && itemDate < new Date(dateFrom as string)) return false;
          if (dateTo && itemDate > new Date(dateTo as string)) return false;
          return true;
        });
      }

      // Group by product and customer for summary
      const summaryMap = new Map();
      
      allJobOrderItems.forEach(item => {
        const key = `${item.customerCode}-${item.productName}`;
        
        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            customerCode: item.customerCode,
            productName: item.productName,
            specification: item.specification || 'Standard',
            jobOrders: [],
            totalOrdered: 0,
            totalReady: 0,
            totalPending: 0,
            readyPercentage: 0
          });
        }
        
        const summary = summaryMap.get(key);
        summary.jobOrders.push({
          jobOrderNumber: item.jobOrderNumber,
          quantity: item.totalQuantity,
          readyQuantity: item.readyQuantity,
          dueDate: item.dueDate
        });
        
        summary.totalOrdered += item.totalQuantity;
        summary.totalReady += item.readyQuantity;
        summary.totalPending += item.pendingQuantity;
        summary.readyPercentage = summary.totalOrdered > 0 
          ? Math.round((summary.totalReady / summary.totalOrdered) * 100) 
          : 0;
      });

      const summaryArray = Array.from(summaryMap.values()).sort((a, b) => {
        if (a.customerCode !== b.customerCode) {
          return a.customerCode.localeCompare(b.customerCode);
        }
        return a.productName.localeCompare(b.productName);
      });

      const totalItems = summaryArray.length;
      const totalOrderedGlobal = summaryArray.reduce((sum, item) => sum + item.totalOrdered, 0);
      const totalReadyGlobal = summaryArray.reduce((sum, item) => sum + item.totalReady, 0);
      const totalPendingGlobal = summaryArray.reduce((sum, item) => sum + item.totalPending, 0);
      const overallReadyPercentage = totalOrderedGlobal > 0 
        ? Math.round((totalReadyGlobal / totalOrderedGlobal) * 100) 
        : 0;

      const summaryData = {
        summary: summaryArray,
        statistics: {
          totalItems,
          totalOrderedGlobal,
          totalReadyGlobal,
          totalPendingGlobal,
          overallReadyPercentage,
          filters: {
            dateFrom: dateFrom || null,
            dateTo: dateTo || null,
            customerCode: customerCode || null,
            orderItem: orderItem || null
          }
        }
      };
      
      // Use export service to create Excel file
      const { exportService } = await import("./export-service");
      const buffer = await exportService.exportReadyItemsSummary(summaryData);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="ready-items-summary-${Date.now()}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting ready items summary:", error);
      res.status(500).json({ message: "Failed to export ready items summary" });
    }
  });

  // =====================================================
  // EXPORT ROUTES
  // =====================================================
  
  // Export Quotation to Excel
  app.get("/api/quotations/:id/export/excel", async (req, res) => {
    try {
      const { exportService } = await import("./export-service");
      const buffer = await exportService.exportQuotationToExcel(req.params.id);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="quotation-${req.params.id}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting quotation:", error);
      res.status(500).json({ message: "Failed to export quotation" });
    }
  });

  // Export Sales Order to Excel
  app.get("/api/sales-orders/:id/export/excel", async (req, res) => {
    try {
      const { exportService } = await import("./export-service");
      const buffer = await exportService.exportSalesOrderToExcel(req.params.id);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="sales-order-${req.params.id}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting sales order:", error);
      res.status(500).json({ message: "Failed to export sales order" });
    }
  });

  // Export Summary Report to Excel
  app.post("/api/reports/export/excel", async (req, res) => {
    try {
      const { exportService } = await import("./export-service");
      const { dateFrom, dateTo, customerCode, orderItem, reportType } = req.body;
      
      const buffer = await exportService.exportSummaryReport({
        dateFrom,
        dateTo,
        customerCode,
        orderItem,
        reportType: reportType || 'sales-orders'
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}-report-${Date.now()}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting summary report:", error);
      res.status(500).json({ message: "Failed to export summary report" });
    }
  });

  // =====================================================
  // WAREHOUSES MANAGEMENT
  // =====================================================

  app.get("/api/warehouses", async (req, res) => {
    try {
      const warehouses = await storage.getWarehouses();
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warehouses" });
    }
  });

  app.post("/api/warehouses", async (req, res) => {
    try {
      const warehouseData = insertWarehouseSchema.parse(req.body);
      const warehouse = await storage.createWarehouse(warehouseData);
      res.status(201).json(warehouse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid warehouse data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create warehouse" });
    }
  });

  // Inventory Movement Tracking
  app.get("/api/inventory/movements", async (req, res) => {
    try {
      const { warehouseId, productId, dateFrom, dateTo, movementType } = req.query;
      const movements = await storage.getInventoryMovements({
        warehouseId: warehouseId as string,
        productId: productId as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        movementType: movementType as string
      });
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory movements" });
    }
  });

  app.post("/api/inventory/movements", async (req, res) => {
    try {
      const movementData = insertInventoryTransactionSchema.parse(req.body);
      
      // Get current staff ID
      const staffList = await storage.getAllStaff();
      const currentStaff = staffList.find((s: any) => s.role === 'admin') || staffList[0];
      movementData.staffId = currentStaff.id;

      const movement = await storage.createInventoryMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid movement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory movement" });
    }
  });

  // =====================================================
  // REPORTS AND ANALYTICS
  // =====================================================

  // Manufacturing Dashboard Stats
  app.get("/api/dashboard/manufacturing", async (req, res) => {
    try {
      const stats = await storage.getManufacturingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch manufacturing stats" });
    }
  });

  // Summary Reports with Filtering
  app.get("/api/reports/summary", async (req, res) => {
    try {
      const { dateFrom, dateTo, customerCode, orderItems } = req.query;
      const report = await storage.getSummaryReport({
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        customerCode: customerCode as string,
        orderItems: orderItems as string
      });
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate summary report" });
    }
  });

  app.get("/api/products/vlookup-price", async (req, res) => {
    try {
      const { productId, priceListId } = req.query;
      
      if (!productId || !priceListId) {
        return res.status(400).json({ 
          message: "Both productId and priceListId query parameters are required" 
        });
      }

      const product = await storage.getProduct(productId as string);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // VLOOKUP price based on price list
      let price = "0.00";
      switch (priceListId) {
        case "A":
          price = product.priceListA || "0.00";
          break;
        case "B":
          price = product.priceListB || "0.00";
          break;
        case "C":
          price = product.priceListC || "0.00";
          break;
        case "D":
          price = product.priceListD || "0.00";
          break;
        default:
          price = product.priceListA || "0.00";
      }

      res.json({
        productId: product.id,
        productName: product.name,
        unit: product.unit || "pcs",
        price: price,
        priceList: priceListId,
        sku: product.sku
      });
      
    } catch (error) {
      console.error('Error in price lookup:', error);
      res.status(500).json({ message: "Failed to lookup product price" });
    }
  });

  // Simplified Payment processing routes - COD and GCash only
  app.post("/api/payments/process", async (req, res) => {
    try {
      const { orderId, paymentMethod, amount, referenceNumber, accountNumber, notes } = req.body;

      // Validate payment method
      if (!["cod", "gcash"].includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method. Only COD and GCash are supported." });
      }

      // Update order payment status based on method
      let paymentStatus = "pending";
      let orderStatus = "pending";

      if (paymentMethod === "cod") {
        paymentStatus = "pending_cod";
        orderStatus = "confirmed"; // COD orders are confirmed immediately
      } else if (paymentMethod === "gcash" && referenceNumber) {
        paymentStatus = "pending_verification";
        orderStatus = "processing";
      } else if (paymentMethod === "gcash" && !referenceNumber) {
        return res.status(400).json({ message: "GCash reference number is required" });
      }

      const updatedOrder = await storage.updateOrderStatus(orderId, {
        paymentStatus,
        status: orderStatus
      });

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Store payment details in order notes
      const paymentDetails = {
        method: paymentMethod,
        reference: referenceNumber || null,
        account: accountNumber || null,
        notes: notes || null,
        processedAt: new Date().toISOString(),
        amount: amount
      };

      await storage.updateOrder(orderId, {
        notes: `Payment: ${JSON.stringify(paymentDetails)}`
      });

      res.json({ 
        success: true, 
        orderId,
        message: paymentMethod === "cod" ? "COD order confirmed" : "GCash payment submitted for verification",
        paymentStatus,
        orderStatus
      });
    } catch (error: any) {
      console.error("Payment processing error:", error);
      res.status(500).json({ message: "Failed to process payment: " + error.message });
    }
  });

  // Get payment status
  app.get("/api/payments/status/:orderId", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        status: order.status,
        total: order.total
      });
    } catch (error: any) {
      console.error("Get payment status error:", error);
      res.status(500).json({ message: "Failed to get payment status: " + error.message });
    }
  });

  // NexusPay Integration Routes
  app.post("/api/nexuspay/cash-in", async (req, res) => {
    try {
      const { orderId, amount, description } = req.body;

      if (!orderId || !amount) {
        return res.status(400).json({ message: "Order ID and amount are required" });
      }

      // Get order to verify it exists
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Create NexusPay transaction record
      const transaction = await storage.createNexusPayTransaction({
        orderId,
        type: 'cash_in',
        amount: amount.toString(),
        currency: 'PHP',
        reference: orderId,
        description: description || `Payment for order ${orderId}`,
        status: 'pending'
      });

      // Initialize NexusPay service
      const { createNexusPayService } = await import('./nexuspay-service');
      const nexusPayService = createNexusPayService();

      // Process payment through NexusPay
      const result = await nexusPayService.cashIn({
        amount: parseFloat(amount),
        reference: orderId,
        description: description || `Payment for order ${orderId}`
      });

      // Update transaction with NexusPay response
      await storage.updateNexusPayTransaction(transaction.id, {
        transactionId: result.transactionId,
        status: result.success ? 'completed' : 'failed',
        nexusPayResponse: JSON.stringify(result)
      });

      if (result.success) {
        // Update order payment status
        await storage.updateOrderStatus(orderId, {
          paymentStatus: 'paid',
          status: 'confirmed'
        });

        res.json({
          success: true,
          transactionId: result.transactionId,
          message: 'Payment processed successfully',
          orderId
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error || 'Payment processing failed',
          orderId
        });
      }
    } catch (error: any) {
      console.error("NexusPay Cash In Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to process payment: " + error.message 
      });
    }
  });

  app.post("/api/nexuspay/cash-out", async (req, res) => {
    try {
      const { orderId, amount, recipientAccount, description } = req.body;

      if (!orderId || !amount || !recipientAccount) {
        return res.status(400).json({ message: "Order ID, amount, and recipient account are required" });
      }

      // Create NexusPay transaction record
      const transaction = await storage.createNexusPayTransaction({
        orderId,
        type: 'cash_out',
        amount: amount.toString(),
        currency: 'PHP',
        reference: orderId,
        description: description || `Refund for order ${orderId}`,
        status: 'pending'
      });

      // Initialize NexusPay service
      const { createNexusPayService } = await import('./nexuspay-service');
      const nexusPayService = createNexusPayService();

      // Process refund through NexusPay
      const result = await nexusPayService.cashOut({
        amount: parseFloat(amount),
        reference: orderId,
        recipientAccount,
        description: description || `Refund for order ${orderId}`
      });

      // Update transaction with NexusPay response
      await storage.updateNexusPayTransaction(transaction.id, {
        transactionId: result.transactionId,
        status: result.success ? 'completed' : 'failed',
        nexusPayResponse: JSON.stringify(result)
      });

      if (result.success) {
        res.json({
          success: true,
          transactionId: result.transactionId,
          message: 'Refund processed successfully',
          orderId
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error || 'Refund processing failed',
          orderId
        });
      }
    } catch (error: any) {
      console.error("NexusPay Cash Out Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to process refund: " + error.message 
      });
    }
  });

  app.get("/api/nexuspay/transactions/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const transactions = await storage.getNexusPayTransactions(orderId);
      res.json(transactions);
    } catch (error: any) {
      console.error("Get NexusPay transactions error:", error);
      res.status(500).json({ message: "Failed to get transactions: " + error.message });
    }
  });

  app.get("/api/nexuspay/status/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;

      // Initialize NexusPay service
      const { createNexusPayService } = await import('./nexuspay-service');
      const nexusPayService = createNexusPayService();

      // Get transaction status from NexusPay
      const result = await nexusPayService.getTransactionStatus(transactionId);

      res.json(result);
    } catch (error: any) {
      console.error("Get NexusPay status error:", error);
      res.status(500).json({ message: "Failed to get transaction status: " + error.message });
    }
  });

  app.get("/api/nexuspay/balance", async (req, res) => {
    try {
      // Initialize NexusPay service
      const { createNexusPayService } = await import('./nexuspay-service');
      const nexusPayService = createNexusPayService();

      // Get wallet balance
      const balance = await nexusPayService.getBalance();

      if (balance) {
        res.json(balance);
      } else {
        res.status(503).json({ message: "Unable to retrieve balance at this time" });
      }
    } catch (error: any) {
      console.error("Get NexusPay balance error:", error);
      res.status(500).json({ message: "Failed to get balance: " + error.message });
    }
  });

  // Admin Payment Methods Management
  app.get("/api/admin/payment-methods", async (req, res) => {
    try {
      const methods = await storage.getPaymentMethods();
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  app.post("/api/admin/payment-methods", async (req, res) => {
    try {
      const method = await storage.createPaymentMethod(req.body);
      res.json(method);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment method" });
    }
  });

  app.put("/api/admin/payment-methods/:id", async (req, res) => {
    try {
      const method = await storage.updatePaymentMethod(req.params.id, req.body);
      if (!method) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      res.json(method);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment method" });
    }
  });

  app.delete("/api/admin/payment-methods/:id", async (req, res) => {
    try {
      const success = await storage.deletePaymentMethod(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment method" });
    }
  });

  // Payment Proof Management
  app.get("/api/admin/payment-proofs", async (req, res) => {
    try {
      const status = req.query.status as string;
      const proofs = await storage.getPaymentProofs(status);
      res.json(proofs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment proofs" });
    }
  });

  app.post("/api/admin/payment-proofs/:id/approve", async (req, res) => {
    try {
      const { adminNotes } = req.body;
      const proof = await storage.updatePaymentProofStatus(req.params.id, "approved", adminNotes, "admin-user");

      if (!proof) {
        return res.status(404).json({ message: "Payment proof not found" });
      }

      // Update the order status to confirmed when payment is approved
      await storage.updateOrderStatus(proof.orderId, {
        paymentStatus: "confirmed",
        status: "confirmed"
      });

      res.json(proof);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve payment" });
    }
  });

  app.post("/api/admin/payment-proofs/:id/reject", async (req, res) => {
    try {
      const { adminNotes } = req.body;
      const proof = await storage.updatePaymentProofStatus(req.params.id, "rejected", adminNotes, "admin-user");

      if (!proof) {
        return res.status(404).json({ message: "Payment proof not found" });
      }

      // Update the order status when payment is rejected
      await storage.updateOrderStatus(proof.orderId, {
        paymentStatus: "rejected",
        status: "payment_failed"
      });

      res.json(proof);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject payment" });
    }
  });

  // Customer payment proof submission
  app.post("/api/payment-proofs", async (req, res) => {
    try {
      const proof = await storage.createPaymentProof(req.body);
      res.json(proof);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit payment proof" });
    }
  });

  // Get active payment methods for checkout
  app.get("/api/payment-methods/active", async (req, res) => {
    try {
      const methods = await storage.getActivePaymentMethods();
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  // ============ PAYMENT RECORDING SYSTEM ROUTES ============
  
  // Record a new payment
  app.post('/api/payments/record', async (req, res) => {
    try {
      const payment = await storage.recordPayment(req.body);
      res.json(payment);
    } catch (error) {
      console.error('Error recording payment:', error);
      res.status(500).json({ error: 'Failed to record payment' });
    }
  });

  // Get payments for an invoice
  app.get('/api/payments/invoice/:invoiceId', async (req, res) => {
    try {
      const payments = await storage.getInvoicePayments(req.params.invoiceId);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching invoice payments:', error);
      res.status(500).json({ error: 'Failed to fetch invoice payments' });
    }
  });

  // Get payments for a customer
  app.get('/api/payments/customer/:customerCode', async (req, res) => {
    try {
      const payments = await storage.getCustomerPayments(req.params.customerCode);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      res.status(500).json({ error: 'Failed to fetch customer payments' });
    }
  });

  // Get a single payment
  app.get('/api/payments/:id', async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  });

  // Update payment status
  app.patch('/api/payments/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const payment = await storage.updatePaymentStatus(req.params.id, status);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ error: 'Failed to update payment status' });
    }
  });

  // Process refund
  app.post('/api/payments/:id/refund', async (req, res) => {
    try {
      const { amount, notes } = req.body;
      const refund = await storage.processRefund(req.params.id, amount, notes);
      res.json(refund);
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({ error: 'Failed to process refund' });
    }
  });

  // Email settings routes
  app.get('/api/email-settings', async (req, res) => {
    try {
      const settings = await storage.getEmailSettings();
      res.json(settings || {});
    } catch (error) {
      console.error('Error fetching email settings:', error);
      res.status(500).json({ message: 'Failed to fetch email settings' });
    }
  });

  app.post('/api/email-settings', async (req, res) => {
    try {
      const { emailNotificationService } = await import('./email-notification-service');
      await emailNotificationService.updateEmailSettings(req.body);
      res.json({ success: true, message: 'Email settings updated successfully' });
    } catch (error) {
      console.error('Error updating email settings:', error);
      res.status(500).json({ message: 'Failed to update email settings' });
    }
  });

  app.post('/api/email-settings/test-connection', async (req, res) => {
    try {
      const { emailNotificationService } = await import('./email-notification-service');
      await emailNotificationService.updateEmailSettings(req.body);
      const success = await emailNotificationService.verifyConnection();
      res.json({ 
        success, 
        message: success ? 'Connection successful' : 'Connection failed. Please check your settings.' 
      });
    } catch (error) {
      console.error('Error testing email connection:', error);
      res.status(500).json({ message: 'Failed to test connection' });
    }
  });

  app.post('/api/email-settings/test-email', async (req, res) => {
    try {
      const { recipient, settings } = req.body;
      const { emailNotificationService } = await import('./email-notification-service');
      
      // Temporarily update settings for testing
      await emailNotificationService.updateEmailSettings(settings);
      
      const success = await emailNotificationService.testEmailConnection(recipient);
      res.json({ 
        success, 
        message: success ? 'Test email sent successfully' : 'Failed to send test email' 
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({ message: 'Failed to send test email' });
    }
  });

  // Get all invoices
  app.get('/api/invoices', async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });

  // Get single invoice
  app.get('/api/invoices/:id', async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ error: 'Failed to fetch invoice' });
    }
  });

  // ============ CUSTOMER PORTAL ROUTES (DISABLED - INTERNAL SYSTEM ONLY) ============
  
  /* Commented out - System is now internal-only, no customer access
  // Customer portal authentication
  app.post('/api/customer-portal/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const { customerPortalService } = await import('./customer-portal-service');
      
      const customer = await customerPortalService.authenticateCustomer(email, password);
      if (!customer) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      res.json(customer);
    } catch (error) {
      console.error('Error in customer login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Get customer orders
  app.get('/api/customer-portal/orders', async (req, res) => {
    try {
      const { customerId } = req.query;
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID required' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      const orders = await customerPortalService.getCustomerOrders(customerId as string);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  // Get customer quotations
  app.get('/api/customer-portal/quotations', async (req, res) => {
    try {
      const { customerId } = req.query;
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID required' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      const quotations = await customerPortalService.getCustomerQuotations(customerId as string);
      res.json(quotations);
    } catch (error) {
      console.error('Error fetching customer quotations:', error);
      res.status(500).json({ message: 'Failed to fetch quotations' });
    }
  });

  // Get customer invoices
  app.get('/api/customer-portal/invoices', async (req, res) => {
    try {
      const { customerId } = req.query;
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID required' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      const invoices = await customerPortalService.getCustomerInvoices(customerId as string);
      res.json(invoices);
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      res.status(500).json({ message: 'Failed to fetch invoices' });
    }
  });

  // Get specific order details
  app.get('/api/customer-portal/orders/:orderId', async (req, res) => {
    try {
      const { customerId } = req.query;
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID required' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      const order = await customerPortalService.getOrderDetails(customerId as string, req.params.orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Failed to fetch order details' });
    }
  });

  // Get specific quotation details
  app.get('/api/customer-portal/quotations/:quotationId', async (req, res) => {
    try {
      const { customerId } = req.query;
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID required' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      const quotation = await customerPortalService.getQuotationDetails(customerId as string, req.params.quotationId);
      
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      
      res.json(quotation);
    } catch (error) {
      console.error('Error fetching quotation details:', error);
      res.status(500).json({ message: 'Failed to fetch quotation details' });
    }
  });

  // Update customer profile
  app.put('/api/customer-portal/profile', async (req, res) => {
    try {
      const { customerId, ...updates } = req.body;
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID required' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      const updatedCustomer = await customerPortalService.updateCustomerProfile(customerId, updates);
      res.json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Change customer password
  app.post('/api/customer-portal/change-password', async (req, res) => {
    try {
      const { customerId, currentPassword, newPassword } = req.body;
      if (!customerId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const { customerPortalService } = await import('./customer-portal-service');
      await customerPortalService.changeCustomerPassword(customerId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing customer password:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to change password' });
    }
  });

  // Get customer dashboard stats
  app.get('/api/customer-portal/dashboard/:customerId', async (req, res) => {
    try {
      const { customerPortalService } = await import('./customer-portal-service');
      const stats = await customerPortalService.getCustomerDashboardStats(req.params.customerId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching customer dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });
  */ // End of commented out customer portal routes

  // ============ ADMIN PORTAL ROUTES ============
  
  // Admin portal authentication - Use main auth system
  app.post('/api/admin-portal/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Use the main authentication system
      const result = await authService.authenticate(email, password);
      
      if (!result.success || !result.user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Admin portal doesn't need sessions - token-based auth

      // Return admin format for AdminPortal component
      res.json({ 
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        permissions: result.user.permissions || []
      });
    } catch (error) {
      console.error('Error in admin login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Get all customers for admin
  app.get('/api/admin-portal/customers', async (req, res) => {
    try {
      const { adminPortalService } = await import('./admin-portal-service');
      const customers = await adminPortalService.getAllCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers for admin:', error);
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  });

  // Get all orders for admin
  app.get('/api/admin-portal/orders', async (req, res) => {
    try {
      const { adminPortalService } = await import('./admin-portal-service');
      const orders = await adminPortalService.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders for admin:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  // Get all quotations for admin
  app.get('/api/admin-portal/quotations', async (req, res) => {
    try {
      const { adminPortalService } = await import('./admin-portal-service');
      const quotations = await adminPortalService.getAllQuotations();
      res.json(quotations);
    } catch (error) {
      console.error('Error fetching quotations for admin:', error);
      res.status(500).json({ message: 'Failed to fetch quotations' });
    }
  });

  // Get admin dashboard stats
  app.get('/api/admin-portal/dashboard', async (req, res) => {
    try {
      const { adminPortalService } = await import('./admin-portal-service');
      const stats = await adminPortalService.getAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  // Update customer status
  app.patch('/api/admin-portal/customers/:customerId/status', async (req, res) => {
    try {
      const { status } = req.body;
      const { adminPortalService } = await import('./admin-portal-service');
      const updatedCustomer = await adminPortalService.updateCustomerStatus(req.params.customerId, status);
      res.json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer status:', error);
      res.status(500).json({ message: 'Failed to update customer status' });
    }
  });

  // Get specific customer details for admin
  app.get('/api/admin-portal/customers/:customerId', async (req, res) => {
    try {
      const { adminPortalService } = await import('./admin-portal-service');
      const customerDetails = await adminPortalService.getCustomerDetails(req.params.customerId);
      
      if (!customerDetails) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json(customerDetails);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      res.status(500).json({ message: 'Failed to fetch customer details' });
    }
  });

  // Update order status
  app.patch('/api/admin-portal/orders/:orderId/status', async (req, res) => {
    try {
      const { status } = req.body;
      const { adminPortalService } = await import('./admin-portal-service');
      const updatedOrder = await adminPortalService.updateOrderStatus(req.params.orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  });

  // Update quotation status
  app.patch('/api/admin-portal/quotations/:quotationId/status', async (req, res) => {
    try {
      const { status } = req.body;
      const { adminPortalService } = await import('./admin-portal-service');
      const updatedQuotation = await adminPortalService.updateQuotationStatus(req.params.quotationId, status);
      res.json(updatedQuotation);
    } catch (error) {
      console.error('Error updating quotation status:', error);
      res.status(500).json({ message: 'Failed to update quotation status' });
    }
  });

  // Search functionality
  app.get('/api/admin-portal/search/customers', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query required' });
      }
      
      const { adminPortalService } = await import('./admin-portal-service');
      const results = await adminPortalService.searchCustomers(q as string);
      res.json(results);
    } catch (error) {
      console.error('Error searching customers:', error);
      res.status(500).json({ message: 'Failed to search customers' });
    }
  });

  app.get('/api/admin-portal/search/orders', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query required' });
      }
      
      const { adminPortalService } = await import('./admin-portal-service');
      const results = await adminPortalService.searchOrders(q as string);
      res.json(results);
    } catch (error) {
      console.error('Error searching orders:', error);
      res.status(500).json({ message: 'Failed to search orders' });
    }
  });

  // Get system activity log
  app.get('/api/admin-portal/activity-log', async (req, res) => {
    try {
      const { adminPortalService } = await import('./admin-portal-service');
      const activityLog = await adminPortalService.getSystemActivityLog();
      res.json(activityLog);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      res.status(500).json({ message: 'Failed to fetch activity log' });
    }
  });

  // ============ LOYALTY SYSTEM ROUTES ============

  // Loyalty Points routes
  app.get("/api/loyalty/points/:customerId", async (req, res) => {
    try {
      const points = await storage.getCustomerLoyaltyPoints(req.params.customerId);
      res.json({ points });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty points" });
    }
  });

  app.get("/api/loyalty/history/:customerId", async (req, res) => {
    try {
      const history = await storage.getLoyaltyPointsHistory(req.params.customerId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty points history" });
    }
  });

  app.post("/api/loyalty/points/add", async (req, res) => {
    try {
      const { customerId, points, pointsType, description, referenceId, referenceType } = req.body;
      const history = await storage.addLoyaltyPoints(customerId, points, pointsType, description, referenceId, referenceType);
      res.status(201).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to add loyalty points" });
    }
  });

  // Styling Challenges routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const { active } = req.query;
      const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
      const challenges = await storage.getStylingChallenges(isActive);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getStylingChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      const challengeData = insertStylingChallengeSchema.parse(req.body);
      const challenge = await storage.createStylingChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });

  app.put("/api/challenges/:id", async (req, res) => {
    try {
      const challengeData = insertStylingChallengeSchema.partial().parse(req.body);
      const challenge = await storage.updateStylingChallenge(req.params.id, challengeData);
      res.json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });

  app.post("/api/challenges/:challengeId/join", async (req, res) => {
    try {
      const { customerId } = req.body;
      const participation = await storage.joinChallenge(customerId, req.params.challengeId);
      res.status(201).json(participation);
    } catch (error) {
      if (error instanceof Error && error.message === 'Already joined this challenge') {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to join challenge" });
    }
  });

  app.post("/api/challenges/submit/:participationId", async (req, res) => {
    try {
      const { submissionText, submissionImages } = req.body;
      const participation = await storage.submitChallenge(req.params.participationId, submissionText, submissionImages || []);
      res.json(participation);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit challenge" });
    }
  });

  app.get("/api/challenges/customer/:customerId", async (req, res) => {
    try {
      const challenges = await storage.getCustomerChallenges(req.params.customerId);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer challenges" });
    }
  });

  app.get("/api/challenges/:challengeId/participations", async (req, res) => {
    try {
      const participations = await storage.getChallengeParticipations(req.params.challengeId);
      res.json(participations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge participations" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const { active } = req.query;
      const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
      const achievements = await storage.getAchievements(isActive);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(achievementData);
      res.status(201).json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid achievement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  app.get("/api/achievements/customer/:customerId", async (req, res) => {
    try {
      const achievements = await storage.getCustomerAchievements(req.params.customerId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer achievements" });
    }
  });

  app.post("/api/achievements/check/:customerId", async (req, res) => {
    try {
      const newAchievements = await storage.checkAndUnlockAchievements(req.params.customerId);
      res.json(newAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  app.post("/api/achievements/mark-viewed", async (req, res) => {
    try {
      const { customerId, achievementId } = req.body;
      await storage.markAchievementAsViewed(customerId, achievementId);
      res.json({ message: "Achievement marked as viewed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark achievement as viewed" });
    }
  });

  // Loyalty Rewards routes
  app.get("/api/loyalty/rewards", async (req, res) => {
    try {
      const { active, tier } = req.query;
      const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
      const rewards = await storage.getLoyaltyRewards(isActive, tier as string);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty rewards" });
    }
  });

  app.post("/api/loyalty/rewards", async (req, res) => {
    try {
      const rewardData = insertLoyaltyRewardSchema.parse(req.body);
      const reward = await storage.createLoyaltyReward(rewardData);
      res.status(201).json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reward data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loyalty reward" });
    }
  });

  app.post("/api/loyalty/rewards/:rewardId/redeem", async (req, res) => {
    try {
      const { customerId } = req.body;
      const redemption = await storage.redeemLoyaltyReward(customerId, req.params.rewardId);
      res.status(201).json(redemption);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Insufficient points') {
          return res.status(400).json({ message: error.message });
        }
        if (error.message === 'Reward usage limit reached') {
          return res.status(410).json({ message: error.message });
        }
      }
      res.status(500).json({ message: "Failed to redeem reward" });
    }
  });

  app.get("/api/loyalty/redemptions/:customerId", async (req, res) => {
    try {
      const redemptions = await storage.getCustomerRedemptions(req.params.customerId);
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer redemptions" });
    }
  });

  // Loyalty System Seeding endpoint (for development)
  app.post("/api/admin/seed-loyalty", async (req, res) => {
    try {
      const { seedLoyaltySystem } = await import("./seed-loyalty");
      await seedLoyaltySystem();
      res.json({ message: "Loyalty system seeded successfully" });
    } catch (error) {
      console.error("Loyalty seeding error:", error);
      res.status(500).json({ 
        message: "Failed to seed loyalty system",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Inventory Insights API routes
  app.get("/api/ai/inventory-predictions", async (req, res) => {
    try {
      const { product, timeframe } = req.query;
      
      // Get products with sales/production history
      const products = await storage.getProducts();
      const jobOrders = await storage.getJobOrders({});
      
      // Mock implementation for demo - in production, this would use real data
      const predictions = products.slice(0, 5).map((prod: any) => ({
        productName: prod.name,
        currentStock: Math.floor(Math.random() * 1000) + 100,
        predictedDemand: {
          next30Days: Math.floor(Math.random() * 200) + 50,
          next60Days: Math.floor(Math.random() * 400) + 100,
          next90Days: Math.floor(Math.random() * 600) + 150,
        },
        recommendations: {
          action: ['reorder', 'maintain', 'increase_production'][Math.floor(Math.random() * 3)],
          urgency: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          suggestedOrderQuantity: Math.floor(Math.random() * 500) + 100,
          reasoning: `Based on ${timeframe}-day analysis of sales patterns, seasonal trends, and current inventory levels, this product shows ${['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)]} demand.`,
          estimatedStockoutDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        insights: {
          trendAnalysis: "Strong upward trend in premium Filipino hair demand, particularly in international markets.",
          seasonalFactors: "Peak demand expected during wedding season (March-June) and holiday periods.",
          riskAssessment: "Low supply chain risk with established supplier relationships in the Philippines.",
          costOptimization: "Consider bulk ordering during off-peak seasons to reduce per-unit costs.",
        },
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      }));

      res.json({ predictions, timeframe, productFilter: product });
    } catch (error) {
      console.error("Error generating inventory predictions:", error);
      res.status(500).json({ message: "Failed to generate inventory predictions" });
    }
  });

  app.get("/api/ai/market-demand-analysis", async (req, res) => {
    try {
      const { timeframe } = req.query;
      
      const analysis = {
        overallTrend: 'increasing',
        growthRate: 15.7,
        seasonalPatterns: [
          {
            period: "Q1 (Jan-Mar)",
            demandIncrease: 25,
            description: "Pre-wedding season preparation, increased demand for premium hair extensions"
          },
          {
            period: "Q2 (Apr-Jun)", 
            demandIncrease: 40,
            description: "Peak wedding season, highest demand for bridal hair solutions"
          },
          {
            period: "Q3 (Jul-Sep)",
            demandIncrease: -10,
            description: "Post-wedding season, lower demand but steady commercial orders"
          },
          {
            period: "Q4 (Oct-Dec)",
            demandIncrease: 30,
            description: "Holiday season, increased demand for special events and parties"
          }
        ],
        keyFactors: [
          "Growing international awareness of Filipino hair quality",
          "Increased demand from US and European markets",
          "Social media influence on premium hair product adoption",
          "Economic recovery driving luxury beauty product purchases",
          "Expansion of online sales channels"
        ],
        recommendations: [
          "Increase production capacity for Q2 and Q4 peak seasons",
          "Develop marketing campaigns targeting international markets",
          "Invest in quality certifications to support premium positioning",
          "Consider expanding product line for different hair textures"
        ]
      };

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing market demand:", error);
      res.status(500).json({ message: "Failed to analyze market demand" });
    }
  });

  app.post("/api/ai/generate-restock-plan", async (req, res) => {
    try {
      const { budget } = req.body;
      
      const products = await storage.getProducts();
      
      const restockPlan = products.slice(0, 6).map((product: any) => {
        const priority = Math.floor(Math.random() * 10) + 1;
        const quantity = Math.floor(Math.random() * 300) + 50;
        const unitCost = Math.random() * 100 + 20;
        const estimatedCost = quantity * unitCost;
        
        return {
          productName: product.name,
          suggestedQuantity: quantity,
          priority: priority,
          estimatedCost: estimatedCost,
          reasoning: priority >= 8 
            ? "Critical inventory level - immediate restock required to avoid stockouts"
            : priority >= 6
            ? "Moderate priority - restock recommended within 2 weeks"
            : "Low priority - can wait for next bulk order cycle"
        };
      });

      const totalCost = restockPlan.reduce((sum, item) => sum + item.estimatedCost, 0);
      
      const plan = {
        restockPlan: restockPlan.sort((a, b) => b.priority - a.priority),
        totalCost,
        recommendations: [
          "Prioritize high-demand products for immediate restocking",
          "Consider bulk ordering for cost optimization",
          "Monitor seasonal trends for better planning"
        ],
        riskAssessment: totalCost > budget 
          ? "Budget exceeded - consider phased restocking approach"
          : "Budget sufficient for recommended restock plan"
      };

      res.json(plan);
    } catch (error) {
      console.error("Error generating restock plan:", error);
      res.status(500).json({ message: "Failed to generate restock plan" });
    }
  });

  // Summary Reports API routes
  app.get("/api/reports/job-order-summary", async (req, res) => {
    try {
      const { dateFrom, dateTo, customer, item } = req.query;
      
      // Get all job orders with items
      const jobOrdersWithItems = await storage.getJobOrdersWithItems({
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        customer: customer as string,
        item: item as string
      });

      // Process and categorize items
      const ready: any[] = [];
      const toProduce: any[] = [];
      const reserved: any[] = [];
      const shipped: any[] = [];

      jobOrdersWithItems.forEach((jobOrder: any) => {
        jobOrder.items?.forEach((item: any) => {
          const baseItem = {
            jobOrderNumber: jobOrder.jobOrderNumber,
            customerCode: jobOrder.customerCode,
            productName: item.productName,
            specification: item.specification,
            totalQuantity: item.quantity,
            dueDate: jobOrder.dueDate,
            dateCreated: jobOrder.date || jobOrder.createdAt,
          };

          // Add ready items
          if (Number(item.ready) > 0) {
            ready.push({
              ...baseItem,
              quantity: item.ready
            });
          }

          // Add to produce items
          if (Number(item.toProduce) > 0) {
            toProduce.push({
              ...baseItem,
              quantity: item.toProduce
            });
          }

          // Add reserved items
          if (Number(item.reserved) > 0) {
            reserved.push({
              ...baseItem,
              quantity: item.reserved
            });
          }

          // Add shipped items
          if (Number(item.shipped) > 0) {
            shipped.push({
              ...baseItem,
              quantity: item.shipped
            });
          }
        });
      });

      res.json({
        ready,
        toProduce,
        reserved,
        shipped
      });
    } catch (error) {
      console.error("Error fetching job order summary:", error);
      res.status(500).json({ message: "Failed to fetch job order summary" });
    }
  });

  // =====================================================
  // INVOICE MANAGEMENT ENDPOINTS
  // =====================================================
  
  // Generate invoice PDF/HTML
  app.get("/api/invoices/:id/pdf", async (req, res) => {
    try {
      const invoiceService = new InvoiceService();
      const invoice = await invoiceService.getInvoice(req.params.id);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Get sales order and items for the invoice
      const salesOrder = await storage.getSalesOrder(invoice.salesOrderId);
      const salesOrderItems = await storage.getSalesOrderItems(invoice.salesOrderId);
      const customer = await storage.getCustomer(invoice.customerId);

      const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        date: new Date(invoice.createdAt).toLocaleDateString(),
        dueDate: new Date(invoice.dueDate).toLocaleDateString(),
        customerCode: invoice.customerCode,
        customerName: customer?.name || invoice.customerCode,
        country: invoice.country,
        items: salesOrderItems.map(item => ({
          productName: item.productName,
          quantity: parseFloat(item.quantity),
          unitPrice: item.unitPrice,
          totalPrice: item.lineTotal,
          specification: item.specification || ''
        })),
        subtotal: invoice.subtotal,
        shippingFee: invoice.shippingFee,
        bankCharge: invoice.bankCharge,
        discount: invoice.discount,
        others: invoice.others,
        total: invoice.total,
        paymentMethod: invoice.paymentMethod,
        paymentStatus: invoice.paymentStatus,
        paidAmount: invoice.paidAmount
      };

      const htmlContent = generateInvoiceHTML(invoiceData);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="Invoice_${invoice.invoiceNumber}.html"`);
      res.send(htmlContent);
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      res.status(500).json({ message: "Failed to generate invoice PDF" });
    }
  });

  // Get all invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoiceService = new InvoiceService();
      const invoices = await invoiceService.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Update invoice payment status
  app.patch("/api/invoices/:id/payment-status", async (req, res) => {
    try {
      const { paymentStatus, paidAmount } = req.body;
      const invoiceService = new InvoiceService();
      const updated = await invoiceService.updatePaymentStatus(
        req.params.id,
        paymentStatus,
        paidAmount
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // =====================================================
  // PAYMENT VERIFICATION ENDPOINTS
  // =====================================================
  
  // Get all payment proofs for admin verification
  app.get("/api/admin/payment-proofs", async (req, res) => {
    try {
      const { status } = req.query;
      const paymentProofs = await storage.getPaymentProofs(status as string);
      res.json(paymentProofs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment proofs" });
    }
  });

  // Verify payment proof
  app.patch("/api/admin/payment-proofs/:id/verify", async (req, res) => {
    try {
      const { status, verificationNotes } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updated = await storage.updatePaymentProofStatus(
        req.params.id,
        status,
        verificationNotes
      );

      // If approved, update the related sales order payment status
      if (status === 'approved' && updated) {
        const paymentProof = await storage.getPaymentProof(req.params.id);
        if (paymentProof?.salesOrderId) {
          // Update invoice payment status
          const invoiceService = new InvoiceService();
          const invoice = await invoiceService.getInvoiceBySalesOrder(paymentProof.salesOrderId);
          if (invoice) {
            await invoiceService.updatePaymentStatus(
              invoice.id,
              'paid',
              paymentProof.amount
            );
          }
        }
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify payment proof" });
    }
  });

  // =====================================================
  // PRODUCTION MANAGEMENT ENDPOINTS
  // =====================================================
  
  // Create production receipt
  app.post("/api/production/receipts", async (req, res) => {
    try {
      const productionService = new ProductionService();
      const receipt = await productionService.createProductionReceipt(req.body);
      res.status(201).json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to create production receipt" });
    }
  });

  // Get production receipts
  app.get("/api/production/receipts", async (req, res) => {
    try {
      const productionService = new ProductionService();
      const receipts = await productionService.getProductionReceipts(req.query);
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production receipts" });
    }
  });

  // Get production metrics
  app.get("/api/production/metrics", async (req, res) => {
    try {
      const productionService = new ProductionService();
      const metrics = await productionService.getProductionMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production metrics" });
    }
  });

  // Update job order item production status
  app.patch("/api/job-orders/:id/items/:itemId/production", async (req, res) => {
    try {
      const { quantity, warehouseId, quality, notes } = req.body;
      
      const productionService = new ProductionService();
      const jobOrderItem = await storage.getJobOrderItem(req.params.itemId);
      
      if (!jobOrderItem) {
        return res.status(404).json({ message: "Job order item not found" });
      }

      // Create production receipt
      const receipt = await productionService.createProductionReceipt({
        jobOrderId: req.params.id,
        productId: jobOrderItem.productId,
        quantity,
        warehouseId,
        quality: quality || 'standard',
        notes,
        producedBy: 'system' // Should get from authenticated user
      });

      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to update production status" });
    }
  });

  // =====================================================
  // INVENTORY TRANSFER ENDPOINTS
  // =====================================================
  
  // Create inventory transfer
  app.post("/api/inventory/transfers", async (req, res) => {
    try {
      const transferService = new InventoryTransferService();
      const transfer = await transferService.createTransfer(req.body);
      res.status(201).json(transfer);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Insufficient stock')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create inventory transfer" });
    }
  });

  // Get inventory levels across warehouses
  app.get("/api/inventory/levels", async (req, res) => {
    try {
      const transferService = new InventoryTransferService();
      const levels = await transferService.getInventoryLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory levels" });
    }
  });

  // Get transfer history
  app.get("/api/inventory/transfers", async (req, res) => {
    try {
      const transferService = new InventoryTransferService();
      const history = await transferService.getTransferHistory(req.query);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transfer history" });
    }
  });

  // Get low stock alerts
  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const { threshold = 10 } = req.query;
      const transferService = new InventoryTransferService();
      const alerts = await transferService.getLowStockAlerts(Number(threshold));
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock alerts" });
    }
  });

  // Adjust inventory
  app.post("/api/inventory/adjustments", async (req, res) => {
    try {
      const transferService = new InventoryTransferService();
      const result = await transferService.adjustInventory(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to adjust inventory" });
    }
  });

  // Get warehouse stock for a product
  app.get("/api/warehouses/:warehouseId/stock/:productId", async (req, res) => {
    try {
      const transferService = new InventoryTransferService();
      const stock = await transferService.getWarehouseStock(
        req.params.warehouseId,
        req.params.productId
      );
      res.json({ stock });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warehouse stock" });
    }
  });
}