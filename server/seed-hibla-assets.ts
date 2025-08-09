import { db } from './db';
import { customers, quotations, quotationItems, salesOrders, salesOrderItems, jobOrders, jobOrderItems, products, categories, priceLists, staff, warehouses, inventoryItems } from '../shared/schema';
import { eq } from 'drizzle-orm';
// Using simple hash instead of bcrypt for seed data

export async function seedHiblaAssets() {
  console.log('🌱 Seeding Hibla Manufacturing System with real business data...');

  try {
    // 1. Create comprehensive product catalog based on attached assets
    const productCategories = [
      {
        id: 'cat-machine-weft',
        name: 'Machine Weft',
        description: 'Premium Filipino hair machine weft products'
      },
      {
        id: 'cat-lace-closure',
        name: 'Lace Closures',
        description: 'High-quality lace closures with improved hairlines'
      },
      {
        id: 'cat-lace-frontal',
        name: 'Lace Frontals',
        description: 'Premium lace frontals for natural hairline'
      }
    ];

    for (const category of productCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    // 2. Products from Sales Order Format (with realistic pricing structure)
    const hiblaProducts = [
      {
        id: 'prod-mw-8-straight',
        name: '8" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino hair, 8 inches, straight texture, single drawn',
        categoryId: 'cat-machine-weft',
        sku: 'MW-8-STR-SD',
        unit: 'bundles',
        priceListA: '120.00', // Premium pricing
        priceListB: '115.00',
        priceListC: '110.00', 
        priceListD: '105.00',
        costPrice: '60.00',
        lowStockThreshold: '10.00'
      },
      {
        id: 'prod-mw-10-straight',
        name: '10" Machine Weft Single Drawn, STRAIGHT', 
        description: 'Premium Filipino hair, 10 inches, straight texture, single drawn',
        categoryId: 'cat-machine-weft',
        sku: 'MW-10-STR-SD',
        unit: 'bundles',
        priceListA: '130.00',
        priceListB: '125.00',
        priceListC: '120.00',
        priceListD: '115.00', 
        costPrice: '65.00',
        lowStockThreshold: '8.00'
      },
      {
        id: 'prod-mw-16-straight',
        name: '16" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino hair, 16 inches, straight texture, single drawn',
        categoryId: 'cat-machine-weft',
        sku: 'MW-16-STR-SD',
        unit: 'bundles',
        priceListA: '140.00',
        priceListB: '135.00',
        priceListC: '130.00',
        priceListD: '125.00',
        costPrice: '70.00',
        lowStockThreshold: '5.00'
      },
      {
        id: 'prod-mw-20-straight',
        name: '20" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino hair, 20 inches, straight texture, single drawn',
        categoryId: 'cat-machine-weft',
        sku: 'MW-20-STR-SD',
        unit: 'bundles',
        priceListA: '150.00',
        priceListB: '145.00',
        priceListC: '140.00',
        priceListD: '135.00',
        costPrice: '75.00',
        lowStockThreshold: '3.00'
      },
      {
        id: 'prod-mw-22-straight',
        name: '22" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino hair, 22 inches, straight texture, single drawn',
        categoryId: 'cat-machine-weft',
        sku: 'MW-22-STR-SD',
        unit: 'bundles',
        priceListA: '80.00',
        priceListB: '78.00',
        priceListC: '76.00',
        priceListD: '74.00',
        costPrice: '40.00',
        lowStockThreshold: '5.00'
      },
      {
        id: 'prod-mw-10-dd-straight',
        name: '10" Machine Weft, Double Drawn, Straight',
        description: 'Premium Filipino hair, 10 inches, double drawn, straight texture',
        categoryId: 'cat-machine-weft',
        sku: 'MW-10-DD-STR',
        unit: 'bundles',
        priceListA: '90.00',
        priceListB: '88.00',
        priceListC: '86.00',
        priceListD: '84.00',
        costPrice: '45.00',
        lowStockThreshold: '6.00'
      },
      {
        id: 'prod-mw-18-dd-straight',
        name: '18" Machine Weft, Double Drawn, Straight',
        description: 'Premium Filipino hair, 18 inches, double drawn, straight texture',
        categoryId: 'cat-machine-weft',
        sku: 'MW-18-DD-STR',
        unit: 'bundles',
        priceListA: '70.00',
        priceListB: '68.00',
        priceListC: '66.00',
        priceListD: '64.00',
        costPrice: '35.00',
        lowStockThreshold: '4.00'
      },
      {
        id: 'prod-lc-12-2x6-straight',
        name: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)',
        description: 'Premium Korean HD lace closure, 12 inches, 2x6 size, straight with improved hairline',
        categoryId: 'cat-lace-closure',
        sku: 'LC-12-2X6-STR-HD',
        unit: 'pcs',
        priceListA: '45.00',
        priceListB: '43.00',
        priceListC: '41.00',
        priceListD: '39.00',
        costPrice: '22.00',
        lowStockThreshold: '8.00'
      },
      {
        id: 'prod-lc-12-4x4-straight',
        name: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)',
        description: 'Premium Korean HD lace closure, 12 inches, 4x4 size, straight with improved hairline',
        categoryId: 'cat-lace-closure',
        sku: 'LC-12-4X4-STR-HD',
        unit: 'pcs',
        priceListA: '100.00',
        priceListB: '95.00',
        priceListC: '90.00',
        priceListD: '85.00',
        costPrice: '50.00',
        lowStockThreshold: '6.00'
      },
      {
        id: 'prod-lc-20-4x4-straight',
        name: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)',
        description: 'Premium Korean HD lace closure, 20 inches, 4x4 size, straight with improved hairline',
        categoryId: 'cat-lace-closure',
        sku: 'LC-20-4X4-STR-HD',
        unit: 'pcs',
        priceListA: '100.00',
        priceListB: '95.00',
        priceListC: '90.00',
        priceListD: '85.00',
        costPrice: '50.00',
        lowStockThreshold: '4.00'
      },
      {
        id: 'prod-lc-22-4x4-straight',
        name: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)',
        description: 'Premium Korean HD lace closure, 22 inches, 4x4 size, straight with improved hairline',
        categoryId: 'cat-lace-closure',
        sku: 'LC-22-4X4-STR-HD',
        unit: 'pcs',
        priceListA: '120.00',
        priceListB: '115.00',
        priceListC: '110.00',
        priceListD: '105.00',
        costPrice: '60.00',
        lowStockThreshold: '3.00'
      },
      {
        id: 'prod-lf-22-9x6-straight',
        name: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)',
        description: 'Premium Korean HD lace frontal, 22 inches, 9x6 size, straight with improved hairline',
        categoryId: 'cat-lace-frontal',
        sku: 'LF-22-9X6-STR-HD',
        unit: 'pcs',
        priceListA: '130.00',
        priceListB: '125.00',
        priceListC: '120.00',
        priceListD: '115.00',
        costPrice: '65.00',
        lowStockThreshold: '2.00'
      }
    ];

    for (const product of hiblaProducts) {
      await db.insert(products).values({
        ...product,
        hairType: 'human',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Initialize warehouse stocks
        ngWarehouse: '0.00',
        phWarehouse: '0.00', 
        reservedWarehouse: '0.00',
        redWarehouse: '0.00',
        adminWarehouse: '0.00',
        wipWarehouse: '0.00'
      }).onConflictDoNothing();
    }

    // 3. Create ABA Customer (from the document)
    const abaCustomer = {
      id: 'customer-aba',
      customerCode: 'ABA',
      name: 'ABA Hair International',
      email: 'orders@abahair.com',
      phone: '+1-555-0123',
      password: 'temp-password-123',
      country: 'United States',
      status: 'active',
      address: '123 Hair District',
      city: 'Los Angeles',
      postalCode: '90210',
      totalOrders: 0,
      totalSpent: '0.00',
      emailVerified: true,
      paymentTerms: 'NET30',
      creditLimit: '10000.00',
      preferredShipping: 'DHL',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(customers).values(abaCustomer).onConflictDoNothing();

    // 4. Create AAMA Staff Member (from the document)
    const aamaStaff = {
      id: 'staff-aama',
      username: 'AAMA',
      email: 'aama@hiblamanufacturing.com',
      password: 'temp-password-123',
      name: 'AAMA Production Manager',
      role: 'production_manager',
      department: 'Production',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(staff).values(aamaStaff).onConflictDoNothing();

    // 5. Create Sales Order based on the attached format
    const salesOrderData = {
      id: 'so-aba-001',
      salesOrderNumber: '2025.08.001',
      revisionNumber: 'R1',
      customerId: 'customer-aba',
      customerCode: 'ABA',
      country: 'United States',
      priceListId: 'pl-a',
      subtotal: '947.00',
      shippingFee: '35.00',
      bankCharge: '50.00',
      discount: '-15.00',
      others: '70.00',
      total: '1087.00',
      paymentMethod: 'bank',
      shippingMethod: 'DHL',
      customerServiceInstructions: 'Silky Bundles\nBrushed Back Closure/Frontal',
      status: 'confirmed',
      dueDate: new Date('2025-08-30'),
      createdBy: 'staff-aama',
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    };

    await db.insert(salesOrders).values(salesOrderData).onConflictDoNothing();

    // 6. Create Sales Order Items based on the attached format
    const salesOrderItemsData = [
      {
        id: 'soi-001-01',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-8-straight',
        productName: '8" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '1',
        unitPrice: '120.00',
        lineTotal: '120.00'
      },
      {
        id: 'soi-001-02',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-10-straight',
        productName: '10" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '0.6',
        unitPrice: '130.00',
        lineTotal: '78.00'
      },
      {
        id: 'soi-001-03',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-16-straight',
        productName: '16" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '1',
        unitPrice: '140.00',
        lineTotal: '140.00'
      },
      {
        id: 'soi-001-04',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-20-straight',
        productName: '20" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '0.5',
        unitPrice: '150.00',
        lineTotal: '75.00'
      },
      {
        id: 'soi-001-05',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-22-straight',
        productName: '22" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '0.2',
        unitPrice: '80.00',
        lineTotal: '16.00'
      },
      {
        id: 'soi-001-06',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-10-dd-straight',
        productName: '10" Machine Weft, Double Drawn, Straight',
        specification: '',
        quantity: '0.1',
        unitPrice: '90.00',
        lineTotal: '9.00'
      },
      {
        id: 'soi-001-07',
        salesOrderId: 'so-aba-001',
        productId: 'prod-mw-18-dd-straight',
        productName: '18" Machine Weft, Double Drawn, Straight',
        specification: '',
        quantity: '0.2',
        unitPrice: '70.00',
        lineTotal: '14.00'
      },
      {
        id: 'soi-001-08',
        salesOrderId: 'so-aba-001',
        productId: 'prod-lc-12-2x6-straight',
        productName: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)',
        specification: '',
        quantity: '1',
        unitPrice: '45.00',
        lineTotal: '45.00'
      },
      {
        id: 'soi-001-09',
        salesOrderId: 'so-aba-001',
        productId: 'prod-lc-12-4x4-straight',
        productName: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)',
        specification: '',
        quantity: '1',
        unitPrice: '100.00',
        lineTotal: '100.00'
      },
      {
        id: 'soi-001-10',
        salesOrderId: 'so-aba-001',
        productId: 'prod-lc-20-4x4-straight',
        productName: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)',
        specification: '',
        quantity: '1',
        unitPrice: '100.00',
        lineTotal: '100.00'
      },
      {
        id: 'soi-001-11',
        salesOrderId: 'so-aba-001',
        productId: 'prod-lc-22-4x4-straight',
        productName: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)',
        specification: '',
        quantity: '1',
        unitPrice: '120.00',
        lineTotal: '120.00'
      },
      {
        id: 'soi-001-12',
        salesOrderId: 'so-aba-001',
        productId: 'prod-lf-22-9x6-straight',
        productName: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)',
        specification: '',
        quantity: '1',
        unitPrice: '130.00',
        lineTotal: '130.00'
      }
    ];

    for (const item of salesOrderItemsData) {
      await db.insert(salesOrderItems).values(item).onConflictDoNothing();
    }

    // 7. Create Job Order based on the attached format
    const jobOrderData = {
      id: 'jo-aba-001',
      jobOrderNumber: '2025.08.001',
      revisionNumber: 'R1',
      customerId: 'customer-aba',
      customerCode: 'ABA',
      salesOrderId: 'so-aba-001',
      customerServiceInstructions: 'Silky Bundles\nBrushed Back Closure/Frontal',
      status: 'active',
      dueDate: new Date('2025-08-30'),
      createdBy: 'staff-aama',
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    };

    await db.insert(jobOrders).values(jobOrderData).onConflictDoNothing();

    // 8. Create Job Order Items with production tracking
    const jobOrderItemsData = [
      {
        id: 'joi-001-01',
        jobOrderId: 'jo-aba-001',
        productId: 'prod-mw-8-straight',
        productName: '8" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '1',
        shipped: '0.1',
        reserved: '0.2',
        ready: '0.1',
        toProduce: '0.8',
        orderBalance: '0.9'
      },
      {
        id: 'joi-001-02',
        jobOrderId: 'jo-aba-001',
        productId: 'prod-mw-10-straight',
        productName: '10" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '0.6',
        shipped: '0.1',
        reserved: '0.2',
        ready: '0.1',
        toProduce: '0.4',
        orderBalance: '0.5'
      },
      {
        id: 'joi-001-03',
        jobOrderId: 'jo-aba-001',
        productId: 'prod-mw-16-straight',
        productName: '16" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '1',
        shipped: '0.3',
        reserved: '0.3',
        ready: '0',
        toProduce: '0.7',
        orderBalance: '0.7'
      },
      {
        id: 'joi-001-04',
        jobOrderId: 'jo-aba-001',
        productId: 'prod-mw-20-straight',
        productName: '20" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '0.5',
        shipped: '0',
        reserved: '0.4',
        ready: '0.4',
        toProduce: '0.1',
        orderBalance: '0.5'
      },
      {
        id: 'joi-001-05',
        jobOrderId: 'jo-aba-001',
        productId: 'prod-mw-22-straight',
        productName: '22" Machine Weft Single Drawn, STRAIGHT',
        specification: '',
        quantity: '0.2',
        shipped: '0',
        reserved: '0',
        ready: '0',
        toProduce: '0.2',
        orderBalance: '0.2'
      }
    ];

    for (const item of jobOrderItemsData) {
      await db.insert(jobOrderItems).values(item).onConflictDoNothing();
    }

    console.log('✅ Successfully seeded Hibla Manufacturing System with:');
    console.log(`   • ${hiblaProducts.length} authentic hair products`);
    console.log('   • ABA customer with complete profile');
    console.log('   • AAMA staff member');
    console.log('   • Sales Order 2025.08.001 with 12 line items');
    console.log('   • Job Order 2025.08.001 with production tracking');
    console.log('   • Complete manufacturing workflow ready for testing');

  } catch (error) {
    console.error('❌ Error seeding Hibla assets:', error);
    throw error;
  }
}

if (require.main === module) {
  seedHiblaAssets()
    .then(() => {
      console.log('✅ Hibla Manufacturing System seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to seed:', error);
      process.exit(1);
    });
}