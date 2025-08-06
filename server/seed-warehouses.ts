import { db } from "./db";
import { warehouses, staff, inventoryTransactions, products } from "@shared/schema";

export async function seedWarehouses() {
  try {
    console.log("🏭 Seeding warehouses...");

    // Check if warehouses already exist
    const existingWarehouses = await db.select().from(warehouses).limit(1);
    if (existingWarehouses.length > 0) {
      console.log("📦 Warehouses already exist, skipping...");
      return;
    }

    // Get or create a default staff member for manager reference
    let defaultStaff = await db.select().from(staff).limit(1);
    if (defaultStaff.length === 0) {
      // Create a default custodian staff member
      const [newStaff] = await db.insert(staff).values({
        name: "System Custodian",
        email: "custodian@hibla.com",
        password: "hashed_password", // In real app, this would be properly hashed
        role: "custodian",
        permissions: ["manage_warehouse", "view_inventory", "manage_inventory"]
      }).returning();
      defaultStaff = [newStaff];
    }

    const managerId = defaultStaff[0].id;

    // Create the 6 warehouses as per client requirements
    const warehouseData = [
      {
        code: "NG",
        name: "NG Warehouse",
        description: "Main Nigeria distribution center for African market operations",
        managerId: managerId,
        isActive: true
      },
      {
        code: "PH", 
        name: "PH Warehouse",
        description: "Philippines production facility and Asia-Pacific distribution hub",
        managerId: managerId,
        isActive: true
      },
      {
        code: "RESERVED",
        name: "Reserved Warehouse", 
        description: "Stock reserved for confirmed sales orders and allocated inventory",
        managerId: managerId,
        isActive: true
      },
      {
        code: "RED",
        name: "Red Warehouse",
        description: "Quality control, returns processing, and damaged goods handling",
        managerId: managerId,
        isActive: true
      },
      {
        code: "ADMIN",
        name: "Admin Warehouse",
        description: "Administrative inventory, samples, and internal use products",
        managerId: managerId,
        isActive: true
      },
      {
        code: "WIP",
        name: "WIP Warehouse",
        description: "Work in Progress inventory for manufacturing and processing",
        managerId: managerId,
        isActive: true
      }
    ];

    // Insert warehouse records
    const createdWarehouses = await db.insert(warehouses).values(warehouseData).returning();
    
    console.log(`✅ Created ${createdWarehouses.length} warehouses:`);
    createdWarehouses.forEach(warehouse => {
      console.log(`   - ${warehouse.name} (${warehouse.code})`);
    });

    // Add some sample inventory transactions to demonstrate warehouse movements
    const existingProducts = await db.select().from(products).limit(3);
    
    if (existingProducts.length > 0) {
      const sampleTransactions = [
        {
          productId: existingProducts[0].id,
          warehouseId: createdWarehouses.find(w => w.code === 'PH')?.id!,
          movementType: "deposit" as const,
          quantity: "100.00",
          unitCost: "25.50",
          totalCost: "2550.00",
          reason: "Initial stock receipt from production",
          reference: "PROD-2025-001",
          referenceType: "production" as const,
          staffId: managerId
        },
        {
          productId: existingProducts[0].id,
          warehouseId: createdWarehouses.find(w => w.code === 'RESERVED')?.id!,
          movementType: "deposit" as const,
          quantity: "25.00",
          unitCost: "25.50",
          totalCost: "637.50",
          reason: "Reserved for sales order SO-2025-001",
          reference: "SO-2025-001",
          referenceType: "sales_order" as const,
          fromWarehouseId: createdWarehouses.find(w => w.code === 'PH')?.id!,
          staffId: managerId
        },
        {
          productId: existingProducts[1].id,
          warehouseId: createdWarehouses.find(w => w.code === 'NG')?.id!,
          movementType: "deposit" as const,
          quantity: "75.00",
          unitCost: "32.00",
          totalCost: "2400.00",
          reason: "Stock transfer for Nigeria distribution",
          reference: "TRF-2025-001",
          referenceType: "transfer" as const,
          fromWarehouseId: createdWarehouses.find(w => w.code === 'PH')?.id!,
          staffId: managerId
        }
      ];

      await db.insert(inventoryTransactions).values(sampleTransactions);
      console.log(`✅ Created ${sampleTransactions.length} sample inventory transactions`);
    }

    console.log("🏭 Warehouse seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding warehouses:", error);
    throw error;
  }
}