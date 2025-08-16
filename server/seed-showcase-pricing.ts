import { db } from './db';
import { priceLists } from '../shared/schema';

async function seedShowcasePricing() {
  // Reduced logging for faster startup - only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 Seeding pricing system...');
  }

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

    // Use onConflictDoNothing to prevent duplicate key errors
    await db.insert(priceLists).values(showcasePriceLists).onConflictDoNothing();

    // Only log in development for performance
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Pricing system seeded');
    }

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error seeding pricing:', error);
    }
    throw error;
  }
}

// Only execute if run directly as a script (not during import)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedShowcasePricing()
    .then(() => {
      console.log('Pricing seeding completed');
    })
    .catch((error) => {
      console.error('Pricing seeding failed:', error);
    });
}

export { seedShowcasePricing };