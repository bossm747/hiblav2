import { db } from "./db";
import { 
  categories, 
  products, 
  inventoryTransactions,
  shopSettings,
  staff
} from "@shared/schema";

async function seedInventory() {
  console.log("Starting inventory seed...");

  try {
    // Get categories
    const [singleDrawn] = await db.select().from(categories).where(eq(categories.slug, "single-drawn"));
    const [doubleDrawn] = await db.select().from(categories).where(eq(categories.slug, "double-drawn"));
    const [laceClosures] = await db.select().from(categories).where(eq(categories.slug, "lace-closures"));
    const [laceFrontals] = await db.select().from(categories).where(eq(categories.slug, "lace-frontals"));

    // Get or create a system staff member for inventory transactions
    let [systemStaff] = await db.select().from(staff).where(eq(staff.email, "admin@hibla.com"));
    if (!systemStaff) {
      [systemStaff] = await db.insert(staff).values({
        name: "System Admin",
        email: "admin@hibla.com",
        password: "system",
        role: "admin",
        permissions: ["manage_products", "manage_inventory", "manage_orders"]
      }).returning();
    }

    // Single Drawn Wavy Products
    const singleDrawnWavyProducts = [
      { length: 6, stock: 1.6, price: 1800 },
      { length: 8, stock: 28, price: 2200 },
      { length: 10, stock: 0.6, price: 2800 },
      { length: 12, stock: 2.0, price: 3500 },
      { length: 14, stock: 0.1, price: 4200 },
      { length: 16, stock: 0.1, price: 4800 },
      { length: 18, stock: 0.1, price: 5500 }
    ];

    for (const item of singleDrawnWavyProducts) {
      const [product] = await db.insert(products).values({
        name: `${item.length}" Single Drawn Wavy`,
        description: `Premium quality ${item.length}-inch single drawn wavy hair extension`,
        categoryId: singleDrawn.id,
        hairType: "human",
        texture: "wavy",
        length: item.length,
        color: "natural black",
        price: item.price.toString(),
        currentStock: Math.floor(item.stock),
        sku: `SD-W-${item.length}`,
        isActive: true
      }).returning();

      // Create initial inventory transaction
      if (item.stock > 0) {
        await db.insert(inventoryTransactions).values({
          productId: product.id,
          type: "purchase",
          quantity: Math.floor(item.stock),
          reason: "Initial stock",
          staffId: systemStaff.id
        });
      }
    }

    // Single Drawn Straight Products
    const singleDrawnStraightProducts = [
      { length: 8, stock: 1.9, price: 2200 },
      { length: 10, stock: 0.1, price: 2800 },
      { length: 12, stock: 0.1, price: 3500 },
      { length: 14, stock: 0.1, price: 4200 }
    ];

    for (const item of singleDrawnStraightProducts) {
      const [product] = await db.insert(products).values({
        name: `${item.length}" Single Drawn Straight`,
        description: `Premium quality ${item.length}-inch single drawn straight hair extension`,
        categoryId: singleDrawn.id,
        hairType: "human",
        texture: "straight",
        length: item.length,
        color: "natural black",
        price: item.price.toString(),
        currentStock: Math.floor(item.stock),
        sku: `SD-S-${item.length}`,
        isActive: true
      }).returning();

      if (item.stock > 0) {
        await db.insert(inventoryTransactions).values({
          productId: product.id,
          type: "purchase",
          quantity: Math.floor(item.stock),
          reason: "Initial stock",
          staffId: systemStaff.id
        });
      }
    }

    // Double Drawn Products
    const doubleDrawnProducts = [
      { length: 6, texture: "straight", stock: 4, price: 2500 },
      { length: 8, texture: "straight", stock: 1.5, price: 3200 },
      { length: 10, texture: "straight", stock: 0.1, price: 4000 },
      { length: 12, texture: "straight", stock: 0.6, price: 4800 },
      { length: 14, texture: "straight", stock: 0.1, price: 5600 },
      { length: 8, texture: "wavy", stock: 0.3, price: 3200 },
      { length: 10, texture: "wavy", stock: 0.3, price: 4000 },
      { length: 12, texture: "wavy", stock: 0.3, price: 4800 }
    ];

    for (const item of doubleDrawnProducts) {
      const [product] = await db.insert(products).values({
        name: `${item.length}" Double Drawn ${item.texture.charAt(0).toUpperCase() + item.texture.slice(1)}`,
        description: `Premium quality ${item.length}-inch double drawn ${item.texture} hair extension`,
        categoryId: doubleDrawn.id,
        hairType: "human",
        texture: item.texture,
        length: item.length,
        color: "natural black",
        price: item.price.toString(),
        currentStock: Math.floor(item.stock),
        sku: `DD-${item.texture.charAt(0).toUpperCase()}-${item.length}`,
        isActive: true
      }).returning();

      if (item.stock > 0) {
        await db.insert(inventoryTransactions).values({
          productId: product.id,
          type: "purchase",
          quantity: Math.floor(item.stock),
          reason: "Initial stock",
          staffId: systemStaff.id
        });
      }
    }

    // Korean HD Lace Closures
    const koreanClosures = [
      { size: "6x6", length: 10, curl: "Maganda Curl", stock: 1, price: 4500 },
      { size: "5x5", length: 8, curl: "Malagu Curl", stock: 3, price: 3800 }, // Combined duplicate entries
      { size: "4x4", length: 6, curl: "Straight", stock: 2, price: 3200 }
    ];

    for (const item of koreanClosures) {
      const [product] = await db.insert(products).values({
        name: `${item.length}" Korean HD Lace Closure ${item.size}" ${item.curl}`,
        description: `Premium Korean HD lace closure, ${item.size} inches, ${item.curl} pattern`,
        categoryId: laceClosures.id,
        hairType: "human",
        texture: item.curl.toLowerCase(),
        length: item.length,
        color: "natural black",
        price: item.price.toString(),
        currentStock: item.stock,
        sku: `KHD-C-${item.size}-${item.length}`,
        isActive: true,
        features: ["Korean HD Lace", `Size: ${item.size}"`, "Pre-plucked hairline", "Baby hairs included"]
      }).returning();

      if (item.stock > 0) {
        await db.insert(inventoryTransactions).values({
          productId: product.id,
          type: "purchase",
          quantity: item.stock,
          reason: "Initial stock",
          staffId: systemStaff.id
        });
      }
    }

    // Korean HD Lace Frontals
    const koreanFrontals = [
      { size: "13x4", length: 12, curl: "Malagu Curl", stock: 2, price: 5500 },
      { size: "13x4", length: 10, curl: "Malagu Curl", stock: 2, price: 4800 }
    ];

    for (const item of koreanFrontals) {
      const [product] = await db.insert(products).values({
        name: `${item.length}" Korean HD Lace Frontal ${item.size}" ${item.curl}`,
        description: `Premium Korean HD lace frontal, ${item.size} inches, ${item.curl} pattern`,
        categoryId: laceFrontals.id,
        hairType: "human",
        texture: item.curl.toLowerCase(),
        length: item.length,
        color: "natural black",
        price: item.price.toString(),
        currentStock: item.stock,
        sku: `KHD-F-${item.size}-${item.length}`,
        isActive: true,
        features: ["Korean HD Lace", `Size: ${item.size}"`, "Pre-plucked hairline", "Baby hairs included"]
      }).returning();

      if (item.stock > 0) {
        await db.insert(inventoryTransactions).values({
          productId: product.id,
          type: "purchase",
          quantity: item.stock,
          reason: "Initial stock",
          staffId: systemStaff.id
        });
      }
    }

    // European HD Lace Products
    const europeanProducts = [
      { type: "closure", size: "6x6", length: 12, texture: "wavy", stock: 1, price: 5200 },
      { type: "closure", size: "4x4", length: 14, texture: "straight", stock: 1, price: 5800 },
      { type: "closure", size: "6x6", length: 12, texture: "maganda curl", stock: 2, price: 5200 },
      { type: "frontal", size: "13x4", length: 12, texture: "straight", stock: 1, price: 6500 }
    ];

    for (const item of europeanProducts) {
      const categoryId = item.type === "closure" ? laceClosures.id : laceFrontals.id;
      const [product] = await db.insert(products).values({
        name: `${item.length}" European HD Lace ${item.type.charAt(0).toUpperCase() + item.type.slice(1)} ${item.size}" ${item.texture.charAt(0).toUpperCase() + item.texture.slice(1)}`,
        description: `Premium European HD lace ${item.type}, ${item.size} inches, ${item.texture} pattern`,
        categoryId: categoryId,
        hairType: "human",
        texture: item.texture,
        length: item.length,
        color: "natural black",
        price: item.price.toString(),
        currentStock: item.stock,
        sku: `EHD-${item.type.charAt(0).toUpperCase()}-${item.size}-${item.length}`,
        isActive: true,
        features: ["European HD Lace", `Size: ${item.size}"`, "Pre-plucked hairline", "Baby hairs included", "Swiss lace base"]
      }).returning();

      if (item.stock > 0) {
        await db.insert(inventoryTransactions).values({
          productId: product.id,
          type: "purchase",
          quantity: item.stock,
          reason: "Initial stock",
          staffId: systemStaff.id
        });
      }
    }

    // Update shop settings
    const existingSettings = await db.select().from(shopSettings).limit(1);
    
    if (existingSettings.length === 0) {
      await db.insert(shopSettings).values({
        shopName: "Hibla Filipino Hair",
        shopEmail: "contact@hibla.com",
        shopPhone: "+63 999 999 9999",
        shopAddress: "Metro Manila, Philippines",
        currency: "PHP",
        taxRate: "12",
        shippingPolicy: "Free shipping for orders above ₱5,000. Standard shipping fee of ₱150 for orders below.",
        returnPolicy: "7-day return policy for unopened products. Quality issues addressed within 30 days.",
        socialLinks: {
          instagram: "@hibla.filipinohumanhair",
          facebook: "hibla.filipinohair"
        }
      });
    }

    console.log("Inventory seed completed successfully!");

  } catch (error) {
    console.error("Error seeding inventory:", error);
    throw error;
  }
}

// Add missing import
import { eq } from "drizzle-orm";

// Run the seed
seedInventory().then(() => {
  console.log("Done!");
  process.exit(0);
}).catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});