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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Manage quotations, sales orders, and customer relationships
          </p>
        </div>
        <div className="flex gap-2">
          <QuotationForm />
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotations}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSalesOrders}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active customer base
            </p>
          </CardContent>
        </Card>
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
  );
}
