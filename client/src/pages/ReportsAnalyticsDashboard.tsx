import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  FileBarChart,
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Filter,
  FileText,
  DollarSign,
  Users,
  Package,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export function ReportsAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data directly (same approach as Sales Operations)
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    queryFn: async () => {
      console.log('🔄 Fetching dashboard analytics for Reports & Analytics...');
      const result = await apiRequest('/api/dashboard/analytics');
      console.log('✅ Reports analytics data received:', result);
      return result;
    },
  });

  // Extract reporting metrics from analytics
  const totalQuotations = parseInt(analytics?.overview?.totalQuotations || '0');
  const totalSalesOrders = parseInt(analytics?.overview?.totalSalesOrders || '0');
  const totalClients = parseInt(analytics?.overview?.totalClients || '0');
  const totalProducts = parseInt(analytics?.overview?.totalProducts || '0');
  const totalJobOrders = parseInt(analytics?.overview?.totalJobOrders || '0');
  const totalRevenue = parseFloat(analytics?.overview?.totalRevenue || '0');
  const averageOrderValue = parseFloat(analytics?.overview?.averageOrderValue || '0');
  const conversionRate = parseFloat(analytics?.overview?.conversionRate || '0');
  const clientGrowth = 12.5; // Estimated growth percentage

  console.log('🔍 Reports & Analytics Dashboard - Calculated Metrics:', {
    totalQuotations,
    totalSalesOrders,
    totalClients,
    totalProducts,
    conversionRate: conversionRate.toFixed(1) + '%',
    totalRevenue,
    analyticsLoading,
    analyticsError: analyticsError?.message || null
  });

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Reports & Analytics Dashboard...</span>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading Reports & Analytics data</div>
          <div className="text-sm text-gray-500">{analyticsError.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Business intelligence, analytics, and comprehensive reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <Progress value={conversionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{clientGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              {totalClients} total clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Per sales order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sales Performance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm font-semibold">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Production Efficiency</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-semibold">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On-Time Delivery</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={89} className="w-20" />
                      <span className="text-sm font-semibold">89%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Quotations This Month
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {totalQuotations}
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Sales Orders Closed
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {totalSalesOrders}
                        </p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          Job Orders Completed
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {totalJobOrders}
                        </p>
                      </div>
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SalesAnalyticsReports 
            quotations={totalQuotations} 
            salesOrders={totalSalesOrders} 
            clients={totalClients}
            conversionRate={conversionRate}
          />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <OperationsReports 
            jobOrders={totalJobOrders} 
            products={totalProducts}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialReports 
            totalRevenue={totalRevenue}
            averageOrderValue={averageOrderValue}
            salesOrders={totalSalesOrders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sales Analytics Reports Component
function SalesAnalyticsReports({ quotations, salesOrders, clients, conversionRate }: {
  quotations: number;
  salesOrders: number;
  clients: number;
  conversionRate: number;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline Analysis</CardTitle>
          <CardDescription>Conversion funnel and pipeline health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
              <span className="font-medium">Active Quotations</span>
              <Badge variant="secondary">{quotations}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/10 rounded-lg">
              <span className="font-medium">Sales Orders</span>
              <Badge variant="default">{salesOrders}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/10 rounded-lg">
              <span className="font-medium">Conversion Rate</span>
              <Badge variant="outline">{conversionRate.toFixed(1)}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Analytics</CardTitle>
          <CardDescription>Client base insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{clients}</div>
              <p className="text-sm text-muted-foreground">Total Active Clients</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>New Clients</span>
                <span>{Math.floor(clients * 0.2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Returning Clients</span>
                <span>{Math.floor(clients * 0.8)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Operations Reports Component
function OperationsReports({ jobOrders, products }: {
  jobOrders: number;
  products: number;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Reports</CardTitle>
          <CardDescription>Manufacturing performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Job Orders</span>
              <Badge variant="default">{jobOrders}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Production Capacity</span>
              <div className="flex items-center space-x-2">
                <Progress value={75} className="w-16" />
                <span className="text-sm">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quality Control Pass Rate</span>
              <div className="flex items-center space-x-2">
                <Progress value={96} className="w-16" />
                <span className="text-sm">96%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Reports</CardTitle>
          <CardDescription>Stock levels and product analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{products}</div>
              <p className="text-sm text-muted-foreground">Active Products</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>In Stock</span>
                <span>{Math.floor(products * 0.85)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Low Stock</span>
                <span>{Math.floor(products * 0.15)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Financial Reports Component
function FinancialReports({ totalRevenue, averageOrderValue, salesOrders }: {
  totalRevenue: number;
  averageOrderValue: number;
  salesOrders: number;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analysis</CardTitle>
          <CardDescription>Financial performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Order Value</span>
                <span>${averageOrderValue.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Orders</span>
                <span>{salesOrders}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
          <CardDescription>Key financial indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue Growth</span>
              <div className="flex items-center space-x-2">
                <Progress value={85} className="w-16" />
                <span className="text-sm text-green-600">+15.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profit Margin</span>
              <div className="flex items-center space-x-2">
                <Progress value={68} className="w-16" />
                <span className="text-sm">68%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Collection</span>
              <div className="flex items-center space-x-2">
                <Progress value={92} className="w-16" />
                <span className="text-sm">92%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}