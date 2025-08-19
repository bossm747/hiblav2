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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quotations">Quotations ({totalQuotations})</TabsTrigger>
          <TabsTrigger value="sales-orders">Sales Orders ({totalSalesOrders})</TabsTrigger>
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
          <SalesOrdersTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Quotations Data Table Component
function QuotationsTable({ onRefresh }: { onRefresh: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotations = [], isLoading, error } = useQuery({
    queryKey: ['/api/quotations'],
    queryFn: async () => {
      console.log('🔄 Fetching all quotations...');
      const result = await quotationsApi.fetchQuotations();
      console.log('✅ All quotations fetched:', result?.length || 0);
      return result;
    },
  });

  const handleDeleteQuotation = async (quotation: any) => {
    if (confirm(`Delete quotation ${quotation.quotationNumber}?`)) {
      try {
        await quotationsApi.deleteQuotation(quotation.id);
        queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
        onRefresh();
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
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
      onRefresh();
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Quotations...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quotation Management</CardTitle>
          <CardDescription>Unable to load quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error loading quotations</div>
            <div className="text-sm text-gray-500">{error.message}</div>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/quotations'] })}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      pending: { variant: 'default' as const, label: 'Pending' },
      approved: { variant: 'default' as const, label: 'Approved' },
      expired: { variant: 'destructive' as const, label: 'Expired' },
      converted: { variant: 'default' as const, label: 'Converted' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const quotationColumns = [
    {
      key: 'quotationNumber',
      label: 'Quote #',
      sortable: true,
      filterable: true,
    },
    {
      key: 'customerCode',
      label: 'Customer',
      sortable: true,
      filterable: true,
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'USA', label: 'USA' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Philippines', label: 'Philippines' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Nigeria', label: 'Nigeria' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'expired', label: 'Expired' },
        { value: 'converted', label: 'Converted' },
      ],
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value: string) => formatCurrency(value),
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      sortable: true,
      render: (value: string) => value ? formatDate(value) : 'No expiry',
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  const quotationActions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (quotation: any) => {
        toast({
          title: "Viewing Quotation",
          description: `Opening quotation ${quotation.quotationNumber}`,
        });
      },
    },
    {
      label: 'Edit Quotation',
      icon: Edit,
      onClick: (quotation: any) => {
        // This will be handled by opening the QuotationForm with the quotation ID
        toast({
          title: "Edit Quotation",
          description: `Opening edit form for ${quotation.quotationNumber}`,
        });
      },
    },
    {
      label: 'Convert to Sales Order',
      icon: ArrowRight,
      onClick: (quotation: any) => handleConvertToSalesOrder(quotation),
      condition: (quotation: any) => quotation.status === 'approved',
    },
    {
      label: 'Duplicate Quotation',
      icon: Copy,
      onClick: (quotation: any) => {
        toast({
          title: "Duplicating Quotation",
          description: `Creating copy of ${quotation.quotationNumber}`,
        });
      },
    },
    {
      label: 'Download PDF',
      icon: Download,
      onClick: (quotation: any) => {
        toast({
          title: "Downloading PDF",
          description: `Generating PDF for ${quotation.quotationNumber}`,
        });
      },
    },
    {
      label: 'Send Email',
      icon: Mail,
      onClick: (quotation: any) => {
        toast({
          title: "Sending Email",
          description: `Sending quotation ${quotation.quotationNumber} via email`,
        });
      },
    },
    {
      label: 'Delete Quotation',
      icon: Trash2,
      onClick: (quotation: any) => handleDeleteQuotation(quotation),
      variant: 'destructive' as const,
      className: 'text-red-600 hover:text-red-700',
    },
  ];

  const globalQuotationActions = [
    {
      label: 'New Quotation',
      icon: Plus,
      onClick: () => {
        // This will trigger the QuotationForm - for now just show a toast
        toast({
          title: "New Quotation",
          description: "Please use the 'New Quotation' button in the header",
        });
      },
    },
    {
      label: 'Export All',
      icon: Download,
      onClick: () => {
        toast({
          title: "Exporting Data",
          description: "Downloading all quotations as Excel file",
        });
      },
      variant: 'outline' as const,
    },
  ];

  return (
    <>

      
      <DataTable
        title="Quotation Management"
        data={quotations}
        columns={quotationColumns}
        actions={quotationActions}
        globalActions={globalQuotationActions}
        searchPlaceholder="Search quotations by number, customer, or country..."
        isLoading={isLoading}
        onRefresh={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
          onRefresh();
        }}
        emptyMessage="No quotations found. Create your first quotation to get started."
      />
    </>
  );
}

