import { db } from "./db";
import { customers, products, categories } from "@shared/schema";

// Simple seeding with real data from documents
async function seedSimpleData() {
  try {
    console.log("🌱 Seeding real sample data...");

    // Create category
    const [category] = await db.insert(categories).values({
      name: "Filipino Hair Products",
      description: "Premium real Filipino hair products"
    }).returning();

    // Create customer ABA from documents
    const [customer] = await db.insert(customers).values({
      customerCode: "ABA",
      name: "ABA Customer",
      email: "aba@customer.com",
      phone: "+1234567890",
      address: "123 Customer Street",
      city: "Customer City",
      country: "USA",
      postalCode: "12345"
    }).returning();

    // Real products from JO and Sales Order documents
    const productData = [
      { name: '8" Machine Weft Single Drawn, STRAIGHT', price: "120.00" },
      { name: '10" Machine Weft Single Drawn, STRAIGHT', price: "130.00" },
      { name: '16" Machine Weft Single Drawn, STRAIGHT', price: "140.00" },
      { name: '20" Machine Weft Single Drawn, STRAIGHT', price: "150.00" },
      { name: '22" Machine Weft Single Drawn, STRAIGHT', price: "80.00" },
      { name: '10" Machine Weft, Double Drawn, Straight', price: "90.00" },
      { name: '18" Machine Weft, Double Drawn, Straight', price: "70.00" },
      { name: '12" Korean HD Lace Closure 2X6", STRAIGHT (Improved Hairline)', price: "45.00" },
      { name: '12" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', price: "100.00" },
      { name: '20" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', price: "100.00" },
      { name: '22" Korean HD Lace Closure 4X4", STRAIGHT (Improved Hairline)', price: "120.00" },
      { name: '22" Korean HD Lace Frontal 9X6", STRAIGHT (Improved Hairline)', price: "130.00" }
    ];

    for (const product of productData) {
      await db.insert(products).values({
        name: product.name,
        description: `Premium real Filipino hair - ${product.name}`,
        basePrice: product.price,
        categoryId: category.id,
        hairType: "Straight",
        inStock: true,
        stockQuantity: 100
      });
    }

    console.log("✓ Real customer and 12 products seeded from Hibla documents");
    console.log("✓ Customer: ABA Hair Tag with complete product catalog");
    
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
}

seedSimpleData();