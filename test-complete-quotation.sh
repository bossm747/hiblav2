#!/bin/bash

echo "Testing Complete Quotation Workflow..."

# Test 1: VLOOKUP Price Lookup
echo "1. Testing VLOOKUP Price Lookup..."
curl -X GET "http://localhost:5000/api/products/price-lookup?productId=1&priceListId=A"
echo ""

# Test 2: Create New Quotation with VLOOKUP Data
echo "2. Creating quotation with VLOOKUP prices..."
QUOTATION_RESPONSE=$(curl -X POST http://localhost:5000/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "quotation": {
      "customerCode": "VLOOKUP_CLIENT_001",
      "country": "Philippines", 
      "priceListId": "A",
      "paymentMethod": "bank",
      "shippingMethod": "DHL",
      "subtotal": "150.00",
      "total": "150.00"
    },
    "items": [
      {
        "productId": "1",
        "productName": "Test Filipino Hair Bundle",
        "quantity": "3",
        "unitPrice": "50.00",
        "lineTotal": "150.00"
      }
    ]
  }')

echo $QUOTATION_RESPONSE
echo ""

# Test 3: List All Quotations
echo "3. Listing all quotations..."
curl -X GET "http://localhost:5000/api/quotations" | jq 'length'
echo ""

echo "Complete workflow test finished."