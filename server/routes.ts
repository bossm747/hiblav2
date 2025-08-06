import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { aiService } from "./ai-service";
import { aiImageService, type ImageGenerationRequest } from "./ai-image-service";
import {
  insertCustomerSchema,
  insertCategorySchema,
  insertStaffSchema,
  insertProductSchema,
  insertSupplierSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertCartSchema,
  insertWishlistSchema,
  insertReviewSchema,
  insertInventoryTransactionSchema,
  insertShopSettingsSchema,
  insertClientSchema,
  insertServiceSchema,
  insertAppointmentSchema,
  insertStaffScheduleSchema,
  insertStylistSchema,
  insertCustomerPreferencesSchema,
  insertStylistRecommendationSchema,
  insertStylistReviewSchema,
  insertStylingChallengeSchema,
  insertChallengeParticipationSchema,
  insertAchievementSchema,
  insertLoyaltyRewardSchema,
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
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.resolve('uploads')));

  // Health check endpoint for deployment monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
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
      const order = await storage.updateOrderStatus(req.params.id, {
        status,
        paymentStatus,
        trackingNumber
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
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
        await storage.updateOrderStatus(orderId, {
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

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Demo authentication - replace with real authentication
      const demoUsers = [
        { id: "admin-1", username: "admin", password: "admin123", name: "Admin User", role: "admin", email: "admin@hibla.com" },
        { id: "cashier-1", username: "cashier", password: "cashier123", name: "Cashier User", role: "cashier", email: "cashier@hibla.com" },
      ];

      const user = demoUsers.find(u => u.username === username && u.password === password);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, generate JWT token here
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        message: "Login successful", 
        user: userWithoutPassword,
        token: `demo-token-${user.id}` 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    // In a real app, invalidate the token
    res.json({ message: "Logout successful" });
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

  app.post("/api/quotations", async (req, res) => {
    try {
      const { quotation, items } = req.body;
      
      // Validate quotation data
      const quotationData = insertQuotationSchema.parse(quotation);
      
      // Get current staff ID - in a real app, this would come from authentication
      const staffList = await storage.getAllStaff();
      const currentStaff = staffList.find((s: any) => s.role === 'admin') || staffList[0];
      
      if (!currentStaff) {
        return res.status(400).json({ message: "No staff member found to create quotation" });
      }

      // Auto-generate quotation number if not provided
      if (!quotationData.quotationNumber) {
        const latestQuotation = await storage.getLatestQuotation();
        const nextNumber = latestQuotation ? parseInt(latestQuotation.quotationNumber.replace(/\D/g, '')) + 1 : 1;
        quotationData.quotationNumber = `Q${nextNumber.toString().padStart(4, '0')}`;
      }

      quotationData.createdBy = currentStaff.id;
      
      // Create quotation
      const createdQuotation = await storage.createQuotation(quotationData);

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

      res.status(201).json(createdQuotation);
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
        dueDate: req.body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        revisionNumber: "R1",
        subtotal: quotation.subtotal,
        shippingFee: quotation.shippingFee,
        bankCharge: quotation.bankCharge,
        discount: quotation.discount,
        others: quotation.others,
        total: quotation.total,
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

  // Confirm Sales Order
  app.post("/api/sales-orders/:id/confirm", async (req, res) => {
    try {
      const updatedSalesOrder = await storage.updateSalesOrder(req.params.id, {
        isConfirmed: true,
        confirmedAt: new Date(),
        status: "confirmed"
      });

      if (!updatedSalesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }

      // Auto-generate Job Order when Sales Order is confirmed
      const salesOrderItems = await storage.getSalesOrderItems(req.params.id);
      
      const jobOrderData = {
        jobOrderNumber: updatedSalesOrder.salesOrderNumber, // Same number as sales order
        revisionNumber: updatedSalesOrder.revisionNumber,
        salesOrderId: updatedSalesOrder.id,
        customerId: updatedSalesOrder.customerId,
        customerCode: updatedSalesOrder.customerCode,
        dueDate: updatedSalesOrder.dueDate,
        customerInstructions: updatedSalesOrder.customerServiceInstructions,
        createdBy: updatedSalesOrder.createdBy
      };

      const createdJobOrder = await storage.createJobOrder(jobOrderData);

      // Create job order items
      for (const item of salesOrderItems) {
        const jobOrderItemData = {
          jobOrderId: createdJobOrder.id,
          productId: item.productId,
          productName: item.productName,
          specification: item.specification,
          quantity: item.quantity
        };
        await storage.createJobOrderItem(jobOrderItemData);
      }

      res.json({ 
        salesOrder: updatedSalesOrder, 
        jobOrder: createdJobOrder 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to confirm sales order" });
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

  // Account Monitoring Reports
  app.get("/api/reports/payments", async (req, res) => {
    try {
      const { customerId, salesOrderId, status } = req.query;
      const payments = await storage.getPaymentReports({
        customerId: customerId as string,
        salesOrderId: salesOrderId as string,
        status: status as string
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment reports" });
    }
  });

  // Export functionality (placeholder for Excel/PDF generation)
  app.post("/api/export/:type", async (req, res) => {
    try {
      const { type } = req.params; // quotation, sales-order, job-order, report
      const { id, format } = req.body; // format: excel, pdf
      
      // In a real implementation, this would generate Excel/PDF files
      // For now, return a success message
      res.json({ 
        message: `Export initiated for ${type} in ${format} format`,
        downloadUrl: `/api/download/${type}-${id}.${format}`
      });
    } catch (error) {
      res.status(500).json({ message: "Export failed" });
    }
  });

  // VLOOKUP Price functionality
  app.get("/api/products/price-lookup", async (req, res) => {
    try {
      const { productId, priceListId } = req.query;
      
      if (!productId || !priceListId) {
        return res.status(400).json({ message: "Product ID and Price List ID are required" });
      }

      const price = await storage.getProductPrice(productId as string, priceListId as string);
      res.json({ price });
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}