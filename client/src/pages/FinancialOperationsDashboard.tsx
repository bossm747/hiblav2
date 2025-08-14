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
  DollarSign,
  CreditCard,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Download,
  Upload,
} from 'lucide-react';
import { PaymentRecordingModule } from '@/components/modules/PaymentRecordingModule';

export function FinancialOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch financial data
  const { data: paymentRecords = [] } = useQuery({
    queryKey: ['/api/payment-records'],
  });

  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  // Calculate financial metrics
  const totalRevenue = salesOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const pendingPayments = paymentRecords.filter((payment: any) => payment.status === 'pending').length;
  const verifiedPayments = paymentRecords.filter((payment: any) => payment.status === 'verified').length;
  const confirmedPayments = paymentRecords.filter((payment: any) => payment.status === 'confirmed').length;
  
  const paymentSuccessRate = paymentRecords.length > 0 ? 
    (confirmedPayments / paymentRecords.length * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Manage payments, invoices, and financial workflows through WhatsApp integration
          </p>
        </div>
        <div className="flex gap-2">
          <PaymentRecordingModule 
            trigger={
              <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            }
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentSuccessRate.toFixed(1)}%</div>
            <Progress value={paymentSuccessRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment Processing</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* WhatsApp Payment Workflow */}
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Payment Workflow</CardTitle>
                <CardDescription>Payment processing through WhatsApp integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Customer Support Upload</span>
                    </div>
                    <Badge variant="secondary">{pendingPayments} pending</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Finance Team Verification</span>
                    </div>
                    <Badge variant="outline">{verifiedPayments} verified</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Payment Confirmation</span>
                    </div>
                    <Badge variant="default">{confirmedPayments} confirmed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Payment Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payment Activity</CardTitle>
                <CardDescription>Latest payment processing updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentRecords.slice(0, 5).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{payment.salesOrderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          ${payment.paymentAmount} - {payment.methodOfPayment}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          payment.status === 'confirmed' ? 'default' :
                          payment.status === 'verified' ? 'secondary' : 'outline'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing Queue</CardTitle>
              <CardDescription>Manage WhatsApp payment screenshots and verification workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Sales Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRecords.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.dateOfPayment}</TableCell>
                      <TableCell className="font-medium">{payment.salesOrderNumber}</TableCell>
                      <TableCell>{payment.customerCode}</TableCell>
                      <TableCell>${payment.paymentAmount.toFixed(2)}</TableCell>
                      <TableCell>{payment.methodOfPayment}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            payment.status === 'confirmed' ? 'default' :
                            payment.status === 'verified' ? 'secondary' : 
                            payment.status === 'rejected' ? 'destructive' : 'outline'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.uploadedBy}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {payment.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" className="text-green-600">
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Auto-generated invoices from confirmed sales orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Sales Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">INV-{order.salesOrderNumber}</TableCell>
                      <TableCell>{order.salesOrderNumber}</TableCell>
                      <TableCell>{order.customerCode}</TableCell>
                      <TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
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

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Monthly Revenue</span>
                    <Badge variant="default">${totalRevenue.toLocaleString()}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Order Value</span>
                    <Badge variant="secondary">
                      ${salesOrders.length > 0 ? (totalRevenue / salesOrders.length).toFixed(2) : '0.00'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Success Rate</span>
                    <Badge variant="outline">{paymentSuccessRate.toFixed(1)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outstanding Receivables</span>
                    <Badge variant="destructive">$0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method Analysis</CardTitle>
                <CardDescription>Breakdown by payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Bank Transfer</span>
                    <Badge variant="default">65%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Money Transfer</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Agent</span>
                    <Badge variant="outline">8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cash</span>
                    <Badge variant="outline">2%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}