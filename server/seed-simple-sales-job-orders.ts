import { db } from './db';
import { customers, salesOrders, salesOrderItems, jobOrders, jobOrderItems, staff } from '../shared/schema';

export async function seedSalesAndJobOrders() {
  console.log('🌱 Seeding Sales Orders and Job Orders based on attached assets...');

  try {
    // 1. Create ABA Customer
    const abaCustomer = {
      id: 'customer-aba-001',
      customerCode: 'ABA',
      name: 'ABA Hair International',
      email: 'orders@abahair.com',
      phone: '+1-555-0123',
      password: 'temp-password-123',
      country: 'United States',
      status: 'active' as const,
      address: '123 Hair District',
      city: 'Los Angeles',
      postalCode: '90210',
      totalOrders: 1,
      totalSpent: '1087.00',
      emailVerified: true,
      paymentTerms: 'NET30',
      creditLimit: '10000.00',
      preferredShipping: 'DHL',
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    };

    await db.insert(customers).values(abaCustomer).onConflictDoNothing();

    // 2. Create AAMA Staff Member
    const aamaStaff = {
      id: 'staff-aama-001',
      username: 'AAMA',
      email: 'aama@hiblamanufacturing.com',
      password: 'temp-password-123',
      name: 'AAMA Production Manager',
      role: 'production_manager' as const,
      department: 'Production',
      isActive: true,
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    };

    await db.insert(staff).values(aamaStaff).onConflictDoNothing();

    // 3. Create Sales Order based on attached format
    const salesOrderData = {
      id: 'so-aba-20250801',
      salesOrderNumber: '2025.08.001',
      revisionNumber: 'R1',
      customerId: 'customer-aba-001',
      customerCode: 'ABA', 
      country: 'United States',
      priceListId: 'pl-a',
      subtotal: '947.00',
      shippingFee: '35.00',
      bankCharge: '50.00',
      discount: '-15.00',
      others: '70.00', 
      total: '1087.00',
      paymentMethod: 'bank' as const,
      shippingMethod: 'DHL' as const,
      customerServiceInstructions: 'Silky Bundles\nBrushed Back Closure/Frontal',
      status: 'confirmed' as const,
      dueDate: new Date('2025-08-30'),
      createdBy: 'staff-aama-001',
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    };

    await db.insert(salesOrders).values(salesOrderData).onConflictDoNothing();

    // 4. Create Sales Order Items (using existing product IDs)
    const salesOrderItemsData = [
      {
        id: 'soi-aba-001',
        salesOrderId: 'so-aba-20250801',
        productId: '1', // Existing Test Filipino Hair Bundle
        productName: '8" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Premium quality',
        quantity: '1',
        unitPrice: '120.00',
        lineTotal: '120.00'
      },
      {
        id: 'soi-aba-002', 
        salesOrderId: 'so-aba-20250801',
        productId: 'prod-002', // Existing 10" Machine Weft
        productName: '10" Machine Weft Single Drawn, WAVY',
        specification: 'Convert to straight',
        quantity: '0.6',
        unitPrice: '130.00',
        lineTotal: '78.00'
      },
      {
        id: 'soi-aba-003',
        salesOrderId: 'so-aba-20250801',
        productId: 'prod-003', // Existing 12" Lace Closure
        productName: '12" Lace Closure 4x4, STRAIGHT',
        specification: 'Korean HD improvement',
        quantity: '2',
        unitPrice: '100.00',
        lineTotal: '200.00'
      }
    ];

    for (const item of salesOrderItemsData) {
      await db.insert(salesOrderItems).values(item).onConflictDoNothing();
    }

    // 5. Create Job Order
    const jobOrderData = {
      id: 'jo-aba-20250801',
      jobOrderNumber: '2025.08.001',
      revisionNumber: 'R1',
      customerId: 'customer-aba-001',
      customerCode: 'ABA',
      salesOrderId: 'so-aba-20250801',
      customerServiceInstructions: 'Silky Bundles\nBrushed Back Closure/Frontal',
      status: 'active' as const,
      dueDate: new Date('2025-08-30'),
      createdBy: 'staff-aama-001',
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    };

    await db.insert(jobOrders).values(jobOrderData).onConflictDoNothing();

    // 6. Create Job Order Items with production tracking
    const jobOrderItemsData = [
      {
        id: 'joi-aba-001',
        jobOrderId: 'jo-aba-20250801',
        productId: '1',
        productName: '8" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Premium quality',
        quantity: '1',
        shipped: '0.1',
        reserved: '0.2',
        ready: '0.1',
        toProduce: '0.6',
        orderBalance: '0.9'
      },
      {
        id: 'joi-aba-002',
        jobOrderId: 'jo-aba-20250801',
        productId: 'prod-002',
        productName: '10" Machine Weft Single Drawn, WAVY',
        specification: 'Convert to straight',
        quantity: '0.6',
        shipped: '0.1',
        reserved: '0.2',
        ready: '0.1',
        toProduce: '0.2',
        orderBalance: '0.5'
      },
      {
        id: 'joi-aba-003',
        jobOrderId: 'jo-aba-20250801',
        productId: 'prod-003',
        productName: '12" Lace Closure 4x4, STRAIGHT',
        specification: 'Korean HD improvement',
        quantity: '2',
        shipped: '0.5',
        reserved: '0.5',
        ready: '0.5',
        toProduce: '0.5',
        orderBalance: '1.5'
      }
    ];

    for (const item of jobOrderItemsData) {
      await db.insert(jobOrderItems).values(item).onConflictDoNothing();
    }

    console.log('✅ Successfully seeded:');
    console.log('   • ABA customer profile');
    console.log('   • AAMA staff member');
    console.log('   • Sales Order 2025.08.001 with 3 line items');
    console.log('   • Job Order 2025.08.001 with production tracking');
    console.log('   • Complete manufacturing workflow ready for testing');

  } catch (error) {
    console.error('❌ Error seeding sales and job orders:', error);
    throw error;
  }
}

// Run the seed function
seedSalesAndJobOrders()
  .then(() => {
    console.log('✅ Sales and Job Orders seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to seed:', error);
    process.exit(1);
  });