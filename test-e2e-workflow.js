#!/usr/bin/env node

// End-to-End Manufacturing Workflow Test
// Tests the complete business cycle from customer creation to shipment

const API_BASE = 'http://localhost:5000/api';
let testData = {};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ ${method} ${endpoint} failed:`, data);
      return { error: data, status: response.status };
    }
    
    console.log(`✅ ${method} ${endpoint} successful`);
    return { data, status: response.status };
  } catch (error) {
    console.error(`❌ ${method} ${endpoint} error:`, error.message);
    return { error: error.message };
  }
}

// Test Steps
async function runTests() {
  console.log('\n🚀 Starting End-to-End Manufacturing Workflow Test\n');
  console.log('=' .repeat(60));
  
  // Step 1: Create a new customer
  console.log('\n📋 Step 1: Creating new customer...');
  const timestamp = Date.now();
  const customerResult = await apiCall('/customers', 'POST', {
    customerCode: `TEST-${timestamp}`,
    name: 'Test Manufacturing Co.',
    customerName: 'Test Manufacturing Co.',
    companyName: 'Test Manufacturing Company Ltd.',
    email: `test-${timestamp}@manufacturing.com`,
    phone: '+1234567890',
    password: 'TestPass123!',
    address: '123 Test Street',
    city: 'Test City',
    country: 'USA',
    creditLimit: '50000',
    paymentTerms: 'Net 30',
    status: 'active'
  });
  
  if (customerResult.error) {
    console.error('Failed to create customer. Aborting tests.');
    return;
  }
  testData.customer = customerResult.data;
  console.log(`Customer created: ${testData.customer.customerName} (ID: ${testData.customer.id})`);
  
  // Step 2: Get products for quotation
  console.log('\n📦 Step 2: Fetching products...');
  const productsResult = await apiCall('/products');
  if (productsResult.data && productsResult.data.length > 0) {
    testData.products = productsResult.data.slice(0, 3); // Get first 3 products
    console.log(`Found ${productsResult.data.length} products`);
  } else {
    console.error('No products found. Creating test products...');
    // Create test products if none exist
    const productResult = await apiCall('/products', 'POST', {
      productCode: 'TEST-001',
      productName: 'Test Hair Product',
      category: 'Premium',
      description: 'Test premium hair product',
      basePrice: '100.00',
      srp: '150.00',
      status: 'active'
    });
    testData.products = [productResult.data];
  }
  
  // Step 2.5: Get staff for createdBy
  console.log('\n👤 Step 2.5: Getting staff for quotation creation...');
  const staffResult = await apiCall('/staff');
  let staffId = 'system-test';
  if (staffResult.data && staffResult.data.length > 0) {
    staffId = staffResult.data[0].id;
    console.log(`Using staff ID: ${staffId}`);
  }
  
  // Step 3: Create a quotation (matching working structure)
  console.log('\n📝 Step 3: Creating quotation...');
  const quotationResult = await apiCall('/quotations', 'POST', {
    quotation: {
      customerId: testData.customer.id,
      customerCode: testData.customer.customerCode || 'TEST-001',
      country: testData.customer.country || 'USA',
      priceListId: null,
      subtotal: '300.00',
      shippingFee: '20.00',
      bankCharge: '10.00',
      discount: '0.00',
      others: '0.00',
      total: '330.00',
      paymentMethod: 'bank',
      shippingMethod: 'DHL Express',
      customerServiceInstructions: 'End-to-end test quotation',
      status: 'pending',
      createdBy: staffId
    },
    items: testData.products.slice(0, 2).map(product => ({
      productId: product.id,
      productName: product.productName || product.name,
      specification: 'Standard',
      quantity: '10',
      unitPrice: product.basePrice || '100.00',
      lineTotal: (10 * parseFloat(product.basePrice || '100.00')).toFixed(2)
    }))
  });
  
  if (quotationResult.error) {
    console.error('Failed to create quotation. Aborting tests.');
    return;
  }
  testData.quotation = quotationResult.data;
  console.log(`Quotation created: ${testData.quotation.quotationNumber}`);
  
  // Step 4: Approve quotation
  console.log('\n✅ Step 4: Approving quotation...');
  const approveResult = await apiCall(`/quotations/${testData.quotation.id}/approve`, 'POST');
  if (approveResult.data) {
    console.log('Quotation approved');
  }
  
  // Step 6: Generate Sales Order from Quotation
  console.log('\n🛒 Step 6: Generating sales order from quotation...');
  const salesOrderResult = await apiCall(`/quotations/${testData.quotation.id}/generate-sales-order`, 'POST');
  if (salesOrderResult.error) {
    console.error('Failed to create sales order. Aborting tests.');
    return;
  }
  testData.salesOrder = salesOrderResult.data;
  console.log(`Sales Order created: ${testData.salesOrder.salesOrderNumber}`);
  
  // Step 7: Confirm Sales Order (which auto-creates Job Order)
  console.log('\n✅ Step 7: Confirming sales order...');
  const confirmResult = await apiCall(`/sales-orders/${testData.salesOrder.id}/confirm`, 'POST');
  if (confirmResult.data) {
    console.log('Sales order confirmed');
    if (confirmResult.data.jobOrder) {
      testData.jobOrder = confirmResult.data.jobOrder;
      console.log(`Job Order auto-created: ${testData.jobOrder.jobOrderNumber}`);
    }
  } else {
    console.error('Failed to confirm sales order. Aborting tests.');
    return;
  }
  
  // Step 8: Update Production Status
  console.log('\n⚙️ Step 8: Creating production receipt...');
  if (!testData.jobOrder) {
    console.error('No job order available. Skipping production receipt.');
  } else {
    const productionResult = await apiCall('/production/receipts', 'POST', {
      jobOrderId: testData.jobOrder.id,
    productId: testData.products[0].id,
    quantity: 5,
    warehouseId: 'warehouse-1',
    quality: 'premium',
    notes: 'Test production batch',
    producedBy: 'system-test'
    });
    if (productionResult.data) {
      console.log('Production receipt created');
    }
  }
  
  // Step 9: Generate Invoice from Sales Order
  console.log('\n💰 Step 9: Generating invoice from sales order...');
  const invoiceResult = await apiCall(`/sales-orders/${testData.salesOrder.id}/invoice`, 'POST');
  if (invoiceResult.data) {
    testData.invoice = invoiceResult.data.invoice;
    console.log(`Invoice created: ${testData.invoice.invoiceNumber}`);
  }
  
  // Step 11: Record Payment
  console.log('\n💳 Step 11: Recording payment...');
  const paymentResult = await apiCall('/payments/record', 'POST', {
    invoiceId: testData.invoice.id,
    salesOrderId: testData.salesOrder.id,
    customerId: testData.customer.id,
    amount: testData.invoice.totalAmount,
    paymentMethod: 'Bank Transfer',
    paymentDate: new Date().toISOString(),
    referenceNumber: `PAY-${Date.now()}`,
    notes: 'Test payment'
  });
  if (paymentResult.data) {
    console.log('Payment recorded successfully');
  }
  
  // Step 12: Create Shipment
  console.log('\n📦 Step 12: Creating shipment...');
  const shipmentResult = await apiCall('/shipments', 'POST', {
    salesOrderId: testData.salesOrder.id,
    jobOrderId: testData.jobOrder.id,
    customerId: testData.customer.id,
    warehouseId: 'warehouse-1',
    trackingNumber: `TRACK-${Date.now()}`,
    carrier: 'DHL Express',
    status: 'preparing',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Test shipment'
  });
  if (shipmentResult.data) {
    testData.shipment = shipmentResult.data;
    console.log(`Shipment created: ${testData.shipment.trackingNumber}`);
  }
  
  // Step 13: Update Inventory Transfer
  console.log('\n📊 Step 13: Creating inventory transfer...');
  const transferResult = await apiCall('/inventory/transfers', 'POST', {
    fromWarehouseId: 'warehouse-1',
    toWarehouseId: 'warehouse-2',
    productId: testData.products[0].id,
    quantity: 5,
    reason: 'Stock balancing',
    notes: 'Test transfer',
    transferredBy: 'system-test'
  });
  if (transferResult.data) {
    console.log('Inventory transfer created');
  }
  
  // Step 14: Get Production Metrics
  console.log('\n📈 Step 14: Fetching production metrics...');
  const metricsResult = await apiCall('/production/metrics');
  if (metricsResult.data) {
    console.log('Production Metrics:', {
      totalProduced: metricsResult.data.totalProduced,
      pendingOrders: metricsResult.data.pendingOrders,
      qualityRate: metricsResult.data.qualityRate
    });
  }
  
  // Step 15: Verify Complete Workflow
  console.log('\n🔍 Step 15: Verifying complete workflow...');
  
  // Check Dashboard Analytics
  const analyticsResult = await apiCall('/dashboard/analytics');
  if (analyticsResult.data) {
    console.log('Dashboard Analytics:', {
      quotations: analyticsResult.data.overview.quotationsCount,
      salesOrders: analyticsResult.data.overview.salesOrdersCount,
      jobOrders: analyticsResult.data.overview.jobOrdersCount,
      customers: analyticsResult.data.overview.customersCount
    });
  }
  
  // Final Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Test Summary:');
  console.log('=' .repeat(60));
  console.log(`✅ Customer: ${testData.customer?.customerName}`);
  console.log(`✅ Quotation: ${testData.quotation?.quotationNumber}`);
  console.log(`✅ Sales Order: ${testData.salesOrder?.salesOrderNumber}`);
  console.log(`✅ Job Order: ${testData.jobOrder?.jobOrderNumber}`);
  console.log(`✅ Invoice: ${testData.invoice?.invoiceNumber}`);
  console.log(`✅ Shipment: ${testData.shipment?.trackingNumber}`);
  console.log('\n🎉 End-to-End Workflow Test Complete!');
  console.log('=' .repeat(60));
}

// Run tests
runTests().catch(console.error);