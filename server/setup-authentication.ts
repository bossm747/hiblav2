import { db } from './db';
import { staff } from '../shared/schema';
import { PERMISSIONS } from '../shared/permissions';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function setupAuthentication() {
  try {
    console.log('Setting up authentication system...');

    // Create default staff users with bcrypt hashed passwords
    const defaultStaff = [
      {
        id: 'staff-admin-001',
        name: 'System Administrator',
        email: 'admin@hibla.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '+1-555-0001',
        role: 'admin',
        permissions: Object.values(PERMISSIONS), // All permissions
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

    let createdUsers = 0;
    let existingUsers = 0;

    for (const user of defaultStaff) {
      try {
        // Check if user already exists
        const existing = await db
          .select()
          .from(staff)
          .where(eq(staff.email, user.email))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(staff).values(user);
          console.log(`✓ Created staff member: ${user.name} (${user.email})`);
          createdUsers++;
        } else {
          console.log(`• Staff member already exists: ${user.email}`);
          existingUsers++;
        }
      } catch (error) {
        console.error(`✗ Error creating staff member ${user.email}:`, error);
      }
    }

    console.log(`\nAuthentication setup complete!`);
    console.log(`Created: ${createdUsers} staff members`);
    console.log(`Already existed: ${existingUsers} staff members`);

    console.log('\n=== Demo Login Credentials ===');
    console.log('Admin: admin@hibla.com / admin123');
    console.log('Manager: manager@hibla.com / manager123');
    console.log('Staff: staff@hibla.com / staff123');
    console.log('==============================\n');

    return true;
  } catch (error) {
    console.error('Error setting up authentication:', error);
    throw error;
  }
}

export { setupAuthentication };

// Run if called directly (ES module compatible)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  setupAuthentication()
    .then(() => {
      console.log('Authentication setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Authentication setup failed:', error);
      process.exit(1);
    });
}