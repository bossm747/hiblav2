import { db } from "./db";
import { staff } from "@shared/schema";

export async function seedStaff() {
  console.log("🌱 Seeding staff database...");

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
    console.log("Checking existing staff data...");
    const existingStaff = await db.select().from(staff);
    
    if (existingStaff.length > 0) {
      console.log(`Found ${existingStaff.length} existing staff members. Adding demo accounts...`);
    }

    // Insert sample staff accounts
    console.log("Inserting sample staff accounts...");
    const insertedStaff = await db.insert(staff).values(sampleStaff).returning();
    
    console.log(`✅ Successfully seeded ${insertedStaff.length} staff accounts`);
    console.log("\n👥 Sample Staff Accounts Created:");
    console.log("==================================");
    
    insertedStaff.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} (${member.role})`);
      console.log(`   Email: ${member.email}`);
      console.log(`   Phone: ${member.phone}`);
      console.log(`   Permissions: ${member.permissions?.join(", ")}`);
      console.log("   ---");
    });
    
    // Display login credentials
    console.log("\n🔐 Login Credentials for Testing:");
    console.log("=================================");
    console.log("Admin Access:");
    console.log("  Email: admin@hibla.com");
    console.log("  Password: admin123");
    console.log("");
    console.log("Cashier Access:");  
    console.log("  Email: cashier@hibla.com");
    console.log("  Password: cashier123");
    console.log("");
    console.log("Manager Access:");
    console.log("  Email: manager@hibla.com");
    console.log("  Password: manager123");
    console.log("");
    console.log("Sales Staff Access:");
    console.log("  Email: sales@hibla.com");
    console.log("  Password: sales123\n");

    return insertedStaff;

  } catch (error) {
    console.error("❌ Error seeding staff data:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedStaff()
    .then(() => {
      console.log("🌱 Staff database seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}