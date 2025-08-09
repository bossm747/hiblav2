import { db } from "./db";
import { 
  jobOrders,
  jobOrderItems,
  salesOrders,
  products,
  customers,
  staff
} from "@shared/schema";

// Exact Job Order data from JO PDF matching the Sales Order
export const exactJobOrderData = {
  // Job Order header information
  jobOrder: {
    id: "jo-2025-08-001-r1",
    jobOrderNumber: "JO-2025.08.001",
    revisionNumber: "R1",
    salesOrderId: "so-2025-08-001-r1", // Links to the Sales Order
    salesOrderNumber: "2025.08.001",
    customerId: "customer-aba-001",
    customerCode: "ABA",
    customerName: "ABA Hair International",
    orderDate: "2025-08-01",
    dueDate: "2025-08-30",
    status: "in_production",
    priority: "high",
    createdBy: "staff-aama-real",
    assignedTo: "staff-production-team",
    productionNotes: "Premium quality hair extensions for ABA - ensure proper brushing and silky finish",
    customerServiceInstructions: "Silky Bundles\nBrushed Back Closure/Frontal",
    estimatedCompletionDate: "2025-08-25",
    actualStartDate: "2025-08-02",
    isActive: true
  },

  // Exact Job Order Items matching the Sales Order products
  jobOrderItems: [
    {
      id: "joi-001",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-mw8-straight-real",
      productName: "8\" Machine Weft Single Drawn, STRAIGHT",
      sku: "MW-8-STR-SD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "120.00",
      totalPrice: "120.00",
      specification: "8-inch length, single drawn, straight texture",
      productionInstructions: "Ensure silky finish and proper weft construction",
      status: "pending",
      estimatedHours: "2.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Priority item for ABA customer"
    },
    {
      id: "joi-002", 
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-mw10-straight-real",
      productName: "10\" Machine Weft Single Drawn, STRAIGHT",
      sku: "MW-10-STR-SD",
      quantity: "0.60",
      unit: "pcs",
      unitPrice: "130.00",
      totalPrice: "78.00",
      specification: "10-inch length, single drawn, straight texture",
      productionInstructions: "Fractional quantity - cut to precise 0.6 portion",
      status: "pending",
      estimatedHours: "1.5",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Partial quantity order"
    },
    {
      id: "joi-003",
      jobOrderId: "jo-2025-08-001-r1", 
      productId: "prod-mw16-straight-real",
      productName: "16\" Machine Weft Single Drawn, STRAIGHT",
      sku: "MW-16-STR-SD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "140.00",
      totalPrice: "140.00",
      specification: "16-inch length, single drawn, straight texture",
      productionInstructions: "Standard weft construction with quality finish",
      status: "pending",
      estimatedHours: "2.5",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Mid-length popular item"
    },
    {
      id: "joi-004",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-mw20-straight-real", 
      productName: "20\" Machine Weft Single Drawn, STRAIGHT",
      sku: "MW-20-STR-SD",
      quantity: "0.50",
      unit: "pcs",
      unitPrice: "150.00",
      totalPrice: "75.00",
      specification: "20-inch length, single drawn, straight texture",
      productionInstructions: "Half quantity - ensure precise cutting and finishing",
      status: "pending",
      estimatedHours: "2.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Long length premium hair"
    },
    {
      id: "joi-005",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-mw22-straight-real",
      productName: "22\" Machine Weft Single Drawn, STRAIGHT",
      sku: "MW-22-STR-SD", 
      quantity: "0.20",
      unit: "pcs",
      unitPrice: "80.00",
      totalPrice: "16.00",
      specification: "22-inch length, single drawn, straight texture",
      productionInstructions: "Small quantity - premium extra long hair",
      status: "pending",
      estimatedHours: "1.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Extra length specialty item"
    },
    {
      id: "joi-006",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-mw10-double-real",
      productName: "10\" Machine Weft, Double Drawn, Straight",
      sku: "MW-10-DD-STR",
      quantity: "0.10",
      unit: "pcs", 
      unitPrice: "90.00",
      totalPrice: "9.00",
      specification: "10-inch length, double drawn, straight texture",
      productionInstructions: "Premium double drawn construction - extra fullness",
      status: "pending",
      estimatedHours: "1.5",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Double drawn premium quality"
    },
    {
      id: "joi-007",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-mw18-double-real",
      productName: "18\" Machine Weft, Double Drawn, Straight", 
      sku: "MW-18-DD-STR",
      quantity: "0.20",
      unit: "pcs",
      unitPrice: "70.00",
      totalPrice: "14.00",
      specification: "18-inch length, double drawn, straight texture",
      productionInstructions: "Double drawn premium with silky finish",
      status: "pending",
      estimatedHours: "2.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Mid-length double drawn"
    },
    {
      id: "joi-008",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-closure-12-2x6-real",
      productName: "12\" Korean HD Lace Closure 2X6\", STRAIGHT (Improved Hairline)",
      sku: "LC-12-2X6-STR-HD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "45.00",
      totalPrice: "45.00",
      specification: "2x6 inch Korean HD lace with improved hairline technology",
      productionInstructions: "Careful lace work with natural hairline finish",
      status: "pending",
      estimatedHours: "3.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Korean HD lace specialty"
    },
    {
      id: "joi-009", 
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-closure-12-4x4-real",
      productName: "12\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      sku: "LC-12-4X4-STR-HD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "100.00",
      totalPrice: "100.00",
      specification: "4x4 inch Korean HD lace with improved hairline technology",
      productionInstructions: "Premium lace construction with natural part",
      status: "pending", 
      estimatedHours: "4.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Standard 4x4 closure"
    },
    {
      id: "joi-010",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-closure-20-4x4-real",
      productName: "20\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      sku: "LC-20-4X4-STR-HD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "100.00",
      totalPrice: "100.00",
      specification: "20-inch 4x4 inch Korean HD lace with improved hairline",
      productionInstructions: "Long length closure with premium lace work",
      status: "pending",
      estimatedHours: "4.5",
      actualHours: null,
      qualityCheck: "pending", 
      notes: "Long length closure"
    },
    {
      id: "joi-011",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-closure-22-4x4-real",
      productName: "22\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      sku: "LC-22-4X4-STR-HD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "120.00",
      totalPrice: "120.00",
      specification: "22-inch 4x4 inch Korean HD lace with improved hairline",
      productionInstructions: "Extra long premium closure with detailed lace work",
      status: "pending",
      estimatedHours: "5.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Premium long closure"
    },
    {
      id: "joi-012",
      jobOrderId: "jo-2025-08-001-r1",
      productId: "prod-frontal-22-9x6-real", 
      productName: "22\" Korean HD Lace Frontal 9X6\", STRAIGHT (Improved Hairline)",
      sku: "LF-22-9X6-STR-HD",
      quantity: "1.00",
      unit: "pcs",
      unitPrice: "130.00",
      totalPrice: "130.00",
      specification: "22-inch 9x6 inch Korean HD frontal with improved hairline",
      productionInstructions: "Premium frontal construction with natural hairline and baby hairs",
      status: "pending",
      estimatedHours: "6.0",
      actualHours: null,
      qualityCheck: "pending",
      notes: "Premium frontal piece"
    }
  ],

  // Production summary
  productionSummary: {
    totalItems: 12,
    totalQuantity: "9.50", // Sum of all quantities
    totalValue: "947.00", // Matches Sales Order subtotal
    estimatedTotalHours: "34.5",
    estimatedCompletionDate: "2025-08-25",
    priorityLevel: "high",
    specialInstructions: [
      "All items must have silky finish",
      "Brushed back technique for closures and frontals",
      "Quality control check required for each item",
      "Package carefully for international shipping to ABA"
    ]
  }
};

