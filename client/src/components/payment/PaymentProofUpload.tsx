import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import {
  Upload,
  Image,
  X,
  DollarSign,
  Calendar,
  Building,
  Smartphone,
  CreditCard,
  Banknote,
  FileImage,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export function PaymentProofUpload() {
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending invoices
  const { data: pendingInvoices = [] } = useQuery({
    queryKey: ['/api/invoices/pending-payment'],
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload/payment-proof', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedImages(prev => [...prev, data.url]);
      toast({
        title: 'Image Uploaded',
        description: 'Payment proof image uploaded successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload payment proof image',
        variant: 'destructive',
      });
    },
  });

  // Payment record submission mutation
  const submitPaymentMutation = useMutation({
    mutationFn: (paymentData: any) => apiRequest('/api/payments/submit-proof', 'POST', paymentData),
    onSuccess: () => {
      toast({
        title: 'Payment Submitted',
        description: 'Payment proof has been submitted for verification',
      });
      // Reset form
      setSelectedInvoice('');
      setUploadedImages([]);
      setPaymentDate(format(new Date(), 'yyyy-MM-dd'));
      queryClient.invalidateQueries({ queryKey: ['/api/invoices/pending-payment'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/recent'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit payment proof',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadImageMutation.mutate(file);
      } else {
        toast({
          title: 'Invalid File',
          description: 'Please select image files only',
          variant: 'destructive',
        });
      }
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedInvoiceData = (pendingInvoices as any[]).find(
      (invoice: any) => invoice.id === selectedInvoice
    );

    if (!selectedInvoiceData) {
      toast({
        title: 'Error',
        description: 'Please select an invoice',
        variant: 'destructive',
      });
      return;
    }

    if (uploadedImages.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one payment proof image',
        variant: 'destructive',
      });
      return;
    }

    const paymentData = {
      invoiceId: selectedInvoice,
      salesOrderId: selectedInvoiceData.salesOrderId,
      customerId: selectedInvoiceData.customerId,
      customerCode: selectedInvoiceData.customerCode,
      amount: parseFloat(formData.get('amount') as string) || selectedInvoiceData.total,
      paymentMethod: formData.get('paymentMethod'),
      referenceNumber: formData.get('referenceNumber'),
      paymentDate: paymentDate,
      bankName: formData.get('bankName'),
      senderName: formData.get('senderName'),
      notes: formData.get('notes'),
      paymentProofImages: uploadedImages,
      status: 'submitted',
    };

    submitPaymentMutation.mutate(paymentData);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Payment Proof Upload Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Payment Proof
            </CardTitle>
            <CardDescription>
              Internal staff: Upload payment screenshots received via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Selection */}
              <div className="space-y-2">
                <Label htmlFor="invoice">Select Invoice *</Label>
                <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose invoice awaiting payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {(pendingInvoices as any[]).map((invoice: any) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{invoice.invoiceNumber}</span>
                          <span className="ml-4 font-bold">${invoice.total}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {invoice.customerCode}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder={selectedInvoice ? 
                      ((pendingInvoices as any[]).find(inv => inv.id === selectedInvoice)?.total || '0.00') : 
                      '0.00'
                    }
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select name="paymentMethod" defaultValue="bank_transfer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                    <SelectItem value="agent">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Money Transfer Agent
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile_payment">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Mobile Payment
                      </div>
                    </SelectItem>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Cash
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Bank Name */}
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    placeholder="e.g., BDO, BPI, Metrobank"
                  />
                </div>

                {/* Reference Number */}
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference/Transaction Number</Label>
                  <Input
                    id="referenceNumber"
                    name="referenceNumber"
                    placeholder="Bank reference number"
                  />
                </div>
              </div>

              {/* Sender Name */}
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  name="senderName"
                  placeholder="Name of person who sent the payment"
                />
              </div>

              {/* Payment Proof Images */}
              <div className="space-y-4">
                <Label>Payment Proof Images *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadImageMutation.isPending}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Images'}
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload payment proof screenshots from WhatsApp
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Payment proof ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information about the payment..."
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={submitPaymentMutation.isPending || !selectedInvoice || uploadedImages.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {submitPaymentMutation.isPending ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Pending Payment Invoices</CardTitle>
            <CardDescription>Select an invoice to process payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(pendingInvoices as any[]).map((invoice: any) => (
                <div 
                  key={invoice.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedInvoice === invoice.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedInvoice(invoice.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customerCode}</p>
                      <div className="flex items-center mt-1">
                        {getPaymentMethodIcon(invoice.paymentMethod)}
                        <span className="ml-1 text-xs text-muted-foreground">
                          {invoice.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${invoice.total}</p>
                      <Badge variant={
                        new Date(invoice.dueDate) < new Date() ? 'destructive' : 'outline'
                      } className="mt-1">
                        {Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Instructions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              Upload Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Upload clear images of payment receipts</p>
            <p>• Include bank transaction screenshots</p>
            <p>• Ensure all text is readable</p>
            <p>• Multiple images can be uploaded</p>
            <p>• Images will be reviewed by finance team</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}