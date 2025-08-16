import { db } from "./db";
import { staff } from "@shared/schema";

export async function seedStaff() {
  // Reduced logging for production performance
  if (process.env.NODE_ENV === 'development') {
    console.log("🌱 Seeding staff database...");
  }

  // Sample staff accounts for admin/cashier access (excluding admin which already exists)
  const sampleStaff = [
    {
      name: "Maria Cashier",
      email: "cashier@hibla.com",
      phone: "+63917000002", 
      password: "cashier123",
      role: "cashier",
      permissions: ["manage_pos", "view_orders", "view_customers", "process_sales"]
    },
    {
      name: "Juan Manager",
      email: "manager@hibla.com",
      phone: "+63917000003",
      password: "manager123",
      role: "manager", 
      permissions: ["manage_products", "manage_orders", "view_reports", "manage_inventory", "manage_pos"]
    },
    {
      name: "Ana Sales Staff",
      email: "sales@hibla.com", 
      phone: "+63917000004",
      password: "sales123",
      role: "staff",
      permissions: ["manage_pos", "view_products", "process_sales"]
    }
  ];

  try {
    // Check existing staff data (don't clear due to foreign key constraints)
    // Quick check for existing staff (reduced logging for performance)
    const existingStaff = await db.select().from(staff);
    
    if (process.env.NODE_ENV === 'development' && existingStaff.length > 0) {
      console.log(`Found ${existingStaff.length} existing staff members`);
    }

    // Insert sample staff accounts (with conflict handling)
    const insertedStaff = await db.insert(staff).values(sampleStaff).onConflictDoNothing().returning();
    
    // Only show detailed logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Successfully seeded ${insertedStaff.length} staff accounts`);
      if (insertedStaff.length > 0) {
        console.log("\n🔐 Login Credentials for Testing:");
        console.log("=================================");
        console.log("Admin: admin@hibla.com / admin123");
        console.log("Cashier: cashier@hibla.com / cashier123");
        console.log("Manager: manager@hibla.com / manager123");
        console.log("Sales: sales@hibla.com / sales123\n");
      }
    }

    return insertedStaff;

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ Error seeding staff data:", error);
    }
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedStaff()
    .then(() => {
      console.log("🌱 Staff database seeding completed!");
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
    });
}