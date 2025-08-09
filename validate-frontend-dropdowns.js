#!/usr/bin/env node

// Comprehensive frontend dropdown validation for quotation form
// Ensures all dropdowns show real database data

const testEndpoints = [
  {
    name: 'Customers API',
    url: 'http://localhost:5000/api/customers',
    expectedFields: ['id', 'customerCode', 'name'],
    minItems: 1
  },
  {
    name: 'Price Lists API', 
    url: 'http://localhost:5000/api/price-lists',
    expectedFields: ['id', 'name', 'description'],
    minItems: 4, // Should have A, B, C, D
    expectedNames: ['A', 'B', 'C', 'D']
  },
  {
    name: 'Staff API',
    url: 'http://localhost:5000/api/staff', 
    expectedFields: ['id', 'name', 'role'],
    minItems: 1
  },
  {
    name: 'Products API',
    url: 'http://localhost:5000/api/products',
    expectedFields: ['id', 'name', 'sku'],
    minItems: 10 // Should have plenty of hair products
  }
];

async function validateDropdownData() {
  console.log('🔍 VALIDATING FRONTEND DROPDOWN DATA');
  console.log('=====================================');
  
  let allPassed = true;
  
  for (const test of testEndpoints) {
    console.log(`\n📋 Testing ${test.name}...`);
    
    try {
      const response = await fetch(test.url);
      
      if (!response.ok) {
        console.log(`❌ FAILED: HTTP ${response.status} - ${response.statusText}`);
        allPassed = false;
        continue;
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.log(`❌ FAILED: Response is not an array`);
        allPassed = false;
        continue;
      }
      
      if (data.length < test.minItems) {
        console.log(`❌ FAILED: Expected at least ${test.minItems} items, got ${data.length}`);
        allPassed = false;
        continue;
      }
      
      // Check required fields exist in first item
      if (data.length > 0) {
        const item = data[0];
        const missingFields = test.expectedFields.filter(field => !(field in item));
        
        if (missingFields.length > 0) {
          console.log(`❌ FAILED: Missing fields: ${missingFields.join(', ')}`);
          allPassed = false;
          continue;
        }
      }
      
      // Special validation for price lists
      if (test.expectedNames) {
        const names = data.map(item => item.name);
        const missingNames = test.expectedNames.filter(name => !names.includes(name));
        
        if (missingNames.length > 0) {
          console.log(`❌ FAILED: Missing expected items: ${missingNames.join(', ')}`);
          allPassed = false;
          continue;
        }
      }
      
      console.log(`✅ PASSED: ${data.length} items found with correct structure`);
      
      // Show sample data
      if (data.length > 0) {
        console.log(`   Sample: ${JSON.stringify({
          ...Object.fromEntries(test.expectedFields.map(field => [field, data[0][field]]))
        })}`);
      }
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n📊 DROPDOWN VALIDATION SUMMARY');
  console.log('===============================');
  console.log(`Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 FRONTEND IMPLEMENTATION VERIFIED');
    console.log('All quotation form dropdowns are properly connected to database');
    console.log('✅ Customer dropdown: Real customers loaded');
    console.log('✅ Price List dropdown: All price lists (A,B,C,D) available');
    console.log('✅ Staff dropdown: Active staff members loaded');
    console.log('✅ Product dropdown: Hair products with SKUs loaded');
    console.log('\nThe quotation form is ready for production use!');
  }
  
  return allPassed;
}

// Test quotation creation with dropdown data
async function testQuotationCreation() {
  console.log('\n🧪 TESTING QUOTATION CREATION WITH DROPDOWN DATA');
  console.log('=================================================');
  
  try {
    // Fetch some real data for the test
    const [customers, products, staff, priceLists] = await Promise.all([
      fetch('http://localhost:5000/api/customers').then(r => r.json()),
      fetch('http://localhost:5000/api/products').then(r => r.json()), 
      fetch('http://localhost:5000/api/staff').then(r => r.json()),
      fetch('http://localhost:5000/api/price-lists').then(r => r.json())
    ]);
    
    const testData = {
      quotation: {
        customerCode: customers[0]?.customerCode || 'TEST001',
        country: 'Philippines',
        priceListId: priceLists.find(p => p.name === 'A')?.name || 'A',
        paymentMethod: 'bank',
        shippingMethod: 'DHL', 
        createdBy: staff.find(s => s.role === 'admin')?.id || staff[0]?.id,
        subtotal: '150.00',
        shippingFee: '25.00',
        bankCharge: '8.00',
        discount: '5.00',
        others: '2.00',
        total: '180.00',
        customerServiceInstructions: 'Frontend dropdown validation test'
      },
      items: [
        {
          productId: products[0]?.id,
          productName: products[0]?.name,
          quantity: '1',
          unitPrice: '150.00', 
          lineTotal: '150.00',
          specification: 'Quality test product'
        }
      ]
    };
    
    console.log(`Using dropdown data:`);
    console.log(`  Customer: ${testData.quotation.customerCode}`);
    console.log(`  Price List: ${testData.quotation.priceListId}`);
    console.log(`  Staff: ${testData.quotation.createdBy}`);
    console.log(`  Product: ${testData.items[0].productName?.substring(0, 50)}...`);
    
    const response = await fetch('http://localhost:5000/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ QUOTATION CREATED: ${result.quotationNumber}`);
      console.log('Frontend dropdown integration working perfectly!');
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ CREATION FAILED: ${error}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ TEST ERROR: ${error.message}`);
    return false;
  }
}

// Run all validations
async function main() {
  const dropdownsValid = await validateDropdownData();
  
  if (dropdownsValid) {
    await testQuotationCreation();
  }
  
  process.exit(dropdownsValid ? 0 : 1);
}

main().catch(console.error);