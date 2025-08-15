import { db } from "./db";
import {
  customers,
  products,
  categories,
  quotations,
  quotationItems,
  salesOrders,
  salesOrderItems,
  jobOrders,
  jobOrderItems,
  priceLists,
  warehouses,
  staff
} from "@shared/schema";
import { sql } from "drizzle-orm";

async function seedRealData() {
  console.log("🌱 Starting to seed real data into database...");
  
  try {
    // Clear existing demo data first (optional)
    console.log("Clearing existing demo data...");
    
    // 1. Seed Price Lists
    console.log("Seeding price lists...");
    await db.insert(priceLists).values([
      {
        id: 'price-list-001',
        name: 'New Customer',
        code: 'NEW',
        description: 'Pricing for new customers (+15% from base price)',
        priceMultiplier: '1.15',
        isDefault: false,
        isActive: true,
        displayOrder: 1
      },
      {
        id: 'price-list-002',
        name: 'Regular Customer',
        code: 'REGULAR',
        description: 'Standard pricing for regular customers',
        priceMultiplier: '1.00',
        isDefault: true,
        isActive: true,
        displayOrder: 2
      },
      {
        id: 'price-list-003',
        name: 'Premier Customer',
        code: 'PREMIER',
        description: 'Discounted pricing for premier customers (-15% from base price)',
        priceMultiplier: '0.85',
        isDefault: false,
        isActive: true,
        displayOrder: 3
      }
    ]).onConflictDoNothing();

    // 2. Seed Categories
    console.log("Seeding categories...");
    await db.insert(categories).values([
      {
        id: 'cat-001',
        name: 'Human Hair',
        slug: 'human-hair',
        description: 'Premium quality Filipino human hair',
        displayOrder: 1,
        isActive: true
      },
      {
        id: 'cat-002',
        name: 'Machine Weft',
        slug: 'machine-weft',
        description: 'Machine weft hair extensions',
        parentId: 'cat-001',
        displayOrder: 2,
        isActive: true
      },
      {
        id: 'cat-003',
        name: 'Hand Tied',
        slug: 'hand-tied',
        description: 'Hand tied hair extensions',
        parentId: 'cat-001',
        displayOrder: 3,
        isActive: true
      }
    ]).onConflictDoNothing();

    // 3. Seed Products
    console.log("Seeding products...");
    await db.insert(products).values([
      {
        id: 'prod-001',
        name: '8" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino human hair, straight texture, 8 inches',
        categoryId: 'cat-002',
        hairType: 'human',
        texture: 'straight',
        length: 8,
        color: 'Natural Black',
        weight: '100g',
        sku: 'MW-STR-8-NB',
        unit: 'pcs',
        basePrice: '25.00',
        srp: '40.00',
        ngWarehouse: '100',
        phWarehouse: '250',
        reservedWarehouse: '20',
        lowStockThreshold: '10',
        isActive: true
      },
      {
        id: 'prod-002',
        name: '12" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino human hair, straight texture, 12 inches',
        categoryId: 'cat-002',
        hairType: 'human',
        texture: 'straight',
        length: 12,
        color: 'Natural Black',
        weight: '100g',
        sku: 'MW-STR-12-NB',
        unit: 'pcs',
        basePrice: '35.00',
        srp: '55.00',
        ngWarehouse: '80',
        phWarehouse: '200',
        reservedWarehouse: '15',
        lowStockThreshold: '10',
        isActive: true
      },
      {
        id: 'prod-003',
        name: '16" Machine Weft Single Drawn, WAVY',
        description: 'Premium Filipino human hair, wavy texture, 16 inches',
        categoryId: 'cat-002',
        hairType: 'human',
        texture: 'wavy',
        length: 16,
        color: 'Natural Black',
        weight: '100g',
        sku: 'MW-WAV-16-NB',
        unit: 'pcs',
        basePrice: '45.00',
        srp: '70.00',
        ngWarehouse: '60',
        phWarehouse: '150',
        reservedWarehouse: '10',
        lowStockThreshold: '10',
        isActive: true
      },
      {
        id: 'prod-004',
        name: '20" Machine Weft Single Drawn, STRAIGHT',
        description: 'Premium Filipino human hair, straight texture, 20 inches',
        categoryId: 'cat-002',
        hairType: 'human',
        texture: 'straight',
        length: 20,
        color: 'Natural Black',
        weight: '100g',
        sku: 'MW-STR-20-NB',
        unit: 'pcs',
        basePrice: '55.00',
        srp: '85.00',
        ngWarehouse: '40',
        phWarehouse: '120',
        reservedWarehouse: '8',
        lowStockThreshold: '10',
        isActive: true
      },
      {
        id: 'prod-005',
        name: '24" Machine Weft Single Drawn, CURLY',
        description: 'Premium Filipino human hair, curly texture, 24 inches',
        categoryId: 'cat-002',
        hairType: 'human',
        texture: 'curly',
        length: 24,
        color: 'Natural Black',
        weight: '100g',
        sku: 'MW-CUR-24-NB',
        unit: 'pcs',
        basePrice: '65.00',
        srp: '100.00',
        ngWarehouse: '30',
        phWarehouse: '80',
        reservedWarehouse: '5',
        lowStockThreshold: '10',
        isActive: true
      }
    ]).onConflictDoNothing();

    // 4. Seed Customers
    console.log("Seeding customers...");
    await db.insert(customers).values([
      {
        id: 'cust-001',
        customerCode: 'ABC',
        name: 'ABC Beauty Supply',
        email: 'orders@abcbeauty.com',
        password: '$2b$10$YourHashedPasswordHere', // Password: abc123
        phone: '+1-555-0101',
        country: 'USA',
        city: 'Los Angeles',
        province: 'California',
        shippingAddress: '123 Beauty Blvd, Los Angeles, CA 90001',
        billingAddress: '123 Beauty Blvd, Los Angeles, CA 90001',
        priceCategory: 'REGULAR',
        priceListId: 'price-list-002',
        paymentTerms: 'NET30',
        creditLimit: '50000.00',
        preferredShipping: 'DHL',
        status: 'active'
      },
      {
        id: 'cust-002',
        customerCode: 'XYZ',
        name: 'XYZ Hair International',
        email: 'purchasing@xyzhair.com',
        password: '$2b$10$YourHashedPasswordHere', // Password: xyz123
        phone: '+1-555-0202',
        country: 'Canada',
        city: 'Toronto',
        province: 'Ontario',
        shippingAddress: '456 Hair Street, Toronto, ON M5V 3A8',
        billingAddress: '456 Hair Street, Toronto, ON M5V 3A8',
        priceCategory: 'PREMIER',
        priceListId: 'price-list-003',
        paymentTerms: 'NET60',
        creditLimit: '100000.00',
        preferredShipping: 'FedEx',
        status: 'active'
      },
      {
        id: 'cust-003',
        customerCode: 'MNO',
        name: 'MNO Salon Supplies',
        email: 'info@mnosalon.com',
        password: '$2b$10$YourHashedPasswordHere', // Password: mno123
        phone: '+61-555-0303',
        country: 'Australia',
        city: 'Sydney',
        province: 'NSW',
        shippingAddress: '789 Salon Ave, Sydney NSW 2000',
        billingAddress: '789 Salon Ave, Sydney NSW 2000',
        priceCategory: 'NEW',
        priceListId: 'price-list-001',
        paymentTerms: 'COD',
        creditLimit: '25000.00',
        preferredShipping: 'UPS',
        status: 'active'
      }
    ]).onConflictDoNothing();

    // 5. Seed Staff
    console.log("Seeding staff...");
    await db.insert(staff).values([
      {
        id: 'staff-001',
        name: 'Admin User',
        email: 'admin@hibla.com',
        password: '$2b$10$YourHashedPasswordHere', // Password: admin123
        role: 'admin',
        permissions: ['manage_products', 'manage_orders', 'view_reports', 'manage_users'],
        isActive: true
      },
      {
        id: 'staff-002',
        name: 'Sales Manager',
        email: 'manager@hibla.com',
        password: '$2b$10$YourHashedPasswordHere', // Password: manager123
        role: 'manager',
        permissions: ['manage_orders', 'view_reports'],
        isActive: true
      },
      {
        id: 'staff-003',
        name: 'Sales Staff',
        email: 'sales@hibla.com',
        password: '$2b$10$YourHashedPasswordHere', // Password: sales123
        role: 'staff',
        permissions: ['manage_orders'],
        isActive: true
      }
    ]).onConflictDoNothing();

    // 6. Seed Quotations
    console.log("Seeding quotations...");
    const currentDate = new Date();
    const quotationData = [
      {
        id: 'quot-001',
        quotationNumber: '2025.01.001',
        revisionNumber: 'R0',
        customerId: 'cust-001',
        customerCode: 'ABC',
        country: 'USA',
        priceListId: 'price-list-002',
        subtotal: '500.00',
        shippingFee: '50.00',
        bankCharge: '10.00',
        discount: '20.00',
        total: '540.00',
        paymentMethod: 'bank',
        shippingMethod: 'DHL',
        status: 'sent',
        createdBy: 'staff-002',
        createdByInitials: 'SM',
        validUntil: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        id: 'quot-002',
        quotationNumber: '2025.01.002',
        revisionNumber: 'R0',
        customerId: 'cust-002',
        customerCode: 'XYZ',
        country: 'Canada',
        priceListId: 'price-list-003',
        subtotal: '1200.00',
        shippingFee: '80.00',
        bankCharge: '15.00',
        discount: '60.00',
        total: '1235.00',
        paymentMethod: 'bank',
        shippingMethod: 'FedEx',
        status: 'accepted',
        createdBy: 'staff-002',
        createdByInitials: 'SM',
        validUntil: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'quot-003',
        quotationNumber: '2025.01.003',
        revisionNumber: 'R0',
        customerId: 'cust-003',
        customerCode: 'MNO',
        country: 'Australia',
        priceListId: 'price-list-001',
        subtotal: '350.00',
        shippingFee: '40.00',
        bankCharge: '8.00',
        discount: '0.00',
        total: '398.00',
        paymentMethod: 'cash',
        shippingMethod: 'UPS',
        status: 'draft',
        createdBy: 'staff-003',
        createdByInitials: 'SS',
        validUntil: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      }
    ];
    
    await db.insert(quotations).values(quotationData).onConflictDoNothing();

    // 7. Seed Quotation Items
    console.log("Seeding quotation items...");
    await db.insert(quotationItems).values([
      // Items for quotation 1
      {
        id: 'quot-item-001',
        quotationId: 'quot-001',
        productId: 'prod-001',
        productName: '8" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Natural Black, 100g',
        quantity: '10',
        unitPrice: '25.00',
        lineTotal: '250.00'
      },
      {
        id: 'quot-item-002',
        quotationId: 'quot-001',
        productId: 'prod-002',
        productName: '12" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Natural Black, 100g',
        quantity: '10',
        unitPrice: '35.00',
        lineTotal: '350.00'
      },
      // Items for quotation 2
      {
        id: 'quot-item-003',
        quotationId: 'quot-002',
        productId: 'prod-003',
        productName: '16" Machine Weft Single Drawn, WAVY',
        specification: 'Natural Black, 100g',
        quantity: '20',
        unitPrice: '38.25', // With premier discount
        lineTotal: '765.00'
      },
      {
        id: 'quot-item-004',
        quotationId: 'quot-002',
        productId: 'prod-004',
        productName: '20" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Natural Black, 100g',
        quantity: '10',
        unitPrice: '46.75', // With premier discount
        lineTotal: '467.50'
      },
      // Items for quotation 3
      {
        id: 'quot-item-005',
        quotationId: 'quot-003',
        productId: 'prod-001',
        productName: '8" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Natural Black, 100g',
        quantity: '5',
        unitPrice: '28.75', // With new customer markup
        lineTotal: '143.75'
      },
      {
        id: 'quot-item-006',
        quotationId: 'quot-003',
        productId: 'prod-005',
        productName: '24" Machine Weft Single Drawn, CURLY',
        specification: 'Natural Black, 100g',
        quantity: '3',
        unitPrice: '74.75', // With new customer markup
        lineTotal: '224.25'
      }
    ]).onConflictDoNothing();

    // 8. Seed Sales Orders (from accepted quotations)
    console.log("Seeding sales orders...");
    await db.insert(salesOrders).values([
      {
        id: 'so-001',
        salesOrderNumber: '2025.01.001',
        revisionNumber: 'R1',
        quotationId: 'quot-002',
        customerId: 'cust-002',
        customerCode: 'XYZ',
        country: 'Canada',
        dueDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        shippingMethod: 'FedEx',
        paymentMethod: 'bank',
        createdBy: 'SM',
        subtotal: '1200.00',
        shippingChargeUsd: '80.00',
        bankChargeUsd: '15.00',
        discountUsd: '60.00',
        pleasePayThisAmountUsd: '1235.00',
        status: 'confirmed',
        isConfirmed: true,
        confirmedAt: currentDate
      }
    ]).onConflictDoNothing();

    // 9. Seed Sales Order Items
    console.log("Seeding sales order items...");
    await db.insert(salesOrderItems).values([
      {
        id: 'so-item-001',
        salesOrderId: 'so-001',
        productId: 'prod-003',
        productName: '16" Machine Weft Single Drawn, WAVY',
        specification: 'Natural Black, 100g',
        quantity: '20',
        unitPrice: '38.25',
        lineTotal: '765.00'
      },
      {
        id: 'so-item-002',
        salesOrderId: 'so-001',
        productId: 'prod-004',
        productName: '20" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Natural Black, 100g',
        quantity: '10',
        unitPrice: '46.75',
        lineTotal: '467.50'
      }
    ]).onConflictDoNothing();

    // 10. Seed Job Orders (from confirmed sales orders)
    console.log("Seeding job orders...");
    await db.insert(jobOrders).values([
      {
        id: 'jo-001',
        jobOrderNumber: '2025.01.001',
        revisionNumber: 'R1',
        salesOrderId: 'so-001',
        customerId: 'cust-002',
        customerCode: 'XYZ',
        dueDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        createdBy: 'SM',
        orderInstructions: 'Please ensure proper packaging for international shipping'
      }
    ]).onConflictDoNothing();

    // 11. Seed Job Order Items
    console.log("Seeding job order items...");
    await db.insert(jobOrderItems).values([
      {
        id: 'jo-item-001',
        jobOrderId: 'jo-001',
        productName: '16" Machine Weft Single Drawn, WAVY',
        specification: 'Natural Black, 100g',
        quantity: '20',
        shipped: '0',
        orderBalance: '20'
      },
      {
        id: 'jo-item-002',
        jobOrderId: 'jo-001',
        productName: '20" Machine Weft Single Drawn, STRAIGHT',
        specification: 'Natural Black, 100g',
        quantity: '10',
        shipped: '0',
        orderBalance: '10'
      }
    ]).onConflictDoNothing();

    // 12. Seed Warehouses
    console.log("Seeding warehouses...");
    await db.insert(warehouses).values([
      {
        id: 'wh-001',
        name: 'NG Warehouse',
        code: 'NG',
        location: 'Nigeria',
        description: 'Main warehouse in Nigeria',
        capacity: '10000',
        currentStock: '5000',
        isActive: true
      },
      {
        id: 'wh-002',
        name: 'PH Warehouse',
        code: 'PH',
        location: 'Philippines',
        description: 'Main warehouse in Philippines',
        capacity: '20000',
        currentStock: '12000',
        isActive: true
      },
      {
        id: 'wh-003',
        name: 'Reserved Warehouse',
        code: 'RESERVED',
        location: 'Virtual',
        description: 'Reserved stock for confirmed orders',
        capacity: '5000',
        currentStock: '800',
        isActive: true
      },
      {
        id: 'wh-004',
        name: 'Ready Warehouse',
        code: 'RED',
        location: 'Virtual',
        description: 'Ready for shipment',
        capacity: '5000',
        currentStock: '300',
        isActive: true
      },
      {
        id: 'wh-005',
        name: 'Admin Warehouse',
        code: 'ADMIN',
        location: 'Virtual',
        description: 'Administrative stock control',
        capacity: '1000',
        currentStock: '50',
        isActive: true
      },
      {
        id: 'wh-006',
        name: 'WIP Warehouse',
        code: 'WIP',
        location: 'Virtual',
        description: 'Work in progress',
        capacity: '3000',
        currentStock: '150',
        isActive: true
      }
    ]).onConflictDoNothing();

    console.log("✅ Successfully seeded real data into database!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seedRealData()
  .then(() => {
    console.log("✅ Database seeding completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Database seeding failed:", err);
    process.exit(1);
  });