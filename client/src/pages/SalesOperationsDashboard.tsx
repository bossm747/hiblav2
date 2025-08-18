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
} from 'lucide-react';
import { EnhancedQuotationForm } from '@/components/forms/EnhancedQuotationForm';
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
          <EnhancedQuotationForm 
            trigger={
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Quotation
              </Button>
            }
          />
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
          <QuotationsTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quotation Management</CardTitle>
            <CardDescription>View and manage all quotations ({quotations.length} total)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/quotations'] })}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {quotations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quotations Found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first quotation to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Quotation #</th>
                  <th className="text-left py-2 px-4 font-semibold">Customer</th>
                  <th className="text-left py-2 px-4 font-semibold">Country</th>
                  <th className="text-left py-2 px-4 font-semibold">Status</th>
                  <th className="text-left py-2 px-4 font-semibold">Total</th>
                  <th className="text-left py-2 px-4 font-semibold">Created</th>
                  <th className="text-left py-2 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quotation) => (
                  <tr key={quotation.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">
                      {quotation.quotationNumber}
                      {quotation.revisionNumber && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {quotation.revisionNumber}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">{quotation.customerCode || 'N/A'}</td>
                    <td className="py-3 px-4">{quotation.country || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={quotation.status === 'approved' ? 'default' : 'secondary'}
                      >
                        {quotation.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${quotation.total || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "View Quotation",
                              description: `Viewing ${quotation.quotationNumber}`,
                            });
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Edit Quotation",
                              description: `Editing ${quotation.quotationNumber}`,
                            });
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConvertToSalesOrder(quotation)}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuotation(quotation)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
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
        isConfirmed: true,
        confirmedAt: new Date(),
        status: 'confirmed'
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Order Management</CardTitle>
            <CardDescription>View and manage all sales orders ({salesOrders.length} total)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] })}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {salesOrders.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sales Orders Found</h3>
            <p className="text-muted-foreground mb-4">
              Convert quotations to create sales orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Order #</th>
                  <th className="text-left py-2 px-4 font-semibold">Customer</th>
                  <th className="text-left py-2 px-4 font-semibold">Country</th>
                  <th className="text-left py-2 px-4 font-semibold">Status</th>
                  <th className="text-left py-2 px-4 font-semibold">Total</th>
                  <th className="text-left py-2 px-4 font-semibold">Due Date</th>
                  <th className="text-left py-2 px-4 font-semibold">Confirmed</th>
                  <th className="text-left py-2 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">
                      {order.salesOrderNumber}
                    </td>
                    <td className="py-3 px-4">{order.customerCode || 'N/A'}</td>
                    <td className="py-3 px-4">{order.country || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                          order.status === 'confirmed' ? 'default' : 
                          order.status === 'shipped' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {order.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${order.total || order.pleasePayThisAmountUsd || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {order.isConfirmed ? (
                        <Badge variant="default">✓ Confirmed</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "View Sales Order",
                              description: `Viewing ${order.salesOrderNumber}`,
                            });
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Edit Sales Order",
                              description: `Editing ${order.salesOrderNumber}`,
                            });
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {!order.isConfirmed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmSalesOrder(order)}
                          >
                            ✓
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSalesOrder(order)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}