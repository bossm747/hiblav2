import { db } from "./db";
import {
  customers,
  products,
  quotations,
  quotationItems,
  salesOrders,
  salesOrderItems,
  jobOrders,
  jobOrderItems,
  warehouses,
  categories,
  priceLists,
  inventoryTransactions
} from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("🌱 Starting comprehensive database seeding...");
  
  try {
    // 1. Seed Categories
    console.log("Seeding categories...");
    const categoriesData = [
      { id: "cat-1", name: "Bundles", displayOrder: 1 },
      { id: "cat-2", name: "Closures", displayOrder: 2 },
      { id: "cat-3", name: "Frontals", displayOrder: 3 },
      { id: "cat-4", name: "Wigs", displayOrder: 4 }
    ];
    
    for (const cat of categoriesData) {
      const existing = await db.select().from(categories).where(eq(categories.id, cat.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(categories).values(cat);
      }
    }

    // 2. Seed Price Lists
    console.log("Seeding price lists...");
    const priceListsData = [
      { id: "pl-1", name: "Regular Customer", displayOrder: 1, multiplier: 1.0, isActive: true },
      { id: "pl-2", name: "Premier Customer", displayOrder: 2, multiplier: 0.9, isActive: true },
      { id: "pl-3", name: "New Customer", displayOrder: 3, multiplier: 1.1, isActive: true }
    ];
    
    for (const pl of priceListsData) {
      const existing = await db.select().from(priceLists).where(eq(priceLists.id, pl.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(priceLists).values(pl);
      }
    }

    // 3. Seed Warehouses
    console.log("Seeding warehouses...");
    const warehousesData = [
      { id: "wh-1", name: "PH Warehouse", code: "PH", location: "Philippines", type: "main" as const, isActive: true },
      { id: "wh-2", name: "NG Warehouse", code: "NG", location: "Nigeria", type: "main" as const, isActive: true },
      { id: "wh-3", name: "Reserved Stock", code: "Reserved", location: "Global", type: "reserved" as const, isActive: true },
      { id: "wh-4", name: "Ready Stock", code: "Ready", location: "Global", type: "ready" as const, isActive: true },
      { id: "wh-5", name: "WIP Stock", code: "WIP", location: "Production", type: "wip" as const, isActive: true },
      { id: "wh-6", name: "Admin Stock", code: "Admin", location: "Office", type: "admin" as const, isActive: true }
    ];
    
    for (const wh of warehousesData) {
      const existing = await db.select().from(warehouses).where(eq(warehouses.id, wh.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(warehouses).values(wh);
      }
    }

    // 4. Seed Customers
    console.log("Seeding customers...");
    const customersData = [
      {
        id: "cust-1",
        code: "C001",
        name: "Beauty Supplies Nigeria",
        email: "contact@beautynigeria.com",
        phone: "+234123456789",
        address: "Lagos, Nigeria",
        country: "Nigeria",
        priceListId: "pl-1",
        isActive: true
      },
      {
        id: "cust-2",
        code: "C002",
        name: "Hair World USA",
        email: "orders@hairworldusa.com",
        phone: "+1234567890",
        address: "New York, USA",
        country: "USA",
        priceListId: "pl-2",
        isActive: true
      },
      {
        id: "cust-3",
        code: "C003",
        name: "Manila Beauty Center",
        email: "info@manilabeauty.ph",
        phone: "+639123456789",
        address: "Manila, Philippines",
        country: "Philippines",
        priceListId: "pl-1",
        isActive: true
      },
      {
        id: "cust-4",
        code: "C004",
        name: "London Hair Extensions",
        email: "sales@londonhair.uk",
        phone: "+441234567890",
        address: "London, UK",
        country: "United Kingdom",
        priceListId: "pl-2",
        isActive: true
      },
      {
        id: "cust-5",
        code: "C005",
        name: "Dubai Beauty Palace",
        email: "orders@dubaibeauty.ae",
        phone: "+971501234567",
        address: "Dubai, UAE",
        country: "UAE",
        priceListId: "pl-3",
        isActive: true
      }
    ];
    
    for (const cust of customersData) {
      const existing = await db.select().from(customers).where(eq(customers.id, cust.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(customers).values(cust);
      }
    }

    // 5. Seed Products
    console.log("Seeding products...");
    const productsData = [
      {
        id: "prod-1",
        code: "BUNDLE-12",
        name: "12\" Straight Bundle",
        description: "Premium Filipino hair straight texture",
        categoryId: "cat-1",
        unitPrice: "85",
        stockQuantity: 150,
        reorderLevel: 20,
        reorderQuantity: 50,
        isActive: true
      },
      {
        id: "prod-2",
        code: "BUNDLE-16",
        name: "16\" Straight Bundle",
        description: "Premium Filipino hair straight texture",
        categoryId: "cat-1",
        unitPrice: "105",
        stockQuantity: 120,
        reorderLevel: 20,
        reorderQuantity: 40,
        isActive: true
      },
      {
        id: "prod-3",
        code: "BUNDLE-20",
        name: "20\" Straight Bundle",
        description: "Premium Filipino hair straight texture",
        categoryId: "cat-1",
        unitPrice: "125",
        stockQuantity: 85,
        reorderLevel: 15,
        reorderQuantity: 30,
        isActive: true
      },
      {
        id: "prod-4",
        code: "CLOSURE-4X4",
        name: "4x4 Straight Closure",
        description: "Premium Filipino hair closure",
        categoryId: "cat-2",
        unitPrice: "65",
        stockQuantity: 60,
        reorderLevel: 10,
        reorderQuantity: 25,
        isActive: true
      },
      {
        id: "prod-5",
        code: "FRONTAL-13X4",
        name: "13x4 Straight Frontal",
        description: "Premium Filipino hair frontal",
        categoryId: "cat-3",
        unitPrice: "95",
        stockQuantity: 45,
        reorderLevel: 8,
        reorderQuantity: 20,
        isActive: true
      },
      {
        id: "prod-6",
        code: "WIG-BOB",
        name: "Bob Wig 12\"",
        description: "Ready-to-wear Filipino hair bob wig",
        categoryId: "cat-4",
        unitPrice: "180",
        stockQuantity: 25,
        reorderLevel: 5,
        reorderQuantity: 15,
        isActive: true
      },
      {
        id: "prod-7",
        code: "BUNDLE-24",
        name: "24\" Straight Bundle",
        description: "Premium Filipino hair straight texture",
        categoryId: "cat-1",
        unitPrice: "145",
        stockQuantity: 65,
        reorderLevel: 10,
        reorderQuantity: 25,
        isActive: true
      },
      {
        id: "prod-8",
        code: "BUNDLE-CURLY-16",
        name: "16\" Curly Bundle",
        description: "Premium Filipino hair curly texture",
        categoryId: "cat-1",
        unitPrice: "115",
        stockQuantity: 55,
        reorderLevel: 10,
        reorderQuantity: 20,
        isActive: true
      }
    ];
    
    for (const prod of productsData) {
      const existing = await db.select().from(products).where(eq(products.id, prod.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(products).values(prod);
      }
    }

    // 6. Seed Quotations
    console.log("Seeding quotations...");
    const quotationsData = [
      {
        id: "quot-1",
        quotationNumber: "2025.01.001",
        customerCode: "C001",
        customerId: "cust-1",
        country: "Nigeria",
        priceListId: "pl-1",
        subtotal: "650",
        discount: "0",
        total: "650",
        status: "approved" as const,
        createdBy: "admin@hibla.com",
        creatorInitials: "AD",
        paymentTerms: "50% advance, 50% before shipping",
        leadTime: "2-3 weeks",
        validity: "30 days",
        canRevise: true
      },
      {
        id: "quot-2",
        quotationNumber: "2025.01.002",
        customerCode: "C002",
        customerId: "cust-2",
        country: "USA",
        priceListId: "pl-2",
        subtotal: "1250",
        discount: "50",
        total: "1200",
        status: "draft" as const,
        createdBy: "admin@hibla.com",
        creatorInitials: "AD",
        paymentTerms: "Net 30",
        leadTime: "3-4 weeks",
        validity: "30 days",
        canRevise: true
      },
      {
        id: "quot-3",
        quotationNumber: "2025.01.003",
        customerCode: "C003",
        customerId: "cust-3",
        country: "Philippines",
        priceListId: "pl-1",
        subtotal: "890",
        discount: "0",
        total: "890",
        status: "sent" as const,
        createdBy: "admin@hibla.com",
        creatorInitials: "AD",
        paymentTerms: "100% advance",
        leadTime: "1-2 weeks",
        validity: "15 days",
        canRevise: false
      }
    ];
    
    for (const quot of quotationsData) {
      const existing = await db.select().from(quotations).where(eq(quotations.id, quot.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(quotations).values(quot);
      }
    }

    // 7. Seed Quotation Items
    console.log("Seeding quotation items...");
    const quotationItemsData = [
      { id: "qi-1", quotationId: "quot-1", productId: "prod-1", productCode: "BUNDLE-12", description: "12\" Straight Bundle", quantity: 3, unitPrice: "85", subtotal: "255" },
      { id: "qi-2", quotationId: "quot-1", productId: "prod-2", productCode: "BUNDLE-16", description: "16\" Straight Bundle", quantity: 2, unitPrice: "105", subtotal: "210" },
      { id: "qi-3", quotationId: "quot-1", productId: "prod-4", productCode: "CLOSURE-4X4", description: "4x4 Straight Closure", quantity: 1, unitPrice: "65", subtotal: "65" },
      { id: "qi-4", quotationId: "quot-1", productId: "prod-5", productCode: "FRONTAL-13X4", description: "13x4 Straight Frontal", quantity: 1, unitPrice: "120", subtotal: "120" },
      
      { id: "qi-5", quotationId: "quot-2", productId: "prod-3", productCode: "BUNDLE-20", description: "20\" Straight Bundle", quantity: 5, unitPrice: "125", subtotal: "625" },
      { id: "qi-6", quotationId: "quot-2", productId: "prod-7", productCode: "BUNDLE-24", description: "24\" Straight Bundle", quantity: 3, unitPrice: "145", subtotal: "435" },
      { id: "qi-7", quotationId: "quot-2", productId: "prod-5", productCode: "FRONTAL-13X4", description: "13x4 Straight Frontal", quantity: 2, unitPrice: "95", subtotal: "190" },
      
      { id: "qi-8", quotationId: "quot-3", productId: "prod-6", productCode: "WIG-BOB", description: "Bob Wig 12\"", quantity: 2, unitPrice: "180", subtotal: "360" },
      { id: "qi-9", quotationId: "quot-3", productId: "prod-8", productCode: "BUNDLE-CURLY-16", description: "16\" Curly Bundle", quantity: 4, unitPrice: "115", subtotal: "460" },
      { id: "qi-10", quotationId: "quot-3", productId: "prod-4", productCode: "CLOSURE-4X4", description: "4x4 Straight Closure", quantity: 1, unitPrice: "70", subtotal: "70" }
    ];
    
    for (const item of quotationItemsData) {
      const existing = await db.select().from(quotationItems).where(eq(quotationItems.id, item.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(quotationItems).values(item);
      }
    }

    // 8. Seed Sales Orders
    console.log("Seeding sales orders...");
    const salesOrdersData = [
      {
        id: "so-1",
        salesOrderNumber: "SO-2025.01.001",
        quotationId: "quot-1",
        customerCode: "C001",
        customerId: "cust-1",
        subtotal: "650",
        discount: "0",
        total: "650",
        status: "confirmed" as const,
        paymentStatus: "partial" as const,
        paymentMethod: "bank_transfer" as const,
        createdBy: "admin@hibla.com"
      },
      {
        id: "so-2",
        salesOrderNumber: "SO-2024.12.045",
        quotationId: null,
        customerCode: "C004",
        customerId: "cust-4",
        subtotal: "480",
        discount: "0",
        total: "480",
        status: "processing" as const,
        paymentStatus: "paid" as const,
        paymentMethod: "credit_card" as const,
        createdBy: "admin@hibla.com"
      },
      {
        id: "so-3",
        salesOrderNumber: "SO-2024.12.044",
        quotationId: null,
        customerCode: "C005",
        customerId: "cust-5",
        subtotal: "750",
        discount: "25",
        total: "725",
        status: "shipped" as const,
        paymentStatus: "paid" as const,
        paymentMethod: "bank_transfer" as const,
        createdBy: "admin@hibla.com"
      }
    ];
    
    for (const so of salesOrdersData) {
      const existing = await db.select().from(salesOrders).where(eq(salesOrders.id, so.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(salesOrders).values(so);
      }
    }

    // 9. Seed Sales Order Items
    console.log("Seeding sales order items...");
    const salesOrderItemsData = [
      { id: "soi-1", salesOrderId: "so-1", productId: "prod-1", productCode: "BUNDLE-12", description: "12\" Straight Bundle", quantity: 3, unitPrice: "85", subtotal: "255" },
      { id: "soi-2", salesOrderId: "so-1", productId: "prod-2", productCode: "BUNDLE-16", description: "16\" Straight Bundle", quantity: 2, unitPrice: "105", subtotal: "210" },
      { id: "soi-3", salesOrderId: "so-1", productId: "prod-4", productCode: "CLOSURE-4X4", description: "4x4 Straight Closure", quantity: 1, unitPrice: "65", subtotal: "65" },
      { id: "soi-4", salesOrderId: "so-1", productId: "prod-5", productCode: "FRONTAL-13X4", description: "13x4 Straight Frontal", quantity: 1, unitPrice: "120", subtotal: "120" },
      
      { id: "soi-5", salesOrderId: "so-2", productId: "prod-1", productCode: "BUNDLE-12", description: "12\" Straight Bundle", quantity: 2, unitPrice: "85", subtotal: "170" },
      { id: "soi-6", salesOrderId: "so-2", productId: "prod-2", productCode: "BUNDLE-16", description: "16\" Straight Bundle", quantity: 2, unitPrice: "105", subtotal: "210" },
      { id: "soi-7", salesOrderId: "so-2", productId: "prod-4", productCode: "CLOSURE-4X4", description: "4x4 Straight Closure", quantity: 1, unitPrice: "100", subtotal: "100" },
      
      { id: "soi-8", salesOrderId: "so-3", productId: "prod-3", productCode: "BUNDLE-20", description: "20\" Straight Bundle", quantity: 3, unitPrice: "125", subtotal: "375" },
      { id: "soi-9", salesOrderId: "so-3", productId: "prod-7", productCode: "BUNDLE-24", description: "24\" Straight Bundle", quantity: 2, unitPrice: "145", subtotal: "290" },
      { id: "soi-10", salesOrderId: "so-3", productId: "prod-4", productCode: "CLOSURE-4X4", description: "4x4 Straight Closure", quantity: 1, unitPrice: "85", subtotal: "85" }
    ];
    
    for (const item of salesOrderItemsData) {
      const existing = await db.select().from(salesOrderItems).where(eq(salesOrderItems.id, item.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(salesOrderItems).values(item);
      }
    }

    // 10. Seed Job Orders
    console.log("Seeding job orders...");
    const jobOrdersData = [
      {
        id: "jo-1",
        jobOrderNumber: "JO-2025.01.001",
        salesOrderId: "so-1",
        customerCode: "C001",
        customerId: "cust-1",
        status: "in-progress" as const,
        priority: "high" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: "admin@hibla.com"
      },
      {
        id: "jo-2",
        jobOrderNumber: "JO-2024.12.045",
        salesOrderId: "so-2",
        customerCode: "C004",
        customerId: "cust-4",
        status: "pending" as const,
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdBy: "admin@hibla.com"
      },
      {
        id: "jo-3",
        jobOrderNumber: "JO-2024.12.044",
        salesOrderId: "so-3",
        customerCode: "C005",
        customerId: "cust-5",
        status: "completed" as const,
        priority: "low" as const,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdBy: "admin@hibla.com"
      },
      {
        id: "jo-4",
        jobOrderNumber: "JO-2024.12.043",
        salesOrderId: null,
        customerCode: "C002",
        customerId: "cust-2",
        status: "on-hold" as const,
        priority: "low" as const,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        createdBy: "admin@hibla.com"
      }
    ];
    
    for (const jo of jobOrdersData) {
      const existing = await db.select().from(jobOrders).where(eq(jobOrders.id, jo.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(jobOrders).values(jo);
      }
    }

    // 11. Seed Job Order Items
    console.log("Seeding job order items...");
    const jobOrderItemsData = [
      { id: "joi-1", jobOrderId: "jo-1", productId: "prod-1", productCode: "BUNDLE-12", description: "12\" Straight Bundle", quantity: 3, unitPrice: "85", status: "in-production" as const },
      { id: "joi-2", jobOrderId: "jo-1", productId: "prod-2", productCode: "BUNDLE-16", description: "16\" Straight Bundle", quantity: 2, unitPrice: "105", status: "pending" as const },
      { id: "joi-3", jobOrderId: "jo-1", productId: "prod-4", productCode: "CLOSURE-4X4", description: "4x4 Straight Closure", quantity: 1, unitPrice: "65", status: "completed" as const },
      
      { id: "joi-4", jobOrderId: "jo-2", productId: "prod-1", productCode: "BUNDLE-12", description: "12\" Straight Bundle", quantity: 2, unitPrice: "85", status: "pending" as const },
      { id: "joi-5", jobOrderId: "jo-2", productId: "prod-2", productCode: "BUNDLE-16", description: "16\" Straight Bundle", quantity: 2, unitPrice: "105", status: "pending" as const },
      
      { id: "joi-6", jobOrderId: "jo-3", productId: "prod-3", productCode: "BUNDLE-20", description: "20\" Straight Bundle", quantity: 3, unitPrice: "125", status: "shipped" as const },
      { id: "joi-7", jobOrderId: "jo-3", productId: "prod-7", productCode: "BUNDLE-24", description: "24\" Straight Bundle", quantity: 2, unitPrice: "145", status: "shipped" as const }
    ];
    
    for (const item of jobOrderItemsData) {
      const existing = await db.select().from(jobOrderItems).where(eq(jobOrderItems.id, item.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(jobOrderItems).values(item);
      }
    }

    // 12. Seed Inventory Transactions
    console.log("Seeding inventory transactions...");
    const inventoryTransactionsData = [
      {
        id: "inv-1",
        productId: "prod-1",
        warehouseId: "wh-1",
        type: "in" as const,
        quantity: 50,
        referenceType: "production" as const,
        referenceId: "prod-receipt-1",
        notes: "Production completed"
      },
      {
        id: "inv-2",
        productId: "prod-1",
        warehouseId: "wh-3",
        type: "out" as const,
        quantity: 3,
        referenceType: "sales_order" as const,
        referenceId: "so-1",
        notes: "Reserved for SO-2025.01.001"
      },
      {
        id: "inv-3",
        productId: "prod-2",
        warehouseId: "wh-1",
        type: "in" as const,
        quantity: 30,
        referenceType: "production" as const,
        referenceId: "prod-receipt-2",
        notes: "Production completed"
      },
      {
        id: "inv-4",
        productId: "prod-3",
        warehouseId: "wh-2",
        type: "in" as const,
        quantity: 25,
        referenceType: "transfer" as const,
        referenceId: "transfer-1",
        notes: "Transfer from PH warehouse"
      },
      {
        id: "inv-5",
        productId: "prod-6",
        warehouseId: "wh-4",
        type: "in" as const,
        quantity: 10,
        referenceType: "production" as const,
        referenceId: "prod-receipt-3",
        notes: "Ready stock"
      }
    ];
    
    for (const trans of inventoryTransactionsData) {
      const existing = await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.id, trans.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(inventoryTransactions).values(trans);
      }
    }

    console.log("✅ Database seeding completed successfully!");
    console.log("📊 Seeded data summary:");
    console.log("   - 5 Customers");
    console.log("   - 8 Products");
    console.log("   - 3 Quotations with items");
    console.log("   - 3 Sales Orders with items");
    console.log("   - 4 Job Orders with items");
    console.log("   - 6 Warehouses");
    console.log("   - 5 Inventory transactions");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}