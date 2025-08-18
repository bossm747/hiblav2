// Seed products with VLOOKUP pricing for production
import { db } from "./db";
import { products } from "@shared/schema";

async function seedProductsForVLOOKUP() {
  console.log('Seeding products with VLOOKUP pricing...');
  
  const sampleProducts = [
    {
      name: "8\" Machine Weft Single Drawn, STRAIGHT",
      description: "Premium Filipino hair, 8 inches, straight texture",
      categoryId: "cat-1",
      hairType: "human",
      texture: "straight", 
      length: 8,
      color: "Natural Black",
      weight: "100g",
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
      name: "10\" Machine Weft Single Drawn, WAVY",
      description: "Premium Filipino hair, 10 inches, wavy texture",
      categoryId: "cat-1", 
      hairType: "human",
      texture: "wavy",
      length: 10,
      color: "Natural Black",
      weight: "100g", 
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
      name: "12\" Lace Closure 4x4, STRAIGHT",
      description: "Premium Filipino hair closure, 12 inches, straight",
      categoryId: "cat-1",
      hairType: "human", 
      texture: "straight",
      length: 12,
      color: "Natural Black",
      weight: "50g",
      sku: "LC-12-STR-4X4",
      unit: "pcs",
      priceListA: "75.00",
      priceListB: "72.00",
      priceListC: "70.00",
      priceListD: "68.00", 
      costPrice: "45.00",
      isActive: true
    }
  ];

  try {
    for (const product of sampleProducts) {
      await db.insert(products).values(product).onConflictDoNothing();
    }
    console.log('Products seeded successfully for VLOOKUP pricing!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedProductsForVLOOKUP().then(() => {
    console.log('Seeding complete');
    process.exit(0);
  }).catch(console.error);
}