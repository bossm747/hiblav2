import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  FileText,
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { QuotationForm } from '@/components/forms/QuotationForm';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  
  // Analytics state
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Calculated metrics
  const totalQuotations = analytics ? parseInt(analytics.overview?.activeQuotations || '0') : 0;
  const totalSalesOrders = analytics ? parseInt(analytics.overview?.activeSalesOrders || '0') : 0;
  const totalJobOrders = analytics ? parseInt(analytics.overview?.activeJobOrders || '0') : 0;
  const totalCustomers = analytics ? parseInt(analytics.overview?.totalCustomers || '0') : 0;
  const conversionRate = totalQuotations > 0 ? ((totalSalesOrders / totalQuotations) * 100).toFixed(1) : '0.0';
  const totalRevenue = totalSalesOrders * 500;

  // Load dashboard analytics
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/dashboard/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setAnalyticsError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Chart data
  const monthlyData = [
    { month: 'Jan', quotations: 18, orders: 8, revenue: 4000 },
    { month: 'Feb', quotations: 22, orders: 12, revenue: 6000 },
    { month: 'Mar', quotations: totalQuotations, orders: totalSalesOrders, revenue: totalRevenue },
  ];

  const customerTiers = [
    { name: 'New Customer', value: 25, fill: '#3b82f6' },
    { name: 'Regular', value: 45, fill: '#10b981' },
    { name: 'Premier', value: 20, fill: '#f59e0b' },
    { name: 'Custom', value: 10, fill: '#ef4444' }
  ];

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Operations</h1>
            <p className="text-gray-600">Manage quotations, orders, and track sales performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={fetchAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="orders">Sales Orders</TabsTrigger>
            <TabsTrigger value="form">New Quotation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuotations}</div>
                  <p className="text-xs text-muted-foreground">Active quotations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSalesOrders}</div>
                  <p className="text-xs text-muted-foreground">Confirmed orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">Quote to order</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Pipeline value</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Quotations and orders over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="quotations" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Customers by pricing tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerTiers}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {customerTiers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quotations Tab */}
          <TabsContent value="quotations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quotations Management</CardTitle>
                    <CardDescription>View and manage all quotations</CardDescription>
                  </div>
                  <Button onClick={() => setActiveTab('form')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Quotation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search quotations..." className="pl-9" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm">
                    <div>Quote #</div>
                    <div>Customer</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  <Separator />
                  
                  {/* Sample quotation rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <div className="grid grid-cols-6 gap-4 p-4 text-sm">
                        <div className="font-medium">QT-{String(i).padStart(3, '0')}</div>
                        <div>Customer {i}</div>
                        <div>2025-01-{String(15 + i).padStart(2, '0')}</div>
                        <div>${(i * 500).toLocaleString()}</div>
                        <div>
                          <Badge variant={i % 3 === 0 ? "default" : i % 2 === 0 ? "secondary" : "outline"}>
                            {i % 3 === 0 ? "Approved" : i % 2 === 0 ? "Pending" : "Draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {i < 5 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Orders</CardTitle>
                <CardDescription>Track confirmed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Sales Orders Management</h3>
                  <p className="mb-4">Complete order tracking system</p>
                  <Badge variant="outline">{totalSalesOrders} Active Orders</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Tab - Single Container */}
          <TabsContent value="form" className="space-y-6">
            <Card className="max-w-none">
              <CardHeader>
                <CardTitle>Create New Quotation</CardTitle>
                <CardDescription>Generate a new quotation for customer inquiry</CardDescription>
              </CardHeader>
              <CardContent>
                <QuotationForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}