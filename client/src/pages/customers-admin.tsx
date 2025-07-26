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
  MapPin,
  ShoppingCart,
  DollarSign,
  Calendar,
  UserPlus
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  province: string | null;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string | null;
  status: string;
  createdAt: string;
}

export default function CustomersAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numAmount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      case "suspended": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const customerStats = {
    total: customers?.length || 0,
    active: customers?.filter(c => c.status === "active").length || 0,
    inactive: customers?.filter(c => c.status === "inactive").length || 0,
    totalRevenue: customers?.reduce((sum, customer) => sum + parseFloat(customer.totalSpent), 0) || 0,
    averageOrderValue: customers?.length 
      ? (customers.reduce((sum, customer) => sum + parseFloat(customer.totalSpent), 0) / 
         customers.reduce((sum, customer) => sum + customer.totalOrders, 0)) || 0
      : 0
  };

  if (isLoading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="flex min-h-screen bg-background">
          <RoleBasedSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 lg:ml-64 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

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
                    <h1 className="text-2xl font-bold text-foreground neon-text-purple">Customer Management</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredCustomers.length} customers • {formatCurrency(customerStats.totalRevenue)} total revenue
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
                    Add Customer
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold text-foreground">{customerStats.total}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-500">{customerStats.active}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Inactive</p>
                    <p className="text-2xl font-bold text-gray-500">{customerStats.inactive}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(customerStats.totalRevenue)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(customerStats.averageOrderValue)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="glass-card border-white/20 hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{customer.name}</h3>
                          <Badge className={`${getStatusColor(customer.status)} text-white border-0 text-xs`}>
                            {customer.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground truncate">{customer.email}</span>
                      </div>
                      
                      {customer.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{customer.phone}</span>
                        </div>
                      )}
                      
                      {(customer.city || customer.province) && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {[customer.city, customer.province].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <ShoppingCart className="h-4 w-4 text-blue-500" />
                          </div>
                          <p className="text-sm text-muted-foreground">Orders</p>
                          <p className="text-lg font-bold text-foreground">{customer.totalOrders}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <DollarSign className="h-4 w-4 text-green-500" />
                          </div>
                          <p className="text-sm text-muted-foreground">Spent</p>
                          <p className="text-sm font-bold text-foreground">{formatCurrency(customer.totalSpent)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="text-xs text-muted-foreground">
                          <p>Last Order: {formatDate(customer.lastOrder)}</p>
                          <p>Joined: {formatDate(customer.createdAt)}</p>
                        </div>
                        
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "No customers have registered yet"}
                </p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}