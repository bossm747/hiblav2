// Comprehensive permission system for Hibla Manufacturing
export const PERMISSIONS = {
  // Dashboard & Analytics
  DASHBOARD_VIEW: 'dashboard_view',
  ANALYTICS_VIEW: 'analytics_view',
  REPORTS_GENERATE: 'reports_generate',
  REPORTS_EXPORT: 'reports_export',

  // Quotation Management
  QUOTATIONS_VIEW: 'quotations_view',
  QUOTATIONS_CREATE: 'quotations_create',
  QUOTATIONS_EDIT: 'quotations_edit',
  QUOTATIONS_DELETE: 'quotations_delete',
  QUOTATIONS_APPROVE: 'quotations_approve',
  QUOTATIONS_CONVERT: 'quotations_convert', // Convert to sales order

  // Sales Order Management
  SALES_ORDERS_VIEW: 'sales_orders_view',
  SALES_ORDERS_CREATE: 'sales_orders_create',
  SALES_ORDERS_EDIT: 'sales_orders_edit',
  SALES_ORDERS_DELETE: 'sales_orders_delete',
  SALES_ORDERS_APPROVE: 'sales_orders_approve',

  // Job Order Management
  JOB_ORDERS_VIEW: 'job_orders_view',
  JOB_ORDERS_CREATE: 'job_orders_create',
  JOB_ORDERS_EDIT: 'job_orders_edit',
  JOB_ORDERS_DELETE: 'job_orders_delete',
  JOB_ORDERS_COMPLETE: 'job_orders_complete',

  // Inventory Management
  INVENTORY_VIEW: 'inventory_view',
  INVENTORY_EDIT: 'inventory_edit',
  INVENTORY_TRANSFER: 'inventory_transfer',
  INVENTORY_ADJUST: 'inventory_adjust',
  INVENTORY_AI_INSIGHTS: 'inventory_ai_insights',

  // Customer Management
  CUSTOMERS_VIEW: 'customers_view',
  CUSTOMERS_CREATE: 'customers_create',
  CUSTOMERS_EDIT: 'customers_edit',
  CUSTOMERS_DELETE: 'customers_delete',
  CUSTOMERS_PORTAL_ACCESS: 'customers_portal_access',

  // Staff Management
  STAFF_VIEW: 'staff_view',
  STAFF_CREATE: 'staff_create',
  STAFF_EDIT: 'staff_edit',
  STAFF_DELETE: 'staff_delete',
  STAFF_PERMISSIONS: 'staff_permissions', // Manage other staff permissions

  // Product Management
  PRODUCTS_VIEW: 'products_view',
  PRODUCTS_CREATE: 'products_create',
  PRODUCTS_EDIT: 'products_edit',
  PRODUCTS_DELETE: 'products_delete',

  // Price Management
  PRICES_VIEW: 'prices_view',
  PRICES_EDIT: 'prices_edit',
  PRICES_CREATE_LIST: 'prices_create_list',
  PRICES_DELETE_LIST: 'prices_delete_list',

  // Payment & Financial
  PAYMENTS_VIEW: 'payments_view',
  PAYMENTS_RECORD: 'payments_record',
  PAYMENTS_EDIT: 'payments_edit',
  INVOICES_GENERATE: 'invoices_generate',

  // System Settings
  EMAIL_SETTINGS: 'email_settings',
  WAREHOUSE_MANAGEMENT: 'warehouse_management',
  SYSTEM_SETTINGS: 'system_settings',

  // Portal Management
  PORTAL_HUB_ACCESS: 'portal_hub_access',
  ADMIN_PORTAL_ACCESS: 'admin_portal_access',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Permission Groups for easy management
export const PERMISSION_GROUPS = {
  'Dashboard & Reporting': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  'Quotation Management': [
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.QUOTATIONS_EDIT,
    PERMISSIONS.QUOTATIONS_DELETE,
    PERMISSIONS.QUOTATIONS_APPROVE,
    PERMISSIONS.QUOTATIONS_CONVERT,
  ],
  'Order Management': [
    PERMISSIONS.SALES_ORDERS_VIEW,
    PERMISSIONS.SALES_ORDERS_CREATE,
    PERMISSIONS.SALES_ORDERS_EDIT,
    PERMISSIONS.SALES_ORDERS_DELETE,
    PERMISSIONS.SALES_ORDERS_APPROVE,
    PERMISSIONS.JOB_ORDERS_VIEW,
    PERMISSIONS.JOB_ORDERS_CREATE,
    PERMISSIONS.JOB_ORDERS_EDIT,
    PERMISSIONS.JOB_ORDERS_DELETE,
    PERMISSIONS.JOB_ORDERS_COMPLETE,
  ],
  'Inventory & Products': [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_AI_INSIGHTS,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE,
  ],
  'Customer & Staff Management': [
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_EDIT,
    PERMISSIONS.CUSTOMERS_DELETE,
    PERMISSIONS.CUSTOMERS_PORTAL_ACCESS,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.STAFF_CREATE,
    PERMISSIONS.STAFF_EDIT,
    PERMISSIONS.STAFF_DELETE,
    PERMISSIONS.STAFF_PERMISSIONS,
  ],
  'Financial Management': [
    PERMISSIONS.PRICES_VIEW,
    PERMISSIONS.PRICES_EDIT,
    PERMISSIONS.PRICES_CREATE_LIST,
    PERMISSIONS.PRICES_DELETE_LIST,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_RECORD,
    PERMISSIONS.PAYMENTS_EDIT,
    PERMISSIONS.INVOICES_GENERATE,
  ],
  'System Administration': [
    PERMISSIONS.EMAIL_SETTINGS,
    PERMISSIONS.WAREHOUSE_MANAGEMENT,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.PORTAL_HUB_ACCESS,
    PERMISSIONS.ADMIN_PORTAL_ACCESS,
  ],
};

// Role-based default permissions
export const ROLE_PERMISSIONS = {
  owner: Object.values(PERMISSIONS), // Full access to everything
  admin: [
    // Dashboard & Analytics
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
    
    // All quotation permissions except delete
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.QUOTATIONS_EDIT,
    PERMISSIONS.QUOTATIONS_APPROVE,
    PERMISSIONS.QUOTATIONS_CONVERT,
    
    // All order management
    PERMISSIONS.SALES_ORDERS_VIEW,
    PERMISSIONS.SALES_ORDERS_CREATE,
    PERMISSIONS.SALES_ORDERS_EDIT,
    PERMISSIONS.SALES_ORDERS_APPROVE,
    PERMISSIONS.JOB_ORDERS_VIEW,
    PERMISSIONS.JOB_ORDERS_CREATE,
    PERMISSIONS.JOB_ORDERS_EDIT,
    PERMISSIONS.JOB_ORDERS_COMPLETE,
    
    // Inventory management
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_AI_INSIGHTS,
    
    // Customer management
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_EDIT,
    PERMISSIONS.CUSTOMERS_PORTAL_ACCESS,
    
    // Staff view only (no management)
    PERMISSIONS.STAFF_VIEW,
    
    // Product management
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    
    // Price management
    PERMISSIONS.PRICES_VIEW,
    PERMISSIONS.PRICES_EDIT,
    
    // Payment management
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_RECORD,
    PERMISSIONS.INVOICES_GENERATE,
    
    // Portal access
    PERMISSIONS.PORTAL_HUB_ACCESS,
    PERMISSIONS.ADMIN_PORTAL_ACCESS,
  ],
  manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.QUOTATIONS_EDIT,
    PERMISSIONS.SALES_ORDERS_VIEW,
    PERMISSIONS.SALES_ORDERS_CREATE,
    PERMISSIONS.JOB_ORDERS_VIEW,
    PERMISSIONS.JOB_ORDERS_CREATE,
    PERMISSIONS.JOB_ORDERS_EDIT,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_EDIT,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRICES_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_RECORD,
  ],
  staff: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.SALES_ORDERS_VIEW,
    PERMISSIONS.JOB_ORDERS_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRICES_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
  ],
};

// Utility functions
export const getAllPermissions = (): Permission[] => Object.values(PERMISSIONS);

export const getPermissionsByRole = (role: string): Permission[] => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.staff;
};

export const hasPermission = (userPermissions: Permission[], requiredPermission: Permission): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};