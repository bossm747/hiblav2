import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Plus,
  FileUp,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  Clock,
  DollarSign,
  Receipt,
  User,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Download,
  Filter,
} from 'lucide-react';

// Payment recording schema per client requirements
const paymentRecordSchema = z.object({
  dateOfPayment: z.string().min(1, 'Payment date is required'),
  salesOrderNumber: z.string().min(1, 'Sales order number is required'),
  clientCode: z.string().min(1, 'Client code is required'),
  methodOfPayment: z.enum(['bank', 'agent', 'money transfer', 'cash']),
  receivingAccount: z.string().optional(),
  paymentAmount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  attachments: z.array(z.string()).default([]),
  remarks: z.string().optional(),
});

type PaymentRecordData = z.infer<typeof paymentRecordSchema>;

interface PaymentRecordingModuleProps {
  className?: string;
}

export function PaymentRecordingModule({ className }: PaymentRecordingModuleProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payment records
  const { data: paymentRecords = [], isLoading } = useQuery({
    queryKey: ['/api/payment-records'],
  });

  // Fetch sales orders for dropdown
  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  const form = useForm<PaymentRecordData>({
    resolver: zodResolver(paymentRecordSchema),
    defaultValues: {
      dateOfPayment: new Date().toISOString().split('T')[0],
      salesOrderNumber: '',
      clientCode: '',
      methodOfPayment: 'bank',
      receivingAccount: '',
      paymentAmount: 0,
      attachments: [],
      remarks: '',
    },
  });

  // Create payment record mutation
  const createPaymentRecordMutation = useMutation({
    mutationFn: async (data: PaymentRecordData) => {
      return apiRequest('/api/payment-records', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          attachments: uploadedFiles,
          status: 'pending',
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Payment Record Created',
        description: 'Payment record has been uploaded for verification.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payment-records'] });
      setShowNewRecordModal(false);
      form.reset();
      setUploadedFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create payment record.',
        variant: 'destructive',
      });
    },
  });

  // Verify payment mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async ({ id, action, notes }: { id: string; action: 'verify' | 'reject'; notes?: string }) => {
      return apiRequest(`/api/payment-records/${id}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ verificationNotes: notes }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Payment Updated',
        description: 'Payment verification status has been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payment-records'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment verification.',
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In real implementation, upload files to server/storage
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const handleSubmit = (data: PaymentRecordData) => {
    createPaymentRecordMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      case 'verified':
        return <Badge variant="default" className="flex items-center gap-1 bg-blue-100 text-blue-800">
          <Eye className="h-3 w-3" />
          Verified
        </Badge>;
      case 'confirmed':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" />
          Confirmed
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPendingRecords = () => paymentRecords.filter((record: any) => record.status === 'pending');
  const getVerifiedRecords = () => paymentRecords.filter((record: any) => record.status === 'verified');
  const getConfirmedRecords = () => paymentRecords.filter((record: any) => record.status === 'confirmed');

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payment Recording</h2>
            <p className="text-gray-600 dark:text-gray-400">
              WhatsApp payment screenshot management and verification workflow
            </p>
          </div>
          <Dialog open={showNewRecordModal} onOpenChange={setShowNewRecordModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" data-testid="button-add-payment">
                <Plus className="h-4 w-4" />
                Upload Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload Payment Record
                </DialogTitle>
                <DialogDescription>
                  Upload payment screenshots received via WhatsApp for verification
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Payment *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" data-testid="input-payment-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salesOrderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales Order Number *</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            // Auto-fill client code when sales order is selected
                            const selectedOrder = salesOrders?.find(order => order.salesOrderNumber === value);
                            if (selectedOrder) {
                              form.setValue('clientCode', selectedOrder.clientCode);
                            }
                          }}>
                            <FormControl>
                              <SelectTrigger data-testid="select-sales-order">
                                <SelectValue placeholder="Select sales order" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {salesOrders.map((order: any) => (
                                <SelectItem key={order.id} value={order.salesOrderNumber}>
                                  {order.salesOrderNumber} - {order.clientCode}
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
                      name="clientCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Code *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter client code" data-testid="input-client-code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="methodOfPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Method of Payment *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-payment-method">
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bank">Bank Transfer</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="money transfer">Money Transfer</SelectItem>
                              <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="receivingAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Receiving Account</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter receiving account" data-testid="input-receiving-account" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Amount *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-payment-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <FormLabel>Payment Screenshots/Documents</FormLabel>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      data-testid="input-file-upload"
                    />
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((fileName, index) => (
                          <Badge key={index} variant="secondary">
                            {fileName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter any additional notes..."
                            rows={3}
                            data-testid="textarea-remarks"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewRecordModal(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPaymentRecordMutation.isPending}
                      data-testid="button-upload"
                    >
                      {createPaymentRecordMutation.isPending ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Payment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Upload</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-pending">
                {getPendingRecords().length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finance Verified</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-verified">
                {getVerifiedRecords().length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-confirmed">
                {getConfirmedRecords().length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="total-amount">
                ${paymentRecords.reduce((sum: number, record: any) => sum + (parseFloat(record.paymentAmount) || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Records Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" data-testid="tab-upload">
              Internal Staff Upload
            </TabsTrigger>
            <TabsTrigger value="finance" data-testid="tab-finance">
              Finance Verification
            </TabsTrigger>
            <TabsTrigger value="confirmed" data-testid="tab-confirmed">
              Confirmed Payments
            </TabsTrigger>
            <TabsTrigger value="all" data-testid="tab-all">
              All Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Upload Verification</CardTitle>
                <CardDescription>
                  Payment screenshots uploaded by internal staff team awaiting finance verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sales Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPendingRecords().map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.dateOfPayment).toLocaleDateString()}</TableCell>
                        <TableCell>{record.salesOrderNumber}</TableCell>
                        <TableCell>{record.clientCode}</TableCell>
                        <TableCell>{record.methodOfPayment}</TableCell>
                        <TableCell>${record.paymentAmount}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verifyPaymentMutation.mutate({ id: record.id, action: 'verify' })}
                              data-testid={`button-verify-${record.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verifyPaymentMutation.mutate({ id: record.id, action: 'reject' })}
                              data-testid={`button-reject-${record.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Finance Team Verification</CardTitle>
                <CardDescription>
                  Payments verified by finance team awaiting final confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sales Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Verified By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getVerifiedRecords().map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.dateOfPayment).toLocaleDateString()}</TableCell>
                        <TableCell>{record.salesOrderNumber}</TableCell>
                        <TableCell>{record.clientCode}</TableCell>
                        <TableCell>{record.methodOfPayment}</TableCell>
                        <TableCell>${record.paymentAmount}</TableCell>
                        <TableCell>{record.paymentVerifiedBy || 'System'}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyPaymentMutation.mutate({ id: record.id, action: 'verify' })}
                            data-testid={`button-confirm-${record.id}`}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Payments</CardTitle>
                <CardDescription>
                  Payments that have been fully verified and confirmed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sales Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Confirmed At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getConfirmedRecords().map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.dateOfPayment).toLocaleDateString()}</TableCell>
                        <TableCell>{record.salesOrderNumber}</TableCell>
                        <TableCell>{record.clientCode}</TableCell>
                        <TableCell>{record.methodOfPayment}</TableCell>
                        <TableCell>${record.paymentAmount}</TableCell>
                        <TableCell>
                          {record.confirmedAt ? new Date(record.confirmedAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Payment Records</CardTitle>
                <CardDescription>
                  Complete history of all payment records in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sales Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRecords.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.dateOfPayment).toLocaleDateString()}</TableCell>
                        <TableCell>{record.salesOrderNumber}</TableCell>
                        <TableCell>{record.clientCode}</TableCell>
                        <TableCell>{record.methodOfPayment}</TableCell>
                        <TableCell>${record.paymentAmount}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {new Date(record.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}