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

  // Extract counts from analytics
  const totalQuotations = parseInt(analytics?.overview?.activeQuotations || '0');
  const totalSalesOrders = parseInt(analytics?.overview?.activeSalesOrders || '0');
  const totalCustomers = parseInt(analytics?.overview?.totalCustomers || '0');
  const conversionRate = totalQuotations > 0 ? (totalSalesOrders / totalQuotations * 100) : 0;
  const totalRevenue = totalSalesOrders * 500; // Estimated revenue per order

  console.log('🔍 Sales Operations Dashboard - Calculated Metrics:', {
    totalQuotations,
    totalSalesOrders,
    totalCustomers,
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
            <div className="flex gap-2">
              <QuotationForm />
              <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards with Semantic Meaning and Sparklines */}
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
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
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
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  AUTO
                </Badge>
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

          {/* Revenue Performance Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Estimated Revenue
                </CardTitle>
                <p className="text-xs text-muted-foreground">Based on confirmed orders</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total estimated revenue from active sales orders</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">
                  {formatCurrency(totalRevenue)}
                </div>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15%
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {totalCustomers} active customers contributing
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
                      <p className="text-xs text-muted-foreground">{totalCustomers} active customers</p>
                    </div>
                    <Badge variant="secondary">{totalCustomers}</Badge>
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
