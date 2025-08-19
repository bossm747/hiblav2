import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  DollarSign,
  Calendar,
  Building,
  Smartphone,
  CreditCard,
  Banknote,
  FileImage,
  User,
  AlertTriangle,
  MessageSquare,
  Filter,
  Search,
} from 'lucide-react';

export function PaymentVerificationQueue() {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending verification payments
  const { data: pendingPayments = [] } = useQuery({
    queryKey: ['/api/payments/pending-verification'],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Payment verification mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: (data: {
      paymentId: string;
      action: 'approve' | 'reject';
      notes?: string;
      rejectionReason?: string;
    }) => apiRequest(`/api/payments/${data.paymentId}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      const actionText = variables.action === 'approve' ? 'approved' : 'rejected';
      toast({
        title: `Payment ${actionText}`,
        description: `Payment has been ${actionText} successfully`,
      });
      setShowVerificationDialog(false);
      setSelectedPayment(null);
      setVerificationAction(null);
      queryClient.invalidateQueries({ queryKey: ['/api/payments/pending-verification'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Failed to process payment verification',
        variant: 'destructive',
      });
    },
  });

  const handleVerificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPayment || !verificationAction) return;

    const formData = new FormData(e.currentTarget);
    verifyPaymentMutation.mutate({
      paymentId: selectedPayment.id,
      action: verificationAction,
      notes: formData.get('verificationNotes') as string,
      rejectionReason: verificationAction === 'reject' ? formData.get('rejectionReason') as string : undefined,
    });
  };

  const openVerificationDialog = (payment: any, action: 'approve' | 'reject') => {
    setSelectedPayment(payment);
    setVerificationAction(action);
    setShowVerificationDialog(true);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'bank_transfer':
        return <Building className="h-4 w-4" />;
      case 'agent':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'mobile_payment':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (payment: any) => {
    const daysSinceSubmission = Math.floor(
      (new Date().getTime() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceSubmission >= 3) {
      return <Badge variant="destructive">High Priority</Badge>;
    } else if (daysSinceSubmission >= 1) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Medium</Badge>;
    } else {
      return <Badge variant="outline">Normal</Badge>;
    }
  };

  const filteredPayments = (pendingPayments as any[]).filter(payment =>
    payment.customerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Verification Queue</h2>
          <p className="text-muted-foreground">Finance team: Review and verify payment submissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, invoice, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Pending Review</span>
            </div>
            <p className="text-2xl font-bold mt-1">{(pendingPayments as any[]).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">High Priority</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {(pendingPayments as any[]).filter(p => 
                Math.floor((new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)) >= 3
              ).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Amount</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              ${(pendingPayments as any[]).reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Avg. Wait Time</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {(pendingPayments as any[]).length > 0 ? 
                Math.round((pendingPayments as any[]).reduce((sum, p) => 
                  sum + Math.floor((new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)), 0
                ) / (pendingPayments as any[]).length) : 0
              } days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Verification Queue ({filteredPayments.length})</CardTitle>
          <CardDescription>Review payment proofs and verify authenticity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Proof Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment: any) => (
                <TableRow key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.customerCode}</p>
                      {payment.senderName && (
                        <p className="text-sm text-muted-foreground">From: {payment.senderName}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.invoiceNumber}</p>
                      {payment.referenceNumber && (
                        <p className="text-xs text-muted-foreground">Ref: {payment.referenceNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">${payment.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-sm">{payment.paymentMethod?.replace('_', ' ')}</span>
                    </div>
                    {payment.bankName && (
                      <p className="text-xs text-muted-foreground mt-1">{payment.bankName}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      {format(new Date(payment.createdAt), 'MMM dd, HH:mm')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor((new Date().getTime() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(payment)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileImage className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{payment.paymentProofImages?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowVerificationDialog(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => openVerificationDialog(payment, 'approve')}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => openVerificationDialog(payment, 'reject')}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No payments match your search criteria.' : 'No payments pending verification.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {verificationAction ? 
                `${verificationAction === 'approve' ? 'Approve' : 'Reject'} Payment` : 
                'Review Payment Proof'
              }
            </DialogTitle>
            <DialogDescription>
              Customer: {selectedPayment?.customerCode} | Invoice: {selectedPayment?.invoiceNumber} | Amount: ${selectedPayment?.amount}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Amount:</strong> ${selectedPayment.amount}</p>
                    <p><strong>Method:</strong> {selectedPayment.paymentMethod?.replace('_', ' ')}</p>
                    <p><strong>Date:</strong> {format(new Date(selectedPayment.paymentDate), 'PPP')}</p>
                    <p><strong>Reference:</strong> {selectedPayment.referenceNumber || 'N/A'}</p>
                    {selectedPayment.bankName && <p><strong>Bank:</strong> {selectedPayment.bankName}</p>}
                    {selectedPayment.senderName && <p><strong>Sender:</strong> {selectedPayment.senderName}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Submission Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Submitted:</strong> {format(new Date(selectedPayment.createdAt), 'PPP p')}</p>
                    <p><strong>Uploaded by:</strong> {selectedPayment.uploadedBy || 'Customer Support'}</p>
                    <p><strong>Priority:</strong> {getPriorityBadge(selectedPayment)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Proof Images */}
              <div>
                <h4 className="font-semibold mb-3">Payment Proof Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(selectedPayment.paymentProofImages || []).map((imageUrl: string, index: number) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Payment proof ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => window.open(imageUrl, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPayment.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {selectedPayment.notes}
                  </p>
                </div>
              )}

              {/* Verification Form */}
              {verificationAction && (
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  {verificationAction === 'reject' && (
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                      <Input
                        id="rejectionReason"
                        name="rejectionReason"
                        placeholder="e.g., Insufficient proof, Invalid bank details, Amount mismatch"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="verificationNotes">Verification Notes</Label>
                    <Textarea
                      id="verificationNotes"
                      name="verificationNotes"
                      placeholder={`Additional notes about this ${verificationAction}...`}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowVerificationDialog(false);
                        setVerificationAction(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant={verificationAction === 'approve' ? 'default' : 'destructive'}
                      disabled={verifyPaymentMutation.isPending}
                    >
                      {verifyPaymentMutation.isPending ? 'Processing...' : 
                        verificationAction === 'approve' ? 'Approve Payment' : 'Reject Payment'
                      }
                    </Button>
                  </div>
                </form>
              )}

              {/* Action Buttons when just reviewing */}
              {!verificationAction && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => setVerificationAction('approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Payment
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => setVerificationAction('reject')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}