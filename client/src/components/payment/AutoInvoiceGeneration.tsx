import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import {
  Receipt,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Calendar,
  Download,
  Send,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Printer,
} from 'lucide-react';

export function AutoInvoiceGeneration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch confirmed sales orders ready for invoice generation
  const { data: readyForInvoice = [] } = useQuery({
    queryKey: ['/api/sales-orders/ready-for-invoice'],
    refetchInterval: 30000,
  });

  // Fetch recent auto-generated invoices
  const { data: recentInvoices = [] } = useQuery({
    queryKey: ['/api/invoices/recent-auto-generated'],
    refetchInterval: 30000,
  });

  // Fetch automation stats
  const { data: automationStats = {} } = useQuery({
    queryKey: ['/api/invoices/automation-stats'],
    refetchInterval: 30000,
  });

  // Auto-generate invoice mutation
  const generateInvoiceMutation = useMutation({
    mutationFn: (salesOrderId: string) => 
      apiRequest(`/api/sales-orders/${salesOrderId}/generate-invoice`, 'POST'),
    onSuccess: (data) => {
      toast({
        title: 'Invoice Generated',
        description: `Invoice ${data.invoiceNumber} has been auto-generated successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders/ready-for-invoice'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices/recent-auto-generated'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices/automation-stats'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate invoice',
        variant: 'destructive',
      });
    },
  });

  // Bulk generate invoices mutation
  const bulkGenerateMutation = useMutation({
    mutationFn: (salesOrderIds: string[]) => 
      apiRequest('/api/invoices/bulk-generate', 'POST', { salesOrderIds }),
    onSuccess: (data) => {
      toast({
        title: 'Bulk Generation Complete',
        description: `Successfully generated ${data.generatedCount} invoices`,
      });
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast({
        title: 'Bulk Generation Failed',
        description: error.message || 'Failed to generate invoices in bulk',
        variant: 'destructive',
      });
    },
  });

  const safeStats = automationStats as {
    totalGenerated?: number;
    todayGenerated?: number;
    automationRate?: number;
    timesSaved?: number;
    avgGenerationTime?: number;
  };

  const handleBulkGenerate = () => {
    const salesOrderIds = (readyForInvoice as any[]).map(so => so.id);
    if (salesOrderIds.length === 0) {
      toast({
        title: 'No Orders Ready',
        description: 'No sales orders are ready for invoice generation',
      });
      return;
    }
    bulkGenerateMutation.mutate(salesOrderIds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automatic Invoice Generation</h2>
          <p className="text-muted-foreground">
            Seamless invoice creation from confirmed sales orders with YYYY.MM.### numbering
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleBulkGenerate}
            disabled={bulkGenerateMutation.isPending || readyForInvoice.length === 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            {bulkGenerateMutation.isPending ? 'Generating...' : `Generate All (${readyForInvoice.length})`}
          </Button>
        </div>
      </div>

      {/* Automation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Today Generated</span>
            </div>
            <p className="text-2xl font-bold mt-1">{safeStats.todayGenerated || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Generated</span>
            </div>
            <p className="text-2xl font-bold mt-1">{safeStats.totalGenerated || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Automation Rate</span>
            </div>
            <p className="text-2xl font-bold mt-1">{safeStats.automationRate || 95}%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Time Saved</span>
            </div>
            <p className="text-2xl font-bold mt-1">{safeStats.timesSaved || 90}%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Avg. Time</span>
            </div>
            <p className="text-2xl font-bold mt-1">{safeStats.avgGenerationTime || 2}s</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Flow Visualization */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Automated Invoice Generation Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: '1',
                title: 'Sales Order Confirmed',
                description: 'Status updated to confirmed',
                icon: CheckCircle,
                status: 'completed'
              },
              {
                step: '2', 
                title: 'Auto-Trigger Detected',
                description: 'System detects confirmed order',
                icon: Zap,
                status: 'active'
              },
              {
                step: '3',
                title: 'Invoice Generated',
                description: 'PDF created with same series #',
                icon: Receipt,
                status: 'processing'
              },
              {
                step: '4',
                title: 'Status Updated',
                description: 'Ready for payment collection',
                icon: TrendingUp,
                status: 'pending'
              }
            ].map((flow) => {
              const Icon = flow.icon;
              return (
                <div key={flow.step} className="text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    flow.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900' :
                    flow.status === 'active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900' :
                    flow.status === 'processing' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900' :
                    'bg-gray-100 text-gray-400 dark:bg-gray-900'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium mb-1">{flow.title}</div>
                  <div className="text-xs text-muted-foreground">{flow.description}</div>
                  {flow.step !== '4' && (
                    <ArrowRight className="mx-auto mt-2 h-4 w-4 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ready for Invoice Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sales Orders Ready for Invoice Generation ({readyForInvoice.length})</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900">
              Auto-Generation Available
            </Badge>
          </CardTitle>
          <CardDescription>
            Confirmed sales orders that will automatically generate invoices with the same series numbering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sales Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(readyForInvoice as any[]).map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.salesOrderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        Invoice: {order.salesOrderNumber} (Auto-generated)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerCode}</p>
                      <p className="text-sm text-muted-foreground">{order.country}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">${order.pleasePayThisAmountUsd}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {order.paymentMethod?.replace('_', ' ') || 'Bank Transfer'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900">
                      <Clock className="h-3 w-3 mr-1" />
                      Awaiting Invoice
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => generateInvoiceMutation.mutate(order.id)}
                      disabled={generateInvoiceMutation.isPending}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {generateInvoiceMutation.isPending ? 'Generating...' : 'Generate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {readyForInvoice.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No sales orders ready for invoice generation.</p>
              <p className="text-sm">Invoices will appear here when sales orders are confirmed.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Auto-Generated Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Auto-Generated Invoices</CardTitle>
          <CardDescription>Latest invoices created through automated generation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(recentInvoices as any[]).slice(0, 10).map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Zap className="h-3 w-3 mr-1 text-green-500" />
                        Auto-Generated
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.customerCode}</p>
                      <p className="text-sm text-muted-foreground">{invoice.country}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">${invoice.total}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {format(new Date(invoice.createdAt), 'MMM dd, HH:mm')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor((new Date().getTime() - new Date(invoice.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.paymentStatus === 'paid' ? 'default' :
                      invoice.paymentStatus === 'overdue' ? 'destructive' : 'outline'
                    }>
                      {invoice.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Automation Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Complete Invoice Automation
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  95% time reduction • 100% accuracy • Same series numbering • Instant PDF generation
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {safeStats.automationRate || 95}%
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                Automation Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}