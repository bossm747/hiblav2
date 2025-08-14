import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
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
} from 'lucide-react';
import { EnhancedQuotationForm } from '@/components/forms/EnhancedQuotationForm';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quotation: any) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                      <TableCell>{quotation.customerCode}</TableCell>
                      <TableCell>{quotation.country}</TableCell>
                      <TableCell>${quotation.total?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <Badge variant={quotation.status === 'approved' ? 'default' : 'secondary'}>
                          {quotation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.salesOrderNumber}</TableCell>
                      <TableCell>{order.customerCode}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <Badge variant="default">{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer: any) => {
                    const customerOrders = salesOrders.filter((order: any) => order.customerCode === customer.customerCode);
                    const totalValue = customerOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
                    
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.customerCode}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.country}</TableCell>
                        <TableCell>{customerOrders.length}</TableCell>
                        <TableCell>${totalValue.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}