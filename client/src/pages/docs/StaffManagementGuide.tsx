import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Crown, 
  Briefcase, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

export default function StaffManagementGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Staff Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete team management system with role-based access control, 
          department organization, and comprehensive staff administration.
        </p>
      </div>

      {/* Staff Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-sm text-muted-foreground">Total Staff</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">11</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">8</div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">11</div>
              <div className="text-sm text-muted-foreground">User Roles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Hierarchy */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Organizational Structure</h2>
        <div className="space-y-6">
          {[
            {
              level: "Executive",
              roles: [{ name: "System Administrator", icon: Crown, count: 1, permissions: 35 }],
              color: "border-red-200 bg-red-50 dark:bg-red-950/10"
            },
            {
              level: "Management",
              roles: [
                { name: "Production Manager", icon: Briefcase, count: 1, permissions: 28 },
                { name: "Sales Manager", icon: UserCheck, count: 1, permissions: 22 },
                { name: "Inventory Manager", icon: Settings, count: 1, permissions: 18 }
              ],
              color: "border-purple-200 bg-purple-50 dark:bg-purple-950/10"
            },
            {
              level: "Supervisory",
              roles: [{ name: "Supervisor", icon: Users, count: 1, permissions: 16 }],
              color: "border-blue-200 bg-blue-50 dark:bg-blue-950/10"
            },
            {
              level: "Operational",
              roles: [
                { name: "Sales Staff", icon: UserCheck, count: 3, permissions: 12 },
                { name: "Production Staff", icon: Settings, count: 2, permissions: 8 },
                { name: "Inventory Staff", icon: Settings, count: 1, permissions: 9 }
              ],
              color: "border-green-200 bg-green-50 dark:bg-green-950/10"
            },
            {
              level: "Support",
              roles: [
                { name: "Customer Service", icon: Users, count: 1, permissions: 10 },
                { name: "Accountant", icon: Settings, count: 1, permissions: 11 }
              ],
              color: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10"
            }
          ].map((level) => (
            <Card key={level.level} className={level.color}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{level.level} Level</span>
                  <Badge variant="outline">{level.roles.reduce((sum, role) => sum + role.count, 0)} staff</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {level.roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <div key={role.name} className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Count: {role.count}</span>
                          <span>Permissions: {role.permissions}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Staff Management Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "User Account Management",
              description: "Create, edit, and manage staff accounts",
              icon: UserCheck,
              features: ["Account creation", "Profile management", "Password policies", "Account activation/deactivation"]
            },
            {
              title: "Role & Permission Control",
              description: "Assign roles and configure permissions",
              icon: Shield,
              features: ["Role assignment", "Permission customization", "Access level control", "Feature restrictions"]
            },
            {
              title: "Department Organization",
              description: "Organize staff by departments and teams",
              icon: Users,
              features: ["Department structure", "Team assignments", "Reporting hierarchy", "Cross-functional teams"]
            },
            {
              title: "Activity Monitoring",
              description: "Track staff activity and performance",
              icon: Eye,
              features: ["Login tracking", "Activity logs", "Performance metrics", "System usage analytics"]
            }
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Common Operations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Common Staff Operations</h2>
        <div className="space-y-4">
          {[
            {
              operation: "Add New Staff Member",
              description: "Create a new staff account with appropriate permissions",
              steps: ["Navigate to Staff Management", "Click 'Add Staff'", "Fill personal information", "Assign role and department"],
              complexity: "Easy",
              icon: Plus
            },
            {
              operation: "Update Staff Permissions",
              description: "Modify existing staff member permissions",
              steps: ["Find staff member", "Click 'Edit Permissions'", "Adjust role or custom permissions", "Save changes"],
              complexity: "Medium",
              icon: Edit
            },
            {
              operation: "Deactivate Staff Account",
              description: "Temporarily or permanently disable staff access",
              steps: ["Locate staff record", "Access account settings", "Set status to inactive", "Confirm deactivation"],
              complexity: "Easy",
              icon: Settings
            },
            {
              operation: "Transfer Department",
              description: "Move staff member to different department",
              steps: ["Open staff profile", "Edit department assignment", "Update reporting manager", "Notify relevant parties"],
              complexity: "Medium",
              icon: Users
            }
          ].map((op) => {
            const Icon = op.icon;
            return (
              <Card key={op.operation}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{op.operation}</h3>
                        <Badge variant={op.complexity === 'Easy' ? 'secondary' : 'default'}>
                          {op.complexity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{op.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {op.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Security Best Practices */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-red-800 dark:text-red-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Access Control:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Follow principle of least privilege</li>
                <li>• Regular permission audits</li>
                <li>• Remove access for terminated staff</li>
                <li>• Monitor suspicious activities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Account Management:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Strong password policies</li>
                <li>• Regular password changes</li>
                <li>• Account lockout policies</li>
                <li>• Activity logging and monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Issues & Solutions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Login Issues</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Check account status, reset password, and verify role assignments.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Permission Conflicts</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Review role hierarchy and resolve conflicting permission assignments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}