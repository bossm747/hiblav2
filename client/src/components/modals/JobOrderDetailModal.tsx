import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Eye,
  Edit,
  Copy,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CreditCard,
  MessageSquare,
  Factory,
  Printer,
  Mail,
  Hash,
  CalendarCheck,
  UserCheck,
  MoreVertical,
  Trash2,
  ShoppingCart,
  Receipt,
  AlertTriangle,
  CheckSquare,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Activity,
} from 'lucide-react';

interface JobOrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobOrderId: string | null;
  onEdit?: (jobOrderId: string) => void;
  onDuplicate?: (jobOrderId: string) => void;
  onStartProduction?: (jobOrderId: string) => void;
  onCompleteProduction?: (jobOrderId: string) => void;
  onSendEmail?: (jobOrderId: string) => void;
  onDownloadPDF?: (jobOrderId: string) => void;
}

export function JobOrderDetailModal({
  open,
  onOpenChange,
  jobOrderId,
  onEdit,
  onDuplicate,
  onStartProduction,
  onCompleteProduction,
  onSendEmail,
  onDownloadPDF,
}: JobOrderDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: jobOrderData, isLoading } = useQuery({
    queryKey: ['/api/job-orders', jobOrderId],
    queryFn: async () => {
      if (!jobOrderId) return null;
      const response = await fetch(`/api/job-orders/${jobOrderId}`);
      if (!response.ok) throw new Error('Failed to fetch job order');
      return response.json();
    },
    enabled: !!jobOrderId && open,
  });

  const { data: jobOrderItems = [] } = useQuery({
    queryKey: ['/api/job-order-items', jobOrderId],
    queryFn: async () => {
      if (!jobOrderId) return [];
      const response = await fetch(`/api/job-order-items/${jobOrderId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!jobOrderId && open,
  });

  // Type-safe access to job order data
  const safeJobOrder = jobOrderData as {
    id?: string;
    jobOrderNumber?: string;
    salesOrderId?: string;
    customerCode?: string;
    customerId?: string;
    status?: string;
    createdBy?: string;
    date?: string;
    dueDate?: string;
    productionDate?: string;
    nameSignature?: string;
    received?: string;
    orderInstructions?: string;
    createdAt?: string;
    updatedAt?: string;
  } || {};

  // Type-safe access to job order items
  const safeJobOrderItems = jobOrderItems as Array<{
    id?: string;
    productName?: string;
    specification?: string;
    quantity?: string;
    shipment1?: string;
    shipment2?: string;
    shipment3?: string;
    shipment4?: string;
    shipment5?: string;
    shipment6?: string;
    shipment7?: string;
    shipment8?: string;
    shipped?: string;
    reserved?: string;
    ready?: string;
    toProduce?: string;
    orderBalance?: string;
  }> || [];

  if (!jobOrderId) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200" },
      'in-progress': { icon: PlayCircle, className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200" },
      completed: { icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200" },
      cancelled: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200" },
      paused: { icon: PauseCircle, className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200" },
      draft: { icon: Edit, className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      icon: Factory,
      className: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200"
    };

    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (!safeJobOrderItems.length) return 0;
    
    const totalQuantity = safeJobOrderItems.reduce((sum, item) => 
      sum + parseFloat(item.quantity || '0'), 0);
    const totalShipped = safeJobOrderItems.reduce((sum, item) => 
      sum + parseFloat(item.shipped || '0'), 0);
    
    return totalQuantity > 0 ? Math.round((totalShipped / totalQuantity) * 100) : 0;
  };

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!safeJobOrder || !safeJobOrder.id) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Order Not Found</DialogTitle>
            <DialogDescription>
              The requested job order could not be found.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold">
              JOB ORDER FORM
            </DialogTitle>
            <DialogDescription>
              Complete production order tracking with real-time monitoring
            </DialogDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                Actions
                <MoreVertical className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit?.(jobOrderId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onDuplicate?.(jobOrderId)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="text-red-600"
                onClick={async () => {
                  if (confirm(`Are you sure you want to delete job order ${safeJobOrder.jobOrderNumber}?`)) {
                    try {
                      await apiRequest(`/api/job-orders/${jobOrderId}`, {
                        method: 'DELETE',
                      });
                      queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] });
                      toast({
                        title: 'Success',
                        description: `Job order ${safeJobOrder.jobOrderNumber} deleted successfully`,
                      });
                      onOpenChange(false);
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to delete job order',
                        variant: 'destructive',
                      });
                    }
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {safeJobOrder.status === 'pending' && (
                <DropdownMenuItem onClick={() => onStartProduction?.(jobOrderId)} className="text-blue-600">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Production
                </DropdownMenuItem>
              )}
              
              {safeJobOrder.status === 'in-progress' && (
                <DropdownMenuItem onClick={() => onCompleteProduction?.(jobOrderId)} className="text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Production
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onDownloadPDF?.(jobOrderId)}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onSendEmail?.(jobOrderId)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>

        {/* Document Header Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Hash className="h-4 w-4 mr-1" />
                Job Order No.
              </div>
              <div className="font-bold text-lg">{safeJobOrder.jobOrderNumber || 'Auto-Generated'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Date
              </div>
              <div className="font-semibold">
                {safeJobOrder.date ? new Date(safeJobOrder.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <CalendarCheck className="h-4 w-4 mr-1" />
                Due Date
              </div>
              <div className="font-semibold">
                {safeJobOrder.dueDate ? new Date(safeJobOrder.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Factory className="h-4 w-4 mr-1" />
                Hair Tag
              </div>
              <div className="font-semibold text-lg">{safeJobOrder.customerCode || 'N/A'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <UserCheck className="h-4 w-4 mr-1" />
                Status
              </div>
              <div>{getStatusBadge(safeJobOrder.status || 'draft')}</div>
            </div>
          </div>
        </div>

        {/* Production Progress Overview */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2" />
              Production Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-lg font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {safeJobOrderItems.reduce((sum, item) => sum + parseFloat(item.shipped || '0'), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Shipped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {safeJobOrderItems.reduce((sum, item) => sum + parseFloat(item.ready || '0'), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Ready for Shipment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {safeJobOrderItems.reduce((sum, item) => sum + parseFloat(item.toProduce || '0'), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">To Produce</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {safeJobOrderItems.reduce((sum, item) => sum + parseFloat(item.orderBalance || '0'), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Order Balance</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">

          {/* Production Team and Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <User className="h-4 w-4 mr-2" />
                  Production Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Created By</div>
                  <div className="font-semibold">{safeJobOrder.createdBy || 'System'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Name / Signature</div>
                  <div className="font-semibold">{safeJobOrder.nameSignature || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Received By</div>
                  <div className="font-semibold">{safeJobOrder.received || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Timer className="h-4 w-4 mr-2" />
                  Production Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Production Date</div>
                  <div className="font-semibold">
                    {safeJobOrder.productionDate ? new Date(safeJobOrder.productionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not started'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Due Date</div>
                  <div className="font-semibold">
                    {safeJobOrder.dueDate ? new Date(safeJobOrder.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Days Remaining</div>
                  <div className="font-semibold">
                    {safeJobOrder.dueDate ? 
                      Math.ceil((new Date(safeJobOrder.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days'
                      : 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Sales Order ID</div>
                  <div className="font-semibold">{safeJobOrder.salesOrderId || 'Direct Entry'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Customer Code</div>
                  <div className="font-semibold text-lg">{safeJobOrder.customerCode || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Date Created</div>
                  <div className="font-semibold">
                    {safeJobOrder.createdAt ? new Date(safeJobOrder.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Instructions */}
          {safeJobOrder.orderInstructions && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Order Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {safeJobOrder.orderInstructions}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Production Items Table with 8-Column Shipment Tracking */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Production Items & Shipment Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableHead className="font-semibold min-w-[200px]">Order Item</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Specification</TableHead>
                      <TableHead className="text-center font-semibold w-20">Quantity</TableHead>
                      <TableHead className="text-center font-semibold w-12">1</TableHead>
                      <TableHead className="text-center font-semibold w-12">2</TableHead>
                      <TableHead className="text-center font-semibold w-12">3</TableHead>
                      <TableHead className="text-center font-semibold w-12">4</TableHead>
                      <TableHead className="text-center font-semibold w-12">5</TableHead>
                      <TableHead className="text-center font-semibold w-12">6</TableHead>
                      <TableHead className="text-center font-semibold w-12">7</TableHead>
                      <TableHead className="text-center font-semibold w-12">8</TableHead>
                      <TableHead className="text-center font-semibold w-20">Order Balance</TableHead>
                      <TableHead className="text-center font-semibold w-20">Shipped</TableHead>
                      <TableHead className="text-center font-semibold w-20">Reserved</TableHead>
                      <TableHead className="text-center font-semibold w-20">Ready</TableHead>
                      <TableHead className="text-center font-semibold w-20">To Produce</TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                      <TableHead colSpan={3} className="font-normal text-center italic">Product Details</TableHead>
                      <TableHead colSpan={8} className="font-normal text-center italic">Shipments</TableHead>
                      <TableHead colSpan={4} className="font-normal text-center italic">Production Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeJobOrderItems && safeJobOrderItems.length > 0 ? (
                      safeJobOrderItems.map((item: any, index: number) => (
                        <TableRow key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <TableCell className="font-medium">{item.productName || 'N/A'}</TableCell>
                          <TableCell>{item.specification || '-'}</TableCell>
                          <TableCell className="text-center font-semibold">{item.quantity || '0.0'}</TableCell>
                          
                          {/* Shipment columns 1-8 */}
                          <TableCell className="text-center text-xs">{item.shipment1 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment2 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment3 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment4 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment5 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment6 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment7 || '0'}</TableCell>
                          <TableCell className="text-center text-xs">{item.shipment8 || '0'}</TableCell>
                          
                          {/* Calculated fields with color coding */}
                          <TableCell className="text-center font-semibold bg-yellow-50 dark:bg-yellow-900">
                            {item.orderBalance || '0.0'}
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-blue-50 dark:bg-blue-900">
                            {item.shipped || '0.0'}
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-purple-50 dark:bg-purple-900">
                            {item.reserved || '0.0'}
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-green-50 dark:bg-green-900">
                            {item.ready || '0.0'}
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-red-50 dark:bg-red-900">
                            {item.toProduce || '0.0'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Factory className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No items in this job order</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Production Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Activity className="h-5 w-5 mr-2" />
                  Production Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Total Items:
                    </span>
                    <span className="font-bold">{safeJobOrderItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Total Quantity:
                    </span>
                    <span className="font-bold">
                      {safeJobOrderItems.reduce((sum, item) => sum + parseFloat(item.quantity || '0'), 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate:</span>
                    <span className="font-bold text-green-600">{progress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Efficiency Score:</span>
                    <span className="font-bold text-blue-600">
                      {progress > 80 ? 'Excellent' : progress > 60 ? 'Good' : progress > 40 ? 'Fair' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <FileText className="h-5 w-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Updated</div>
                    <div className="font-semibold">
                      {safeJobOrder.updatedAt ? new Date(safeJobOrder.updatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Order Type</div>
                    <div className="font-semibold">Manufacturing Job Order</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Priority Level</div>
                    <div>
                      {safeJobOrder.dueDate && new Date(safeJobOrder.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? (
                        <Badge className="bg-red-100 text-red-800 border-red-300">High Priority</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">Standard</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}