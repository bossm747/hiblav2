import { db } from './db';
import { staff } from '../shared/schema';
import { PERMISSIONS } from '../shared/permissions';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function setupAuthentication() {
  try {
    console.log('Setting up authentication system...');

    // Create comprehensive staff users with role-based permissions
    const defaultStaff = [
      // Administrative Staff
      {
        id: 'staff-admin-001',
        name: 'System Administrator',
        email: 'admin@hibla.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '+1-555-0001',
        role: 'admin',
        permissions: Object.values(PERMISSIONS), // All permissions
        isActive: true,
        department: 'Administration',
      },
      
      // Management Staff
      {
        id: 'staff-prod-mgr-001',
        name: 'Maria Santos',
        email: 'maria.santos@hibla.com',
        password: await bcrypt.hash('prodmgr123', 10),
        phone: '+63-917-123-4567',
        role: 'production_manager',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.ANALYTICS_VIEW,
          PERMISSIONS.REPORTS_GENERATE,
          PERMISSIONS.REPORTS_EXPORT,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.QUOTATIONS_EDIT,
          PERMISSIONS.QUOTATIONS_APPROVE,
          PERMISSIONS.QUOTATIONS_CONVERT,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.SALES_ORDERS_CREATE,
          PERMISSIONS.SALES_ORDERS_EDIT,
          PERMISSIONS.SALES_ORDERS_APPROVE,
          PERMISSIONS.JOB_ORDERS_VIEW,
          PERMISSIONS.JOB_ORDERS_CREATE,
          PERMISSIONS.JOB_ORDERS_EDIT,
          PERMISSIONS.JOB_ORDERS_COMPLETE,
          PERMISSIONS.INVENTORY_VIEW,
          PERMISSIONS.INVENTORY_EDIT,
          PERMISSIONS.INVENTORY_TRANSFER,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.CUSTOMERS_CREATE,
          PERMISSIONS.CUSTOMERS_EDIT,
          PERMISSIONS.STAFF_VIEW,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRODUCTS_EDIT,
          PERMISSIONS.PRICES_VIEW,
          PERMISSIONS.PAYMENTS_VIEW,
          PERMISSIONS.PAYMENTS_RECORD,
          PERMISSIONS.WAREHOUSE_MANAGEMENT,
        ],
        isActive: true,
        department: 'Production',
      },
      
      {
        id: 'staff-sales-mgr-001',
        name: 'Robert Chen',
        email: 'robert.chen@hibla.com',
        password: await bcrypt.hash('salesmgr123', 10),
        phone: '+1-555-2001',
        role: 'sales_manager',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.ANALYTICS_VIEW,
          PERMISSIONS.REPORTS_GENERATE,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.QUOTATIONS_EDIT,
          PERMISSIONS.QUOTATIONS_APPROVE,
          PERMISSIONS.QUOTATIONS_CONVERT,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.SALES_ORDERS_CREATE,
          PERMISSIONS.SALES_ORDERS_EDIT,
          PERMISSIONS.SALES_ORDERS_APPROVE,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.CUSTOMERS_CREATE,
          PERMISSIONS.CUSTOMERS_EDIT,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRICES_VIEW,
          PERMISSIONS.PRICES_EDIT,
          PERMISSIONS.PRICES_CREATE_LIST,
          PERMISSIONS.PAYMENTS_VIEW,
          PERMISSIONS.PAYMENTS_RECORD,
          PERMISSIONS.INVOICES_GENERATE,
        ],
        isActive: true,
        department: 'Sales',
      },
      
      {
        id: 'staff-inv-mgr-001',
        name: 'Jennifer Lopez',
        email: 'jennifer.lopez@hibla.com',
        password: await bcrypt.hash('invmgr123', 10),
        phone: '+1-555-3001',
        role: 'inventory_manager',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.ANALYTICS_VIEW,
          PERMISSIONS.INVENTORY_VIEW,
          PERMISSIONS.INVENTORY_EDIT,
          PERMISSIONS.INVENTORY_TRANSFER,
          PERMISSIONS.INVENTORY_ADJUST,
          PERMISSIONS.INVENTORY_AI_INSIGHTS,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRODUCTS_CREATE,
          PERMISSIONS.PRODUCTS_EDIT,
          PERMISSIONS.WAREHOUSE_MANAGEMENT,
          PERMISSIONS.REPORTS_GENERATE,
        ],
        isActive: true,
        department: 'Inventory',
      },
      
      // Supervisory Staff
      {
        id: 'staff-supervisor-001',
        name: 'Carlos Rivera',
        email: 'carlos.rivera@hibla.com',
        password: await bcrypt.hash('supervisor123', 10),
        phone: '+63-917-234-5678',
        role: 'supervisor',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.QUOTATIONS_EDIT,
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
        ],
        isActive: true,
        department: 'Operations',
      },
      
      // Operational Staff
      {
        id: 'staff-sales-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@hibla.com',
        password: await bcrypt.hash('sales123', 10),
        phone: '+1-555-4001',
        role: 'sales_staff',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.QUOTATIONS_EDIT,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.SALES_ORDERS_CREATE,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.CUSTOMERS_CREATE,
          PERMISSIONS.CUSTOMERS_EDIT,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRICES_VIEW,
          PERMISSIONS.PAYMENTS_VIEW,
        ],
        isActive: true,
        department: 'Sales',
      },
      
      {
        id: 'staff-production-001',
        name: 'Miguel Torres',
        email: 'miguel.torres@hibla.com',
        password: await bcrypt.hash('production123', 10),
        phone: '+63-917-345-6789',
        role: 'production_staff',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.JOB_ORDERS_VIEW,
          PERMISSIONS.JOB_ORDERS_EDIT,
          PERMISSIONS.JOB_ORDERS_COMPLETE,
          PERMISSIONS.INVENTORY_VIEW,
          PERMISSIONS.INVENTORY_EDIT,
          PERMISSIONS.PRODUCTS_VIEW,
        ],
        isActive: true,
        department: 'Production',
      },
      
      {
        id: 'staff-inventory-001',
        name: 'Anna Kim',
        email: 'anna.kim@hibla.com',
        password: await bcrypt.hash('inventory123', 10),
        phone: '+1-555-5001',
        role: 'inventory_staff',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.INVENTORY_VIEW,
          PERMISSIONS.INVENTORY_EDIT,
          PERMISSIONS.INVENTORY_TRANSFER,
          PERMISSIONS.INVENTORY_ADJUST,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRODUCTS_EDIT,
        ],
        isActive: true,
        department: 'Inventory',
      },
      
      {
        id: 'staff-cs-001',
        name: 'Emily Davis',
        email: 'emily.davis@hibla.com',
        password: await bcrypt.hash('service123', 10),
        phone: '+1-555-6001',
        role: 'customer_service',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.QUOTATIONS_VIEW,
          PERMISSIONS.QUOTATIONS_CREATE,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.JOB_ORDERS_VIEW,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.CUSTOMERS_CREATE,
          PERMISSIONS.CUSTOMERS_EDIT,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRICES_VIEW,
          PERMISSIONS.PAYMENTS_VIEW,
        ],
        isActive: true,
        department: 'Customer Service',
      },
      
      {
        id: 'staff-accountant-001',
        name: 'David Park',
        email: 'david.park@hibla.com',
        password: await bcrypt.hash('accounting123', 10),
        phone: '+1-555-7001',
        role: 'accountant',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.ANALYTICS_VIEW,
          PERMISSIONS.REPORTS_GENERATE,
          PERMISSIONS.REPORTS_EXPORT,
          PERMISSIONS.PAYMENTS_VIEW,
          PERMISSIONS.PAYMENTS_RECORD,
          PERMISSIONS.PAYMENTS_EDIT,
          PERMISSIONS.INVOICES_GENERATE,
          PERMISSIONS.SALES_ORDERS_VIEW,
          PERMISSIONS.CUSTOMERS_VIEW,
        ],
        isActive: true,
        department: 'Finance',
      },
      
      // Legacy staff for backwards compatibility
      {
        id: 'staff-manager-001',
        name: 'Production Manager (Legacy)',
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
        department: 'Management',
      },
      
      {
        id: 'staff-employee-001',
        name: 'Manufacturing Staff (Legacy)',
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
        department: 'Production',
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