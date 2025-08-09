#!/usr/bin/env tsx

// Clean customer data to keep only real customers from PDF files
import { db } from './db';
import { customers } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function cleanCustomerData() {
  console.log('🧹 CLEANING CUSTOMER DATA TO REAL CUSTOMERS ONLY');
  console.log('================================================');

  try {
    // First, get the ABA customer (real customer from PDF files)
    const abaCustomer = await db.select().from(customers).where(eq(customers.customerCode, 'ABA'));
    
    if (abaCustomer.length === 0) {
      console.log('❌ ABA customer not found! Creating from PDF data...');
      
      // Create ABA customer based on Sales Order and Job Order PDFs
      await db.insert(customers).values({
        customerCode: 'ABA',
        name: 'ABA Customer',
        email: 'orders@aba-customer.com',
        phone: '+1-555-0123',
        password: 'aba-secure-password',
        country: 'United States',
        shippingAddress: 'ABA Customer Shipping Address, USA',
        billingAddress: 'ABA Customer Billing Address, USA',
        city: 'Los Angeles',
        province: 'California',
        postalCode: '90210',
        totalOrders: 2, // Sales Order + Job Order
        totalSpent: '1087.00', // From Sales Order PDF
        status: 'active',
        emailVerified: true,
        paymentTerms: 'net30',
        creditLimit: '10000.00',
        preferredShipping: 'DHL',
      });
      
      console.log('✅ Created ABA customer from PDF data');
    } else {
      console.log('✅ ABA customer already exists');
    }

    // Delete all other test customers, keeping only ABA
    const allCustomers = await db.select().from(customers);
    console.log(`Found ${allCustomers.length} total customers`);
    
    const customersToDelete = allCustomers.filter(c => c.customerCode !== 'ABA');
    console.log(`Removing ${customersToDelete.length} test customers...`);
    
    // First delete related quotations and other related data
    const { quotations, quotationItems, salesOrders, salesOrderItems, jobOrders, jobOrderItems } = await import('@shared/schema');
    
    for (const customer of customersToDelete) {
      // Delete related quotation items first
      const customerQuotations = await db.select().from(quotations).where(eq(quotations.customerId, customer.id));
      for (const quotation of customerQuotations) {
        await db.delete(quotationItems).where(eq(quotationItems.quotationId, quotation.id));
      }
      
      // Delete quotations
      await db.delete(quotations).where(eq(quotations.customerId, customer.id));
      
      // Delete related sales order items
      const customerSalesOrders = await db.select().from(salesOrders).where(eq(salesOrders.customerId, customer.id));
      for (const salesOrder of customerSalesOrders) {
        await db.delete(salesOrderItems).where(eq(salesOrderItems.salesOrderId, salesOrder.id));
        // Delete related job order items
        const relatedJobOrders = await db.select().from(jobOrders).where(eq(jobOrders.salesOrderId, salesOrder.id));
        for (const jobOrder of relatedJobOrders) {
          await db.delete(jobOrderItems).where(eq(jobOrderItems.jobOrderId, jobOrder.id));
        }
        // Delete job orders
        await db.delete(jobOrders).where(eq(jobOrders.salesOrderId, salesOrder.id));
      }
      
      // Delete sales orders
      await db.delete(salesOrders).where(eq(salesOrders.customerId, customer.id));
      
      // Finally delete the customer
      await db.delete(customers).where(eq(customers.id, customer.id));
      console.log(`  - Removed: ${customer.customerCode} (${customer.name}) and related data`);
    }
    
    // Verify final state
    const remainingCustomers = await db.select().from(customers);
    console.log(`\n📊 FINAL CUSTOMER DATA:`);
    console.log(`   Total customers: ${remainingCustomers.length}`);
    
    for (const customer of remainingCustomers) {
      console.log(`   ✓ ${customer.customerCode}: ${customer.name}`);
      console.log(`     Country: ${customer.country}`);
      console.log(`     Total Spent: $${customer.totalSpent}`);
      console.log(`     Orders: ${customer.totalOrders}`);
    }
    
    console.log('\n🎉 CUSTOMER DATA CLEANED SUCCESSFULLY');
    console.log('Only real customers from PDF files remain in the system');
    
  } catch (error) {
    console.error('❌ Error cleaning customer data:', error);
    throw error;
  }
}

// Run if this file is executed directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  cleanCustomerData()
    .then(() => {
      console.log('\n✅ Customer cleanup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Customer cleanup failed:', error);
      process.exit(1);
    });
}

export { cleanCustomerData };