import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';

interface SalesOrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesOrderId: string | null;
  onEdit?: (salesOrderId: string) => void;
  onDuplicate?: (salesOrderId: string) => void;
  onConvertToJobOrder?: (salesOrderId: string) => void;
  onConfirmPayment?: (salesOrderId: string) => void;
  onSendEmail?: (salesOrderId: string) => void;
  onDownloadPDF?: (salesOrderId: string) => void;
}

export function SalesOrderDetailModal({
  open,
  onOpenChange,
  salesOrderId,
  onEdit,
  onDuplicate,
  onConvertToJobOrder,
  onConfirmPayment,
  onSendEmail,
  onDownloadPDF,
}: SalesOrderDetailModalProps) {
  const { data: salesOrderData, isLoading } = useQuery({
    queryKey: ['/api/sales-orders', salesOrderId],
    queryFn: async () => {
      if (!salesOrderId) return null;
      const response = await fetch(`/api/sales-orders/${salesOrderId}`);
      if (!response.ok) throw new Error('Failed to fetch sales order');
      return response.json();
    },
    enabled: !!salesOrderId && open,
  });

  const { data: salesOrderItems = [] } = useQuery({
    queryKey: ['/api/sales-order-items', salesOrderId],
    queryFn: async () => {
      if (!salesOrderId) return [];
      const response = await fetch(`/api/sales-order-items/${salesOrderId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!salesOrderId && open,
  });

  // Type-safe access to sales order data
  const safeSalesOrder = salesOrderData as {
    id?: string;
    salesOrderNumber?: string;
    revisionNumber?: string;
    customerCode?: string;
    customerId?: string;
    country?: string;
    paymentMethod?: string;
    shippingMethod?: string;
    status?: string;
    paymentStatus?: string;
    createdBy?: string;
    orderDate?: string;
    dueDate?: string;
    createdAt?: string;
    updatedAt?: string;
    subtotal?: string;
    shippingChargeUsd?: string;
    bankChargeUsd?: string;
    discountUsd?: string;
    others?: string;
    pleasePayThisAmountUsd?: string;
    customerServiceInstructions?: string;
    quotationId?: string;
  } || {};

  // Type-safe access to sales order items
  const safeSalesOrderItems = salesOrderItems as Array<{
    id?: string;
    productName?: string;
    productSku?: string;
    specification?: string;
    quantity?: string;
    unitPrice?: string;
    lineTotal?: string;
  }> || [];

  if (!salesOrderId) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200" },
      confirmed: { icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200" },
      cancelled: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200" },
      draft: { icon: Edit, className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200" },
      processing: { icon: Factory, className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      icon: FileText,
      className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200"
    };

    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      pending: { icon: Clock, className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200" },
      paid: { icon: CheckSquare, className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200" },
      partial: { icon: AlertTriangle, className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200" },
      overdue: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200" },
    };

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || {
      icon: Receipt,
      className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200"
    };

    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
    );
  };

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

  if (!safeSalesOrder || !safeSalesOrder.id) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Order Not Found</DialogTitle>
            <DialogDescription>
              The requested sales order could not be found.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const subtotal = parseFloat(safeSalesOrder.subtotal || '0');
  const shippingChargeUsd = parseFloat(safeSalesOrder.shippingChargeUsd || '0');
  const bankChargeUsd = parseFloat(safeSalesOrder.bankChargeUsd || '0');
  const discountUsd = parseFloat(safeSalesOrder.discountUsd || '0');
  const others = parseFloat(safeSalesOrder.others || '0');
  const pleasePayThisAmountUsd = parseFloat(safeSalesOrder.pleasePayThisAmountUsd || '0');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold">
              SALES ORDER
            </DialogTitle>
            <DialogDescription>
              Complete sales order details and item breakdown
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
              <DropdownMenuItem onClick={() => onEdit?.(salesOrderId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onDuplicate?.(salesOrderId)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {safeSalesOrder.status === 'confirmed' && (
                <DropdownMenuItem onClick={() => onConvertToJobOrder?.(salesOrderId)}>
                  <Factory className="h-4 w-4 mr-2" />
                  Create Job Order
                </DropdownMenuItem>
              )}
              
              {safeSalesOrder.paymentStatus === 'pending' && (
                <DropdownMenuItem 
                  onClick={() => onConfirmPayment?.(salesOrderId)}
                  className="text-green-600"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Confirm Payment
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onDownloadPDF?.(salesOrderId)}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onSendEmail?.(salesOrderId)}>
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Hash className="h-4 w-4 mr-1" />
                Sales Order No.
              </div>
              <div className="font-bold text-lg">{safeSalesOrder.salesOrderNumber || 'Auto-Generated'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Order Date
              </div>
              <div className="font-semibold">
                {safeSalesOrder.orderDate ? new Date(safeSalesOrder.orderDate).toLocaleDateString('en-US', {
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
                {safeSalesOrder.dueDate ? new Date(safeSalesOrder.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4 mr-1" />
                Revision
              </div>
              <div className="font-semibold">{safeSalesOrder.revisionNumber || 'R1'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <UserCheck className="h-4 w-4 mr-1" />
                Status
              </div>
              <div className="space-y-1">
                {getStatusBadge(safeSalesOrder.status || 'draft')}
                {getPaymentStatusBadge(safeSalesOrder.paymentStatus || 'pending')}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">

          {/* Customer and Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <User className="h-4 w-4 mr-2" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Hair Tag (Customer Code)</div>
                  <div className="font-semibold text-lg">{safeSalesOrder.customerCode || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Country</div>
                  <div className="font-semibold flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {safeSalesOrder.country || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created By</div>
                  <div className="font-semibold">{safeSalesOrder.createdBy || 'System'}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Payment Method</div>
                  <div className="font-semibold flex items-center">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {safeSalesOrder.paymentMethod ? safeSalesOrder.paymentMethod.charAt(0).toUpperCase() + safeSalesOrder.paymentMethod.slice(1) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Shipping Method</div>
                  <div className="font-semibold flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    {safeSalesOrder.shippingMethod || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Payment Status</div>
                  <div>{getPaymentStatusBadge(safeSalesOrder.paymentStatus || 'pending')}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {(shippingChargeUsd > 0 || bankChargeUsd > 0 || discountUsd > 0 || others > 0) && (
                  <>
                    {shippingChargeUsd > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Shipping:</span>
                        <span className="text-sm">${shippingChargeUsd.toFixed(2)}</span>
                      </div>
                    )}
                    {bankChargeUsd > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Bank Charge:</span>
                        <span className="text-sm">${bankChargeUsd.toFixed(2)}</span>
                      </div>
                    )}
                    {discountUsd > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-xs">Discount:</span>
                        <span className="text-sm">-${discountUsd.toFixed(2)}</span>
                      </div>
                    )}
                    {others !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Others:</span>
                        <span className="text-sm">${others.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-orange-600">Please Pay This Amount USD:</span>
                  <span className="font-bold text-lg text-orange-600">${pleasePayThisAmountUsd.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Order Items Table */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableHead className="font-semibold">#</TableHead>
                      <TableHead className="font-semibold">Order Item</TableHead>
                      <TableHead className="font-semibold">Specification</TableHead>
                      <TableHead className="text-center font-semibold">Quantity</TableHead>
                      <TableHead className="text-right font-semibold">Unit Price</TableHead>
                      <TableHead className="text-right font-semibold">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeSalesOrderItems && safeSalesOrderItems.length > 0 ? (
                      safeSalesOrderItems.map((item: any, index: number) => (
                        <TableRow key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.productName || 'N/A'}</div>
                              {item.productSku && (
                                <div className="text-xs text-muted-foreground">SKU: {item.productSku}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              {item.specification || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {item.quantity || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            ${parseFloat(item.unitPrice || '0').toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${parseFloat(item.lineTotal || '0').toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No items in this sales order</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {safeSalesOrderItems && safeSalesOrderItems.length > 0 && (
                    <TableHeader>
                      <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead colSpan={5} className="text-right font-bold">
                          Subtotal:
                        </TableHead>
                        <TableHead className="text-right font-bold text-lg">
                          ${subtotal.toFixed(2)}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  )}
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Complete Financial Breakdown - Matching Client PDF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Breakdown (Client Format)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Sub Total:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Shipping Charge USD:</span>
                    <span className={shippingChargeUsd > 0 ? 'font-semibold' : 'text-muted-foreground'}>
                      ${shippingChargeUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Bank Charge USD:</span>
                    <span className={bankChargeUsd > 0 ? 'font-semibold' : 'text-muted-foreground'}>
                      ${bankChargeUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Discount USD:</span>
                    <span className={discountUsd > 0 ? 'font-semibold text-green-600' : 'text-muted-foreground'}>
                      {discountUsd > 0 ? '-' : ''}${discountUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Others:</span>
                    <span className={others !== 0 ? 'font-semibold' : 'text-muted-foreground'}>
                      ${others.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 text-lg bg-orange-50 dark:bg-orange-950 p-3 rounded">
                    <span className="font-bold text-orange-600">Please Pay This Amount USD:</span>
                    <span className="font-bold text-xl text-orange-600">${pleasePayThisAmountUsd.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information and Instructions */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Customer Service Instructions</div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm min-h-[60px]">
                      {safeSalesOrder.customerServiceInstructions || 'No special instructions provided.'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Order Source</div>
                    <div className="font-semibold">
                      {safeSalesOrder.quotationId ? `Generated from Quotation` : 'Direct Order Entry'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Date Created</div>
                    <div className="font-semibold">
                      {safeSalesOrder.createdAt ? new Date(safeSalesOrder.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  {safeSalesOrder.updatedAt && safeSalesOrder.updatedAt !== safeSalesOrder.createdAt && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Last Updated</div>
                      <div className="font-semibold">
                        {new Date(safeSalesOrder.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}