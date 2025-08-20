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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  Briefcase,
  DollarSign,
  Clock,
  Target,
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  Search,
  Plus,
  ChevronDown,
  Menu,
  Filter,
  Activity,
  Package,
  ShoppingCart,
  Zap
} from 'lucide-react';
import { QuotationForm } from '@/components/forms/QuotationForm';
import { SalesWorkflowVisualizer } from '@/components/sales/SalesWorkflowVisualizer';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  
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
  const totalRevenue = totalSalesOrders * 500; // Estimated average order value

  console.log('🔍 Sales Operations Dashboard - Calculated Metrics:', {
    totalQuotations,
    totalSalesOrders,
    totalCustomers,
    conversionRate: `${conversionRate}%`,
    totalRevenue,
    analyticsLoading,
    analyticsError
  });

  // Load dashboard analytics
  useEffect(() => {
    console.log('🔄 Fetching dashboard analytics for Sales Operations...');
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

      console.log('🔗 API Request:', `${window.location.origin}/api/dashboard/analytics`);
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
      console.log('📤 Request headers:', ['Content-Type', 'Authorization']);

      const response = await fetch('/api/dashboard/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', typeof data);
      console.log('✅ Analytics data received:', data);
      
      setAnalytics(data);
    } catch (error) {
      console.error('❌ Analytics fetch error:', error);
      setAnalyticsError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Sample data for charts
  const salesFunnelData = [
    { name: 'Leads', value: 120, fill: '#8b5cf6' },
    { name: 'Quotations', value: totalQuotations, fill: '#06b6d4' },
    { name: 'Sales Orders', value: totalSalesOrders, fill: '#10b981' },
    { name: 'Completed', value: Math.floor(totalSalesOrders * 0.8), fill: '#f59e0b' }
  ];

  const monthlyTrends = [
    { month: 'Jan', quotations: 18, orders: 8, revenue: 4000 },
    { month: 'Feb', quotations: 22, orders: 12, revenue: 6000 },
    { month: 'Mar', quotations: totalQuotations, orders: totalSalesOrders, revenue: totalRevenue },
  ];

  const customerSegments = [
    { name: 'New Customer', value: 25, fill: '#8b5cf6' },
    { name: 'Regular', value: 45, fill: '#06b6d4' },
    { name: 'Premier', value: 20, fill: '#10b981' },
    { name: 'Custom', value: 10, fill: '#f59e0b' }
  ];

  const performanceMetrics = [
    { name: 'Mon', quotations: 4, orders: 2 },
    { name: 'Tue', quotations: 6, orders: 3 },
    { name: 'Wed', quotations: 8, orders: 4 },
    { name: 'Thu', quotations: 5, orders: 2 },
    { name: 'Fri', quotations: 7, orders: 3 },
    { name: 'Sat', quotations: 3, orders: 1 },
    { name: 'Sun', quotations: 2, orders: 1 }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Sticky Header - Mobile First */}
        <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-col space-y-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:p-6">
            {/* Title Section */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales Operations</h1>
              <p className="text-sm text-muted-foreground md:text-base">
                Monitor quotations, track conversions, and manage the complete sales pipeline
              </p>
            </div>

            {/* Action Buttons - Mobile Responsive */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 lg:space-x-3">
              <QuotationForm />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                <span className="sm:hidden">Filters</span>
                <span className="hidden sm:inline">Filter & Search</span>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={fetchAnalytics} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                <span className="sm:hidden">Refresh</span>
                <span className="hidden sm:inline">Refresh Data</span>
              </Button>
            </div>
          </div>

          {/* Collapsible Filters - Clean Mobile Design */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="border-t bg-muted/30 px-4 py-4 lg:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date-range" className="text-sm font-medium">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="date-range" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 3 months</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-tier" className="text-sm font-medium">Customer Tier</Label>
                  <Select>
                    <SelectTrigger id="customer-tier" className="h-10">
                      <SelectValue placeholder="All tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tiers</SelectItem>
                      <SelectItem value="new">New Customer</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="premier">Premier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Select>
                    <SelectTrigger id="status" className="h-10">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="search"
                      placeholder="Search customers, orders..."
                      className="h-10 pl-9"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Mobile-First Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
              <TabsTrigger 
                value="overview" 
                className="flex-col space-y-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Activity className="h-4 w-4" />
                <span className="text-xs lg:text-sm">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quotations" 
                className="flex-col space-y-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="h-4 w-4" />
                <span className="text-xs lg:text-sm">Quotations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sales-orders" 
                className="flex-col space-y-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs lg:text-sm">Sales Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="job-orders" 
                className="flex-col space-y-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="h-4 w-4" />
                <span className="text-xs lg:text-sm">Production</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab - Completely Redesigned */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Cards - Mobile Responsive Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalQuotations}</div>
                    <p className="text-xs text-muted-foreground">Active quotations</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalSalesOrders}</div>
                    <p className="text-xs text-muted-foreground">Confirmed orders</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">Quote to order</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Estimated value</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section - Responsive Layout */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales Funnel */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Sales Conversion Funnel</CardTitle>
                    <CardDescription>Track lead progression through sales pipeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <FunnelChart>
                          <Funnel
                            dataKey="value"
                            data={salesFunnelData}
                            isAnimationActive
                          >
                            <LabelList position="center" fill="#fff" stroke="none" />
                          </Funnel>
                          <Tooltip />
                        </FunnelChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Performance</CardTitle>
                    <CardDescription>Quotations vs Orders trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="quotations" stroke="#8b5cf6" strokeWidth={2} />
                          <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Segments */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Segments</CardTitle>
                    <CardDescription>Distribution across pricing tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={customerSegments}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {customerSegments.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Performance */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Activity</CardTitle>
                    <CardDescription>Daily quotations and order processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="quotations" fill="#06b6d4" />
                          <Bar dataKey="orders" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sales Workflow Visualizer */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Sales Workflow Process</CardTitle>
                  <CardDescription>Interactive process flow from lead to delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesWorkflowVisualizer />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quotations Tab */}
            <TabsContent value="quotations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quotations Management</CardTitle>
                  <CardDescription>View and manage all active quotations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Quotations list view will be implemented here</p>
                    <p className="text-sm">Total: {totalQuotations} active quotations</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Orders Tab */}
            <TabsContent value="sales-orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Orders Management</CardTitle>
                  <CardDescription>View and manage confirmed sales orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sales orders list view will be implemented here</p>
                    <p className="text-sm">Total: {totalSalesOrders} confirmed orders</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Orders Tab */}
            <TabsContent value="job-orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Orders Management</CardTitle>
                  <CardDescription>View and manage production job orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Job orders list view will be implemented here</p>
                    <p className="text-sm">Total: {totalJobOrders} active jobs</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
}