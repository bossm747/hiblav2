import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Crown, 
  Briefcase, 
  ShoppingCart, 
  Package, 
  UserCheck,
  Settings,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const roles = [
  {
    id: 'admin',
    name: 'System Administrator',
    description: 'Complete system control with full access to all features and user management',
    icon: Crown,
    color: 'text-red-600 bg-red-100 border-red-200',
    level: 'Executive',
    permissions: 35,
    features: [
      'Full system access',
      'User management & roles',
      'System configuration',
      'Security settings',
      'Data backup & restore',
      'Performance monitoring'
    ]
  },
  {
    id: 'production_manager',
    name: 'Production Manager', 
    description: 'Oversees all manufacturing operations, job orders, and production planning',
    icon: Briefcase,
    color: 'text-purple-600 bg-purple-100 border-purple-200',
    level: 'Management',
    permissions: 28,
    features: [
      'Production oversight',
      'Job order management',
      'Inventory control',
      'Staff coordination',
      'Quality assurance',
      'Delivery scheduling'
    ]
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    description: 'Manages sales operations, customer relations, and pricing strategies',
    icon: ShoppingCart,
    color: 'text-blue-600 bg-blue-100 border-blue-200',
    level: 'Management',
    permissions: 22,
    features: [
      'Sales oversight',
      'Customer management',
      'Pricing control',
      'Quote approval',
      'Sales reporting',
      'Team management'
    ]
  },
  {
    id: 'inventory_manager',
    name: 'Inventory Manager',
    description: 'Controls inventory operations across multiple warehouses and locations',
    icon: Package,
    color: 'text-green-600 bg-green-100 border-green-200',
    level: 'Management',
    permissions: 18,
    features: [
      'Inventory oversight',
      'Warehouse management',
      'Stock optimization',
      'Transfer coordination',
      'AI insights access',
      'Reporting'
    ]
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Supervises daily operations across multiple departments',
    icon: UserCheck,
    color: 'text-orange-600 bg-orange-100 border-orange-200',
    level: 'Supervisory',
    permissions: 16,
    features: [
      'Daily operations',
      'Team supervision',
      'Process monitoring',
      'Quality control',
      'Basic reporting',
      'Staff coordination'
    ]
  },
  {
    id: 'sales_staff',
    name: 'Sales Staff',
    description: 'Handles customer quotations, inquiries, and sales order processing',
    icon: Users,
    color: 'text-cyan-600 bg-cyan-100 border-cyan-200',
    level: 'Operational',
    permissions: 12,
    features: [
      'Create quotations',
      'Customer contact',
      'Order processing',
      'Product catalog',
      'Basic customer data',
      'Sales tracking'
    ]
  },
  {
    id: 'production_staff',
    name: 'Production Staff',
    description: 'Works on manufacturing tasks, job completion, and production tracking',
    icon: Settings,
    color: 'text-indigo-600 bg-indigo-100 border-indigo-200',
    level: 'Operational',
    permissions: 8,
    features: [
      'Job order access',
      'Production tracking',
      'Inventory updates',
      'Quality checks',
      'Time tracking',
      'Basic reporting'
    ]
  },
  {
    id: 'inventory_staff',
    name: 'Inventory Staff',
    description: 'Manages inventory tracking, transfers, and stock adjustments',
    icon: Package,
    color: 'text-teal-600 bg-teal-100 border-teal-200',
    level: 'Operational',
    permissions: 9,
    features: [
      'Inventory tracking',
      'Stock adjustments',
      'Transfer processing',
      'Receiving goods',
      'Location management',
      'Count verification'
    ]
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    description: 'Assists customers with inquiries, support, and order status updates',
    icon: Users,
    color: 'text-pink-600 bg-pink-100 border-pink-200',
    level: 'Support',
    permissions: 10,
    features: [
      'Customer support',
      'Order inquiries',
      'Status updates',
      'Problem resolution',
      'Basic data access',
      'Communication logs'
    ]
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Manages financial records, payments, and financial reporting',
    icon: Settings,
    color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    level: 'Financial',
    permissions: 11,
    features: [
      'Financial records',
      'Payment processing',
      'Invoice generation',
      'Financial reports',
      'Revenue tracking',
      'Audit trails'
    ]
  },
  {
    id: 'customer',
    name: 'Customer',
    description: 'External customer access to portal features and order tracking',
    icon: Eye,
    color: 'text-gray-600 bg-gray-100 border-gray-200',
    level: 'External',
    permissions: 1,
    features: [
      'Portal access',
      'Order tracking',
      'Quote viewing',
      'Account management',
      'Communication',
      'Document download'
    ]
  }
];

