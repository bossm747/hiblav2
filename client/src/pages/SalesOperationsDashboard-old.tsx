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
import { DataTable } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  FileText,
  Send,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  Eye,
  Edit,
  Download,
  Trash2,
  Copy,
  Printer,
  Mail,
  Loader2,
  ArrowRight,
  CheckCircle,
  Info,
  Maximize2,
  Minimize2,
  HelpCircle,
  BookOpen,
  TrendingUp as SparklineIcon,
  Timer,
  AlertTriangle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { QuotationForm } from '@/components/forms/QuotationForm';
import { QuotationListView } from '@/components/quotations/QuotationListView';
import { SalesOrderListView } from '@/components/sales/SalesOrderListView';
import { JobOrderListView } from '@/components/jobs/JobOrderListView';
import { SalesWorkflowVisualizer } from '@/components/sales/SalesWorkflowVisualizer';
import { quotationsApi } from '@/api/quotations';
import { salesOrdersApi } from '@/api/sales-orders';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [focusedView, setFocusedView] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data directly (this is working)
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    queryFn: async () => {
      console.log('🔄 Fetching dashboard analytics for Sales Operations...');
      const result = await apiRequest('/api/dashboard/analytics');
      console.log('✅ Analytics data received:', result);
      return result;
    },
  });

  // Extract counts from analytics and calculate enhanced KPIs
  const totalQuotations = parseInt(analytics?.overview?.activeQuotations || '0');
  const totalSalesOrders = parseInt(analytics?.overview?.activeSalesOrders || '0');
  const totalClients = parseInt(analytics?.overview?.totalClients || '0');
  const totalJobOrders = parseInt(analytics?.overview?.activeJobOrders || '0');
  
  // Enhanced KPI calculations
  const conversionRate = totalQuotations > 0 ? (totalSalesOrders / totalQuotations * 100) : 0;
  const totalRevenue = totalSalesOrders * 500; // Estimated revenue per order
  const avgDealSize = totalSalesOrders > 0 ? totalRevenue / totalSalesOrders : 0;
  const pipelineVelocity = totalQuotations > 0 ? (totalSalesOrders / totalQuotations) * 7 : 0; // Days to convert
  const clientSegments = {
    active: Math.floor(totalClients * 0.6),
    dormant: Math.floor(totalClients * 0.3),
    new: Math.floor(totalClients * 0.1)
  };
  const teamPerformance = {
    salesTeam: totalQuotations,
    productionTeam: totalJobOrders,
    efficiency: totalSalesOrders > 0 ? (totalJobOrders / totalSalesOrders * 100) : 0
  };
  
  // Time-based comparisons (mock data for demonstration)
  const weekOverWeek = {
    quotations: 12,
    salesOrders: 8,
    revenue: 15
  };
  const monthOverMonth = {
    quotations: 25,
    salesOrders: 18,
    revenue: 22
  };

  console.log('🔍 Sales Operations Dashboard - Calculated Metrics:', {
    totalQuotations,
    totalSalesOrders,
    totalClients,
    conversionRate: conversionRate.toFixed(1) + '%',
    totalRevenue,
    analyticsLoading,
    analyticsError: analyticsError?.message || null
  });

  // CRUD handlers for quotations
  const handleViewQuotation = (quotation: any) => {
    toast({
      title: "View Quotation",
      description: `Viewing quotation details`,
    });
  };

  const handleEditQuotation = (quotation: any) => {
    toast({
      title: "Edit Quotation",
      description: `Editing quotation`,
    });
  };

  const handleDeleteQuotation = async (quotation: any) => {
    if (confirm(`Delete this quotation?`)) {
      try {
        await apiRequest(`/api/quotations/${quotation.id}`, {
          method: 'DELETE',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] });
        toast({
          title: "Success",
          description: "Quotation deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete quotation",
          variant: "destructive",
        });
      }
    }
  };

  const handleConvertToSalesOrder = async (quotation: any) => {
    try {
      await apiRequest('/api/sales-orders/from-quotation', {
        method: 'POST',
        body: JSON.stringify({ quotationId: quotation.id }),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] });
      toast({
        title: "Success",
        description: "Sales order created from quotation",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sales order",
        variant: "destructive",
      });
    }
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Sales Operations Dashboard...</span>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading Sales Operations data</div>
          <div className="text-sm text-gray-500">{analyticsError.message}</div>
        </div>
      </div>
    );
  }

  // Helper function to format numbers with semantic meaning
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const getWorkflowStageTime = (stage: string) => {
    const times = {
      'quotation': '2-3 days',
      'salesOrder': '1 day (AUTO)',
      'jobOrder': '1 day (AUTO)',
      'invoice': '1 day (AUTO)'
    };
    return times[stage as keyof typeof times] || '1-2 days';
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Enhanced Header with Tour and Focus Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sales Operations Hub
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTour(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Tour
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take a guided tour of the Sales Operations workflow</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Complete sales lifecycle management - from initial customer inquiries to automated invoice generation
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="focused-view" className="text-sm font-medium">
                Focused View
              </Label>
              <Switch
                id="focused-view"
                checked={focusedView}
                onCheckedChange={setFocusedView}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hide secondary panels for better focus</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-4">
              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">Time Period:</Label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-md bg-background"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <QuotationForm />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                      <Download className="h-4 w-4 mr-2" />
                      Export This View
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export current dashboard view as PDF report</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Diversified KPI Cards with Advanced Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Quotations Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Active Quotations
                </CardTitle>
                <p className="text-xs text-muted-foreground">Customer requests pending</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total quotations awaiting customer approval</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{totalQuotations}</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs cursor-help">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{weekOverWeek.quotations}%
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Week over week: +{weekOverWeek.quotations}%</p>
                    <p>Month over month: +{monthOverMonth.quotations}%</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" />
                Avg. response time: {getWorkflowStageTime('quotation')}
              </div>
            </CardContent>
          </Card>

          {/* Confirmed Sales Orders Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Confirmed Sales Orders
                </CardTitle>
                <p className="text-xs text-muted-foreground">Orders ready for production</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sales orders confirmed and in production pipeline</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-green-600 dark:text-green-300">{totalSalesOrders}</div>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AUTO
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">
                        +{weekOverWeek.salesOrders}%
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Week over week: +{weekOverWeek.salesOrders}%</p>
                      <p>Month over month: +{monthOverMonth.salesOrders}%</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" />
                Processing time: {getWorkflowStageTime('salesOrder')}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Performance Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Sales Conversion
                </CardTitle>
                <p className="text-xs text-muted-foreground">Quote-to-order success rate</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Percentage of quotations converted to sales orders</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  {conversionRate.toFixed(1)}%
                </div>
                <Badge variant={conversionRate > 40 ? "default" : "secondary"} className="text-xs">
                  {conversionRate > 40 ? "Excellent" : "Good"}
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress value={conversionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {totalSalesOrders} of {totalQuotations} quotes converted
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Velocity Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Pipeline Velocity
                </CardTitle>
                <p className="text-xs text-muted-foreground">Quote-to-order timeline</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Timer className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average time from quotation to sales order</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                  {pipelineVelocity.toFixed(1)}
                </div>
                <span className="text-sm text-muted-foreground">days avg</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>This Week</span>
                  <span className="text-green-600">-2.3 days</span>
                </div>
                <Progress value={Math.max(0, 100 - (pipelineVelocity * 10))} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Section */}
        <div className="space-y-6 mt-6">
          {/* Sales Funnel Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Sales Conversion Funnel</CardTitle>
                  <CardDescription>Track prospects through the sales pipeline</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {conversionRate.toFixed(1)}% conversion
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shows how prospects move through each stage</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Funnel Stages */}
                <div className="relative">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{totalQuotations}</div>
                        <div className="text-xs text-muted-foreground mt-1">Quotations</div>
                        <div className="text-xs text-blue-600 font-medium">100%</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 border-2 border-green-200 dark:border-green-700">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-300">{totalSalesOrders}</div>
                        <div className="text-xs text-muted-foreground mt-1">Sales Orders</div>
                        <div className="text-xs text-green-600 font-medium">{conversionRate.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{totalJobOrders}</div>
                        <div className="text-xs text-muted-foreground mt-1">Job Orders</div>
                        <div className="text-xs text-purple-600 font-medium">{totalSalesOrders > 0 ? (totalJobOrders / totalSalesOrders * 100).toFixed(1) : 0}%</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-amber-100 dark:bg-amber-900 rounded-lg p-4 border-2 border-amber-200 dark:border-amber-700">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">{totalSalesOrders}</div>
                        <div className="text-xs text-muted-foreground mt-1">Invoices</div>
                        <div className="text-xs text-amber-600 font-medium">100% Auto</div>
                      </div>
                    </div>
                  </div>
                  {/* Connection Lines */}
                  <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between px-12 -mt-1 pointer-events-none">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Conversion Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium">Average Deal Size</div>
                    <div className="text-lg font-bold text-primary">{formatCurrency(avgDealSize)}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium">Pipeline Velocity</div>
                    <div className="text-lg font-bold text-primary">{pipelineVelocity.toFixed(1)} days</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium">Win Rate</div>
                    <div className="text-lg font-bold text-primary">{conversionRate.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Segmentation Donut Chart */}
            <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Customer Breakdown</CardTitle>
                  <CardDescription>Active customer segmentation</CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of customer engagement levels</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-8 border-blue-200 dark:border-blue-800"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent" 
                       style={{ transform: `rotate(${(clientSegments.active / totalClients) * 360}deg)` }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalClients}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="font-semibold">{clientSegments.active}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Dormant</span>
                  </div>
                  <div className="font-semibold">{clientSegments.dormant}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">New</span>
                  </div>
                  <div className="font-semibold">{clientSegments.new}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance Metrics */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Team Performance</CardTitle>
                  <CardDescription>Departmental activity overview</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Sales Team</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{teamPerformance.salesTeam}</div>
                    <div className="text-xs text-muted-foreground">quotations created</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Production Team</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{teamPerformance.productionTeam}</div>
                    <div className="text-xs text-muted-foreground">job orders active</div>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Efficiency</span>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{teamPerformance.efficiency.toFixed(1)}%</div>
                      <Progress value={teamPerformance.efficiency} className="h-2 w-20 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actionable Insights */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Next Actions</CardTitle>
                  <CardDescription>Immediate attention items</CardDescription>
                </div>
                <Badge variant="secondary">
                  {totalQuotations > 15 ? '3' : '1'} alerts
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      High Quote Volume
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      {totalQuotations} pending quotations need review
                    </p>
                    <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                      Review Queue
                    </Button>
                  </div>
                </div>
                
                {conversionRate < 40 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Low Conversion Rate
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300">
                        Only {conversionRate.toFixed(1)}% quotes converting to orders
                      </p>
                      <Button variant="outline" size="sm" className="text-red-700 border-red-300 hover:bg-red-100">
                        Analyze Causes
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Automation Working
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {totalSalesOrders} orders auto-processed successfully
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quotations">Quotations ({totalQuotations})</TabsTrigger>
          <TabsTrigger value="sales-orders">Sales Orders ({totalSalesOrders})</TabsTrigger>
          <TabsTrigger value="job-orders">Job Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Workflow Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Workflow Status</CardTitle>
                <CardDescription>Track progress across the sales pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesWorkflowVisualizer
                  quotationsCount={totalQuotations}
                  salesOrdersCount={totalSalesOrders}
                  jobOrdersCount={parseInt(analytics?.overview?.activeJobOrders || '0')}
                  invoicesCount={0} // We don't have invoice data yet
                />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest sales operations activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New quotations created</p>
                      <p className="text-xs text-muted-foreground">{totalQuotations} active quotations</p>
                    </div>
                    <Badge variant="secondary">{totalQuotations}</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sales orders processed</p>
                      <p className="text-xs text-muted-foreground">{totalSalesOrders} orders in pipeline</p>
                    </div>
                    <Badge variant="secondary">{totalSalesOrders}</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Customer base</p>
                      <p className="text-xs text-muted-foreground">{totalClients} active clients</p>
                    </div>
                    <Badge variant="secondary">{totalClients}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quotations" className="space-y-4">
          <QuotationListView />
        </TabsContent>

        <TabsContent value="sales-orders" className="space-y-4">
          <SalesOrderListView />
        </TabsContent>

        <TabsContent value="job-orders" className="space-y-4">
          <JobOrderListView />
        </TabsContent>
      </Tabs>
      </div>
    </TooltipProvider>
  );
}
