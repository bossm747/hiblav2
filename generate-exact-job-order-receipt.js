// Generate exact Job Order receipt matching the PDF format
// JOB ORDER NO. 2025.08.001 R1

const exactJobOrderReceipt = {
  title: "JOB ORDER FORM",
  jobOrderNumber: "2025.08.001",
  revision: "R1",
  createdBy: "AAMA",
  productionDate: "",
  nameSignature: "",
  received: "",
  
  // Header information
  hairTag: "ABA",
  date: "August 01, 2025",
  dueDate: "August 30, 2025",
  
  // Order instructions exactly from PDF
  orderInstructions: [
    "Silky Bundles",
    "Brushed Back Closure/Frontal"
  ],
  
  // Exact order items with shipment tracking from PDF
  orderItems: [
    {
      orderItem: "8\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "0.1",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0.1",
      shipped: "0.2",
      reserved: "0.1",
      ready: "",
      toProduce: "0.8"
    },
    {
      orderItem: "10\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.6",
      shipments: {
        "1": "",
        "2": "0.1",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0.1",
      shipped: "0.2",
      reserved: "0.1",
      ready: "",
      toProduce: "0.4"
    },
    {
      orderItem: "16\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "0.2",
        "2": "",
        "3": "0.1",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0.3",
      shipped: "0.3",
      reserved: "0",
      ready: "",
      toProduce: "0.7"
    },
    {
      orderItem: "20\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.5",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "0.4",
      reserved: "0.4",
      ready: "",
      toProduce: "0.1"
    },
    {
      orderItem: "22\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.2",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "0.2"
    },
    {
      orderItem: "10\" Machine Weft, Double Drawn, Straight",
      specification: "",
      quantity: "0.1",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "0.1"
    },
    {
      orderItem: "18\" Machine Weft, Double Drawn, Straight",
      specification: "",
      quantity: "0.2",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "0.2"
    },
    {
      orderItem: "12\" Korean HD Lace Closure 2X6\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "1"
    },
    {
      orderItem: "12\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "1"
    },
    {
      orderItem: "20\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "1"
    },
    {
      orderItem: "22\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "1"
    },
    {
      orderItem: "22\" Korean HD Lace Frontal 9X6\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      shipments: {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": ""
      },
      orderBalance: "0",
      shipped: "",
      reserved: "",
      ready: "",
      toProduce: "1"
    }
  ]
};

// Calculate production summary
const totalQuantity = exactJobOrderReceipt.orderItems.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
const totalToProduce = exactJobOrderReceipt.orderItems.reduce((sum, item) => sum + parseFloat(item.toProduce || 0), 0);

console.log("🏭 EXACT JOB ORDER FORM - NO. 2025.08.001 R1");
console.log("===============================================");
console.log(`👨‍💼 CREATED BY: ${exactJobOrderReceipt.createdBy}`);
console.log(`📋 HAIR TAG: ${exactJobOrderReceipt.hairTag}`);
console.log(`📅 DATE: ${exactJobOrderReceipt.date}`);
console.log(`📅 DUE DATE: ${exactJobOrderReceipt.dueDate}`);
console.log("");
console.log("📝 ORDER INSTRUCTIONS:");
exactJobOrderReceipt.orderInstructions.forEach(instruction => {
  console.log(`• ${instruction}`);
});
console.log("");
console.log("📦 PRODUCTION ITEMS WITH SHIPMENT TRACKING:");
console.log("==========================================");

exactJobOrderReceipt.orderItems.forEach((item, index) => {
  console.log(`${index + 1}. ${item.orderItem}`);
  console.log(`   Quantity: ${item.quantity} | To Produce: ${item.toProduce} | Shipped: ${item.shipped || '0'} | Reserved: ${item.reserved || '0'}`);
  
  // Show shipment columns that have values
  const shipmentValues = Object.entries(item.shipments).filter(([key, value]) => value !== "");
  if (shipmentValues.length > 0) {
    console.log(`   Shipments: ${shipmentValues.map(([key, value]) => `${key}=${value}`).join(', ')}`);
  }
});

console.log("");
console.log("📊 PRODUCTION SUMMARY:");
console.log("=====================");
console.log(`Total Order Quantity: ${totalQuantity.toFixed(1)}`);
console.log(`Total To Produce: ${totalToProduce.toFixed(1)}`);
console.log(`Production Progress: ${((totalQuantity - totalToProduce) / totalQuantity * 100).toFixed(1)}%`);
console.log("");
console.log("✅ JOB ORDER STATUS: IN PRODUCTION");
console.log("📋 Matching Sales Order: 2025.08.001 R1");
console.log("👤 Customer: ABA Hair International");

export default exactJobOrderReceipt;