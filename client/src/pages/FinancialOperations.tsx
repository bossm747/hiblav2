import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  FileCheck, 
  Receipt, 
  CreditCard,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FinancialOperations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('invoices');

  // Fetch invoices data
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['/api/invoices'],
    queryFn: async () => {
      const response = await fetch('/api/invoices');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      return response.json();
    },
  });

  // Fetch payments data
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
    queryFn: async () => {
      const response = await fetch('/api/payments');
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      partial: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  // Calculate financial metrics
  const totalInvoices = invoices?.length || 0;
  const paidInvoices = invoices?.filter((inv: any) => inv.status === 'paid').length || 0;
  const pendingAmount = invoices?.filter((inv: any) => inv.status === 'pending')
    .reduce((sum: number, inv: any) => sum + parseFloat(inv.totalAmount || 0), 0) || 0;
  const totalRevenue = invoices?.filter((inv: any) => inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + parseFloat(inv.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Operations</h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, and financial tracking
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Generate Invoice</span>
        </Button>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
              </div>
              <FileCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Invoices</p>
                <p className="text-2xl font-bold">{paidInvoices}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment Recording</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices, payments, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>Recent Invoices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="text-center py-8">Loading invoices...</div>
                ) : (
                  <div className="space-y-4">
                    {invoices?.slice(0, 6).map((invoice: any) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-muted-foreground">{invoice.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${invoice.totalAmount}</div>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline">View All Invoices</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Invoice Status Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'Paid', count: paidInvoices, amount: totalRevenue, color: 'text-green-600' },
                    { status: 'Pending', count: invoices?.filter((inv: any) => inv.status === 'pending').length || 0, amount: pendingAmount, color: 'text-yellow-600' },
                    { status: 'Overdue', count: invoices?.filter((inv: any) => inv.status === 'overdue').length || 0, amount: invoices?.filter((inv: any) => inv.status === 'overdue').reduce((sum: number, inv: any) => sum + parseFloat(inv.totalAmount || 0), 0) || 0, color: 'text-red-600' },
                    { status: 'Partial', count: invoices?.filter((inv: any) => inv.status === 'partial').length || 0, amount: invoices?.filter((inv: any) => inv.status === 'partial').reduce((sum: number, inv: any) => sum + parseFloat(inv.totalAmount || 0), 0) || 0, color: 'text-orange-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className={`font-medium ${item.color}`}>{item.status}</div>
                        <div className="text-sm text-muted-foreground">{item.count} invoices</div>
                      </div>
                      <div className={`text-lg font-bold ${item.color}`}>
                        ${item.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Recording */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Recent Payments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">Loading payments...</div>
                ) : (
                  <div className="space-y-4">
                    {payments?.slice(0, 6).map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{payment.invoiceNumber}</div>
                          <div className="text-sm text-muted-foreground">{payment.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            Method: {payment.paymentMethod}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Date: {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${payment.amount}</div>
                          <Badge className={getStatusColor('paid')}>
                            Received
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        No payment records found
                      </div>
                    )}
                    <div className="text-center pt-4">
                      <Button>Record New Payment</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'Bank Transfer', count: 45, percentage: 65, amount: 125000 },
                    { method: 'Agent Payment', count: 18, percentage: 26, amount: 52000 },
                    { method: 'Money Transfer', count: 4, percentage: 6, amount: 15000 },
                    { method: 'Cash Payment', count: 2, percentage: 3, amount: 5000 }
                  ].map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{method.method}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">${method.amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{method.count} transactions</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {method.percentage}% of total
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}