// Generate exact Sales Order receipt matching the PDF format
// Sales Order NO. 2025.08.001 R1

const exactSalesOrderReceipt = {
  salesOrderNumber: "2025.08.001",
  revision: "R1",
  hairTag: "ABA",
  orderDate: "August 01, 2025", 
  dueDate: "August 30, 2025",
  shippingMethod: "DHL",
  methodOfPayment: "bank",
  createdBy: "AAMA",
  
  // Exact order items from PDF with precise quantities and prices
  items: [
    {
      orderItem: "8\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "1",
      unitPrice: "120.00",
      lineTotal: "120.00"
    },
    {
      orderItem: "10\" Machine Weft Single Drawn, STRAIGHT", 
      specification: "",
      quantity: "0.6",
      unitPrice: "130.00",
      lineTotal: "78.00"
    },
    {
      orderItem: "16\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "1", 
      unitPrice: "140.00",
      lineTotal: "140.00"
    },
    {
      orderItem: "20\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.5",
      unitPrice: "150.00", 
      lineTotal: "75.00"
    },
    {
      orderItem: "22\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.2",
      unitPrice: "80.00",
      lineTotal: "16.00"
    },
    {
      orderItem: "10\" Machine Weft, Double Drawn, Straight",
      specification: "",
      quantity: "0.1", 
      unitPrice: "90.00",
      lineTotal: "9.00"
    },
    {
      orderItem: "18\" Machine Weft, Double Drawn, Straight",
      specification: "",
      quantity: "0.2",
      unitPrice: "70.00",
      lineTotal: "14.00"
    },
    {
      orderItem: "12\" Korean HD Lace Closure 2X6\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "45.00", 
      lineTotal: "45.00"
    },
    {
      orderItem: "12\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "100.00",
      lineTotal: "100.00"
    },
    {
      orderItem: "20\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)", 
      specification: "",
      quantity: "1",
      unitPrice: "100.00",
      lineTotal: "100.00"
    },
    {
      orderItem: "22\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "120.00",
      lineTotal: "120.00"
    },
    {
      orderItem: "22\" Korean HD Lace Frontal 9X6\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1", 
      unitPrice: "130.00",
      lineTotal: "130.00"
    }
  ],
  
  // Exact financial totals from PDF
  subtotal: "947.00",
  shippingChargeUsd: "35.00",
  bankChargeUsd: "50.00", 
  discountUsd: "(15.00)", // Shown as negative/discount
  others: "70.00",
  pleasePayThisAmountUsd: "1087.00", // Final amount to pay
  
  // Customer service instructions from PDF
  customerServiceInstructions: [
    "Silky Bundles",
    "Brushed Back Closure/Frontal"
  ]
};

// Calculate verification
const calculatedSubtotal = exactSalesOrderReceipt.items.reduce((sum, item) => sum + parseFloat(item.lineTotal), 0);
const finalAmount = calculatedSubtotal + 35 + 50 - 15 + 70;

console.log("🧾 EXACT SALES ORDER RECEIPT - NO. 2025.08.001 R1");
console.log("==================================================");
console.log(`📋 HAIR TAG: ${exactSalesOrderReceipt.hairTag}`);
console.log(`📅 ORDER DATE: ${exactSalesOrderReceipt.orderDate}`); 
console.log(`📅 DUE DATE: ${exactSalesOrderReceipt.dueDate}`);
console.log(`🚚 SHIPPING METHOD: ${exactSalesOrderReceipt.shippingMethod}`);
console.log(`💳 METHOD OF PAYMENT: ${exactSalesOrderReceipt.methodOfPayment}`);
console.log(`👨‍💼 CREATED BY: ${exactSalesOrderReceipt.createdBy}`);
console.log("");
console.log("📦 ORDER ITEMS:");
console.log("=============");

exactSalesOrderReceipt.items.forEach((item, index) => {
  console.log(`${index + 1}. ${item.orderItem}`);
  console.log(`   Quantity: ${item.quantity} | Unit Price: $${item.unitPrice} | Line Total: $${item.lineTotal}`);
});

console.log("");
console.log("💰 FINANCIAL SUMMARY:");
console.log("====================");
console.log(`Sub Total: $${exactSalesOrderReceipt.subtotal}`);
console.log(`Shipping Charge USD: $${exactSalesOrderReceipt.shippingChargeUsd}`); 
console.log(`Bank Charge USD: $${exactSalesOrderReceipt.bankChargeUsd}`);
console.log(`Discount USD: ${exactSalesOrderReceipt.discountUsd}`);
console.log(`Others: $${exactSalesOrderReceipt.others}`);
console.log(`PLEASE PAY THIS AMOUNT USD: $${exactSalesOrderReceipt.pleasePayThisAmountUsd}`);
console.log("");
console.log("📝 CUSTOMER SERVICE INSTRUCTIONS:");
exactSalesOrderReceipt.customerServiceInstructions.forEach(instruction => {
  console.log(`• ${instruction}`);
});
console.log("");
console.log("✅ VERIFICATION:");
console.log(`Calculated Subtotal: $${calculatedSubtotal.toFixed(2)}`);
console.log(`Calculated Final Amount: $${finalAmount.toFixed(2)}`);
console.log(`PDF Final Amount: $${exactSalesOrderReceipt.pleasePayThisAmountUsd}`);
console.log(`✅ Match: ${finalAmount.toFixed(2) === exactSalesOrderReceipt.pleasePayThisAmountUsd ? "YES" : "NO"}`);

module.exports = exactSalesOrderReceipt;