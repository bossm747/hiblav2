import { storage } from "./storage";
import type { InsertStylist, InsertCustomerPreferences } from "@shared/schema";

export async function seedStylists() {
  console.log("Seeding stylists data...");

  const stylists: InsertStylist[] = [
    {
      name: "Maria Santos",
      email: "maria.santos@hibla.com",
      phone: "+63 917 123 4567",
      bio: "Expert hair extension specialist with 8 years of experience in premium human hair installations. Specializes in seamless blending and natural looks for Filipino hair types.",
      specialties: ["hair-extensions", "styling", "color-matching"],
      experience: 8,
      certification: ["Licensed Cosmetologist", "Hair Extension Specialist", "Color Theory Certified"],
      languages: ["English", "Filipino", "Tagalog"],
      location: "Quezon City, Metro Manila",
      priceRange: "premium",

      profileImage: "/images/stylists/maria-santos.jpg",
      portfolioImages: [
        "/images/portfolio/maria-1.jpg",
        "/images/portfolio/maria-2.jpg",
        "/images/portfolio/maria-3.jpg"
      ],
      isActive: true,
      isVerified: true,
      workingHours: {
        monday: { start: "09:00", end: "18:00", available: true },
        tuesday: { start: "09:00", end: "18:00", available: true },
        wednesday: { start: "09:00", end: "18:00", available: true },
        thursday: { start: "09:00", end: "18:00", available: true },
        friday: { start: "09:00", end: "18:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false }
      }
    },
    {
      name: "Ana Reyes",
      email: "ana.reyes@hibla.com",
      phone: "+63 926 234 5678",
      bio: "Creative stylist specializing in modern hair transformations and extension installations. Known for creating stunning volume and length using premium Korean HD lace.",
      specialties: ["hair-extensions", "cutting", "styling", "updos"],
      experience: 6,
      certification: ["Licensed Hair Stylist", "Advanced Extension Techniques"],
      languages: ["English", "Filipino"],
      location: "Makati City, Metro Manila",
      priceRange: "mid-range",

      profileImage: "/images/stylists/ana-reyes.jpg",
      portfolioImages: [
        "/images/portfolio/ana-1.jpg",
        "/images/portfolio/ana-2.jpg"
      ],
      isActive: true,
      isVerified: true,
      workingHours: {
        monday: { start: "10:00", end: "19:00", available: true },
        tuesday: { start: "10:00", end: "19:00", available: true },
        wednesday: { start: "10:00", end: "19:00", available: true },
        thursday: { start: "10:00", end: "19:00", available: true },
        friday: { start: "10:00", end: "19:00", available: true },
        saturday: { start: "09:00", end: "17:00", available: true },
        sunday: { start: "09:00", end: "17:00", available: false }
      }
    },
    {
      name: "Patricia Cruz",
      email: "patricia.cruz@hibla.com",
      phone: "+63 915 345 6789",
      bio: "Specialist in natural hair care and extension maintenance. Passionate about helping clients achieve healthy, beautiful hair with proper care techniques.",
      specialties: ["hair-extensions", "treatments", "maintenance", "consultation"],
      experience: 4,
      certification: ["Licensed Cosmetologist", "Hair Health Specialist"],
      languages: ["English", "Filipino", "Cebuano"],
      location: "Cebu City, Cebu",
      priceRange: "budget",

      profileImage: "/images/stylists/patricia-cruz.jpg",
      portfolioImages: [
        "/images/portfolio/patricia-1.jpg"
      ],
      isActive: true,
      isVerified: true,
      workingHours: {
        monday: { start: "08:00", end: "17:00", available: true },
        tuesday: { start: "08:00", end: "17:00", available: true },
        wednesday: { start: "08:00", end: "17:00", available: true },
        thursday: { start: "08:00", end: "17:00", available: true },
        friday: { start: "08:00", end: "17:00", available: true },
        saturday: { start: "09:00", end: "15:00", available: true },
        sunday: { start: "09:00", end: "15:00", available: false }
      }
    },
    {
      name: "Isabella Garcia",
      email: "isabella.garcia@hibla.com",
      phone: "+63 928 456 7890",
      bio: "Master stylist with expertise in luxury hair installations and color transformations. Trained in advanced European techniques for premium clients.",
      specialties: ["hair-extensions", "coloring", "highlighting", "luxury-services"],
      experience: 10,
      certification: ["Master Stylist License", "Advanced Color Theory", "European Extension Techniques"],
      languages: ["English", "Filipino", "Spanish"],
      location: "Bonifacio Global City, Metro Manila",
      priceRange: "premium",

      profileImage: "/images/stylists/isabella-garcia.jpg",
      portfolioImages: [
        "/images/portfolio/isabella-1.jpg",
        "/images/portfolio/isabella-2.jpg",
        "/images/portfolio/isabella-3.jpg",
        "/images/portfolio/isabella-4.jpg"
      ],
      isActive: true,
      isVerified: true,
      workingHours: {
        monday: { start: "10:00", end: "20:00", available: true },
        tuesday: { start: "10:00", end: "20:00", available: true },
        wednesday: { start: "10:00", end: "20:00", available: true },
        thursday: { start: "10:00", end: "20:00", available: true },
        friday: { start: "10:00", end: "20:00", available: true },
        saturday: { start: "10:00", end: "18:00", available: true },
        sunday: { start: "10:00", end: "18:00", available: false }
      }
    },
    {
      name: "Carmen Villanueva",
      email: "carmen.villanueva@hibla.com",
      phone: "+63 917 567 8901",
      bio: "Experienced in working with all hair types and textures. Specializes in creating natural-looking transformations that complement Filipino facial features.",
      specialties: ["hair-extensions", "consultation", "texture-matching"],
      experience: 5,
      certification: ["Licensed Hair Stylist", "Texture Specialist"],
      languages: ["English", "Filipino", "Ilocano"],
      location: "Baguio City, Benguet",
      priceRange: "mid-range",

      profileImage: "/images/stylists/carmen-villanueva.jpg",
      portfolioImages: [
        "/images/portfolio/carmen-1.jpg",
        "/images/portfolio/carmen-2.jpg"
      ],
      isActive: true,
      isVerified: true,
      workingHours: {
        monday: { start: "09:00", end: "18:00", available: true },
        tuesday: { start: "09:00", end: "18:00", available: true },
        wednesday: { start: "09:00", end: "18:00", available: true },
        thursday: { start: "09:00", end: "18:00", available: true },
        friday: { start: "09:00", end: "18:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false }
      }
    }
  ];

  // Create stylists
  for (const stylistData of stylists) {
    try {
      const stylist = await storage.createStylist(stylistData);
      console.log(`Created stylist: ${stylist.name}`);
    } catch (error) {
      console.error(`Failed to create stylist ${stylistData.name}:`, error);
    }
  }

  console.log("Stylists seeding completed!");
}

export async function seedSampleCustomerPreferences() {
  console.log("Seeding sample customer preferences...");

  // Get some customers to create preferences for
  const customers = await storage.getCustomers();
  if (customers.length === 0) {
    console.log("No customers found, skipping preferences seeding");
    return;
  }

  const samplePreferences: InsertCustomerPreferences[] = [
    {
      customerId: customers[0].id,
      hairType: "wavy",
      hairLength: "medium",
      hairGoals: ["length", "volume"],
      preferredStyle: ["natural", "glamorous"],
      budgetRange: "mid-range",
      preferredLocation: "Metro Manila",
      preferredLanguage: ["English", "Filipino"],
      sessionType: "installation",
      urgency: "within-week",
      previousExperience: "intermediate",
      specialNeeds: [],
      communicationStyle: "detailed"
    },
    {
      customerId: customers[1]?.id || customers[0].id,
      hairType: "straight",
      hairLength: "short",
      hairGoals: ["length", "color-change"],
      preferredStyle: ["edgy", "modern"],
      budgetRange: "premium",
      preferredLocation: "Quezon City",
      preferredLanguage: ["English"],
      sessionType: "consultation",
      urgency: "flexible",
      previousExperience: "beginner",
      specialNeeds: ["sensitive-scalp"],
      communicationStyle: "visual"
    },
    {
      customerId: customers[2]?.id || customers[0].id,
      hairType: "curly",
      hairLength: "long",
      hairGoals: ["volume", "maintenance"],
      preferredStyle: ["natural", "classic"],
      budgetRange: "budget",
      preferredLocation: "Cebu City",
      preferredLanguage: ["Filipino", "Cebuano"],
      sessionType: "maintenance",
      urgency: "urgent",
      previousExperience: "expert",
      specialNeeds: [],
      communicationStyle: "brief"
    }
  ];

  // Create customer preferences
  for (const preferencesData of samplePreferences) {
    try {
      const preferences = await storage.createCustomerPreferences(preferencesData);
      console.log(`Created preferences for customer: ${preferences.customerId}`);
    } catch (error) {
      console.error(`Failed to create preferences for customer ${preferencesData.customerId}:`, error);
    }
  }

  console.log("Customer preferences seeding completed!");
}