import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HiblaLogo } from '@/components/HiblaLogo';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { 
  Shield, 
  Users, 
  Package, 
  FileText, 
  CreditCard, 
  Settings, 
  Activity,
  LogOut,
  Search,
  Eye,
  Edit,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface CustomerData {
  id: string;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerCode: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
}

interface QuotationData {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerCode: string;
  status: string;
  totalAmount: string;
  validUntil: string;
  createdAt: string;
}

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const { toast } = useToast();

  // Fetch admin data
  const { data: customers, isLoading: customersLoading, refetch: refetchCustomers } = useQuery({
    queryKey: ['/api/admin-portal/customers'],
    queryFn: async () => {
      const response = await fetch('/api/admin-portal/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    enabled: isLoggedIn && !!adminSession,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/admin-portal/orders'],
    queryFn: async () => {
      const response = await fetch('/api/admin-portal/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: isLoggedIn && !!adminSession,
  });

  const { data: quotations, isLoading: quotationsLoading } = useQuery({
    queryKey: ['/api/admin-portal/quotations'],
    queryFn: async () => {
      const response = await fetch('/api/admin-portal/quotations');
      if (!response.ok) throw new Error('Failed to fetch quotations');
      return response.json();
    },
    enabled: isLoggedIn && !!adminSession,
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin-portal/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/admin-portal/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    },
    enabled: isLoggedIn && !!adminSession,
  });

  // Mutations
  const updateCustomerStatusMutation = useMutation({
    mutationFn: async ({ customerId, status }: { customerId: string; status: string }) => {
      const response = await fetch(`/api/admin-portal/customers/${customerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update customer status');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Customer status updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin-portal/customers'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update customer status', variant: 'destructive' });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin-portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const admin = await response.json();
        setAdminSession(admin);
        setIsLoggedIn(true);
        toast({ title: 'Welcome', description: `Logged in as ${admin.name}` });
      } else {
        const error = await response.json();
        setLoginError(error.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminSession(null);
    setCredentials({ email: '', password: '' });
    toast({ title: 'Logged out', description: 'You have been successfully logged out' });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <HiblaLogo size="lg" showText />
            </div>
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Admin Portal</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Administrative access for staff and managers
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Admin email address"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-600 text-sm">{loginError}</p>
              )}
              <Button type="submit" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Secure administrative access only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <HiblaLogo size="md" showText />
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {adminSession?.role}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {adminSession?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Customers</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {dashboardStats?.totalCustomers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Active Orders</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {dashboardStats?.activeOrders || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Pending Quotations</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {dashboardStats?.pendingQuotations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">System Status</p>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers, orders, quotations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="quotations" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Quotations</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    ))}
                  </div>
                ) : customers?.length > 0 ? (
                  <div className="space-y-4">
                    {customers.map((customer: CustomerData) => (
                      <div key={customer.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="font-semibold text-lg">{customer.name}</h3>
                              <Badge className="text-xs">{customer.customerCode}</Badge>
                              <Badge className={getStatusColor(customer.status)}>
                                {customer.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{customer.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{customer.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4" />
                                <span>{customer.totalOrders} orders | ${customer.totalSpent}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            {customer.status === 'active' ? (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateCustomerStatusMutation.mutate({ 
                                  customerId: customer.id, 
                                  status: 'suspended' 
                                })}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspend
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => updateCustomerStatusMutation.mutate({ 
                                  customerId: customer.id, 
                                  status: 'active' 
                                })}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No customers found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    ))}
                  </div>
                ) : orders?.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: OrderData) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.customerName} ({order.customerCode})
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total}</p>
                            <div className="flex space-x-2 mt-1">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <Badge className={getStatusColor(order.paymentStatus)}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Status
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotations Tab */}
          <TabsContent value="quotations">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Management</CardTitle>
              </CardHeader>
              <CardContent>
                {quotationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    ))}
                  </div>
                ) : quotations?.length > 0 ? (
                  <div className="space-y-4">
                    {quotations.map((quotation: QuotationData) => (
                      <div key={quotation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{quotation.quotationNumber}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {quotation.customerName} ({quotation.customerCode})
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Created: {new Date(quotation.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Valid until: {new Date(quotation.validUntil).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${quotation.totalAmount}</p>
                            <Badge className={getStatusColor(quotation.status)}>
                              {quotation.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No quotations found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portal Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Customer Portal
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Notification Settings
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Portal Version:</span>
                    <span className="font-medium">2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sessions:</span>
                    <span className="font-medium">{dashboardStats?.activeSessions || 1}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}