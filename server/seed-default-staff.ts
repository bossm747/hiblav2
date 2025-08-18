import { db } from './db.js';
import { staff } from '../shared/schema.js';
import { PERMISSIONS } from '../shared/permissions.js';
import bcrypt from 'bcrypt';

async function seedDefaultStaff() {
  try {
    console.log('Seeding default staff members...');

    // Default staff members with different roles and permissions
    const defaultStaff = [
      {
        id: 'staff-admin-001',
        name: 'System Administrator',
        email: 'admin@hibla.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '+1-555-0001',
        role: 'admin',
        permissions: Object.values(PERMISSIONS), // Full permissions
        isActive: true,
      },
      {
        id: 'staff-manager-001',
        name: 'Production Manager',
        email: 'manager@hibla.com',
        password: await bcrypt.hash('manager123', 10),
        phone: '+1-555-0002',
        role: 'manager',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.ANALYTICS_VIEW,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.QUOTATIONS_EDIT,
          PERMISSIONS.QUOTATIONS_APPROVE,
          PERMISSIONS.QUOTATIONS_CONVERT,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.SALES_ORDERS_CREATE,
          PERMISSIONS.SALES_ORDERS_EDIT,
          PERMISSIONS.JOB_ORDERS_VIEW,
          PERMISSIONS.JOB_ORDERS_CREATE,
          PERMISSIONS.JOB_ORDERS_EDIT,
          PERMISSIONS.JOB_ORDERS_COMPLETE,
          PERMISSIONS.INVENTORY_VIEW,
          PERMISSIONS.INVENTORY_EDIT,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.CUSTOMERS_CREATE,
          PERMISSIONS.CUSTOMERS_EDIT,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRICES_VIEW,
          PERMISSIONS.PAYMENTS_VIEW,
          PERMISSIONS.PAYMENTS_RECORD,
          PERMISSIONS.REPORTS_GENERATE,
        ],
        isActive: true,
      },
      {
        id: 'staff-employee-001',
        name: 'Manufacturing Staff',
        email: 'staff@hibla.com',
        password: await bcrypt.hash('staff123', 10),
        phone: '+1-555-0003',
        role: 'staff',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.JOB_ORDERS_VIEW,
          PERMISSIONS.INVENTORY_VIEW,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRICES_VIEW,
        ],
        isActive: true,
      }
    ];

    for (const staffMember of defaultStaff) {
      try {
        // Try to insert, if already exists, update
        const existing = await db
          .select()
          .from(staff)
          .where((table) => table.email === staffMember.email)
          .limit(1);

        if (existing.length === 0) {
          await db.insert(staff).values(staffMember);
          console.log(`Created staff member: ${staffMember.name} (${staffMember.email})`);
        } else {
          console.log(`Staff member already exists: ${staffMember.email}`);
        }
      } catch (error) {
        console.error(`Error seeding staff member ${staffMember.email}:`, error);
      }
    }

    console.log('Default staff seeding completed!');
    
    // Staff seeding completed successfully
    return true;
  } catch (error) {
    console.error('Error seeding default staff:', error);
    throw error;
  }
}

// Run if called directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  seedDefaultStaff()
    .then(() => {
      console.log('✅ Production staff accounts initialized successfully');
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
    });
}

export { seedDefaultStaff };