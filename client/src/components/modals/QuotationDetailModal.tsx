import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { quotationsApi } from '@/api/quotations';
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
import { StatusBadge } from '@/components/ui/status-badge';
import { HeaderInfoCard } from '@/components/ui/header-info-card';
import { ActionDropdown, ActionItem } from '@/components/ui/action-dropdown';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  ShoppingCart,
  Printer,
  Mail,
  Hash,
  CalendarCheck,
  UserCheck,
  MoreVertical,
  Trash2,
  FileUp,
} from 'lucide-react';

interface QuotationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotationId: string | null;
  onEdit?: (quotationId: string) => void;
  onDuplicate?: (quotationId: string) => void;
  onConvertToSalesOrder?: (quotationId: string) => void;
  onApprove?: (quotationId: string) => void;
  onReject?: (quotationId: string) => void;
  onSendEmail?: (quotationId: string) => void;
  onDownloadPDF?: (quotationId: string) => void;
}

export function QuotationDetailModal({
  open,
  onOpenChange,
  quotationId,
  onEdit,
  onDuplicate,
  onConvertToSalesOrder,
  onApprove,
  onReject,
  onSendEmail,
  onDownloadPDF,
}: QuotationDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: quotationData, isLoading } = useQuery({
    queryKey: ['/api/quotations', quotationId],
    queryFn: async () => {
      if (!quotationId) return null;
      const response = await fetch(`/api/quotations/${quotationId}`);
      if (!response.ok) throw new Error('Failed to fetch quotation');
      return response.json();
    },
    enabled: !!quotationId && open,
  });

  const { data: quotationItems = [] } = useQuery({
    queryKey: ['/api/quotation-items', quotationId],
    queryFn: async () => {
      if (!quotationId) return [];
      const response = await fetch(`/api/quotation-items/${quotationId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!quotationId && open,
  });

  // Type-safe access to quotation data
  const safeQuotation = quotationData as {
    id?: string;
    quotationNumber?: string;
    revisionNumber?: string;
    customerCode?: string;
    country?: string;
    paymentMethod?: string;
    shippingMethod?: string;
    status?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    subtotal?: string;
    shippingFee?: string;
    bankCharge?: string;
    discount?: string;
    others?: string;
    total?: string;
    customerServiceInstructions?: string;
  } || {};

  // Type-safe access to quotation items
  const safeQuotationItems = quotationItems as Array<{
    id?: string;
    productName?: string;
    productSku?: string;
    specification?: string;
    quantity?: string;
    unitPrice?: string;
  }> || [];

  if (!quotationId) return null;

  // Build action items for dropdown
  const actionItems: ActionItem[] = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: () => onEdit?.(quotationId),
    },
    {
      label: 'Duplicate',
      icon: Copy,
      onClick: () => onDuplicate?.(quotationId),
    },
    {
      label: 'Delete',
      icon: Trash2,
      color: 'destructive',
      onClick: async () => {
        if (confirm(`Are you sure you want to delete quotation ${safeQuotation.quotationNumber}?`)) {
          try {
            await quotationsApi.deleteQuotation(quotationId);
            queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
            toast({
              title: 'Success',
              description: `Quotation ${safeQuotation.quotationNumber} deleted successfully`,
            });
            onOpenChange(false);
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to delete quotation',
              variant: 'destructive',
            });
          }
        }
      },
    },
    { separator: true },
    {
      label: 'Convert to Sales Order',
      icon: ShoppingCart,
      onClick: () => onConvertToSalesOrder?.(quotationId),
      hidden: safeQuotation.status !== 'approved',
    },
    {
      label: 'Approve',
      icon: CheckCircle,
      color: 'success',
      onClick: () => onApprove?.(quotationId),
      hidden: safeQuotation.status !== 'pending',
    },
    {
      label: 'Reject',
      icon: XCircle,
      color: 'destructive',
      onClick: () => onReject?.(quotationId),
      hidden: safeQuotation.status !== 'pending',
    },
    { separator: true },
    {
      label: 'Export PDF',
      icon: Download,
      onClick: () => onDownloadPDF?.(quotationId),
    },
    {
      label: 'Send Email',
      icon: Mail,
      onClick: () => onSendEmail?.(quotationId),
    },
    {
      label: 'Print',
      icon: Printer,
      onClick: () => window.print(),
    },
  ];

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!safeQuotation || !safeQuotation.id) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation Not Found</DialogTitle>
            <DialogDescription>
              The requested quotation could not be found.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const subtotal = parseFloat(safeQuotation.subtotal || '0');
  const shippingFee = parseFloat(safeQuotation.shippingFee || '0');
  const bankCharge = parseFloat(safeQuotation.bankCharge || '0');
  const discount = parseFloat(safeQuotation.discount || '0');
  const others = parseFloat(safeQuotation.others || '0');
  const total = parseFloat(safeQuotation.total || '0');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold">
              QUOTATION
            </DialogTitle>
            <DialogDescription>
              Complete quotation details and order information
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
              <DropdownMenuItem onClick={() => onEdit?.(quotationId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onDuplicate?.(quotationId)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="text-red-600"
                onClick={async () => {
                  if (confirm(`Are you sure you want to delete quotation ${safeQuotation.quotationNumber}?`)) {
                    try {
                      await apiRequest(`/api/quotations/${quotationId}`, {
                        method: 'DELETE',
                      });
                      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
                      toast({
                        title: 'Success',
                        description: `Quotation ${safeQuotation.quotationNumber} deleted successfully`,
                      });
                      onOpenChange(false);
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to delete quotation',
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
              
              {safeQuotation.status === 'approved' && (
                <DropdownMenuItem onClick={() => onConvertToSalesOrder?.(quotationId)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Convert to Sales Order
                </DropdownMenuItem>
              )}
              
              {safeQuotation.status === 'pending' && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onApprove?.(quotationId)}
                    className="text-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => onReject?.(quotationId)}
                    className="text-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onDownloadPDF?.(quotationId)}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onSendEmail?.(quotationId)}>
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
        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950 dark:to-cyan-950 p-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Hash className="h-4 w-4 mr-1" />
                Quotation Number
              </div>
              <div className="font-bold text-lg">{safeQuotation.quotationNumber || 'N/A'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <CalendarCheck className="h-4 w-4 mr-1" />
                Date
              </div>
              <div className="font-semibold">
                {safeQuotation.createdAt ? new Date(safeQuotation.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4 mr-1" />
                Revision No.
              </div>
              <div className="font-semibold">{safeQuotation.revisionNumber || 'R0'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <UserCheck className="h-4 w-4 mr-1" />
                Status
              </div>
              <div>{getStatusBadge(safeQuotation.status || 'draft')}</div>
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
                  <div className="text-xs text-muted-foreground">Customer Code</div>
                  <div className="font-semibold">{safeQuotation.customerCode || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Country</div>
                  <div className="font-semibold flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {safeQuotation.country || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Price List</div>
                  <div className="font-semibold">{safeQuotation.priceListId ? 'Applied' : 'Standard'}</div>
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
                    {safeQuotation.paymentMethod ? safeQuotation.paymentMethod.charAt(0).toUpperCase() + safeQuotation.paymentMethod.slice(1) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Shipping Method</div>
                  <div className="font-semibold flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    {safeQuotation.shippingMethod || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created By</div>
                  <div className="font-semibold">{safeQuotation.createdBy || 'System'}</div>
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
                {(shippingFee > 0 || bankCharge > 0 || discount > 0 || others > 0) && (
                  <>
                    {shippingFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Shipping:</span>
                        <span className="text-sm">${shippingFee.toFixed(2)}</span>
                      </div>
                    )}
                    {bankCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Bank Charge:</span>
                        <span className="text-sm">${bankCharge.toFixed(2)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-xs">Discount:</span>
                        <span className="text-sm">-${discount.toFixed(2)}</span>
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
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quotation Items Table */}
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
                      <TableHead className="font-semibold">Product Name</TableHead>
                      <TableHead className="font-semibold">Specification</TableHead>
                      <TableHead className="text-center font-semibold">Quantity</TableHead>
                      <TableHead className="text-right font-semibold">Unit Price</TableHead>
                      <TableHead className="text-right font-semibold">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeQuotationItems && safeQuotationItems.length > 0 ? (
                      safeQuotationItems.map((item: any, index: number) => (
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
                            ${(parseFloat(item.quantity || '0') * parseFloat(item.unitPrice || '0')).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No items in this quotation</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {safeQuotationItems && safeQuotationItems.length > 0 && (
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

          {/* Complete Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">A. Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">B. Shipping Fee:</span>
                    <span className={shippingFee > 0 ? 'font-semibold' : 'text-muted-foreground'}>
                      ${shippingFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">C. Bank Charge:</span>
                    <span className={bankCharge > 0 ? 'font-semibold' : 'text-muted-foreground'}>
                      ${bankCharge.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">D. Discount:</span>
                    <span className={discount > 0 ? 'font-semibold text-green-600' : 'text-muted-foreground'}>
                      {discount > 0 ? '-' : ''}${discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">E. Others:</span>
                    <span className={others !== 0 ? 'font-semibold' : 'text-muted-foreground'}>
                      ${others.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 text-lg">
                    <span className="font-bold">TOTAL:</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <FileText className="h-5 w-5 mr-2" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Creator's Initials</div>
                    <div className="font-semibold">{safeQuotation.createdBy || 'System'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Date Created</div>
                    <div className="font-semibold">
                      {safeQuotation.createdAt ? new Date(safeQuotation.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  {safeQuotation.updatedAt && safeQuotation.updatedAt !== safeQuotation.createdAt && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Last Modified</div>
                      <div className="font-semibold">
                        {new Date(safeQuotation.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Valid Until</div>
                    <div className="font-semibold">
                      {safeQuotation.expiresAt ? 
                        new Date(safeQuotation.expiresAt).toLocaleDateString() : 
                        '30 days from creation'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Service Instructions */}
          {safeQuotation.customerServiceInstructions && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Customer Service Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {safeQuotation.customerServiceInstructions}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Footer Actions */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Quotation ID: {quotationId}
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}