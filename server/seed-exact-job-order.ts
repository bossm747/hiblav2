#!/usr/bin/env tsx

// Create the exact Job Order from the PDF document provided by client
import { db } from './db';
import { customers, salesOrders, jobOrders, jobOrderItems, products } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function createExactJobOrder() {
  console.log('📋 CREATING EXACT JOB ORDER FROM PDF DATA');
  console.log('=========================================');

  try {
    // Get ABA customer
    const [abaCustomer] = await db.select().from(customers).where(eq(customers.customerCode, 'ABA'));
    if (!abaCustomer) {
      throw new Error('ABA customer not found. Run seed-real-customers-only.ts first.');
    }

    // Get the sales order
    const [salesOrder] = await db.select().from(salesOrders).where(eq(salesOrders.salesOrderNumber, '2025.08.001'));
    if (!salesOrder) {
      throw new Error('Sales Order 2025.08.001 not found. Run seed-exact-sales-order.ts first.');
    }

    // Check if job order already exists
    const existingJobOrder = await db.select().from(jobOrders).where(eq(jobOrders.jobOrderNumber, '2025.08.001'));
    if (existingJobOrder.length > 0) {
      console.log('✅ Job Order 2025.08.001 R1 already exists');
      return existingJobOrder[0];
    }

    // Create the exact job order from PDF
    const jobOrderData = {
      jobOrderNumber: '2025.08.001',
      revisionNumber: 'R1',
      salesOrderId: salesOrder.id,
      salesOrderNumber: salesOrder.salesOrderNumber,
      customerId: abaCustomer.id,
      customerCode: 'ABA',
      dueDate: new Date('2025-08-30'),
      customerInstructions: 'Silky Bundles\nBrushed Back Closure/Frontal',
      createdBy: 'AAMA', // as per PDF
      status: 'in-progress',
      shipmentStatus: 'partial'
    };

    const [createdJobOrder] = await db.insert(jobOrders).values(jobOrderData).returning();
    console.log(`✅ Created Job Order: ${createdJobOrder.jobOrderNumber}`);

    // Create job order items exactly as in PDF with shipment tracking
    const exactJobOrderItems = [
      { 
        name: '8" Machine Weft Single Drawn, STRAIGHT', 
        quantity: '1', 
        shipped: '0.1', 
        reserved: '0.2', 
        ready: '0.1', 
        toProduce: '0.8',
        shipment1: '0.1'
      },
      { 
        name: '10" Machine Weft Single Drawn, STRAIGHT', 
        quantity: '0.6', 
        shipped: '0.1', 
        reserved: '0.2', 
        ready: '0.1', 
        toProduce: '0.4',
        shipment2: '0.1'
      },
      { 
        name: '16" Machine Weft Single Drawn, STRAIGHT', 
        quantity: '1', 
        shipped: '0.3', 
        reserved: '0.3', 
        ready: '0', 
        toProduce: '0.7',
        shipment1: '0.2',
        shipment3: '0.1'
      },
      { 
        name: '20" Machine Weft Single Drawn, STRAIGHT', 
        quantity: '0.5', 
        shipped: '0', 
        reserved: '0.4', 
        ready: '0.4', 
        toProduce: '0.1'
      },
      { 
        name: '22" Machine Weft Single Drawn, STRAIGHT', 
        quantity: '0.2', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '0.2'
      },
      { 
        name: '10" Machine Weft, Double Drawn, Straight', 
        quantity: '0.1', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '0.1'
      },
      { 
        name: '18" Machine Weft, Double Drawn, Straight', 
        quantity: '0.2', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '0.2'
      },
      { 
        name: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)', 
        quantity: '1', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '1'
      },
      { 
        name: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', 
        quantity: '1', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '1'
      },
      { 
        name: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', 
        quantity: '1', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '1'
      },
      { 
        name: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', 
        quantity: '1', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '1'
      },
      { 
        name: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)', 
        quantity: '1', 
        shipped: '0', 
        reserved: '0', 
        ready: '0', 
        toProduce: '1'
      }
    ];

    // Find matching products in database
    const allProducts = await db.select().from(products);
    
    for (const item of exactJobOrderItems) {
      // Try to find matching product by name similarity
      const matchingProduct = allProducts.find(p => 
        p.name.toLowerCase().includes(item.name.toLowerCase().substring(0, 10)) ||
        item.name.toLowerCase().includes(p.name.toLowerCase().substring(0, 10))
      );

      const jobOrderItemData = {
        jobOrderId: createdJobOrder.id,
        productId: matchingProduct?.id || 'product-placeholder',
        productName: item.name,
        specification: '', // Standard specification
        quantity: item.quantity,
        status: parseFloat(item.toProduce) > 0 ? 'pending' : 'in-progress',
        shipment1: item.shipment1 || '0',
        shipment2: item.shipment2 || '0',
        shipment3: item.shipment3 || '0',
        shipment4: '0',
        shipment5: '0',
        shipment6: '0',
        shipment7: '0',
        shipment8: '0',
        orderBalance: item.toProduce,
        shipped: item.shipped,
        reserved: item.reserved,
        ready: item.ready,
        toProduce: item.toProduce
      };

      await db.insert(jobOrderItems).values(jobOrderItemData);
      console.log(`  ✓ ${item.name} - Total: ${item.quantity} | Shipped: ${item.shipped} | To Produce: ${item.toProduce}`);
    }

    console.log(`\n📊 JOB ORDER STATUS:`);
    console.log(`   Total Items: ${exactJobOrderItems.length}`);
    console.log(`   Status: ${jobOrderData.status}`);
    console.log(`   Shipment Status: ${jobOrderData.shipmentStatus}`);
    console.log(`   Customer Instructions: ${jobOrderData.customerInstructions}`);

    console.log(`\n🎯 Job Order 2025.08.001 R1 created exactly as per PDF!`);
    console.log(`   Linked to Sales Order: ${salesOrder.salesOrderNumber}`);
    console.log(`   Customer: ${abaCustomer.name} (${abaCustomer.customerCode})`);
    console.log(`   Production tracking with 8 shipment columns`);
    console.log(`   Shipment status reflects partial completion`);
    
    return createdJobOrder;

  } catch (error) {
    console.error('❌ Error creating exact job order:', error);
    throw error;
  }
}

// Run if this file is executed directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  createExactJobOrder()
    .then(() => {
      console.log('\n✅ Exact job order creation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Exact job order creation failed:', error);
      process.exit(1);
    });
}

export { createExactJobOrder };