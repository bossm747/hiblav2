import { db } from './db';
import { priceLists } from '../shared/schema';

async function seedShowcasePricing() {
  console.log('🎯 Seeding showcase pricing system...');

  try {
    // Don't delete existing price lists - just add showcase ones if they don't exist

    // Create the 3 showcase price lists
    const showcasePriceLists = [
      {
        id: 'new-customer-showcase',
        name: 'New Customer',
        code: 'NEW',
        description: 'New customer pricing with 5% markup from SRP',
        priceMultiplier: '1.05', // +5% from SRP
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'regular-customer-showcase',
        name: 'Regular Customer',
        code: 'REG',
        description: 'Regular customer pricing using default SRP',
        priceMultiplier: '1.0', // Default SRP
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'vip-customer-showcase',
        name: 'VIP Customer',
        code: 'VIP',
        description: 'VIP customer pricing with 5% bonus from SRP',
        priceMultiplier: '1.05', // +5% from SRP (bonus pricing)
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.insert(priceLists).values(showcasePriceLists);

    console.log('✅ Showcase pricing system seeded successfully!');
    console.log('📊 Created 3 price categories:');
    console.log('   • New Customer (+5% SRP)');
    console.log('   • Regular Customer (Default SRP)');
    console.log('   • VIP Customer (+5% SRP)');

  } catch (error) {
    console.error('❌ Error seeding showcase pricing:', error);
    throw error;
  }
}

if (import.meta.url === new URL(import.meta.resolve('./seed-showcase-pricing.ts')).href) {
  seedShowcasePricing().catch(console.error);
}

export { seedShowcasePricing };