// Sales Orders Data Table Component  
function SalesOrdersTable({ onRefresh }: { onRefresh: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: salesOrders = [], isLoading, error } = useQuery({
    queryKey: ['/api/sales-orders'],
    queryFn: async () => {
      console.log('🔄 Fetching all sales orders...');
      const result = await salesOrdersApi.getAll();
      console.log('✅ All sales orders fetched:', result?.length || 0);
      return result;
    },
  });

  const handleDeleteSalesOrder = async (salesOrder: any) => {
    if (confirm(`Delete sales order ${salesOrder.salesOrderNumber}?`)) {
      try {
        await salesOrdersApi.delete(salesOrder.id);
        queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
        onRefresh();
        toast({
          title: "Success",
          description: "Sales order deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete sales order",
          variant: "destructive",
        });
      }
    }
  };

  const handleConfirmSalesOrder = async (salesOrder: any) => {
    try {
      await salesOrdersApi.update(salesOrder.id, { 
        isConfirmed: true
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
      onRefresh();
      toast({
        title: "Success",
        description: "Sales order confirmed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm sales order",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Sales Orders...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Order Management</CardTitle>
          <CardDescription>Unable to load sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error loading sales orders</div>
            <div className="text-sm text-gray-500">{error.message}</div>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] })}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'Pending' },
      confirmed: { variant: 'default' as const, label: 'Confirmed' },
      processing: { variant: 'default' as const, label: 'Processing' },
      shipped: { variant: 'secondary' as const, label: 'Shipped' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const salesOrderColumns = [
    {
      key: 'salesOrderNumber',
      label: 'Order #',
      sortable: true,
      filterable: true,
    },
    {
      key: 'customerCode',
      label: 'Customer',
      sortable: true,
      filterable: true,
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'USA', label: 'USA' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Philippines', label: 'Philippines' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Nigeria', label: 'Nigeria' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value: string, row: any) => formatCurrency(value || row.pleasePayThisAmountUsd || 0),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value: string) => value ? formatDate(value) : 'N/A',
    },
    {
      key: 'isConfirmed',
      label: 'Confirmed',
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'true', label: 'Confirmed' },
        { value: 'false', label: 'Pending' },
      ],
      render: (value: boolean) => value ? (
        <Badge variant="default">✓ Confirmed</Badge>
      ) : (
        <Badge variant="outline">Pending</Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  const salesOrderActions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (order: any) => {
        toast({
          title: "Viewing Sales Order",
          description: `Opening sales order ${order.salesOrderNumber}`,
        });
      },
    },
    {
      label: 'Edit Order',
      icon: Edit,
      onClick: (order: any) => {
        toast({
          title: "Edit Sales Order",
          description: `Opening edit form for ${order.salesOrderNumber}`,
        });
      },
    },
    {
      label: 'Confirm Order',
      icon: CheckCircle,
      onClick: (order: any) => handleConfirmSalesOrder(order),
      condition: (order: any) => !order.isConfirmed,
    },
    {
      label: 'Create Job Order',
      icon: ArrowRight,
      onClick: (order: any) => {
        toast({
          title: "Creating Job Order",
          description: `Creating job order from ${order.salesOrderNumber}`,
        });
      },
      condition: (order: any) => order.isConfirmed,
    },
    {
      label: 'Download PDF',
      icon: Download,
      onClick: (order: any) => {
        toast({
          title: "Downloading PDF",
          description: `Generating PDF for ${order.salesOrderNumber}`,
        });
      },
    },
    {
      label: 'Send Email',
      icon: Mail,
      onClick: (order: any) => {
        toast({
          title: "Sending Email",
          description: `Sending sales order ${order.salesOrderNumber} via email`,
        });
      },
    },
  ];

  const globalSalesOrderActions = [
    {
      label: 'Export All',
      icon: Download,
      onClick: () => {
        toast({
          title: "Exporting Data",
          description: "Downloading all sales orders as Excel file",
        });
      },
      variant: 'outline' as const,
    },
  ];

  return (
    <DataTable
      title="Sales Order Management"
      data={salesOrders}
      columns={salesOrderColumns}
      actions={salesOrderActions}
      globalActions={globalSalesOrderActions}
      searchPlaceholder="Search sales orders by number, customer, or country..."
      isLoading={isLoading}
      onRefresh={() => {
        queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
        onRefresh();
      }}
      emptyMessage="No sales orders found. Convert quotations to create sales orders."
    />
  );
}