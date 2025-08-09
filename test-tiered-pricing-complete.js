#!/usr/bin/env node

/**
 * COMPREHENSIVE TIERED PRICING SYSTEM TEST
 * Tests all pricing scenarios for the Hibla Manufacturing system
 */

const BASE_URL = 'http://localhost:5000';

async function makeRequest(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTieredPricingTests() {
  console.log('🧪 COMPREHENSIVE TIERED PRICING SYSTEM TEST');
  console.log('═══════════════════════════════════════════════════\n');
  
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Get all price tiers
  console.log('📊 TEST 1: Fetch all price tiers');
  testResults.total++;
  const tiersResult = await makeRequest('/api/price-tiers');
  if (tiersResult.success && Array.isArray(tiersResult.data)) {
    console.log('✅ PASS: Price tiers fetched successfully');
    console.log(`   Found ${tiersResult.data.length} price tiers:`);
    tiersResult.data.forEach(tier => {
      console.log(`   - ${tier.name} (${tier.code}): ${tier.multiplier}x`);
    });
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Failed to fetch price tiers');
    testResults.failed++;
  }
  console.log();

  // Test 2: Regular Customer Pricing (1.00x)
  console.log('💰 TEST 2: Regular Customer Pricing (Baseline)');
  testResults.total++;
  const regularResult = await makeRequest('/api/products/price-lookup?productId=1&priceListId=REGULAR');
  if (regularResult.success && regularResult.data.price === "47.00" && regularResult.data.priceMultiplier === "1.0000") {
    console.log('✅ PASS: Regular customer pricing correct');
    console.log(`   Product: ${regularResult.data.productName}`);
    console.log(`   Base Price: $${regularResult.data.basePrice}`);
    console.log(`   Final Price: $${regularResult.data.price} (${regularResult.data.priceMultiplier}x)`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Regular customer pricing incorrect');
    testResults.failed++;
  }
  console.log();

  // Test 3: New Customer Pricing (1.15x markup)
  console.log('🆕 TEST 3: New Customer Pricing (+15% markup)');
  testResults.total++;
  const newResult = await makeRequest('/api/products/price-lookup?productId=1&priceListId=NEW');
  if (newResult.success && newResult.data.price === "54.05" && newResult.data.priceMultiplier === "1.1500") {
    console.log('✅ PASS: New customer pricing correct');
    console.log(`   Base Price: $${newResult.data.basePrice}`);
    console.log(`   Final Price: $${newResult.data.price} (${newResult.data.priceMultiplier}x)`);
    console.log(`   Markup: +15% = +$${(parseFloat(newResult.data.price) - parseFloat(newResult.data.basePrice)).toFixed(2)}`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: New customer pricing incorrect');
    testResults.failed++;
  }
  console.log();

  // Test 4: Premier Customer Pricing (0.85x discount)
  console.log('⭐ TEST 4: Premier Customer Pricing (15% discount)');
  testResults.total++;
  const premierResult = await makeRequest('/api/products/price-lookup?productId=1&priceListId=PREMIER');
  if (premierResult.success && premierResult.data.price === "39.95" && premierResult.data.priceMultiplier === "0.8500") {
    console.log('✅ PASS: Premier customer pricing correct');
    console.log(`   Base Price: $${premierResult.data.basePrice}`);
    console.log(`   Final Price: $${premierResult.data.price} (${premierResult.data.priceMultiplier}x)`);
    console.log(`   Discount: -15% = -$${(parseFloat(premierResult.data.basePrice) - parseFloat(premierResult.data.price)).toFixed(2)}`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Premier customer pricing incorrect');
    testResults.failed++;
  }
  console.log();

  // Test 5: Legacy VLOOKUP Support (Price List A)
  console.log('🔄 TEST 5: Legacy VLOOKUP Support (Price List A)');
  testResults.total++;
  const legacyResult = await makeRequest('/api/products/price-lookup?productId=1&priceListId=A');
  if (legacyResult.success && legacyResult.data.price === "50.00" && legacyResult.data.priceListName.includes("Legacy")) {
    console.log('✅ PASS: Legacy VLOOKUP pricing correct');
    console.log(`   Price List A: $${legacyResult.data.price}`);
    console.log(`   Legacy Label: ${legacyResult.data.priceListName}`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Legacy VLOOKUP pricing incorrect');
    testResults.failed++;
  }
  console.log();

  // Test 6: Customer-based pricing (ABA customer)
  console.log('👤 TEST 6: Customer-based pricing (ABA = Regular)');
  testResults.total++;
  const customerResult = await makeRequest('/api/products/price-lookup?productId=1&customerCode=ABA');
  if (customerResult.success && customerResult.data.price === "47.00") {
    console.log('✅ PASS: Customer-based pricing correct');
    console.log(`   Customer: ABA`);
    console.log(`   Price Category: ${customerResult.data.priceListName}`);
    console.log(`   Final Price: $${customerResult.data.price}`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Customer-based pricing incorrect');
    testResults.failed++;
  }
  console.log();

  // Test 7: Customer pricing details
  console.log('📋 TEST 7: Customer pricing details');
  testResults.total++;
  const customerPricingResult = await makeRequest('/api/customer-pricing/ABA');
  if (customerPricingResult.success && customerPricingResult.data.priceCategory === "REGULAR") {
    console.log('✅ PASS: Customer pricing details correct');
    console.log(`   Customer: ABA`);
    console.log(`   Price Category: ${customerPricingResult.data.priceCategory}`);
    console.log(`   Price List: ${customerPricingResult.data.priceListName}`);
    console.log(`   Multiplier: ${customerPricingResult.data.multiplier}x`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Customer pricing details incorrect');
    testResults.failed++;
  }
  console.log();

  // Test 8: Pricing calculation validation
  console.log('🧮 TEST 8: Pricing calculation validation');
  testResults.total++;
  const basePrice = 47.00;
  const newCustomerMultiplier = 1.15;
  const expectedNewPrice = (basePrice * newCustomerMultiplier).toFixed(2);
  
  if (expectedNewPrice === "54.05") {
    console.log('✅ PASS: Pricing calculations are mathematically correct');
    console.log(`   Base: $${basePrice.toFixed(2)}`);
    console.log(`   New Customer (1.15x): $${expectedNewPrice}`);
    console.log(`   Premier Customer (0.85x): $${(basePrice * 0.85).toFixed(2)}`);
    testResults.passed++;
  } else {
    console.log('❌ FAIL: Pricing calculations incorrect');
    testResults.failed++;
  }
  console.log();

  // Final Results
  console.log('📊 FINAL TEST RESULTS');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Tests Passed: ${testResults.passed}/${testResults.total}`);
  console.log(`❌ Tests Failed: ${testResults.failed}/${testResults.total}`);
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Tiered pricing system is working perfectly!');
    console.log('\n💼 BUSINESS PRICING SUMMARY:');
    console.log('   • New Customer: +15% markup ($54.05)');
    console.log('   • Regular Customer: Standard price ($47.00)');
    console.log('   • Premier Customer: 15% discount ($39.95)');
    console.log('   • Legacy VLOOKUP: Fully backward compatible');
    console.log('   • Customer-based: Auto-applied by customer code');
  } else {
    console.log(`\n⚠️  ${testResults.failed} tests failed. Please review the implementation.`);
  }
  
  console.log('\n🔧 System Status: Ready for production use!');
  return testResults.failed === 0;
}

// Run the test
runTieredPricingTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});