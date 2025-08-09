// Test script to debug customer creation directly
const { pool, db } = require('./db.js');
const { customers } = require('../shared/schema.js');

async function testCustomerCreation() {
  console.log('Testing customer creation directly...');
  
  const customerData = {
    customerCode: 'TEST_DEBUG',
    name: 'Test Customer',
    email: 'test@debug.com',
    password: 'temp-password-debug',
    phone: '',
    country: 'Philippines',
    status: 'active'
  };
  
  try {
    console.log('Customer data to insert:', customerData);
    const [customer] = await db.insert(customers).values(customerData).returning();
    console.log('SUCCESS: Customer created:', customer);
    return customer;
  } catch (error) {
    console.error('FAILED: Customer creation error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  }
}

testCustomerCreation().then(() => {
  console.log('Test complete');
  process.exit(0);
}).catch(console.error);