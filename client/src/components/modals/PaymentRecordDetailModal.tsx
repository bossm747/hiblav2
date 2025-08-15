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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Edit,
  Copy,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  MessageSquare,
  Printer,
  Mail,
  Hash,
  CalendarCheck,
  UserCheck,
  MoreVertical,
  Trash2,
  Receipt,
  AlertTriangle,
  CheckSquare,
  FileImage,
  Eye,
  Building2,
  Banknote,
  Upload,
  Shield,
  FileCheck,
} from 'lucide-react';

interface PaymentRecordDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRecordId: string | null;
  onEdit?: (paymentRecordId: string) => void;
  onApprove?: (paymentRecordId: string) => void;
  onReject?: (paymentRecordId: string) => void;
  onDownloadProof?: (paymentRecordId: string) => void;
}

export function PaymentRecordDetailModal({
  open,
  onOpenChange,
  paymentRecordId,
  onEdit,
  onApprove,
  onReject,
  onDownloadProof,
}: PaymentRecordDetailModalProps) {
  const { data: paymentRecordData, isLoading } = useQuery({
    queryKey: ['/api/payment-records', paymentRecordId],
    queryFn: async () => {
      if (!paymentRecordId) return null;
      const response = await fetch(`/api/payment-records/${paymentRecordId}`);
      if (!response.ok) throw new Error('Failed to fetch payment record');
      return response.json();
    },
    enabled: !!paymentRecordId && open,
  });

  // Type-safe access to payment record data
  const safePaymentRecord = paymentRecordData as {
    id?: string;
    paymentRecordNumber?: string;
    salesOrderId?: string;
    salesOrderNumber?: string;
    paymentDate?: string;
    amount?: string;
    paymentMethod?: string;
    receivingAccount?: string;
    uploadedBy?: string;
    verifiedBy?: string;
    status?: string;
    remarks?: string;
    proofImagePath?: string;
    customerCode?: string;
    createdAt?: string;
    updatedAt?: string;
    verifiedAt?: string;
  } || {};

  if (!paymentRecordId) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200" },
      verified: { icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200" },
      rejected: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200" },
      'under-review': { icon: AlertTriangle, className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      icon: Receipt,
      className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200"
    };

    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
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

  if (!safePaymentRecord || !safePaymentRecord.id) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Record Not Found</DialogTitle>
            <DialogDescription>
              The requested payment record could not be found.
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold">
              PAYMENT RECORD
            </DialogTitle>
            <DialogDescription>
              Payment verification and documentation details
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
              <DropdownMenuItem onClick={() => onEdit?.(paymentRecordId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {safePaymentRecord.status === 'pending' && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onApprove?.(paymentRecordId)}
                    className="text-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Payment
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => onReject?.(paymentRecordId)}
                    className="text-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Payment
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              {safePaymentRecord.proofImagePath && (
                <DropdownMenuItem onClick={() => onDownloadProof?.(paymentRecordId)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Proof
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>

        {/* Document Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Hash className="h-4 w-4 mr-1" />
                Payment Record No.
              </div>
              <div className="font-bold text-lg">{safePaymentRecord.paymentRecordNumber || 'Auto-Generated'}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Payment Date
              </div>
              <div className="font-semibold">
                {safePaymentRecord.paymentDate ? new Date(safePaymentRecord.paymentDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                Amount
              </div>
              <div className="font-bold text-xl text-green-600">${parseFloat(safePaymentRecord.amount || '0').toFixed(2)}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <UserCheck className="h-4 w-4 mr-1" />
                Status
              </div>
              <div>{getStatusBadge(safePaymentRecord.status || 'pending')}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">

          {/* Order and Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Receipt className="h-4 w-4 mr-2" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Sales Order No.</div>
                  <div className="font-semibold">{safePaymentRecord.salesOrderNumber || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Customer Code</div>
                  <div className="font-semibold text-lg">{safePaymentRecord.customerCode || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sales Order ID</div>
                  <div className="font-mono text-sm">{safePaymentRecord.salesOrderId || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Payment Method</div>
                  <div className="font-semibold flex items-center">
                    <Banknote className="h-3 w-3 mr-1" />
                    {safePaymentRecord.paymentMethod ? safePaymentRecord.paymentMethod.charAt(0).toUpperCase() + safePaymentRecord.paymentMethod.slice(1) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Receiving Account</div>
                  <div className="font-semibold flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    {safePaymentRecord.receivingAccount || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Amount Paid</div>
                  <div className="font-bold text-2xl text-green-600">${parseFloat(safePaymentRecord.amount || '0').toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Shield className="h-4 w-4 mr-2" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">Current Status</div>
                  <div>{getStatusBadge(safePaymentRecord.status || 'pending')}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Verified By</div>
                  <div className="font-semibold">{safePaymentRecord.verifiedBy || 'Pending verification'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Verification Date</div>
                  <div className="font-semibold">
                    {safePaymentRecord.verifiedAt ? new Date(safePaymentRecord.verifiedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not verified'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Proof Image */}
          {safePaymentRecord.proofImagePath && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <FileImage className="h-4 w-4 mr-2" />
                  Payment Proof Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Payment Screenshot</div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded by {safePaymentRecord.uploadedBy || 'Customer Support'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open image in new window for full view
                          window.open(safePaymentRecord.proofImagePath, '_blank');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Full Size
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownloadProof?.(paymentRecordId)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="text-center">
                      <img
                        src={safePaymentRecord.proofImagePath}
                        alt="Payment Proof"
                        className="max-w-full h-auto max-h-96 mx-auto rounded shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => window.open(safePaymentRecord.proofImagePath, '_blank')}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Click image to view full size
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Staff Information and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <User className="h-5 w-5 mr-2" />
                  Staff Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Uploaded By</div>
                    <div className="font-semibold flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      {safePaymentRecord.uploadedBy || 'Customer Support Team'}
                    </div>
                  </div>
                  {safePaymentRecord.verifiedBy && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Verified By</div>
                      <div className="font-semibold flex items-center">
                        <FileCheck className="h-4 w-4 mr-2" />
                        {safePaymentRecord.verifiedBy}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Record Created</div>
                    <div className="font-semibold">
                      {safePaymentRecord.createdAt ? new Date(safePaymentRecord.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Remarks & Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Staff Remarks</div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm min-h-[80px]">
                      {safePaymentRecord.remarks || 'No additional remarks provided.'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Updated</div>
                    <div className="font-semibold">
                      {safePaymentRecord.updatedAt ? new Date(safePaymentRecord.updatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Actions */}
          {safePaymentRecord.status === 'pending' && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Pending Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      This payment record requires verification from the finance team.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Review the payment proof and confirm the payment details before verification.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => onReject?.(paymentRecordId)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onApprove?.(paymentRecordId)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}