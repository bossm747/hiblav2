import { db } from "./db";
import { staff } from "@shared/schema";
import { getEnhancedPermissionsByRole } from "@shared/permissions";
import bcrypt from "bcrypt";

export async function seedAccessManagement() {
  console.log("🔐 Seeding access management data...");
  
  try {
    // Check if staff already exists
    const existingStaff = await db.select().from(staff);
    
    if (existingStaff.length > 0) {
      console.log("✓ Staff already exists, skipping seed");
      return;
    }
    
    // Create demo staff members
    const demoStaff = [
      {
        id: "admin-001",
        name: "Admin User",
        email: "admin@hibla.com",
        password: "admin123", // In production, this should be hashed
        phone: "+1234567890",
        role: "admin",
        permissions: getEnhancedPermissionsByRole("admin"),
        department: "Administration",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "prod-mgr-001",
        name: "Production Manager",
        email: "production@hibla.com",
        password: "prod123",
        phone: "+1234567891",
        role: "production_manager",
        permissions: getEnhancedPermissionsByRole("production_manager"),
        department: "Production",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "sales-mgr-001",
        name: "Sales Manager",
        email: "sales@hibla.com",
        password: "sales123",
        phone: "+1234567892",
        role: "sales_manager",
        permissions: getEnhancedPermissionsByRole("sales_manager"),
        department: "Sales",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "inv-mgr-001",
        name: "Inventory Manager",
        email: "inventory@hibla.com",
        password: "inv123",
        phone: "+1234567893",
        role: "inventory_manager",
        permissions: getEnhancedPermissionsByRole("inventory_manager"),
        department: "Warehouse",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "manager-001",
        name: "Manager User",
        email: "manager@hibla.com",
        password: "manager123",
        phone: "+1234567894",
        role: "supervisor",
        permissions: getEnhancedPermissionsByRole("supervisor"),
        department: "Operations",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "staff-001",
        name: "Staff User",
        email: "staff@hibla.com",
        password: "staff123",
        phone: "+1234567895",
        role: "sales_staff",
        permissions: getEnhancedPermissionsByRole("sales_staff"),
        department: "Sales",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "prod-staff-001",
        name: "Production Staff",
        email: "production.staff@hibla.com",
        password: "prodstaff123",
        phone: "+1234567896",
        role: "production_staff",
        permissions: getEnhancedPermissionsByRole("production_staff"),
        department: "Production",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "inv-staff-001",
        name: "Inventory Staff",
        email: "inventory.staff@hibla.com",
        password: "invstaff123",
        phone: "+1234567897",
        role: "inventory_staff",
        permissions: getEnhancedPermissionsByRole("inventory_staff"),
        department: "Warehouse",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "cs-001",
        name: "Customer Service Rep",
        email: "cs@hibla.com",
        password: "cs123",
        phone: "+1234567898",
        role: "customer_service",
        permissions: getEnhancedPermissionsByRole("customer_service"),
        department: "Customer Service",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "acct-001",
        name: "Accountant",
        email: "accountant@hibla.com",
        password: "acct123",
        phone: "+1234567899",
        role: "accountant",
        permissions: getEnhancedPermissionsByRole("accountant"),
        department: "Finance",
        isActive: true,
        createdAt: new Date()
      }
    ];
    
    // Insert demo staff
    for (const member of demoStaff) {
      // In production, hash the password
      // member.password = await bcrypt.hash(member.password, 10);
      
      await db.insert(staff).values(member);
      console.log(`✓ Created ${member.role}: ${member.name} (${member.email})`);
    }
    
    console.log(`✅ Successfully seeded ${demoStaff.length} staff members`);
    
    // Log demo credentials for easy reference
    console.log("\n📋 Demo Credentials:");
    console.log("==================");
    console.log("Admin: admin@hibla.com / admin123");
    console.log("Production Manager: production@hibla.com / prod123");
    console.log("Sales Manager: sales@hibla.com / sales123");
    console.log("Inventory Manager: inventory@hibla.com / inv123");
    console.log("Supervisor: manager@hibla.com / manager123");
    console.log("Sales Staff: staff@hibla.com / staff123");
    console.log("==================\n");
    
  } catch (error) {
    console.error("❌ Error seeding access management:", error);
    throw error;
  }
}

// Run the seed if this file is executed directly
seedAccessManagement()
  .then(() => {
    console.log("✅ Access management seeding complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });