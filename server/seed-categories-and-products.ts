// Create categories and products for VLOOKUP system
import { db } from "./db";
import { categories, products } from "@shared/schema";

async function seedCategoriesAndProducts() {
  console.log('Creating categories and products for VLOOKUP...');

  try {
    // Create hair categories first
    const sampleCategories = [
      {
        id: "cat-weft",
        name: "Machine Weft",
        slug: "machine-weft",
        description: "Premium machine weft hair bundles"
      },
      {
        id: "cat-closure", 
        name: "Lace Closures",
        slug: "lace-closures",
        description: "Lace closure pieces"
      },
      {
        id: "cat-frontal",
        name: "Lace Frontals",
        slug: "lace-frontals", 
        description: "Lace frontal pieces"
      }
    ];

    for (const category of sampleCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }
    console.log('Categories created');

    // Create products with VLOOKUP pricing
    const sampleProducts = [
      {
        id: "prod-001",
        name: "8\" Machine Weft Single Drawn, STRAIGHT",
        description: "Premium Filipino hair, 8 inches, straight texture",
        categoryId: "cat-weft",
        sku: "MW-8-STR-100",
        unit: "bundles",
        priceListA: "45.00",
        priceListB: "42.00",
        priceListC: "40.00", 
        priceListD: "38.00",
        costPrice: "25.00",
        isActive: true
      },
      {
        id: "prod-002",
        name: "10\" Machine Weft Single Drawn, WAVY",
        description: "Premium Filipino hair, 10 inches, wavy texture", 
        categoryId: "cat-weft",
        sku: "MW-10-WAV-100",
        unit: "bundles",
        priceListA: "55.00",
        priceListB: "52.00",
        priceListC: "50.00",
        priceListD: "48.00",
        costPrice: "30.00",
        isActive: true
      },
      {
        id: "prod-003",
        name: "12\" Lace Closure 4x4, STRAIGHT",
        description: "Premium Filipino hair closure, 12 inches",
        categoryId: "cat-closure",
        sku: "LC-12-STR-4X4",
        unit: "pcs",
        priceListA: "75.00",
        priceListB: "72.00",
        priceListC: "70.00",
        priceListD: "68.00",
        costPrice: "45.00", 
        isActive: true
      },
      {
        id: "1", // This matches our test product ID
        name: "Test Filipino Hair Bundle",
        description: "Test product for quotation validation",
        categoryId: "cat-weft", 
        sku: "TEST-001",
        unit: "bundles",
        priceListA: "50.00",
        priceListB: "47.00",
        priceListC: "45.00",
        priceListD: "43.00",
        costPrice: "30.00",
        isActive: true
      }
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values(product).onConflictDoNothing();
    }
    console.log('Products created successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategoriesAndProducts().then(() => {
    console.log('Seeding complete');
    process.exit(0);
  }).catch(console.error);
}