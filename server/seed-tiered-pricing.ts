import { db } from './db';
import { priceLists, customers, products } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedTieredPricing() {
  console.log('🎯 Seeding tiered pricing system...');

  try {
    // First, create the tiered price lists
    console.log('📊 Creating tiered price lists...');
    
    const priceListsData = [
      {
        id: 'price-list-new-customer',
        name: 'New Customer',
        code: 'NEW',
        description: 'Higher pricing for new customers until relationship is established',
        priceMultiplier: '1.1500', // 15% markup over regular
        isDefault: false,
        displayOrder: 1,
      },
      {
        id: 'price-list-regular-customer',
        name: 'Regular Customer',
        code: 'REGULAR',
        description: 'Standard pricing for established customers',
        priceMultiplier: '1.0000', // Base price (no markup/discount)
        isDefault: true,
        displayOrder: 2,
      },
      {
        id: 'price-list-premier-customer',
        name: 'Premier Customer',
        code: 'PREMIER',
        description: 'Discounted pricing for high-volume or VIP customers',
        priceMultiplier: '0.8500', // 15% discount from regular
        isDefault: false,
        displayOrder: 3,
      },
      {
        id: 'price-list-custom-pricing',
        name: 'Custom Pricing',
        code: 'CUSTOM',
        description: 'Admin-defined custom pricing for special arrangements',
        priceMultiplier: '1.0000', // Base, but can be overridden per customer
        isDefault: false,
        displayOrder: 4,
      },
    ];

    // Insert or update price lists
    for (const priceListData of priceListsData) {
      const existingPriceList = await db
        .select()
        .from(priceLists)
        .where(eq(priceLists.code, priceListData.code))
        .limit(1);

      if (existingPriceList.length === 0) {
        await db.insert(priceLists).values(priceListData);
        console.log(`✓ Created price list: ${priceListData.name}`);
      } else {
        await db
          .update(priceLists)
          .set(priceListData)
          .where(eq(priceLists.code, priceListData.code));
        console.log(`✓ Updated price list: ${priceListData.name}`);
      }
    }

    // Update existing customer (ABA) with Regular Customer pricing
    console.log('👥 Updating customer pricing categories...');
    
    const regularPriceList = await db
      .select()
      .from(priceLists)
      .where(eq(priceLists.code, 'REGULAR'))
      .limit(1);

    if (regularPriceList.length > 0) {
      await db
        .update(customers)
        .set({
          priceCategory: 'REGULAR',
          priceListId: regularPriceList[0].id,
        })
        .where(eq(customers.customerCode, 'ABA'));
      
      console.log('✓ Updated ABA customer with Regular pricing');
    }

    // Update products with base pricing
    console.log('💰 Setting product base prices from current priceListB...');
    
    const allProducts = await db.select().from(products);
    
    for (const product of allProducts) {
      // Use priceListB as the base price (Regular Customer pricing)
      if (product.priceListB) {
        await db
          .update(products)
          .set({
            basePrice: product.priceListB, // Set Regular Customer price as base
          })
          .where(eq(products.id, product.id));
      }
    }

    console.log(`✓ Updated ${allProducts.length} products with base pricing`);

    // Display pricing summary
    console.log('\n📋 Tiered Pricing Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('│ Category         │ Multiplier │ Description                    │');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('│ New Customer     │   1.15x    │ +15% markup for new customers  │');
    console.log('│ Regular Customer │   1.00x    │ Standard pricing (baseline)    │');
    console.log('│ Premier Customer │   0.85x    │ 15% discount for VIP customers │');
    console.log('│ Custom Pricing   │   1.00x    │ Admin-defined custom rates     │');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✅ Tiered pricing system seeded successfully!');
    console.log('💡 Usage: Customer pricing is automatically calculated as base_price × price_multiplier');

  } catch (error) {
    console.error('❌ Error seeding tiered pricing:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTieredPricing()
    .then(() => {
      console.log('🎉 Tiered pricing seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Tiered pricing seeding failed:', error);
      process.exit(1);
    });
}