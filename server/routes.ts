import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { aiService } from "./ai-service";
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
  insertShopSettingsSchema
} from "@shared/schema";
// import { sendAppointmentNotification } from "./notification-service";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
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
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
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
      
      const transaction = await storage.createInventoryTransaction({
        productId,
        quantity,
        type,
        reason,
        staffId: staffId || "system"
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Failed to adjust inventory", error });
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
      
      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      const tax = subtotal * 0.12; // 12% VAT
      const total = subtotal + tax;
      
      // Create the order
      const order = await storage.createOrder({
        customerId: customerId || "walk-in-customer",
        status: "completed",
        paymentStatus: "paid",
        paymentMethod,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        shippingMethod: "pickup",
        shippingFee: "0"
      });
      
      // Create order items
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
      }
      
      res.status(201).json({
        order,
        change: amountPaid - total
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create sale", error });
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

  // Configure multer for file uploads
  const storage_multer = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = 'uploads/products';
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

  // File upload endpoint for product images
  app.post("/api/upload/product-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/products/${req.file.filename}`;
      
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

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = await storage.getAppointmentsByDate(today);
      const allClients = await storage.getClients();
      const allAppointments = await storage.getAppointments();
      
      // Calculate basic stats
      const dailyRevenue = todayAppointments.reduce((sum, apt) => {
        return sum + parseFloat(apt.totalAmount || "0");
      }, 0);

      const stats = {
        todayAppointments: todayAppointments.length,
        dailyRevenue: dailyRevenue.toFixed(2),
        totalClients: allClients.length,
        totalAppointments: allAppointments.length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // POS Transactions endpoints
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      console.error('Get Transactions Error:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transaction = await storage.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      console.error('Create Transaction Error:', error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error('Get Transaction Error:', error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Time Records endpoints
  app.get("/api/time-records", async (req, res) => {
    try {
      const timeRecords = await storage.getTimeRecords();
      res.json(timeRecords);
    } catch (error) {
      console.error('Get Time Records Error:', error);
      res.status(500).json({ message: "Failed to fetch time records" });
    }
  });

  app.get("/api/time-records/active/:staffId", async (req, res) => {
    try {
      const activeRecord = await storage.getActiveTimeRecord(req.params.staffId);
      res.json(activeRecord);
    } catch (error) {
      console.error('Get Active Time Record Error:', error);
      res.status(500).json({ message: "Failed to fetch active time record" });
    }
  });

  app.get("/api/time-records/report", async (req, res) => {
    try {
      const report = await storage.getAttendanceReport();
      res.json(report);
    } catch (error) {
      console.error('Get Attendance Report Error:', error);
      res.status(500).json({ message: "Failed to fetch attendance report" });
    }
  });

  app.post("/api/time-records/clock-in", async (req, res) => {
    try {
      const timeRecord = await storage.clockIn(req.body);
      res.status(201).json(timeRecord);
    } catch (error) {
      console.error('Clock In Error:', error);
      res.status(500).json({ message: "Failed to clock in" });
    }
  });

  app.post("/api/time-records/clock-out/:id", async (req, res) => {
    try {
      const timeRecord = await storage.clockOut(req.params.id, req.body);
      res.json(timeRecord);
    } catch (error) {
      console.error('Clock Out Error:', error);
      res.status(500).json({ message: "Failed to clock out" });
    }
  });

  app.post("/api/time-records/break-start/:id", async (req, res) => {
    try {
      const timeRecord = await storage.startBreak(req.params.id, req.body);
      res.json(timeRecord);
    } catch (error) {
      console.error('Start Break Error:', error);
      res.status(500).json({ message: "Failed to start break" });
    }
  });

  app.post("/api/time-records/break-end/:id", async (req, res) => {
    try {
      const timeRecord = await storage.endBreak(req.params.id, req.body);
      res.json(timeRecord);
    } catch (error) {
      console.error('End Break Error:', error);
      res.status(500).json({ message: "Failed to end break" });
    }
  });

  // Notification Settings routes
  app.get("/api/notification-settings", async (req, res) => {
    try {
      const settings = await storage.getNotificationSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.post("/api/notification-settings", async (req, res) => {
    try {
      const settingsData = insertNotificationSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateNotificationSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save notification settings" });
    }
  });

  // Notification Log routes
  app.get("/api/notification-log", async (req, res) => {
    try {
      const { appointmentId } = req.query;
      const logs = await storage.getNotificationLogs(appointmentId as string);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification logs" });
    }
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
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/marketing/campaigns", async (req, res) => {
    try {
      const campaignData = req.body;
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.post("/api/marketing/campaigns/:id/send", async (req, res) => {
    try {
      const campaign = await storage.sendCampaign(req.params.id);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to send campaign" });
    }
  });

  app.delete("/api/marketing/campaigns/:id", async (req, res) => {
    try {
      await storage.deleteCampaign(req.params.id);
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Email Leads routes
  app.get("/api/marketing/leads", async (req, res) => {
    try {
      const leads = await storage.getEmailLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
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
          await storage.createEmailLead(lead);
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

  // Marketing stats
  app.get("/api/marketing/stats", async (req, res) => {
    try {
      const stats = await storage.getMarketingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketing stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
