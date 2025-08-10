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
  Hammer,
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
  const { data: quotation, isLoading } = useQuery({
    queryKey: ['/api/quotations', quotationId],
    enabled: !!quotationId && open,
  });

  const { data: quotationItems = [] } = useQuery({
    queryKey: ['/api/quotation-items', quotationId],
    enabled: !!quotationId && open,
  });

  // Type-safe access to quotation data
  const safeQuotation = quotation as {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      approved: { icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-300" },
      rejected: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-300" },
      draft: { icon: Edit, className: "bg-gray-100 text-gray-800 border-gray-300" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      icon: FileText,
      className: "bg-blue-100 text-blue-800 border-blue-300"
    };

    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Quotation Details - {safeQuotation.quotationNumber}
            {safeQuotation.revisionNumber && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Rev. {safeQuotation.revisionNumber})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Complete details and items for this quotation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusBadge(safeQuotation.status || 'draft')}
              <span className="text-sm text-muted-foreground">
                Created: {new Date(safeQuotation.createdAt || '').toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {safeQuotation.status === 'pending' && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600" onClick={() => onApprove?.(quotationId)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => onReject?.(quotationId)}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              
              {safeQuotation.status === 'approved' && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onConvertToSalesOrder?.(quotationId)}>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Convert to Sales Order
                </Button>
              )}
              
              <Button size="sm" variant="outline" onClick={() => onEdit?.(quotationId)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => onDuplicate?.(quotationId)}>
                <Copy className="h-4 w-4 mr-1" />
                Duplicate
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => onSendEmail?.(quotationId)}>
                <Send className="h-4 w-4 mr-1" />
                Send Email
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => onDownloadPDF?.(quotationId)}>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Customer and Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Code:</span>
                  <span className="font-medium">{safeQuotation.customerCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country:</span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {safeQuotation.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {safeQuotation.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Method:</span>
                  <span className="flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    {safeQuotation.shippingMethod}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Quotation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quotation Number:</span>
                  <span className="font-medium">{safeQuotation.quotationNumber}</span>
                </div>
                {safeQuotation.revisionNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revision:</span>
                    <span className="font-medium">R{safeQuotation.revisionNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By:</span>
                  <span className="font-medium">{safeQuotation.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Created:</span>
                  <span>{new Date(safeQuotation.createdAt || '').toLocaleString()}</span>
                </div>
                {safeQuotation.updatedAt && safeQuotation.updatedAt !== safeQuotation.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(safeQuotation.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quotation Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Quotation Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Specification</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeQuotationItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          {item.productSku && (
                            <div className="text-sm text-muted-foreground">SKU: {item.productSku}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.specification || '-'}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${parseFloat(item.unitPrice || '0').toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${(parseFloat(item.quantity || '0') * parseFloat(item.unitPrice || '0')).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span>${shippingFee.toFixed(2)}</span>
                  </div>
                )}
                {bankCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Bank Charge:</span>
                    <span>${bankCharge.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                {others > 0 && (
                  <div className="flex justify-between">
                    <span>Others:</span>
                    <span>${others.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Service Instructions */}
          {safeQuotation.customerServiceInstructions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Customer Service Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{safeQuotation.customerServiceInstructions}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}