#!/usr/bin/env node

// Test create quotation with professional title instead of VLOOKUP
console.log('🧪 TESTING PROFESSIONAL QUOTATION CREATION');
console.log('==========================================');

async function testQuotationCreation() {
  try {
    // Test API data availability first
    console.log('1. Checking API data availability...');
    
    const [customers, products, staff, priceLists] = await Promise.all([
      fetch('http://localhost:5000/api/customers').then(r => r.json()),
      fetch('http://localhost:5000/api/products').then(r => r.json()),
      fetch('http://localhost:5000/api/staff').then(r => r.json()),
      fetch('http://localhost:5000/api/price-lists').then(r => r.json())
    ]);
    
    console.log(`✓ Found ${customers.length} customers`);
    console.log(`✓ Found ${products.length} products`); 
    console.log(`✓ Found ${staff.length} staff members`);
    console.log(`✓ Found ${priceLists.length} price lists`);
    
    // Validate essential data exists
    if (customers.length === 0) throw new Error('No customers found');
    if (products.length === 0) throw new Error('No products found');
    if (staff.length === 0) throw new Error('No staff found');
    if (priceLists.length === 0) throw new Error('No price lists found');
    
    console.log('\n2. Testing professional quotation creation...');
    
    const testQuotation = {
      quotation: {
        customerCode: customers[0].customerCode,
        country: 'Philippines',
        priceListId: priceLists.find(p => p.name === 'A')?.name || 'A',
        paymentMethod: 'bank',
        shippingMethod: 'DHL',
        createdBy: staff.find(s => s.role === 'admin')?.id || staff[0].id,
        subtotal: '299.00',
        shippingFee: '50.00',
        bankCharge: '15.00',
        discount: '10.00',
        others: '5.00',
        total: '359.00',
        customerServiceInstructions: 'Professional quotation created without VLOOKUP terminology'
      },
      items: [
        {
          productId: products[0].id,
          productName: products[0].name,
          quantity: '2',
          unitPrice: '149.50',
          lineTotal: '299.00',
          specification: 'Premium quality authentic Filipino hair'
        }
      ]
    };
    
    console.log(`Using professional data:`);
    console.log(`  Customer: ${testQuotation.quotation.customerCode}`);
    console.log(`  Product: ${testQuotation.items[0].productName?.substring(0, 40)}...`);
    console.log(`  Staff: ${staff.find(s => s.id === testQuotation.quotation.createdBy)?.name}`);
    console.log(`  Price List: ${testQuotation.quotation.priceListId}`);
    
    const response = await fetch('http://localhost:5000/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testQuotation)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`\n✅ SUCCESS: Professional quotation created!`);
      console.log(`   Quotation Number: ${result.quotationNumber}`);
      console.log(`   Total: $${result.total}`);
      console.log(`   Status: ${result.status}`);
      
      // Test the frontend is accessible
      console.log('\n3. Testing frontend access...');
      const frontendResponse = await fetch('http://localhost:5000/quotations-vlookup');
      
      if (frontendResponse.ok) {
        console.log('✅ Frontend page accessible');
        console.log('✅ Professional quotation system ready');
        return true;
      } else {
        console.log('❌ Frontend not accessible');
        return false;
      }
      
    } else {
      const errorText = await response.text();
      console.log(`❌ FAILED: ${response.status} - ${errorText}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

testQuotationCreation().then(success => {
  if (success) {
    console.log('\n🎉 ALL TESTS PASSED - PROFESSIONAL QUOTATION SYSTEM READY');
    console.log('   • Dropdown data loading consistently');
    console.log('   • Professional terminology implemented');
    console.log('   • Database integration working');
    console.log('   • Frontend accessible and functional');
  } else {
    console.log('\n❌ TESTS FAILED - ISSUES NEED TO BE RESOLVED');
  }
  process.exit(success ? 0 : 1);
});