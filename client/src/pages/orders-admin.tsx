import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
  paymentMethod: string;
}

export default function OrdersAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock orders data - replace with real API
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "HBL-2025-001",
      customerName: "Maria Santos",
      email: "maria.santos@email.com",
      total: 4500,
      status: "processing",
      createdAt: "2025-01-26T10:30:00Z",
      items: [
        { productName: "Korean HD Lace 22\"", quantity: 1, price: 4500 }
      ],
      shippingAddress: "123 Quezon City, Metro Manila",
      paymentMethod: "GCash"
    },
    {
      id: "2",
      orderNumber: "HBL-2025-002",
      customerName: "Jennifer Cruz",
      email: "jen.cruz@email.com",
      total: 8900,
      status: "shipped",
      createdAt: "2025-01-25T14:20:00Z",
      items: [
        { productName: "European HD Lace 20\"", quantity: 1, price: 5800 },
        { productName: "Single Drawn 18\"", quantity: 1, price: 3100 }
      ],
      shippingAddress: "456 Makati City, Metro Manila",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "3",
      orderNumber: "HBL-2025-003",
      customerName: "Ana Reyes",
      email: "ana.reyes@email.com",
      total: 6200,
      status: "delivered",
      createdAt: "2025-01-24T09:15:00Z",
      items: [
        { productName: "Double Drawn 24\"", quantity: 1, price: 6200 }
      ],
      shippingAddress: "789 Cebu City, Cebu",
      paymentMethod: "Cash on Delivery"
    },
    {
      id: "4",
      orderNumber: "HBL-2025-004",
      customerName: "Carmen Torres",
      email: "carmen.torres@email.com",
      total: 3100,
      status: "pending",
      createdAt: "2025-01-26T16:45:00Z",
      items: [
        { productName: "Single Drawn 18\"", quantity: 1, price: 3100 }
      ],
      shippingAddress: "321 Davao City, Davao del Sur",
      paymentMethod: "GCash"
    }
  ];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <Package className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const orderStats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === "pending").length,
    processing: mockOrders.filter(o => o.status === "processing").length,
    shipped: mockOrders.filter(o => o.status === "shipped").length,
    delivered: mockOrders.filter(o => o.status === "delivered").length,
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0)
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
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground neon-text-purple">Order Management</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredOrders.length} orders • {formatCurrency(orderStats.totalRevenue)} total revenue
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
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
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{orderStats.total}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">{orderStats.pending}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold text-blue-500">{orderStats.processing}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Shipped</p>
                    <p className="text-2xl font-bold text-purple-500">{orderStats.shipped}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-2xl font-bold text-green-500">{orderStats.delivered}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(orderStats.totalRevenue)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
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
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="glass-card border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-foreground">{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-foreground">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm text-foreground">
                              {item.quantity}x {item.productName}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                        <p className="text-sm text-foreground">{order.shippingAddress}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                        <p className="text-sm text-foreground">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "No orders have been placed yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}