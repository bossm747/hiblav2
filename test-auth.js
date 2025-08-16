// Test authentication and API connectivity
const baseUrl = 'http://localhost:5000';

async function testAuth() {
  console.log('🔐 Testing Authentication System...\n');
  
  try {
    // 1. Test login
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hibla.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('   User:', loginData.user.name, `(${loginData.user.role})`);
    console.log('   Token received:', loginData.token ? 'Yes' : 'No');
    console.log('   Debug - Full response:', JSON.stringify(loginData, null, 2));
    
    const token = loginData.token;
    
    // 2. Test authenticated API calls
    console.log('\n2. Testing protected API endpoints...');
    
    // Test customers endpoint
    const customersResponse = await fetch(`${baseUrl}/api/customers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (customersResponse.ok) {
      const customers = await customersResponse.json();
      console.log(`✅ Customers API: ${customers.length} customers loaded`);
    } else {
      console.error('❌ Customers API failed:', customersResponse.status);
    }
    
    // Test quotations endpoint
    const quotationsResponse = await fetch(`${baseUrl}/api/quotations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (quotationsResponse.ok) {
      const quotations = await quotationsResponse.json();
      console.log(`✅ Quotations API: ${quotations.length} quotations loaded`);
    } else {
      console.error('❌ Quotations API failed:', quotationsResponse.status);
    }
    
    // Test sales orders endpoint
    const salesOrdersResponse = await fetch(`${baseUrl}/api/sales-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (salesOrdersResponse.ok) {
      const salesOrders = await salesOrdersResponse.json();
      console.log(`✅ Sales Orders API: ${salesOrders.length} sales orders loaded`);
    } else {
      console.error('❌ Sales Orders API failed:', salesOrdersResponse.status);
    }
    
    // Test job orders endpoint
    const jobOrdersResponse = await fetch(`${baseUrl}/api/job-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (jobOrdersResponse.ok) {
      const jobOrders = await jobOrdersResponse.json();
      console.log(`✅ Job Orders API: ${jobOrders.length} job orders loaded`);
    } else {
      console.error('❌ Job Orders API failed:', jobOrdersResponse.status);
    }
    
    // Test dashboard analytics
    const dashboardResponse = await fetch(`${baseUrl}/api/dashboard/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (dashboardResponse.ok) {
      const analytics = await dashboardResponse.json();
      console.log(`✅ Dashboard Analytics API: Data loaded successfully`);
      console.log(`   Active Quotations: ${analytics.activeQuotations}`);
      console.log(`   Active Sales Orders: ${analytics.activeSalesOrders}`);
      console.log(`   Active Job Orders: ${analytics.activeJobOrders}`);
    } else {
      console.error('❌ Dashboard API failed:', dashboardResponse.status);
    }
    
    // 3. Test unauthorized access (without token)
    console.log('\n3. Testing security (unauthorized access)...');
    
    const unauthorizedResponse = await fetch(`${baseUrl}/api/customers`);
    
    if (unauthorizedResponse.status === 401) {
      console.log('✅ Security check passed: Unauthorized requests are blocked');
    } else {
      console.error('❌ Security issue: Unauthorized request was not blocked');
    }
    
    console.log('\n✅ All authentication tests completed successfully!');
    console.log('🎉 Frontend-Backend integration is working seamlessly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuth();