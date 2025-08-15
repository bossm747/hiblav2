import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  CalendarIcon, 
  Upload, 
  FileImage, 
  X, 
  Eye, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

const paymentRecordingSchema = z.object({
  paymentDate: z.date(),
  salesOrderId: z.string().min(1, 'Sales Order is required'),
  customerCode: z.string().min(1, 'Customer Code is required'),
  amount: z.string().min(1, 'Payment amount is required'),
  paymentMethod: z.enum(['bank', 'agent', 'money transfer', 'cash']),
  status: z.enum(['pending', 'confirmed', 'rejected']),
  receivingAccount: z.string().min(1, 'Receiving account is required'),
  paymentUploadedBy: z.string().min(1, 'Uploader name is required'),
  referenceNumber: z.string().optional(),
  remarks: z.string().optional(),
});

type PaymentRecordingFormData = z.infer<typeof paymentRecordingSchema>;

interface PaymentRecordingFormProps {
  salesOrderId?: string;
  onSuccess?: () => void;
  mode?: 'upload' | 'verify'; // upload for customer support, verify for finance
}

export function PaymentRecordingForm({ 
  salesOrderId, 
  onSuccess, 
  mode = 'upload' 
}: PaymentRecordingFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PaymentRecordingFormData>({
    resolver: zodResolver(paymentRecordingSchema),
    defaultValues: {
      paymentDate: new Date(),
      salesOrderId: salesOrderId || '',
      customerCode: '',
      amount: '',
      paymentMethod: 'bank',
      status: mode === 'upload' ? 'pending' : 'confirmed',
      receivingAccount: '',
      paymentUploadedBy: '',
      referenceNumber: '',
      remarks: '',
    },
  });

  const { data: salesOrders = [] } = useQuery<any[]>({
    queryKey: ['/api/sales-orders'],
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ['/api/customers'],
  });

  // Load sales order data if salesOrderId is provided
  const { data: salesOrder } = useQuery<any>({
    queryKey: ['/api/sales-orders', salesOrderId],
    enabled: !!salesOrderId,
  });

  React.useEffect(() => {
    if (salesOrder) {
      form.setValue('customerCode', salesOrder.customerCode || '');
      form.setValue('amount', salesOrder.pleasePayThisAmountUsd || '0.00');
    }
  }, [salesOrder, form]);

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentRecordingFormData) => {
      const formData = new FormData();
      
      // Add payment data
      formData.append('paymentData', JSON.stringify({
        paymentDate: data.paymentDate.toISOString(),
        salesOrderId: data.salesOrderId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: data.status,
        receivingAccount: data.receivingAccount,
        paymentUploadedBy: data.paymentUploadedBy,
        referenceNumber: data.referenceNumber,
        remarks: data.remarks,
      }));
      
      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`paymentProof${index}`, file);
      });

      const response = await apiRequest('/api/payments', {
        method: 'POST',
        body: formData,
      });

      return response;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: mode === 'upload' ? 
          'Payment proof uploaded successfully. Awaiting finance verification.' :
          'Payment verified and confirmed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      form.reset();
      setUploadedFiles([]);
      setPreviewUrls([]);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please upload only image files.',
          variant: 'destructive',
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File Too Large',
          description: 'Please upload images smaller than 5MB.',
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    const newFiles = [...uploadedFiles, ...validFiles];
    const newUrls = [...previewUrls];

    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    });

    setUploadedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setUploadedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const getReceivingAccounts = () => {
    return [
      { value: 'hibla-bdo-001', label: 'Hibla Manufacturing - BDO Account 001' },
      { value: 'hibla-bpi-002', label: 'Hibla Manufacturing - BPI Account 002' },
      { value: 'hibla-gcash-003', label: 'Hibla Manufacturing - GCash 003' },
      { value: 'hibla-paypal-004', label: 'Hibla Manufacturing - PayPal 004' },
      { value: 'agent-remittance', label: 'Agent Remittance Center' },
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          {mode === 'upload' ? 'Payment Proof Upload' : 'Payment Verification'}
          {mode === 'upload' ? (
            <Badge variant="outline" className="ml-2">Customer Support</Badge>
          ) : (
            <Badge variant="secondary" className="ml-2">Finance Team</Badge>
          )}
        </CardTitle>
        {salesOrderId && (
          <Badge variant="outline">
            For Sales Order #{salesOrder?.salesOrderNumber}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createPaymentMutation.mutate(data))} className="space-y-6">
            
            {/* Payment Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Payment</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'MMMM dd, yyyy') : 'Pick a date'}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salesOrderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Order No.</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        const order = salesOrders.find((so: any) => so.id === value);
                        if (order) {
                          form.setValue('customerCode', order.customerCode);
                          form.setValue('amount', order.pleasePayThisAmountUsd || '0.00');
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales order" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {salesOrders.map((order: any) => (
                            <SelectItem key={order.id} value={order.id}>
                              {order.salesOrderNumber} - ${order.pleasePayThisAmountUsd}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Customer code" readOnly className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Amount (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" placeholder="0.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method of Payment</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank">bank</SelectItem>
                          <SelectItem value="agent">agent</SelectItem>
                          <SelectItem value="money transfer">money transfer</SelectItem>
                          <SelectItem value="cash">cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-yellow-600" />
                              Pending Verification
                            </div>
                          </SelectItem>
                          <SelectItem value="confirmed">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Confirmed
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              Rejected
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Transaction ref #" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Account & Staff Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Account & Staff Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receivingAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiving Account</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select receiving account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getReceivingAccounts().map((account) => (
                            <SelectItem key={account.value} value={account.value}>
                              {account.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentUploadedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Uploaded By</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Staff name/initials" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional notes about the payment..."
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* File Upload Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileImage className="h-5 w-5 mr-2" />
                Payment Proof Images
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Payment Screenshots
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Upload images (max 5MB each, PNG/JPG only)
                  </span>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Payment proof ${index + 1}`}
                          className="w-full h-24 object-cover rounded border shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                            className="text-white hover:bg-white hover:bg-opacity-20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-white hover:bg-red-500 hover:bg-opacity-20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {uploadedFiles[index]?.name?.substring(0, 20)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={createPaymentMutation.isPending || uploadedFiles.length === 0}
                className="flex items-center gap-2"
              >
                {createPaymentMutation.isPending ? (
                  'Processing...'
                ) : mode === 'upload' ? (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Payment Proof
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Verify & Confirm Payment
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}