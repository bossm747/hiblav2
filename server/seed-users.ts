import { db } from "./db";
import { customers } from "@shared/schema";

export async function seedUsers() {
  console.log("🌱 Seeding user database...");

  // Sample customer accounts for testing and showcase
  const sampleCustomers = [
    {
      name: "Maria Santos",
      email: "maria.santos@gmail.com",
      phone: "+63917123456",
      password: "password123", // Simple password for demo
      shippingAddress: "123 Bonifacio Street, Makati City, Metro Manila",
      city: "Makati City",
      province: "Metro Manila",
      postalCode: "1200",
      totalSpent: "12500.00",
      totalOrders: 8
    },
    {
      name: "Ana Rodriguez",
      email: "ana.rodriguez@yahoo.com", 
      phone: "+63918234567",
      password: "password123",
      shippingAddress: "456 Quezon Avenue, Quezon City, Metro Manila",
      city: "Quezon City",
      province: "Metro Manila",
      postalCode: "1100",
      totalSpent: "8750.00",
      totalOrders: 5
    },
    {
      name: "Jasmine Cruz",
      email: "jasmine.cruz@hotmail.com",
      phone: "+63919345678", 
      password: "password123",
      shippingAddress: "789 Rizal Boulevard, Cebu City, Cebu",
      city: "Cebu City",
      province: "Cebu",
      postalCode: "6000",
      totalSpent: "15200.00",
      totalOrders: 12
    },
    {
      name: "Princess Dela Cruz",
      email: "princess.delacruz@gmail.com",
      phone: "+63920456789",
      password: "password123",
      shippingAddress: "321 Magsaysay Drive, Davao City, Davao del Sur",
      city: "Davao City", 
      province: "Davao del Sur",
      postalCode: "8000",
      totalSpent: "6300.00",
      totalOrders: 3
    },
    {
      name: "Catherine Gonzales",
      email: "catherine.gonzales@outlook.com",
      phone: "+63921567890",
      password: "password123",
      shippingAddress: "654 Session Road, Baguio City, Benguet",
      city: "Baguio City",
      province: "Benguet", 
      postalCode: "2600",
      totalSpent: "9800.00",
      totalOrders: 6
    },
    {
      name: "Angel Reyes",
      email: "angel.reyes@icloud.com", 
      phone: "+63922678901",
      password: "password123",
      shippingAddress: "987 Colon Street, Iloilo City, Iloilo",
      city: "Iloilo City",
      province: "Iloilo",
      postalCode: "5000",
      totalSpent: "18900.00",
      totalOrders: 15
    },
    {
      name: "Bianca Fernandez",
      email: "bianca.fernandez@gmail.com",
      phone: "+63923789012",
      password: "password123",
      shippingAddress: "147 Magallanes Street, Cagayan de Oro, Misamis Oriental",
      city: "Cagayan de Oro",
      province: "Misamis Oriental",
      postalCode: "9000",
      totalSpent: "4200.00",
      totalOrders: 2
    },
    {
      name: "Sophia Mendoza",
      email: "sophia.mendoza@yahoo.com",
      phone: "+63924890123", 
      password: "password123",
      shippingAddress: "258 Real Street, Tacloban City, Leyte",
      city: "Tacloban City",
      province: "Leyte",
      postalCode: "6500",
      totalSpent: "11600.00",
      totalOrders: 9
    },
    {
      name: "Isabella Torres",
      email: "isabella.torres@gmail.com",
      phone: "+63925901234",
      password: "password123",
      shippingAddress: "369 General Luna Street, Dumaguete City, Negros Oriental",
      city: "Dumaguete City", 
      province: "Negros Oriental",
      postalCode: "6200",
      totalSpent: "7850.00",
      totalOrders: 4
    },
    {
      name: "Kyla Morales",
      email: "kyla.morales@hotmail.com",
      phone: "+63926012345",
      password: "password123",
      shippingAddress: "741 J.P. Rizal Street, Butuan City, Agusan del Norte",
      city: "Butuan City",
      province: "Agusan del Norte",
      postalCode: "8600",
      totalSpent: "13400.00",
      totalOrders: 10
    },
    {
      name: "Camille Castro",
      email: "camille.castro@outlook.com", 
      phone: "+63927123456",
      password: "password123",
      shippingAddress: "852 Taft Avenue, Manila City, Metro Manila",
      city: "Manila City",
      province: "Metro Manila",
      postalCode: "1000",
      totalSpent: "5600.00",
      totalOrders: 3
    },
    {
      name: "Nicole Ramos",
      email: "nicole.ramos@gmail.com",
      phone: "+63928234567",
      password: "password123",
      shippingAddress: "963 Escolta Street, Binondo, Manila",
      city: "Manila",
      province: "Metro Manila",
      postalCode: "1006",
      totalSpent: "16800.00",
      totalOrders: 13
    },
    {
      name: "Alyssa Santiago",
      email: "alyssa.santiago@icloud.com",
      phone: "+63929345678", 
      password: "password123",
      shippingAddress: "159 Maharlika Highway, San Fernando, Pampanga",
      city: "San Fernando",
      province: "Pampanga",
      postalCode: "2000",
      totalSpent: "3900.00",
      totalOrders: 2
    },
    {
      name: "Krystal Villanueva",
      email: "krystal.villanueva@yahoo.com",
      phone: "+63930456789",
      password: "password123",
      shippingAddress: "357 MacArthur Highway, Angeles City, Pampanga",
      city: "Angeles City",
      province: "Pampanga",
      postalCode: "2009",
      totalSpent: "10200.00",
      totalOrders: 7
    },
    {
      name: "Andrea Aquino",
      email: "andrea.aquino@gmail.com", 
      phone: "+63931567890",
      password: "password123",
      shippingAddress: "486 National Highway, Bacolod City, Negros Occidental",
      city: "Bacolod City",
      province: "Negros Occidental",
      postalCode: "6100",
      totalSpent: "8300.00",
      totalOrders: 5
    }
  ];

  try {
    // Clear existing customers (for development/testing)
    console.log("Clearing existing customer data...");
    await db.delete(customers);

    // Insert sample customers
    console.log("Inserting sample customer accounts...");
    const insertedCustomers = await db.insert(customers).values(sampleCustomers).returning();
    
    console.log(`✅ Successfully seeded ${insertedCustomers.length} customer accounts`);
    console.log("\n📋 Sample Customer Accounts Created:");
    console.log("=====================================");
    
    insertedCustomers.slice(0, 5).forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name}`);
      console.log(`   Email: ${customer.email}`);
      console.log(`   Phone: ${customer.phone}`);
      console.log(`   Total Spent: ₱${Number(customer.totalSpent).toLocaleString()}`);
      console.log(`   Orders: ${customer.totalOrders}`);
      console.log(`   Address: ${customer.shippingAddress}`);
      console.log("   ---");
    });
    
    console.log(`... and ${insertedCustomers.length - 5} more customer accounts\n`);
    
    // Display usage instructions
    console.log("🎯 Demo Usage Instructions:");
    console.log("===========================");
    console.log("• These customer accounts can be used to test order placement");
    console.log("• Customer data includes realistic Philippine addresses and phone numbers");
    console.log("• Loyalty points and spending history are included for testing purposes");
    console.log("• Email addresses are fictional but formatted realistically");
    console.log("• Use any of these emails in the customer lookup or order system\n");

    return insertedCustomers;

  } catch (error) {
    console.error("❌ Error seeding customer data:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers()
    .then(() => {
      console.log("🌱 User database seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}