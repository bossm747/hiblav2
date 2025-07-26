import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Shield,
  UserPlus,
  Edit,
  Trash2,
  Clock,
  CheckCircle
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export default function StaffAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Mock staff data - replace with real API
  const mockStaff: StaffMember[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@hibla.com",
      phone: "+63 912 345 6789",
      role: "admin",
      permissions: ["manage_products", "manage_orders", "manage_staff", "view_reports", "manage_settings"],
      isActive: true,
      lastLogin: "2025-01-26T10:30:00Z",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@hibla.com",
      phone: "+63 923 456 7890",
      role: "manager",
      permissions: ["manage_products", "manage_orders", "view_reports"],
      isActive: true,
      lastLogin: "2025-01-25T14:20:00Z",
      createdAt: "2024-06-15T00:00:00Z"
    },
    {
      id: "3",
      name: "Juan Cruz",
      email: "juan@hibla.com",
      phone: "+63 934 567 8901",
      role: "cashier",
      permissions: ["manage_pos", "view_inventory"],
      isActive: true,
      lastLogin: "2025-01-26T09:15:00Z",
      createdAt: "2024-09-10T00:00:00Z"
    },
    {
      id: "4",
      name: "Ana Reyes",
      email: "ana@hibla.com",
      phone: "+63 945 678 9012",
      role: "staff",
      permissions: ["view_orders", "basic_pos"],
      isActive: false,
      lastLogin: "2024-12-20T16:45:00Z",
      createdAt: "2024-11-05T00:00:00Z"
    }
  ];

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500";
      case "manager": return "bg-blue-500";
      case "cashier": return "bg-green-500";
      case "staff": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getPermissionCount = (permissions: string[]) => {
    return permissions.length;
  };

  const staffStats = {
    total: mockStaff.length,
    active: mockStaff.filter(s => s.isActive).length,
    inactive: mockStaff.filter(s => !s.isActive).length,
    admin: mockStaff.filter(s => s.role === "admin").length,
    managers: mockStaff.filter(s => s.role === "manager").length,
    cashiers: mockStaff.filter(s => s.role === "cashier").length
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <RoleBasedSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="border-b border-white/20 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground neon-text-purple">Staff Management</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredStaff.length} staff members • {staffStats.active} active
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                    <p className="text-2xl font-bold text-foreground">{staffStats.total}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-500">{staffStats.active}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold text-red-500">{staffStats.admin}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Managers</p>
                    <p className="text-2xl font-bold text-blue-500">{staffStats.managers}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Cashiers</p>
                    <p className="text-2xl font-bold text-green-500">{staffStats.cashiers}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Inactive</p>
                    <p className="text-2xl font-bold text-gray-500">{staffStats.inactive}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-md bg-background text-foreground"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((staff) => (
                <Card key={staff.id} className="glass-card border-white/20 hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{staff.name}</h3>
                          <Badge className={`${getRoleColor(staff.role)} text-white border-0 text-xs`}>
                            {staff.role}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {staff.isActive ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground truncate">{staff.email}</span>
                      </div>
                      
                      {staff.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{staff.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {getPermissionCount(staff.permissions)} permissions
                        </span>
                      </div>
                      
                      <div className="pt-3 border-t border-white/10">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Last Login: {formatDate(staff.lastLogin)}</p>
                          <p>Joined: {formatDate(staff.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No staff found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "No staff members have been added yet"}
                </p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}