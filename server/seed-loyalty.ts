import { db } from "./db";
import { 
  stylingChallenges, 
  achievements, 
  loyaltyRewards 
} from "@shared/schema";

export async function seedLoyaltySystem() {
  console.log("Seeding loyalty system data...");

  // Seed Styling Challenges
  const challengesData = [
    {
      title: "Beach Waves Challenge",
      description: "Create beautiful beach waves using our wavy hair extensions. Show us your best beachy look!",
      category: "styling",
      difficulty: "easy",
      pointsReward: 150,
      requirements: {
        hairType: "wavy",
        minLength: 16,
        submitPhoto: true,
        submitDescription: true
      },
      instructions: [
        "Choose a wavy hair extension 16 inches or longer",
        "Style into loose beach waves",
        "Take a photo showing the final look",
        "Write a description of your styling process"
      ],
      maxParticipants: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true
    },
    {
      title: "Elegant Updo Mastery",
      description: "Master the art of elegant updos using our premium straight hair extensions. Perfect for special occasions!",
      category: "styling",
      difficulty: "medium",
      pointsReward: 300,
      requirements: {
        hairType: "straight",
        minLength: 20,
        submitPhoto: true,
        submitVideo: true
      },
      instructions: [
        "Use straight hair extensions 20+ inches",
        "Create an elegant updo suitable for formal events",
        "Take photos from multiple angles",
        "Record a short video showing the final result"
      ],
      maxParticipants: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      isActive: true
    },
    {
      title: "Color Transformation",
      description: "Show off a dramatic color transformation using our colored hair extensions. Get creative with color combinations!",
      category: "color",
      difficulty: "hard",
      pointsReward: 500,
      requirements: {
        multipleColors: true,
        submitBefore: true,
        submitAfter: true,
        submitProcess: true
      },
      instructions: [
        "Use at least 2 different colored hair extensions",
        "Take a 'before' photo of your natural hair",
        "Document your styling process",
        "Take an 'after' photo showing the transformation",
        "Share tips for color blending"
      ],
      maxParticipants: 25,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isActive: true
    },
    {
      title: "Volume & Texture Challenge",
      description: "Create maximum volume and texture using our curly hair extensions. Show us your most voluminous look!",
      category: "texture",
      difficulty: "medium",
      pointsReward: 250,
      requirements: {
        hairType: "curly",
        minVolume: true,
        submitPhoto: true,
        submitTips: true
      },
      instructions: [
        "Use curly hair extensions for maximum volume",
        "Style to enhance natural texture and volume",
        "Take photos highlighting the volume achieved",
        "Share your top 3 volume-boosting tips"
      ],
      maxParticipants: 75,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true
    }
  ];

  // Seed Achievements
  const achievementsData = [
    {
      name: "First Purchase",
      description: "Welcome to Hibla! Complete your first purchase with us.",
      category: "shopping",
      icon: "🛍️",
      pointsReward: 100,
      requirements: {
        totalOrders: 1
      },
      isActive: true
    },
    {
      name: "Loyal Customer",
      description: "Thank you for your loyalty! Complete 5 orders with us.",
      category: "shopping",
      icon: "❤️",
      pointsReward: 250,
      requirements: {
        totalOrders: 5
      },
      isActive: true
    },
    {
      name: "VIP Shopper",
      description: "You're a VIP! Complete 10 orders with us.",
      category: "shopping",
      icon: "👑",
      pointsReward: 500,
      requirements: {
        totalOrders: 10
      },
      isActive: true
    },
    {
      name: "Big Spender",
      description: "Spend ₱10,000 or more on hair extensions.",
      category: "spending",
      icon: "💰",
      pointsReward: 300,
      requirements: {
        totalSpent: 10000
      },
      isActive: true
    },
    {
      name: "Premium Patron",
      description: "Spend ₱25,000 or more - you're our premium customer!",
      category: "spending",
      icon: "💎",
      pointsReward: 750,
      requirements: {
        totalSpent: 25000
      },
      isActive: true
    },
    {
      name: "Challenge Starter",
      description: "Join your first styling challenge.",
      category: "challenges",
      icon: "🎯",
      pointsReward: 50,
      requirements: {
        challengesJoined: 1
      },
      isActive: true
    },
    {
      name: "Challenge Master",
      description: "Complete 3 styling challenges successfully.",
      category: "challenges",
      icon: "🏆",
      pointsReward: 400,
      requirements: {
        challengesCompleted: 3
      },
      isActive: true
    },
    {
      name: "Style Influencer",
      description: "Complete 5 styling challenges and inspire others!",
      category: "challenges",
      icon: "✨",
      pointsReward: 800,
      requirements: {
        challengesCompleted: 5
      },
      isActive: true
    },
    {
      name: "Community Leader",
      description: "Complete 10 styling challenges and become a community leader.",
      category: "challenges",
      icon: "🌟",
      pointsReward: 1200,
      requirements: {
        challengesCompleted: 10
      },
      isActive: true
    }
  ];

  // Seed Loyalty Rewards
  const rewardsData = [
    {
      name: "₱100 Off Your Next Purchase",
      description: "Get ₱100 discount on any order over ₱2,000",
      pointsCost: 500,
      discountType: "fixed",
      discountValue: 100,
      minimumSpend: 2000,
      tierRequirement: "bronze",
      maxUses: 1000,
      currentUses: 0,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true
    },
    {
      name: "₱250 Off Premium Extensions",
      description: "Get ₱250 discount on premium hair extensions over ₱4,000",
      pointsCost: 1000,
      discountType: "fixed",
      discountValue: 250,
      minimumSpend: 4000,
      tierRequirement: "silver",
      maxUses: 500,
      currentUses: 0,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true
    },
    {
      name: "15% Off Entire Order",
      description: "Get 15% off your entire order (max ₱1,500 discount)",
      pointsCost: 1500,
      discountType: "percentage",
      discountValue: 15,
      minimumSpend: 3000,
      maxDiscountAmount: 1500,
      tierRequirement: "gold",
      maxUses: 200,
      currentUses: 0,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true
    },
    {
      name: "₱500 VIP Discount",
      description: "Exclusive ₱500 discount for VIP customers on orders over ₱8,000",
      pointsCost: 2000,
      discountType: "fixed",
      discountValue: 500,
      minimumSpend: 8000,
      tierRequirement: "platinum",
      maxUses: 100,
      currentUses: 0,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true
    },
    {
      name: "Free Shipping Voucher",
      description: "Free shipping on any order (normally ₱150)",
      pointsCost: 300,
      discountType: "shipping",
      discountValue: 150,
      minimumSpend: 1000,
      tierRequirement: "bronze",
      maxUses: 2000,
      currentUses: 0,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      isActive: true
    },
    {
      name: "Double Points Weekend",
      description: "Earn double loyalty points on your next purchase (valid for one weekend)",
      pointsCost: 800,
      discountType: "bonus",
      discountValue: 100, // 100% bonus points
      tierRequirement: "silver",
      maxUses: 300,
      currentUses: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true
    },
    {
      name: "Early Access Pass",
      description: "Get early access to new product launches and exclusive collections",
      pointsCost: 1200,
      discountType: "access",
      tierRequirement: "gold",
      maxUses: 150,
      currentUses: 0,
      validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
      isActive: true
    },
    {
      name: "Personal Styling Consultation",
      description: "One-on-one styling consultation with our hair experts (₱1,000 value)",
      pointsCost: 2500,
      discountType: "service",
      discountValue: 1000,
      tierRequirement: "platinum",
      maxUses: 50,
      currentUses: 0,
      validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days
      isActive: true
    }
  ];

  try {
    // Insert styling challenges
    console.log("Inserting styling challenges...");
    await db.insert(stylingChallenges).values(challengesData);

    // Insert achievements
    console.log("Inserting achievements...");
    await db.insert(achievements).values(achievementsData);

    // Insert loyalty rewards
    console.log("Inserting loyalty rewards...");
    await db.insert(loyaltyRewards).values(rewardsData);

    console.log("✅ Loyalty system seeding completed successfully!");
    console.log(`- ${challengesData.length} styling challenges created`);
    console.log(`- ${achievementsData.length} achievements created`);
    console.log(`- ${rewardsData.length} loyalty rewards created`);

  } catch (error) {
    console.error("❌ Error seeding loyalty system:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
seedLoyaltySystem()
  .then(() => {
    console.log("Loyalty system seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });