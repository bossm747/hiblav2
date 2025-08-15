import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { DataTable } from '@/components/ui/data-table';
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
} from 'lucide-react';
import { EnhancedQuotationForm } from '@/components/forms/EnhancedQuotationForm';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sales data
  const { data: quotations = [] } = useQuery({
    queryKey: ['/api/quotations'],
  });

  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Calculate metrics
  const totalQuotations = quotations.length;
  const totalSalesOrders = salesOrders.length;
  const conversionRate = totalQuotations > 0 ? (totalSalesOrders / totalQuotations * 100) : 0;
  const totalRevenue = salesOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

  // CRUD handlers for quotations
  const handleViewQuotation = (quotation: any) => {
    toast({
      title: "View Quotation",
      description: `Viewing quotation ${quotation.quotationNumber}`,
    });
  };

  const handleEditQuotation = (quotation: any) => {
    toast({
      title: "Edit Quotation",
      description: `Editing quotation ${quotation.quotationNumber}`,
    });
  };

  const handleDeleteQuotation = async (quotation: any) => {
    if (confirm(`Delete quotation ${quotation.quotationNumber}?`)) {
      try {
        await apiRequest(`/api/quotations/${quotation.id}`, {
          method: 'DELETE',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
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

  const handleDuplicateQuotation = (quotation: any) => {
    toast({
      title: "Duplicate Quotation",
      description: `Duplicating quotation ${quotation.quotationNumber}`,
    });
  };

  const handlePrintQuotation = (quotation: any) => {
    window.open(`/api/quotations/${quotation.id}/pdf`, '_blank');
  };

  const handleEmailQuotation = (quotation: any) => {
    toast({
      title: "Email Quotation",
      description: `Sending quotation ${quotation.quotationNumber} via email`,
    });
  };

  const handleConvertToSalesOrder = (quotation: any) => {
    toast({
      title: "Convert to Sales Order",
      description: `Converting quotation ${quotation.quotationNumber} to sales order`,
    });
  };

  // Quotation columns definition
  const quotationColumns = [
    {
      key: 'quotationNumber',
      header: 'Quotation #',
      accessor: (item: any) => item.quotationNumber,
      sortable: true,
      filterable: true,
    },
    {
      key: 'customerCode',
      header: 'Customer',
      accessor: (item: any) => item.customerCode,
      sortable: true,
      filterable: true,
    },
    {
      key: 'country',
      header: 'Country',
      accessor: (item: any) => item.country || 'N/A',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Philippines', value: 'Philippines' },
        { label: 'USA', value: 'USA' },
        { label: 'Canada', value: 'Canada' },
        { label: 'Australia', value: 'Australia' },
      ],
      mobileHidden: true,
    },
    {
      key: 'total',
      header: 'Total',
      accessor: (item: any) => item.total,
      sortable: true,
      filterable: true,
      filterType: 'number' as const,
      render: (value: any) => `$${(value || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item: any) => item.status,
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Converted', value: 'converted' },
      ],
      render: (value: string) => (
        <Badge variant={value === 'approved' ? 'default' : value === 'rejected' ? 'destructive' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      accessor: (item: any) => item.createdAt,
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
      mobileHidden: true,
    },
  ];

  // Sales Order columns definition
  const salesOrderColumns = [
    {
      key: 'salesOrderNumber',
      header: 'Order #',
      accessor: (item: any) => item.salesOrderNumber,
      sortable: true,
      filterable: true,
    },
    {
      key: 'customerCode',
      header: 'Customer',
      accessor: (item: any) => item.customerCode,
      sortable: true,
      filterable: true,
    },
    {
      key: 'orderDate',
      header: 'Date',
      accessor: (item: any) => item.orderDate || item.createdAt,
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
      mobileHidden: true,
    },
    {
      key: 'total',
      header: 'Total',
      accessor: (item: any) => item.total,
      sortable: true,
      filterable: true,
      filterType: 'number' as const,
      render: (value: any) => `$${(value || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item: any) => item.status,
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
      ],
      render: (value: string) => (
        <Badge variant={value === 'delivered' ? 'default' : value === 'shipped' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      ),
    },
  ];

  // Customer columns definition
  const customerColumns = [
    {
      key: 'customerCode',
      header: 'Customer Code',
      accessor: (item: any) => item.customerCode,
      sortable: true,
      filterable: true,
    },
    {
      key: 'companyName',
      header: 'Company Name',
      accessor: (item: any) => item.companyName,
      sortable: true,
      filterable: true,
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      accessor: (item: any) => item.contactPerson || 'N/A',
      sortable: true,
      filterable: true,
      mobileHidden: true,
    },
    {
      key: 'country',
      header: 'Country',
      accessor: (item: any) => item.country || 'N/A',
      sortable: true,
      filterable: true,
      mobileHidden: true,
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (item: any) => item.type || 'Regular',
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'New', value: 'new' },
        { label: 'Regular', value: 'regular' },
        { label: 'VIP', value: 'vip' },
      ],
      render: (value: string) => (
        <Badge variant={value === 'vip' ? 'default' : value === 'new' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      ),
    },
  ];

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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="sales-orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Quotations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Quotations</CardTitle>
                <CardDescription>Latest quotation activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotations.slice(0, 5).map((quotation: any) => (
                    <div key={quotation.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{quotation.quotationNumber}</p>
                        <p className="text-sm text-muted-foreground">{quotation.customerCode}</p>
                      </div>
                      <Badge variant={quotation.status === 'approved' ? 'default' : 'secondary'}>
                        {quotation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Current sales progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Pending Quotations</span>
                    <Badge variant="outline">{quotations.filter((q: any) => q.status === 'pending').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Approved Quotations</span>
                    <Badge variant="default">{quotations.filter((q: any) => q.status === 'approved').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Converted to Sales</span>
                    <Badge variant="success">{totalSalesOrders}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quotations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Quotations</CardTitle>
              <CardDescription>Manage and track all quotations</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={quotations}
                columns={quotationColumns}
                searchKeys={['quotationNumber', 'customerCode', 'country']}
                onView={handleViewQuotation}
                onEdit={handleEditQuotation}
                onDelete={handleDeleteQuotation}
                onDuplicate={handleDuplicateQuotation}
                onPrint={handlePrintQuotation}
                onEmail={handleEmailQuotation}
                onApprove={handleConvertToSalesOrder}
                onCreate={() => setShowQuotationForm(true)}
                createLabel="New Quotation"
                pageSize={10}
                mobileCardView={true}
                stickyHeader={true}
                showPagination={true}
                showFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Orders</CardTitle>
              <CardDescription>Track confirmed sales orders</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={salesOrders}
                columns={salesOrderColumns}
                searchKeys={['salesOrderNumber', 'customerCode']}
                onView={(order) => toast({ title: "View Order", description: `Viewing order ${order.salesOrderNumber}` })}
                onEdit={(order) => toast({ title: "Edit Order", description: `Editing order ${order.salesOrderNumber}` })}
                onDelete={async (order) => {
                  if (confirm(`Delete order ${order.salesOrderNumber}?`)) {
                    toast({ title: "Success", description: "Order deleted successfully" });
                  }
                }}
                onPrint={(order) => window.open(`/api/sales-orders/${order.id}/pdf`, '_blank')}
                onCreate={() => toast({ title: "Create Sales Order", description: "Opening sales order form" })}
                createLabel="New Sales Order"
                pageSize={10}
                mobileCardView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage customer relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={customers.map((customer: any) => ({
                  ...customer,
                  orderCount: salesOrders.filter((order: any) => order.customerCode === customer.customerCode).length,
                  totalValue: salesOrders.filter((order: any) => order.customerCode === customer.customerCode)
                    .reduce((sum: number, order: any) => sum + (order.total || 0), 0),
                }))}
                columns={[
                  ...customerColumns,
                  {
                    key: 'orderCount',
                    header: 'Orders',
                    accessor: (item: any) => item.orderCount,
                    sortable: true,
                  },
                  {
                    key: 'totalValue',
                    header: 'Total Value',
                    accessor: (item: any) => item.totalValue,
                    sortable: true,
                    render: (value: number) => `$${value.toFixed(2)}`,
                  },
                ]}
                searchKeys={['customerCode', 'companyName', 'contactPerson']}
                onView={(customer) => toast({ title: "View Customer", description: `Viewing ${customer.customerCode}` })}
                onEdit={(customer) => toast({ title: "Edit Customer", description: `Editing ${customer.customerCode}` })}
                onDelete={async (customer) => {
                  if (confirm(`Delete customer ${customer.customerCode}?`)) {
                    toast({ title: "Success", description: "Customer deleted successfully" });
                  }
                }}
                onCreate={() => toast({ title: "Create Customer", description: "Opening customer form" })}
                createLabel="New Customer"
                pageSize={10}
                mobileCardView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}