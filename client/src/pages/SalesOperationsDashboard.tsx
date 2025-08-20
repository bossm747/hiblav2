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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Download,
  Loader2,
  ArrowRight,
  CheckCircle,
  Info,
  HelpCircle,
  Timer,
  AlertTriangle,
  AlertCircle,
  Briefcase,
  Menu,
  Filter,
} from 'lucide-react';
import { QuotationForm } from '@/components/forms/QuotationForm';
// Import placeholder components for now - these will be implemented later
import { SalesWorkflowVisualizer } from '@/components/sales/SalesWorkflowVisualizer';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [focusedView, setFocusedView] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    meta: {
      errorMessage: 'Failed to fetch dashboard analytics',
    },
    queryFn: async ({ signal }) => {
      const result = await apiRequest('/api/dashboard/analytics', {
        method: 'GET',
        signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      return result;
    },
  });

  // Enhanced KPI calculations
  const totalQuotations = parseInt(analytics?.overview?.activeQuotations || '0');
  const totalSalesOrders = parseInt(analytics?.overview?.activeSalesOrders || '0');
  const totalCustomers = parseInt(analytics?.overview?.totalCustomers || '0');
  const totalJobOrders = parseInt(analytics?.overview?.activeJobOrders || '0');
  
  const conversionRate = totalQuotations > 0 ? (totalSalesOrders / totalQuotations * 100) : 0;
  const totalRevenue = totalSalesOrders * 500;
  const avgDealSize = totalSalesOrders > 0 ? totalRevenue / totalSalesOrders : 0;
  const pipelineVelocity = totalQuotations > 0 ? (totalSalesOrders / totalQuotations) * 7 : 0;

  // Helper functions
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading Sales Operations Dashboard...</p>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-6">
          <div className="text-red-500">Error loading Sales Operations data</div>
          <p className="text-sm text-muted-foreground">{analyticsError.message}</p>
          <Button onClick={() => refetchAnalytics()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
        {/* Mobile-First Sticky Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Header Content */}
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Sales Operations
                </h1>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  Live Data
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <QuotationForm />
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {showFilters && (
              <div className="pb-4 border-t border-gray-200 dark:border-gray-700 sm:hidden">
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Time Period</Label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Focused View</Label>
                    <Switch
                      checked={focusedView}
                      onCheckedChange={setFocusedView}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Controls */}
            <div className="hidden sm:block pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Period:</Label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="focused-view"
                      checked={focusedView}
                      onCheckedChange={setFocusedView}
                      size="sm"
                    />
                    <Label htmlFor="focused-view" className="text-sm">Focused View</Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help with Sales Operations</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* KPI Cards - Mobile Optimized Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Active Quotations */}
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Active Quotations
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">{totalQuotations}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirmed Orders */}
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                    Sales Orders
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">{totalSalesOrders}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      AUTO
                    </Badge>
                    <span className="text-xs text-muted-foreground">automated process</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Rate */}
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Conversion Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">{conversionRate.toFixed(1)}%</div>
                  <Progress value={conversionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Estimated Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">
                    Avg: {formatCurrency(avgDealSize)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Funnel Visualization */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold">Sales Pipeline</CardTitle>
                  <CardDescription>Track conversion through each stage</CardDescription>
                </div>
                <Badge variant="outline">{conversionRate.toFixed(1)}% conversion rate</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600">{totalQuotations}</div>
                    <div className="text-sm text-muted-foreground mt-1">Quotations</div>
                    <div className="text-xs text-blue-600 font-medium">100%</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600">{totalSalesOrders}</div>
                    <div className="text-sm text-muted-foreground mt-1">Sales Orders</div>
                    <div className="text-xs text-green-600 font-medium">{conversionRate.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600">{totalJobOrders}</div>
                    <div className="text-sm text-muted-foreground mt-1">Job Orders</div>
                    <div className="text-xs text-purple-600 font-medium">
                      {totalSalesOrders > 0 ? (totalJobOrders / totalSalesOrders * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <div className="text-2xl font-bold text-amber-600">{totalSalesOrders}</div>
                    <div className="text-sm text-muted-foreground mt-1">Invoices</div>
                    <div className="text-xs text-amber-600 font-medium">100% Auto</div>
                  </div>
                </div>
              </div>
              
              {/* Pipeline Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Average Deal Size</div>
                  <div className="text-xl font-bold text-primary">{formatCurrency(avgDealSize)}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Pipeline Velocity</div>
                  <div className="text-xl font-bold text-primary">{pipelineVelocity.toFixed(1)} days</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
                  <div className="text-xl font-bold text-primary">{conversionRate.toFixed(1)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="quotations" className="text-xs sm:text-sm py-2">
                Quotations ({totalQuotations})
              </TabsTrigger>
              <TabsTrigger value="sales-orders" className="text-xs sm:text-sm py-2">
                Orders ({totalSalesOrders})
              </TabsTrigger>
              <TabsTrigger value="job-orders" className="text-xs sm:text-sm py-2">
                Jobs ({totalJobOrders})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workflow Visualizer */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Workflow Status</CardTitle>
                    <CardDescription>Track progress through the pipeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalesWorkflowVisualizer
                      quotationsCount={totalQuotations}
                      salesOrdersCount={totalSalesOrders}
                      jobOrdersCount={totalJobOrders}
                      invoicesCount={0}
                    />
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">New quotations created</p>
                          <p className="text-xs text-muted-foreground">{totalQuotations} active quotations</p>
                        </div>
                        <Badge variant="secondary">{totalQuotations}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Sales orders processed</p>
                          <p className="text-xs text-muted-foreground">{totalSalesOrders} orders in pipeline</p>
                        </div>
                        <Badge variant="secondary">{totalSalesOrders}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Active customers</p>
                          <p className="text-xs text-muted-foreground">Total customer base</p>
                        </div>
                        <Badge variant="secondary">{totalCustomers}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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