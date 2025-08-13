import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Calculator,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SalesWorkflowVisualizer } from '@/components/sales/SalesWorkflowVisualizer';

export default function SalesOperations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('quotations');

  // Fetch data for all sales operations
  const { data: quotations, isLoading: quotationsLoading } = useQuery({
    queryKey: ['/api/quotations'],
    queryFn: async () => {
      const response = await fetch('/api/quotations');
      if (!response.ok) throw new Error('Failed to fetch quotations');
      return response.json();
    },
  });

  const { data: salesOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/sales-orders'],
    queryFn: async () => {
      const response = await fetch('/api/sales-orders');
      if (!response.ok) throw new Error('Failed to fetch sales orders');
      return response.json();
    },
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['/api/customers'],
    queryFn: async () => {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
  });

  // Fetch job orders for workflow visualization
  const { data: jobOrders = [] } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const handleStepClick = (step: string) => {
    switch (step) {
      case 'quotations':
        window.location.href = '/quotations';
        break;
      case 'sales-orders':
        setActiveTab('orders');
        break;
      case 'job-orders':
        window.location.href = '/job-orders';
        break;
      case 'invoices':
        window.location.href = '/invoices';
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Operations Hub</h1>
          <p className="text-muted-foreground">
            Complete sales management from quotation to fulfillment
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/quotations-vlookup'} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0">
            <Calculator className="h-4 w-4 mr-2" />
            VLOOKUP Quote
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            New Operation
          </Button>
        </div>
      </div>

      {/* Sales Workflow Visualizer */}
      <SalesWorkflowVisualizer
        quotationsCount={quotations?.length || 0}
        salesOrdersCount={salesOrders?.length || 0}
        jobOrdersCount={Array.isArray(jobOrders) ? jobOrders.length : 0}
        invoicesCount={0} // TODO: Add when invoices API is ready
        onStepClick={handleStepClick}
      />

      {/* Main Operations Interface */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search across all sales operations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="quotations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Quotations Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotationsLoading ? (
                <div className="text-center py-8">Loading quotations...</div>
              ) : (
                <div className="space-y-4">
                  {quotations?.slice(0, 5).map((quote: any) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{quote.quotationNumber}</div>
                        <div className="text-sm text-muted-foreground">{quote.customerCode}</div>
                        <div className="text-sm text-muted-foreground">Total: ${quote.total}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <div className="flex items-center space-x-2 justify-center">
                      <Button variant="outline" onClick={() => window.location.href = '/quotations'}>View All Quotations</Button>
                      <Button variant="outline" onClick={() => window.location.href = '/quotations-vlookup'}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create VLOOKUP Quote
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Sales Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="text-center py-8">Loading sales orders...</div>
              ) : (
                <div className="space-y-4">
                  {salesOrders?.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{order.salesOrderNumber}</div>
                        <div className="text-sm text-muted-foreground">{order.customerCode}</div>
                        <div className="text-sm text-muted-foreground">Total: ${order.pleasePayThisAmountUsd}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline">View All Sales Orders</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Customer Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customersLoading ? (
                <div className="text-center py-8">Loading customers...</div>
              ) : (
                <div className="space-y-4">
                  {customers?.slice(0, 5).map((customer: any) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                        <div className="text-sm text-muted-foreground">{customer.country}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline">View All Customers</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Price Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Manage pricing lists and customer pricing tiers</p>
                <Button className="mt-4">Manage Price Lists</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}