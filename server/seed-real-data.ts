import { db } from "./db";
import { 
  customers, 
  products, 
  categories,
  quotations, 
  quotationItems,
  salesOrders, 
  salesOrderItems,
  jobOrders,
  jobOrderItems,
  warehouses,
  inventoryTransactions
} from "@shared/schema";

// Real data from attached JO and Sales Order documents
export async function seedRealData() {
  console.log("🌱 Seeding database with real sample data from Hibla documents...");

  try {
    // Seed customer from documents
    const customer = await db.insert(customers).values({
      customerCode: "ABA", // Hair Tag from documents
      name: "ABA Customer",
      email: "aba@customer.com",
      phone: "+1234567890",
      address: "123 Customer Street",
      city: "Customer City",
      country: "USA", // As mentioned in requirements
      postalCode: "12345"
    }).returning();

    console.log("✓ Customer seeded with Hair Tag: ABA");

    // Seed real products from the documents
    const productData = [
      // Machine Weft Single Drawn products
      { name: '8" Machine Weft Single Drawn, STRAIGHT', price: 120.00, category: 'Machine Weft', subcategory: 'Single Drawn' },
      { name: '10" Machine Weft Single Drawn, STRAIGHT', price: 130.00, category: 'Machine Weft', subcategory: 'Single Drawn' },
      { name: '16" Machine Weft Single Drawn, STRAIGHT', price: 140.00, category: 'Machine Weft', subcategory: 'Single Drawn' },
      { name: '20" Machine Weft Single Drawn, STRAIGHT', price: 150.00, category: 'Machine Weft', subcategory: 'Single Drawn' },
      { name: '22" Machine Weft Single Drawn, STRAIGHT', price: 80.00, category: 'Machine Weft', subcategory: 'Single Drawn' },
      
      // Machine Weft Double Drawn products
      { name: '10" Machine Weft, Double Drawn, Straight', price: 90.00, category: 'Machine Weft', subcategory: 'Double Drawn' },
      { name: '18" Machine Weft, Double Drawn, Straight', price: 70.00, category: 'Machine Weft', subcategory: 'Double Drawn' },
      
      // Korean HD Lace Closures
      { name: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)', price: 45.00, category: 'Closure', subcategory: 'Korean HD Lace' },
      { name: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', price: 100.00, category: 'Closure', subcategory: 'Korean HD Lace' },
      { name: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', price: 100.00, category: 'Closure', subcategory: 'Korean HD Lace' },
      { name: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', price: 120.00, category: 'Closure', subcategory: 'Korean HD Lace' },
      
      // Korean HD Lace Frontal
      { name: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)', price: 130.00, category: 'Frontal', subcategory: 'Korean HD Lace' }
    ];

    // First create a category for Filipino hair products
    const category = await db.insert(categories).values({
      name: "Filipino Hair Products",
      description: "Premium real Filipino hair products"
    }).returning();

    const products_inserted = await db.insert(products).values(
      productData.map(product => ({
        name: product.name,
        description: `Premium real Filipino hair - ${product.name}`,
        basePrice: product.price.toString(),
        categoryId: category[0].id,
        hairType: "Straight",
        inStock: true,
        stockQuantity: 100
      }))
    ).returning();

    console.log("✓ 12 real products seeded from documents");

    // Create quotation matching the sales order format
    const quotation = await db.insert(quotations).values({
      quotationNumber: "2025.08.001",
      revisionNumber: "R1",
      customerId: customer[0].id,
      customerCode: "ABA",
      country: "USA",
      subtotal: "947.00",
      shippingFee: "35.00",
      bankCharge: "50.00",
      discount: "-15.00",
      others: "0.00",
      total: "1017.00", // 947 + 35 + 50 - 15
      paymentMethod: "bank",
      shippingMethod: "DHL",
      customerServiceInstructions: "Silky Bundles\nBrushed Back Closure/Frontal",
      status: "approved",
      createdBy: "AAMA"
    }).returning();

    // Seed quotation items with exact data from documents
    const quotationItemsData = [
      { productId: products_inserted[0].id, productName: '8" Machine Weft Single Drawn, STRAIGHT', quantity: "1", unitPrice: "120.00", lineTotal: "120.00" },
      { productId: products_inserted[1].id, productName: '10" Machine Weft Single Drawn, STRAIGHT', quantity: "0.6", unitPrice: "130.00", lineTotal: "78.00" },
      { productId: products_inserted[2].id, productName: '16" Machine Weft Single Drawn, STRAIGHT', quantity: "1", unitPrice: "140.00", lineTotal: "140.00" },
      { productId: products_inserted[3].id, productName: '20" Machine Weft Single Drawn, STRAIGHT', quantity: "0.5", unitPrice: "150.00", lineTotal: "75.00" },
      { productId: products_inserted[4].id, productName: '22" Machine Weft Single Drawn, STRAIGHT', quantity: "0.2", unitPrice: "80.00", lineTotal: "16.00" },
      { productId: products_inserted[5].id, productName: '10" Machine Weft, Double Drawn, Straight', quantity: "0.1", unitPrice: "90.00", lineTotal: "9.00" },
      { productId: products_inserted[6].id, productName: '18" Machine Weft, Double Drawn, Straight', quantity: "0.2", unitPrice: "70.00", lineTotal: "14.00" },
      { productId: products_inserted[7].id, productName: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)', quantity: "1", unitPrice: "45.00", lineTotal: "45.00" },
      { productId: products_inserted[8].id, productName: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: "1", unitPrice: "100.00", lineTotal: "100.00" },
      { productId: products_inserted[9].id, productName: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: "1", unitPrice: "100.00", lineTotal: "100.00" },
      { productId: products_inserted[10].id, productName: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: "1", unitPrice: "120.00", lineTotal: "120.00" },
      { productId: products_inserted[11].id, productName: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)', quantity: "1", unitPrice: "130.00", lineTotal: "130.00" }
    ];

    await db.insert(quotationItems).values(
      quotationItemsData.map(item => ({
        quotationId: quotation[0].id,
        ...item
      }))
    );

    console.log("✓ 12 quotation items seeded with exact document data");

    // Create sales order from quotation (as per requirements)
    const salesOrder = await db.insert(salesOrders).values({
      salesOrderNumber: "2025.08.001",
      revisionNumber: "R1",
      quotationId: quotation[0].id,
      customerId: customer[0].id,
      customerCode: "ABA",
      country: "USA",
      dueDate: new Date("2025-08-30"), // Due date from document
      subtotal: "947.00",
      shippingFee: "35.00",
      bankCharge: "50.00",
      discount: "-15.00",
      others: "0.00",
      total: "1017.00",
      paymentMethod: "bank",
      shippingMethod: "DHL",
      customerServiceInstructions: "Silky Bundles\nBrushed Back Closure/Frontal",
      status: "confirmed",
      isConfirmed: true,
      confirmedAt: new Date(),
      createdBy: "AAMA"
    }).returning();

    // Seed sales order items
    await db.insert(salesOrderItems).values(
      quotationItemsData.map(item => ({
        salesOrderId: salesOrder[0].id,
        ...item
      }))
    );

    console.log("✓ Sales order created from quotation with confirmation");

    // Create job order from sales order (as per requirements)
    const jobOrder = await db.insert(jobOrders).values({
      id: "jo_2025_08_001",
      jobOrderNumber: "2025.08.001",
      revisionNumber: "R1",
      salesOrderId: salesOrder[0].id,
      customerId: customer[0].id,
      customerCode: "ABA",
      date: new Date("2025-08-01"), // Date from document
      dueDate: new Date("2025-08-30"), // Due date from document
      createdBy: "AAMA",
      orderInstructions: "Silky Bundles\nBrushed Back Closure/Frontal"
    }).returning();

    // Seed job order items with shipment data from document
    const jobOrderItemsData = [
      { productId: products_inserted[0].id, productName: '8" Machine Weft Single Drawn, STRAIGHT', quantity: "1", shipment1: "0.1", shipped: "0.1", reserved: "0.2", ready: "0.1", toProduce: "0.8", orderBalance: "0.9" },
      { productId: products_inserted[1].id, productName: '10" Machine Weft Single Drawn, STRAIGHT', quantity: "0.6", shipment2: "0.1", shipped: "0.1", reserved: "0.2", ready: "0.1", toProduce: "0.4", orderBalance: "0.5" },
      { productId: products_inserted[2].id, productName: '16" Machine Weft Single Drawn, STRAIGHT', quantity: "1", shipment1: "0.2", shipment3: "0.1", shipped: "0.3", reserved: "0.3", ready: "0", toProduce: "0.7", orderBalance: "0.7" },
      { productId: products_inserted[3].id, productName: '20" Machine Weft Single Drawn, STRAIGHT', quantity: "0.5", shipped: "0", reserved: "0.4", ready: "0.4", toProduce: "0.1", orderBalance: "0.5" },
      { productId: products_inserted[4].id, productName: '22" Machine Weft Single Drawn, STRAIGHT', quantity: "0.2", shipped: "0", reserved: "0", ready: "0", toProduce: "0.2", orderBalance: "0.2" },
      { productId: products_inserted[5].id, productName: '10" Machine Weft, Double Drawn, Straight', quantity: "0.1", shipped: "0", reserved: "0", ready: "0", toProduce: "0.1", orderBalance: "0.1" },
      { productId: products_inserted[6].id, productName: '18" Machine Weft, Double Drawn, Straight', quantity: "0.2", shipped: "0", reserved: "0", ready: "0", toProduce: "0.2", orderBalance: "0.2" },
      { productId: products_inserted[7].id, productName: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)', quantity: "1", shipped: "0", reserved: "0", ready: "0", toProduce: "1", orderBalance: "1" },
      { productId: products_inserted[8].id, productName: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: "1", shipped: "0", reserved: "0", ready: "0", toProduce: "1", orderBalance: "1" },
      { productId: products_inserted[9].id, productName: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: "1", shipped: "0", reserved: "0", ready: "0", toProduce: "1", orderBalance: "1" },
      { productId: products_inserted[10].id, productName: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: "1", shipped: "0", reserved: "0", ready: "0", toProduce: "1", orderBalance: "1" },
      { productId: products_inserted[11].id, productName: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)', quantity: "1", shipped: "0", reserved: "0", ready: "0", toProduce: "1", orderBalance: "1" }
    ];

    await db.insert(jobOrderItems).values(
      jobOrderItemsData.map(item => ({
        jobOrderId: jobOrder[0].id,
        ...item
      }))
    );

    console.log("✓ Job order created with detailed shipment tracking data");

    // Seed warehouse inventory based on the 6 warehouses from requirements
    const warehouseNames = ["NG", "PH", "Reserved", "Red", "Admin", "WIP"];
    
    for (const warehouseName of warehouseNames) {
      const warehouse = await db.select().from(warehouses).where(sql`name = ${warehouseName}`);
      if (warehouse.length > 0) {
        // Add inventory transactions for each product in each warehouse
        for (const product of products_inserted) {
          await db.insert(inventoryTransactions).values({
            productId: product.id,
            productName: product.name,
            transactionType: "adjustment",
            quantity: warehouseName === "Reserved" ? "50.0" : "25.0", // More stock in reserved
            unitCost: product.basePrice,
            totalValue: (parseFloat(product.basePrice) * (warehouseName === "Reserved" ? 50 : 25)).toString(),
            referenceNumber: `INIT-${warehouseName}-${product.id.slice(-8)}`,
            notes: `Initial inventory setup for ${warehouseName} warehouse`
          });
        }
      }
    }

    console.log("✓ Inventory seeded across all 6 warehouses with real product data");

    console.log("🎉 Real sample data seeding completed successfully!");
    console.log("📋 Summary:");
    console.log("   - 1 customer (ABA Hair Tag)");
    console.log("   - 12 real Filipino hair products");
    console.log("   - 1 complete quotation with 12 items");
    console.log("   - 1 confirmed sales order generated from quotation");
    console.log("   - 1 job order with detailed shipment tracking");
    console.log("   - Inventory distributed across 6 warehouses");

  } catch (error) {
    console.error("❌ Error seeding real data:", error);
    throw error;
  }
}

// Import sql function
import { sql } from "drizzle-orm";