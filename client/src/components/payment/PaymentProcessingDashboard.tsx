import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Receipt,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  FileImage,
  Eye,
  DollarSign,
  CreditCard,
  Banknote,
  Building,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Filter,
} from 'lucide-react';
import { PaymentProofUpload } from './PaymentProofUpload';
import { PaymentVerificationQueue } from './PaymentVerificationQueue';
import { AutoInvoiceGeneration } from './AutoInvoiceGeneration';

export function PaymentProcessingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch payment data
  const { data: paymentStats = {} } = useQuery({
    queryKey: ['/api/payments/stats'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: recentPayments = [] } = useQuery({
    queryKey: ['/api/payments/recent'],
    refetchInterval: 30000,
  });

  const { data: pendingInvoices = [] } = useQuery({
    queryKey: ['/api/invoices/pending-payment'],
  });

  // Safe data access
  const safePaymentStats = paymentStats as {
    totalSubmitted?: number;
    totalVerified?: number;
    totalRejected?: number;
    pendingVerification?: number;
    totalAmount?: number;
    todaySubmissions?: number;
    verificationRate?: number;
  };

  const metrics = [
    {
      title: 'Payment Submissions',
      value: safePaymentStats.todaySubmissions || 0,
      description: 'Today',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Pending Verification',
      value: safePaymentStats.pendingVerification || 0,
      description: 'Awaiting finance review',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      title: 'Verified Payments',
      value: safePaymentStats.totalVerified || 0,
      description: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Total Amount',
      value: `$${(safePaymentStats.totalAmount || 0).toLocaleString()}`,
      description: 'Processed this month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'bank_transfer':
        return <Building className="h-4 w-4" />;
      case 'agent':
        return <Users className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'mobile_payment':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { icon: Clock, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900" },
      verified: { icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900" },
      rejected: { icon: XCircle, className: "bg-red-100 text-red-800 dark:bg-red-900" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Processing Center</h1>
          <p className="text-muted-foreground">
            Streamlined payment recording, verification, and invoice generation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className={`border-l-4 border-l-primary ${metric.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Processing Flow Visual */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Optimal Payment Processing Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Invoice Generated', description: 'Auto from Sales Order', icon: Receipt, status: 'completed' },
              { step: '2', title: 'Client Payment', description: 'External via WhatsApp', icon: Smartphone, status: 'active' },
              { step: '3', title: 'Proof Upload', description: 'Staff upload screenshots', icon: Upload, status: 'active' },
              { step: '4', title: 'Finance Review', description: 'Verify & approve payment', icon: CheckCircle, status: 'pending' },
              { step: '5', title: 'Auto Updates', description: 'Status propagation', icon: TrendingUp, status: 'pending' },
            ].map((flow, index) => {
              const Icon = flow.icon;
              return (
                <div key={flow.step} className="text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    flow.status === 'completed' ? 'bg-green-100 text-green-600' :
                    flow.status === 'active' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">{flow.title}</div>
                  <div className="text-xs text-muted-foreground">{flow.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Payment Upload</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
          <TabsTrigger value="invoices">Auto Invoicing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Payment Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payment Activity</CardTitle>
                <CardDescription>Latest payment submissions and verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(recentPayments as any[]).slice(0, 5).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <div>
                          <p className="font-medium">${payment.amount}</p>
                          <p className="text-sm text-muted-foreground">{payment.customerCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payment.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Payment Invoices</CardTitle>
                <CardDescription>Invoices awaiting client payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(pendingInvoices as any[]).slice(0, 5).map((invoice: any) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customerCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${invoice.total}</p>
                        <Badge variant="outline" className="mt-1">
                          {Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Verification Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verification Rate</span>
                  <span className="text-lg font-bold">{safePaymentStats.verificationRate || 0}%</span>
                </div>
                <Progress value={safePaymentStats.verificationRate || 0} className="h-2" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{safePaymentStats.totalSubmitted || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Submitted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{safePaymentStats.totalVerified || 0}</div>
                    <div className="text-xs text-muted-foreground">Verified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{safePaymentStats.totalRejected || 0}</div>
                    <div className="text-xs text-muted-foreground">Rejected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <PaymentProofUpload />
        </TabsContent>

        <TabsContent value="verification">
          <PaymentVerificationQueue />
        </TabsContent>

        <TabsContent value="invoices">
          <AutoInvoiceGeneration />
        </TabsContent>
      </Tabs>
    </div>
  );
}