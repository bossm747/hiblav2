import { db } from './db';
import { 
  clients, 
  services, 
  appointments,
  staffSchedules,
  staff 
} from '@shared/schema';

export async function seedSalonData() {
  console.log('🌱 Seeding salon data...');

  try {
    // Check if data already exists
    const existingClients = await db.select().from(clients).limit(1);
    if (existingClients.length > 0) {
      console.log('✓ Salon data already exists, skipping seed');
      return;
    }

    // Seed Services
    const serviceList = await db.insert(services).values([
      {
        name: "Classic Facial Treatment",
        description: "Deep cleansing facial with extraction and moisturizing treatment",
        category: "facial",
        duration: 60,
        price: "2500.00",
        isActive: true,
        imageUrl: "/images/services/facial.jpg"
      },
      {
        name: "Full Body Swedish Massage",
        description: "Relaxing full body massage using Swedish techniques",
        category: "massage",
        duration: 90,
        price: "3500.00",
        isActive: true,
        imageUrl: "/images/services/massage.jpg"
      },
      {
        name: "Hair Cut & Styling",
        description: "Professional haircut with wash and styling",
        category: "hair",
        duration: 45,
        price: "1500.00",
        isActive: true,
        imageUrl: "/images/services/haircut.jpg"
      },
      {
        name: "Hair Color Treatment",
        description: "Full hair coloring service with professional products",
        category: "hair",
        duration: 120,
        price: "4500.00",
        isActive: true,
        imageUrl: "/images/services/hair-color.jpg"
      },
      {
        name: "Manicure & Pedicure",
        description: "Complete nail care with polish application",
        category: "nail-care",
        duration: 75,
        price: "1800.00",
        isActive: true,
        imageUrl: "/images/services/nails.jpg"
      },
      {
        name: "Anti-Aging Facial",
        description: "Advanced anti-aging treatment with collagen therapy",
        category: "facial",
        duration: 90,
        price: "4000.00",
        isActive: true,
        imageUrl: "/images/services/anti-aging.jpg"
      },
      {
        name: "Hot Stone Massage",
        description: "Therapeutic massage using heated stones",
        category: "massage",
        duration: 75,
        price: "4200.00",
        isActive: true,
        imageUrl: "/images/services/hot-stone.jpg"
      },
      {
        name: "Body Scrub Treatment",
        description: "Exfoliating body treatment with moisturizing finish",
        category: "body-treatment",
        duration: 60,
        price: "2800.00",
        isActive: true,
        imageUrl: "/images/services/body-scrub.jpg"
      }
    ]).returning();

    console.log(`✓ Seeded ${serviceList.length} services`);

    // Seed Clients
    const clientList = await db.insert(clients).values([
      {
        name: "Isabella Garcia",
        email: "isabella.garcia@gmail.com",
        phone: "+63 917 555 1111",
        address: "456 Ortigas Center, Pasig City",
        dateOfBirth: "1990-03-15",
        notes: "Prefers afternoon appointments",
        skinType: "combination",
        hairType: "wavy",
        allergies: ["lavender"]
      },
      {
        name: "Miguel Torres",
        email: "miguel.torres@yahoo.com",
        phone: "+63 917 555 2222", 
        address: "789 BGC, Taguig City",
        dateOfBirth: "1985-07-22",
        notes: "Regular customer, prefers Maria as therapist",
        skinType: "oily",
        hairType: "straight",
        allergies: []
      },
      {
        name: "Sofia Mendoza",
        email: "sofia.mendoza@hotmail.com",
        phone: "+63 917 555 3333",
        address: "321 Alabang, Muntinlupa City",
        dateOfBirth: "1988-11-08",
        notes: "Allergic to certain essential oils",
        skinType: "sensitive",
        hairType: "curly",
        allergies: ["eucalyptus", "tea tree"]
      },
      {
        name: "David Ramos",
        email: "david.ramos@gmail.com",
        phone: "+63 917 555 4444",
        address: "654 Quezon City",
        dateOfBirth: "1982-05-30",
        notes: "Prefers weekend appointments",
        skinType: "dry",
        hairType: "straight",
        allergies: []
      },
      {
        name: "Carmen Villanueva",
        email: "carmen.v@gmail.com",
        phone: "+63 917 555 5555",
        address: "987 Marikina City",
        dateOfBirth: "1995-09-12",
        notes: "First-time client, interested in facial treatments",
        skinType: "normal",
        hairType: "wavy",
        allergies: []
      },
      {
        name: "Elena Rodriguez",
        email: "elena.rodriguez@gmail.com",
        phone: "+63 917 555 6666",
        address: "123 Makati City",
        dateOfBirth: "1987-08-14",
        notes: "Regular for monthly facials and massages",
        skinType: "combination",
        hairType: "curly",
        allergies: ["coconut oil"]
      }
    ]).returning();

    console.log(`✓ Seeded ${clientList.length} clients`);

    // Get existing staff for appointments
    const existingStaff = await db.select().from(staff).limit(3);
    
    if (existingStaff.length > 0) {
      // Seed some sample appointments
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appointmentList = await db.insert(appointments).values([
        {
          clientId: clientList[0].id,
          serviceId: serviceList[0].id, // Classic Facial
          staffId: existingStaff[0].id,
          date: tomorrow.toISOString().split('T')[0],
          time: "10:00",
          duration: 60,
          status: "confirmed",
          totalAmount: "2500.00",
          notes: "First time facial treatment"
        },
        {
          clientId: clientList[1].id,
          serviceId: serviceList[1].id, // Swedish Massage
          staffId: existingStaff[1].id,
          date: tomorrow.toISOString().split('T')[0],
          time: "14:00",
          duration: 90,
          status: "confirmed",
          totalAmount: "3500.00",
          notes: "Regular client, knows the routine"
        },
        {
          clientId: clientList[2].id,
          serviceId: serviceList[2].id, // Hair Cut
          staffId: existingStaff[2].id,
          date: tomorrow.toISOString().split('T')[0],
          time: "16:30",
          duration: 45,
          status: "confirmed",
          totalAmount: "1500.00",
          notes: "Trim only, no styling needed"
        }
      ]).returning();

      console.log(`✓ Seeded ${appointmentList.length} appointments`);

      // Seed staff schedules for tomorrow
      const scheduleList = await db.insert(staffSchedules).values([
        {
          staffId: existingStaff[0].id,
          date: tomorrow.toISOString().split('T')[0],
          startTime: "09:00",
          endTime: "18:00",
          isAvailable: true,
          breakStart: "12:00",
          breakEnd: "13:00",
          notes: "Regular schedule"
        },
        {
          staffId: existingStaff[1].id,
          date: tomorrow.toISOString().split('T')[0],
          startTime: "10:00",
          endTime: "19:00",
          isAvailable: true,
          breakStart: "13:00",
          breakEnd: "14:00",
          notes: "Late start, extended hours"
        },
        {
          staffId: existingStaff[2].id,
          date: tomorrow.toISOString().split('T')[0],
          startTime: "08:00",
          endTime: "17:00",
          isAvailable: true,
          breakStart: "12:30",
          breakEnd: "13:30",
          notes: "Early bird schedule"
        }
      ]).returning();

      console.log(`✓ Seeded ${scheduleList.length} staff schedules`);
    }

    console.log('🎉 Salon data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding salon data:', error);
    throw error;
  }
}