export async function seedExactJobOrderData() {
  try {
    console.log('🏭 Seeding exact Job Order data from JO PDF...');

    // Create the Job Order
    await db.insert(jobOrders).values({
      id: exactJobOrderData.jobOrder.id,
      jobOrderNumber: exactJobOrderData.jobOrder.jobOrderNumber,
      salesOrderId: exactJobOrderData.jobOrder.salesOrderId,
      customerId: exactJobOrderData.jobOrder.customerId,
      customerCode: exactJobOrderData.jobOrder.customerCode,
      dueDate: new Date(exactJobOrderData.jobOrder.dueDate),
      status: exactJobOrderData.jobOrder.status,
      priority: exactJobOrderData.jobOrder.priority,
      createdBy: exactJobOrderData.jobOrder.createdBy,
      customerServiceInstructions: exactJobOrderData.jobOrder.customerServiceInstructions,
      isActive: exactJobOrderData.jobOrder.isActive
    }).onConflictDoNothing();

    // Create all Job Order Items
    for (const item of exactJobOrderData.jobOrderItems) {
      await db.insert(jobOrderItems).values({
        id: item.id,
        jobOrderId: item.jobOrderId,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        specification: item.specification,
        productionInstructions: item.productionInstructions,
        status: item.status,
        notes: item.notes
      }).onConflictDoNothing();
    }

    console.log('✅ Exact Job Order data seeded successfully');
    console.log('   🏭 Job Order NO: JO-2025.08.001 R1');
    console.log('   📋 Sales Order: 2025.08.001 R1');
    console.log('   👤 Customer: ABA Hair International');
    console.log('   📅 Due Date: August 30, 2025');
    console.log(`   📦 ${exactJobOrderData.jobOrderItems.length} production items`);
    console.log(`   💰 Total Value: $${exactJobOrderData.productionSummary.totalValue}`);
    console.log(`   ⏱️ Estimated Hours: ${exactJobOrderData.productionSummary.estimatedTotalHours}`);

  } catch (error) {
    console.error('❌ Error seeding exact Job Order data:', error);
    throw error;
  }
}