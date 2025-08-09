// Test VLOOKUP Price functionality
async function testVLOOKUP() {
  const productId = "1";
  const priceListId = "A";
  
  try {
    const response = await fetch(`http://localhost:5000/api/products/price-lookup?productId=${productId}&priceListId=${priceListId}`);
    const data = await response.json();
    console.log('VLOOKUP Test Result:', data);
  } catch (error) {
    console.error('VLOOKUP Test Failed:', error.message);
  }
}

testVLOOKUP();