
import { storage } from "./storage";

export async function seedPOS() {
  console.log("🌱 Seeding POS system requirements...");

  try {
    // Check if walk-in customer exists
    const existingCustomer = await storage.getCustomer("walk-in-customer");
    
    if (!existingCustomer) {
      // Create walk-in customer
      await storage.createCustomer({
        id: "walk-in-customer",
        name: "Walk-in Customer",
        email: "walkin@pos.local", 
        password: "pos-system",
        status: "active"
      } as any);
      console.log("✓ Walk-in customer created");
    } else {
      console.log("✓ Walk-in customer already exists");
    }

    // Ensure demo customer exists as fallback
    const demoCustomer = await storage.getCustomer("demo-customer-1");
    if (!demoCustomer) {
      await storage.createCustomer({
        id: "demo-customer-1", 
        name: "Demo Customer",
        email: "demo@hibla.com",
        password: "demo123",
        status: "active"
      } as any);
      console.log("✓ Demo customer created");
    } else {
      console.log("✓ Demo customer already exists");
    }

    console.log("✅ POS system seeding completed!");
  } catch (error) {
    console.error("❌ POS seeding failed:", error);
  }
}
