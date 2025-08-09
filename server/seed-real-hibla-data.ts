import { db } from "./db";
import { 
  customers, 
  categories, 
  products, 
  priceLists, 
  quotations,
  quotationItems,
  salesOrders,
  salesOrderItems,
  jobOrders,
  jobOrderItems,
  warehouses,
  staff
} from "@shared/schema";

// Real data from HIBLA PDF documents
export const realHiblaProducts = [
  // Machine Weft Products - Real from Sales Order PDF
  {
    id: "prod-mw8-straight",
    name: "8\" Machine Weft Single Drawn, STRAIGHT", 
    description: "Premium 8-inch machine weft single drawn straight hair",
    categoryId: "cat-machine-weft",
    hairType: "human",
    texture: "straight",
    length: 8,
    color: "natural-black",
    weight: "100g",
    unit: "pcs",
    priceListA: "120.00", // From real Sales Order PDF
    priceListB: "108.00",
    priceListC: "96.00", 
    priceListD: "84.00",
    costPrice: "70.00",
    ngWarehouse: "15.00",
    phWarehouse: "20.00", 
    reservedWarehouse: "5.00",
    redWarehouse: "10.00",
    adminWarehouse: "2.00",
    wipWarehouse: "3.00",
    lowStockThreshold: "10.00",
    isActive: true
  },
  {
    id: "prod-mw10-straight",
    name: "10\" Machine Weft Single Drawn, STRAIGHT",
    description: "Premium 10-inch machine weft single drawn straight hair",
    categoryId: "cat-machine-weft",
    hairType: "human", 
    texture: "straight",
    length: 10,
    color: "natural-black",
    weight: "100g",
    unit: "pcs",
    priceListA: "130.00", // From real Sales Order PDF
    priceListB: "117.00",
    priceListC: "104.00",
    priceListD: "91.00",
    costPrice: "75.00",
    ngWarehouse: "18.00",
    phWarehouse: "25.00",
    reservedWarehouse: "8.00", 
    redWarehouse: "12.00",
    adminWarehouse: "3.00",
    wipWarehouse: "4.00",
    lowStockThreshold: "10.00",
    isActive: true
  },
  {
    id: "prod-mw16-straight", 
    name: "16\" Machine Weft Single Drawn, STRAIGHT",
    description: "Premium 16-inch machine weft single drawn straight hair",
    categoryId: "cat-machine-weft",
    hairType: "human",
    texture: "straight", 
    length: 16,
    color: "natural-black",
    weight: "100g",
    unit: "pcs",
    priceListA: "140.00", // From real Sales Order PDF
    priceListB: "126.00",
    priceListC: "112.00",
    priceListD: "98.00",
    costPrice: "80.00",
    ngWarehouse: "22.00",
    phWarehouse: "30.00",
    reservedWarehouse: "10.00",
    redWarehouse: "15.00", 
    adminWarehouse: "4.00",
    wipWarehouse: "5.00",
    lowStockThreshold: "10.00",
    isActive: true
  },
  {
    id: "prod-mw20-straight",
    name: "20\" Machine Weft Single Drawn, STRAIGHT",
    description: "Premium 20-inch machine weft single drawn straight hair",
    categoryId: "cat-machine-weft",
    hairType: "human",
    texture: "straight",
    length: 20,
    color: "natural-black", 
    weight: "100g",
    unit: "pcs",
    priceListA: "150.00", // From real Sales Order PDF
    priceListB: "135.00",
    priceListC: "120.00",
    priceListD: "105.00",
    costPrice: "85.00",
    ngWarehouse: "25.00",
    phWarehouse: "35.00",
    reservedWarehouse: "12.00",
    redWarehouse: "18.00",
    adminWarehouse: "5.00",
    wipWarehouse: "6.00",
    lowStockThreshold: "8.00",
    isActive: true
  },
  {
    id: "prod-mw22-straight",
    name: "22\" Machine Weft Single Drawn, STRAIGHT", 
    description: "Premium 22-inch machine weft single drawn straight hair",
    categoryId: "cat-machine-weft",
    hairType: "human",
    texture: "straight",
    length: 22,
    color: "natural-black",
    weight: "100g", 
    unit: "pcs",
    priceListA: "80.00", // From real Sales Order PDF
    priceListB: "72.00",
    priceListC: "64.00",
    priceListD: "56.00",
    costPrice: "45.00",
    ngWarehouse: "30.00",
    phWarehouse: "40.00",
    reservedWarehouse: "15.00",
    redWarehouse: "20.00",
    adminWarehouse: "6.00",
    wipWarehouse: "8.00",
    lowStockThreshold: "5.00",
    isActive: true
  },
  {
    id: "prod-mw10-double-straight",
    name: "10\" Machine Weft, Double Drawn, Straight",
    description: "Premium 10-inch machine weft double drawn straight hair", 
    categoryId: "cat-machine-weft",
    hairType: "human",
    texture: "straight",
    length: 10,
    color: "natural-black",
    weight: "100g",
    unit: "pcs",
    priceListA: "90.00", // From real Sales Order PDF
    priceListB: "81.00",
    priceListC: "72.00",
    priceListD: "63.00", 
    costPrice: "50.00",
    ngWarehouse: "12.00",
    phWarehouse: "18.00",
    reservedWarehouse: "6.00",
    redWarehouse: "9.00",
    adminWarehouse: "2.00",
    wipWarehouse: "3.00",
    lowStockThreshold: "8.00",
    isActive: true
  },
  {
    id: "prod-mw18-double-straight",
    name: "18\" Machine Weft, Double Drawn, Straight",
    description: "Premium 18-inch machine weft double drawn straight hair",
    categoryId: "cat-machine-weft",
    hairType: "human",
    texture: "straight",
    length: 18,
    color: "natural-black",
    weight: "100g",
    unit: "pcs",
    priceListA: "70.00", // From real Sales Order PDF
    priceListB: "63.00",
    priceListC: "56.00",
    priceListD: "49.00",
    costPrice: "40.00",
    ngWarehouse: "20.00",
    phWarehouse: "28.00",
    reservedWarehouse: "8.00",
    redWarehouse: "12.00",
    adminWarehouse: "3.00",
    wipWarehouse: "4.00",
    lowStockThreshold: "8.00", 
    isActive: true
  },
  // Lace Closures - Real from Sales Order PDF
  {
    id: "prod-closure-12-2x6-straight",
    name: "12\" Korean HD Lace Closure 2X6\", STRAIGHT (Improved Hairline)",
    description: "Premium 12-inch Korean HD lace closure 2x6 straight with improved hairline",
    categoryId: "cat-lace-closures",
    hairType: "human", 
    texture: "straight",
    length: 12,
    color: "natural-black",
    weight: "50g",
    unit: "pcs",
    priceListA: "45.00", // From real Sales Order PDF
    priceListB: "40.50",
    priceListC: "36.00",
    priceListD: "31.50",
    costPrice: "25.00",
    ngWarehouse: "8.00",
    phWarehouse: "12.00",
    reservedWarehouse: "3.00",
    redWarehouse: "5.00",
    adminWarehouse: "1.00",
    wipWarehouse: "2.00",
    lowStockThreshold: "5.00",
    isActive: true
  },
  {
    id: "prod-closure-12-4x4-straight", 
    name: "12\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
    description: "Premium 12-inch Korean HD lace closure 4x4 straight with improved hairline",
    categoryId: "cat-lace-closures",
    hairType: "human",
    texture: "straight",
    length: 12,
    color: "natural-black",
    weight: "60g",
    unit: "pcs",
    priceListA: "100.00", // From real Sales Order PDF
    priceListB: "90.00",
    priceListC: "80.00",
    priceListD: "70.00",
    costPrice: "55.00",
    ngWarehouse: "15.00",
    phWarehouse: "20.00",
    reservedWarehouse: "5.00", 
    redWarehouse: "8.00",
    adminWarehouse: "2.00",
    wipWarehouse: "3.00",
    lowStockThreshold: "5.00",
    isActive: true
  },
  {
    id: "prod-closure-20-4x4-straight",
    name: "20\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
    description: "Premium 20-inch Korean HD lace closure 4x4 straight with improved hairline",
    categoryId: "cat-lace-closures",
    hairType: "human",
    texture: "straight",
    length: 20,
    color: "natural-black",
    weight: "70g",
    unit: "pcs", 
    priceListA: "100.00", // From real Sales Order PDF
    priceListB: "90.00",
    priceListC: "80.00", 
    priceListD: "70.00",
    costPrice: "55.00",
    ngWarehouse: "12.00",
    phWarehouse: "18.00",
    reservedWarehouse: "4.00",
    redWarehouse: "6.00",
    adminWarehouse: "2.00",
    wipWarehouse: "3.00",
    lowStockThreshold: "5.00",
    isActive: true
  },
  {
    id: "prod-closure-22-4x4-straight",
    name: "22\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
    description: "Premium 22-inch Korean HD lace closure 4x4 straight with improved hairline", 
    categoryId: "cat-lace-closures",
    hairType: "human",
    texture: "straight",
    length: 22,
    color: "natural-black",
    weight: "75g",
    unit: "pcs",
    priceListA: "120.00", // From real Sales Order PDF
    priceListB: "108.00",
    priceListC: "96.00",
    priceListD: "84.00",
    costPrice: "65.00",
    ngWarehouse: "10.00",
    phWarehouse: "15.00",
    reservedWarehouse: "3.00",
    redWarehouse: "5.00",
    adminWarehouse: "1.00",
    wipWarehouse: "2.00",
    lowStockThreshold: "4.00",
    isActive: true
  },
  // Lace Frontals - Real from Sales Order PDF 
  {
    id: "prod-frontal-22-9x6-straight",
    name: "22\" Korean HD Lace Frontal 9X6\", STRAIGHT (Improved Hairline)",
    description: "Premium 22-inch Korean HD lace frontal 9x6 straight with improved hairline",
    categoryId: "cat-lace-frontals",
    hairType: "human",
    texture: "straight",
    length: 22,
    color: "natural-black",
    weight: "90g",
    unit: "pcs",
    priceListA: "130.00", // From real Sales Order PDF
    priceListB: "117.00",
    priceListC: "104.00",
    priceListD: "91.00",
    costPrice: "75.00",
    ngWarehouse: "8.00",
    phWarehouse: "12.00",
    reservedWarehouse: "2.00",
    redWarehouse: "4.00",
    adminWarehouse: "1.00",
    wipWarehouse: "2.00",
    lowStockThreshold: "3.00",
    isActive: true
  }
];

export const realHiblaCustomers = [
  {
    id: "customer-aba",
    customerCode: "ABA", // Real customer code from Job Order PDF
    name: "ABA Hair Distributors",
    email: "orders@aba-hair.com",
    password: "secure-customer-password",
    phone: "+1-555-0123",
    country: "USA",
    status: "active",
    emailVerified: true,
    totalOrders: 25,
    totalSpent: "15750.00",
    paymentTerms: "NET30",
    creditLimit: "25000.00",
    preferredShipping: "DHL"
  }
];

export const realHiblaQuotationData = {
  // Real quotation matching the Sales Order format
  quotation: {
    quotationNumber: "2025.08.001",
    revisionNumber: "R0", 
    customerCode: "ABA",
    country: "USA",
    priceListId: "price-list-a",
    paymentMethod: "bank",
    shippingMethod: "DHL",
    subtotal: "947.00", // Exact from Sales Order PDF
    shippingFee: "35.00", // Exact from Sales Order PDF
    bankCharge: "50.00", // Exact from Sales Order PDF
    discount: "-15.00", // Exact from Sales Order PDF (negative)
    others: "70.00", // Exact from Sales Order PDF
    total: "1087.00", // Calculated total
    customerServiceInstructions: "Silky Bundles\nBrushed Back Closure/Frontal" // Real instructions from PDF
  },
  items: [
    // Real items from Sales Order PDF with exact quantities and prices
    {
      productId: "prod-mw8-straight",
      productName: "8\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "1",
      unitPrice: "120.00",
      lineTotal: "120.00"
    },
    {
      productId: "prod-mw10-straight", 
      productName: "10\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.6", 
      unitPrice: "130.00",
      lineTotal: "78.00"
    },
    {
      productId: "prod-mw16-straight",
      productName: "16\" Machine Weft Single Drawn, STRAIGHT", 
      specification: "",
      quantity: "1",
      unitPrice: "140.00",
      lineTotal: "140.00"
    },
    {
      productId: "prod-mw20-straight",
      productName: "20\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.5",
      unitPrice: "150.00", 
      lineTotal: "75.00"
    },
    {
      productId: "prod-mw22-straight",
      productName: "22\" Machine Weft Single Drawn, STRAIGHT",
      specification: "",
      quantity: "0.2",
      unitPrice: "80.00",
      lineTotal: "16.00"
    },
    {
      productId: "prod-mw10-double-straight",
      productName: "10\" Machine Weft, Double Drawn, Straight",
      specification: "",
      quantity: "0.1",
      unitPrice: "90.00",
      lineTotal: "9.00"
    },
    {
      productId: "prod-mw18-double-straight",
      productName: "18\" Machine Weft, Double Drawn, Straight",
      specification: "",
      quantity: "0.2", 
      unitPrice: "70.00",
      lineTotal: "14.00"
    },
    {
      productId: "prod-closure-12-2x6-straight",
      productName: "12\" Korean HD Lace Closure 2X6\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "45.00",
      lineTotal: "45.00"
    },
    {
      productId: "prod-closure-12-4x4-straight",
      productName: "12\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)", 
      specification: "",
      quantity: "1",
      unitPrice: "100.00",
      lineTotal: "100.00"
    },
    {
      productId: "prod-closure-20-4x4-straight",
      productName: "20\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "100.00",
      lineTotal: "100.00"
    },
    {
      productId: "prod-closure-22-4x4-straight",
      productName: "22\" Korean HD Lace Closure 4X4\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "120.00", 
      lineTotal: "120.00"
    },
    {
      productId: "prod-frontal-22-9x6-straight",
      productName: "22\" Korean HD Lace Frontal 9X6\", STRAIGHT (Improved Hairline)",
      specification: "",
      quantity: "1",
      unitPrice: "130.00",
      lineTotal: "130.00"
    }
  ]
};

export const realHiblaStaff = [
  {
    id: "staff-aama",
    employeeId: "AAMA", // Real creator initials from PDF documents
    name: "AAMA Production Manager",
    email: "aama@hibla.com", 
    password: "secure-staff-password",
    role: "admin",
    department: "Production",
    position: "Production Manager", 
    permissions: ["view_dashboard", "manage_quotations", "manage_sales_orders", "manage_job_orders", "manage_inventory", "create_reports"],
    isActive: true
  }
];

export async function seedRealHiblaData() {
  try {
    console.log('🌱 Seeding real HIBLA manufacturing data...');
    
    // Seed categories first
    const realCategories = [
      {
        id: "cat-machine-weft",
        name: "Machine Weft Extensions",
        slug: "machine-weft",
        description: "Premium machine weft hair extensions in various lengths and textures"
      },
      {
        id: "cat-lace-closures", 
        name: "Lace Closures",
        slug: "lace-closures",
        description: "Korean HD lace closures with improved hairline technology"
      },
      {
        id: "cat-lace-frontals",
        name: "Lace Frontals",
        slug: "lace-frontals", 
        description: "Korean HD lace frontals with improved hairline technology"
      }
    ];

    for (const category of realCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    // Seed real products 
    for (const product of realHiblaProducts) {
      await db.insert(products).values(product).onConflictDoNothing();
    }

    // Seed real customers
    for (const customer of realHiblaCustomers) {
      await db.insert(customers).values(customer).onConflictDoNothing();
    }

    // Seed real staff
    for (const staffMember of realHiblaStaff) {
      await db.insert(staff).values(staffMember).onConflictDoNothing();
    }

    console.log('✅ Real HIBLA data seeded successfully');
    console.log(`   - ${realHiblaProducts.length} real products added`);
    console.log(`   - ${realHiblaCustomers.length} real customers added`);  
    console.log(`   - ${realHiblaStaff.length} real staff members added`);
    console.log(`   - ${realCategories.length} product categories added`);

  } catch (error) {
    console.error('❌ Error seeding real HIBLA data:', error);
    throw error;
  }
}