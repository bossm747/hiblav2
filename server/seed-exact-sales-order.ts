#!/usr/bin/env tsx

// Create the exact Sales Order from the PDF document provided by client
import { db } from './db';
import { customers, salesOrders, salesOrderItems, products } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function createExactSalesOrder() {
  console.log('📄 CREATING EXACT SALES ORDER FROM PDF DATA');
  console.log('============================================');

  try {
    // Get ABA customer
    const [abaCustomer] = await db.select().from(customers).where(eq(customers.customerCode, 'ABA'));
    if (!abaCustomer) {
      throw new Error('ABA customer not found. Run seed-real-customers-only.ts first.');
    }

    // Check if sales order already exists
    const existingSalesOrder = await db.select().from(salesOrders).where(eq(salesOrders.salesOrderNumber, '2025.08.001'));
    if (existingSalesOrder.length > 0) {
      console.log('✅ Sales Order 2025.08.001 R1 already exists');
      return existingSalesOrder[0];
    }

    // Create the exact sales order from PDF
    const salesOrderData = {
      salesOrderNumber: '2025.08.001',
      revisionNumber: 'R1',
      customerId: abaCustomer.id,
      customerCode: 'ABA',
      country: 'United States',
      dueDate: new Date('2025-08-30'),
      subtotal: '947.00',
      shippingFee: '35.00', // shipping charge USD
      bankCharge: '50.00', // bank charge USD  
      discount: '15.00', // discount USD (positive value, will be subtracted)
      others: '70.00', // please pay this amount USD
      total: '1087.00', // Total calculated: 947 + 35 + 50 - 15 + 70 = 1087
      pleasePayThisAmountUsd: '1087.00',
      paymentMethod: 'bank',
      shippingMethod: 'DHL',
      customerServiceInstructions: 'Silky Bundles\nBrushed Back Closure/Frontal',
      createdBy: 'AAMA', // as per PDF
      status: 'confirmed'
    };

    const [createdSalesOrder] = await db.insert(salesOrders).values(salesOrderData).returning();
    console.log(`✅ Created Sales Order: ${createdSalesOrder.salesOrderNumber}`);

    // Create sales order items exactly as in PDF
    const exactItems = [
      { name: '8" Machine Weft Single Drawn, STRAIGHT', quantity: '1', unitPrice: '120.00', lineTotal: '120.00' },
      { name: '10" Machine Weft Single Drawn, STRAIGHT', quantity: '0.6', unitPrice: '130.00', lineTotal: '78.00' },
      { name: '16" Machine Weft Single Drawn, STRAIGHT', quantity: '1', unitPrice: '140.00', lineTotal: '140.00' },
      { name: '20" Machine Weft Single Drawn, STRAIGHT', quantity: '0.5', unitPrice: '150.00', lineTotal: '75.00' },
      { name: '22" Machine Weft Single Drawn, STRAIGHT', quantity: '0.2', unitPrice: '80.00', lineTotal: '16.00' },
      { name: '10" Machine Weft, Double Drawn, Straight', quantity: '0.1', unitPrice: '90.00', lineTotal: '9.00' },
      { name: '18" Machine Weft, Double Drawn, Straight', quantity: '0.2', unitPrice: '70.00', lineTotal: '14.00' },
      { name: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)', quantity: '1', unitPrice: '45.00', lineTotal: '45.00' },
      { name: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: '1', unitPrice: '100.00', lineTotal: '100.00' },
      { name: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: '1', unitPrice: '100.00', lineTotal: '100.00' },
      { name: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', quantity: '1', unitPrice: '120.00', lineTotal: '120.00' },
      { name: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)', quantity: '1', unitPrice: '130.00', lineTotal: '130.00' }
    ];

    // Find matching products in database or use product names directly
    const allProducts = await db.select().from(products);
    
    let totalCalculated = 0;
    for (const item of exactItems) {
      // Try to find matching product by name similarity
      const matchingProduct = allProducts.find(p => 
        p.name.toLowerCase().includes(item.name.toLowerCase().substring(0, 10)) ||
        item.name.toLowerCase().includes(p.name.toLowerCase().substring(0, 10))
      );

      const salesOrderItemData = {
        salesOrderId: createdSalesOrder.id,
        productId: matchingProduct?.id || 'product-placeholder',
        productName: item.name,
        specification: '', // No specifications in the PDF for these items
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      };

      await db.insert(salesOrderItems).values(salesOrderItemData);
      totalCalculated += parseFloat(item.lineTotal);
      console.log(`  ✓ ${item.name} - Qty: ${item.quantity} - $${item.lineTotal}`);
    }

    console.log(`\n💰 SALES ORDER TOTALS:`);
    console.log(`   Items Total: $${totalCalculated.toFixed(2)}`);
    console.log(`   Subtotal: $${salesOrderData.subtotal}`);
    console.log(`   Shipping: $${salesOrderData.shippingFee}`);
    console.log(`   Bank Charge: $${salesOrderData.bankCharge}`);
    console.log(`   Discount: -$${salesOrderData.discount}`);
    console.log(`   Others: $${salesOrderData.others}`);
    console.log(`   FINAL TOTAL: $${salesOrderData.total}`);

    console.log(`\n🎯 Sales Order 2025.08.001 R1 created exactly as per PDF!`);
    console.log(`   Customer: ${abaCustomer.name} (${abaCustomer.customerCode})`);
    console.log(`   Items: ${exactItems.length} products`);
    console.log(`   Payment: ${salesOrderData.paymentMethod}`);
    console.log(`   Shipping: ${salesOrderData.shippingMethod}`);
    console.log(`   Instructions: ${salesOrderData.customerServiceInstructions}`);
    
    return createdSalesOrder;

  } catch (error) {
    console.error('❌ Error creating exact sales order:', error);
    throw error;
  }
}

// Run if this file is executed directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  createExactSalesOrder()
    .then(() => {
      console.log('\n✅ Exact sales order creation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Exact sales order creation failed:', error);
      process.exit(1);
    });
}

export { createExactSalesOrder };