const permissionMatrix = {
  'Dashboard & Analytics': {
    admin: true,
    production_manager: true,
    sales_manager: true,
    inventory_manager: true,
    supervisor: true,
    sales_staff: true,
    production_staff: true,
    inventory_staff: true,
    customer_service: true,
    accountant: true,
    customer: false
  },
  'Quotation Management': {
    admin: true,
    production_manager: true,
    sales_manager: true,
    inventory_manager: false,
    supervisor: true,
    sales_staff: true,
    production_staff: false,
    inventory_staff: false,
    customer_service: true,
    accountant: false,
    customer: false
  },
  'Sales Orders': {
    admin: true,
    production_manager: true,
    sales_manager: true,
    inventory_manager: false,
    supervisor: true,
    sales_staff: true,
    production_staff: false,
    inventory_staff: false,
    customer_service: true,
    accountant: true,
    customer: false
  },
  'Job Orders': {
    admin: true,
    production_manager: true,
    sales_manager: false,
    inventory_manager: false,
    supervisor: true,
    sales_staff: false,
    production_staff: true,
    inventory_staff: false,
    customer_service: true,
    accountant: false,
    customer: false
  },
  'Inventory Management': {
    admin: true,
    production_manager: true,
    sales_manager: false,
    inventory_manager: true,
    supervisor: true,
    sales_staff: false,
    production_staff: true,
    inventory_staff: true,
    customer_service: false,
    accountant: false,
    customer: false
  },
  'User Management': {
    admin: true,
    production_manager: false,
    sales_manager: false,
    inventory_manager: false,
    supervisor: false,
    sales_staff: false,
    production_staff: false,
    inventory_staff: false,
    customer_service: false,
    accountant: false,
    customer: false
  },
  'System Settings': {
    admin: true,
    production_manager: false,
    sales_manager: false,
    inventory_manager: false,
    supervisor: false,
    sales_staff: false,
    production_staff: false,
    inventory_staff: false,
    customer_service: false,
    accountant: false,
    customer: false
  }
};

export default function UserRolesGuide() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [expandedRole, setExpandedRole] = useState(null);

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">User Roles & Access Control</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to user roles, permissions, and access control in Hibla Manufacturing System. 
          Understand what each role can do and how to manage team access effectively.
        </p>
      </div>

      {/* Role Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{roles.filter(r => r.level === 'Executive').length}</div>
            <div className="text-sm text-muted-foreground">Executive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{roles.filter(r => r.level === 'Management').length}</div>
            <div className="text-sm text-muted-foreground">Management</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{roles.filter(r => r.level === 'Operational').length}</div>
            <div className="text-sm text-muted-foreground">Operational</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{roles.filter(r => r.level === 'Support' || r.level === 'Financial' || r.level === 'External').length}</div>
            <div className="text-sm text-muted-foreground">Other</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Role Details</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Role to View Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Button
                      key={role.id}
                      variant={selectedRole === role.id ? "default" : "outline"}
                      onClick={() => setSelectedRole(role.id)}
                      className="h-auto p-4 justify-start"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs opacity-75">{role.level}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Role Details */}
          {selectedRoleData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <selectedRoleData.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{selectedRoleData.name}</CardTitle>
                      <Badge className={selectedRoleData.color}>{selectedRoleData.level}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedRoleData.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedRoleData.permissions}</div>
                      <div className="text-sm text-muted-foreground">Permissions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedRoleData.features.length}</div>
                      <div className="text-sm text-muted-foreground">Key Features</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Features & Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedRoleData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Roles Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Role Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Executive', 'Management', 'Supervisory', 'Operational', 'Support', 'Financial', 'External'].map((level) => {
                  const levelRoles = roles.filter(role => role.level === level);
                  if (levelRoles.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                        <span>{level} Level</span>
                        <Badge variant="outline">{levelRoles.length} roles</Badge>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {levelRoles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <div key={role.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <Icon className="h-5 w-5 text-primary" />
                                  <div>
                                    <div className="font-medium">{role.name}</div>
                                    <div className="text-sm text-muted-foreground">{role.permissions} permissions</div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedRole(role.id)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Permission Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete overview of what each role can access across different system modules.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Module / Feature</th>
                      {roles.slice(0, -1).map((role) => ( // Exclude customer role for cleaner matrix
                        <th key={role.id} className="text-center p-2 font-medium min-w-24">
                          <div className="flex flex-col items-center space-y-1">
                            <role.icon className="h-4 w-4" />
                            <span className="text-xs">{role.name.split(' ')[0]}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissionMatrix).map(([module, permissions]) => (
                      <tr key={module} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{module}</td>
                        {roles.slice(0, -1).map((role) => (
                          <td key={role.id} className="text-center p-3">
                            {permissions[role.id] ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Permission Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Full Access</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Complete read and write access to the module with all features available.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span>Read Only</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    View-only access to data and reports without editing capabilities.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span>No Access</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No access to the module or its features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}