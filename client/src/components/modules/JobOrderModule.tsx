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
  Eye,
  Edit,
  Download,
  Factory,
  Calendar,
  User,
  Package,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Printer,
  Search,
} from 'lucide-react';

// Job order schema per client requirements
const jobOrderSchema = z.object({
  salesOrderId: z.string().min(1, 'Sales order is required'),
  clientCode: z.string().min(1, 'Client code is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  orderInstructions: z.string().optional(),
  productionDate: z.string().optional(),
  nameSignature: z.string().optional(),
  received: z.string().optional(),
});

type JobOrderData = z.infer<typeof jobOrderSchema>;

interface JobOrderModuleProps {
  className?: string;
}

export function JobOrderModule({ className }: JobOrderModuleProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewJobOrderModal, setShowNewJobOrderModal] = useState(false);
  const [selectedJobOrder, setSelectedJobOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch job orders
  const { data: jobOrders = [], isLoading } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  // Fetch sales orders for dropdown
  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
    select: (data: any[]) => data.filter(order => order.isConfirmed), // Only confirmed sales orders
  });

  const form = useForm<JobOrderData>({
    resolver: zodResolver(jobOrderSchema),
    defaultValues: {
      salesOrderId: '',
      clientCode: '',
      dueDate: '',
      orderInstructions: '',
      productionDate: '',
      nameSignature: '',
      received: '',
    },
  });

  // Create job order mutation
  const createJobOrderMutation = useMutation({
    mutationFn: async (data: JobOrderData) => {
      return apiRequest('/api/job-orders', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
          productionDate: data.productionDate ? new Date(data.productionDate).toISOString() : null,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Job Order Created',
        description: 'Job order has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] });
      setShowNewJobOrderModal(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create job order.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: JobOrderData) => {
    createJobOrderMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      case 'in_production':
        return <Badge variant="default" className="flex items-center gap-1 bg-blue-100 text-blue-800">
          <Factory className="h-3 w-3" />
          In Production
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>;
      case 'delayed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Delayed
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysUntilDue <= 3) {
      return <Badge variant="destructive">Urgent</Badge>;
    } else if (daysUntilDue <= 7) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">High</Badge>;
    } else {
      return <Badge variant="secondary">Normal</Badge>;
    }
  };

  // Filter job orders based on search
  const filteredJobOrders = jobOrders.filter((jobOrder: any) =>
    jobOrder?.jobOrderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jobOrder?.clientCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jobOrder?.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getJobOrdersByStatus = (status: string) => 
    filteredJobOrders.filter((order: any) => order.status === status);

  const getOverdueJobOrders = () => 
    filteredJobOrders.filter((order: any) => {
      const due = new Date(order.dueDate);
      return due < new Date() && order.status !== 'completed';
    });

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Order Management</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Production workflow and manufacturing order tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search job orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-job-orders"
              />
            </div>
            <Dialog open={showNewJobOrderModal} onOpenChange={setShowNewJobOrderModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" data-testid="button-create-job-order">
                  <Plus className="h-4 w-4" />
                  Create Job Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5 text-blue-600" />
                    Create New Job Order
                  </DialogTitle>
                  <DialogDescription>
                    Create a new job order from a confirmed sales order
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="salesOrderId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sales Order *</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedOrder = salesOrders.find((order: any) => order.id === value);
                                if (selectedOrder) {
                                  form.setValue('clientCode', selectedOrder.clientCode);
                                  form.setValue('dueDate', selectedOrder.dueDate?.split('T')[0] || '');
                                }
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-sales-order">
                                  <SelectValue placeholder="Select confirmed sales order" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {salesOrders.map((order: any) => (
                                  <SelectItem key={order.id} value={order.id}>
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
                                <Input {...field} readOnly className="bg-gray-50" data-testid="input-client-code" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date *</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-due-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="productionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Production Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-production-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nameSignature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name/Signature</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter name/signature" data-testid="input-name-signature" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="received"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Received</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter received by" data-testid="input-received" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="orderInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Instructions</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter client-specific production instructions..."
                              rows={4}
                              data-testid="textarea-instructions"
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
                        onClick={() => setShowNewJobOrderModal(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createJobOrderMutation.isPending}
                        data-testid="button-create"
                      >
                        {createJobOrderMutation.isPending ? (
                          <>
                            <Factory className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Factory className="h-4 w-4 mr-2" />
                            Create Job Order
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-total">
                {filteredJobOrders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Production</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-in-production">
                {getJobOrdersByStatus('in_production').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-pending">
                {getJobOrdersByStatus('pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="count-completed">
                {getJobOrdersByStatus('completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="count-overdue">
                {getOverdueJobOrders().length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({getJobOrdersByStatus('pending').length})
            </TabsTrigger>
            <TabsTrigger value="production" data-testid="tab-production">
              In Production ({getJobOrdersByStatus('in_production').length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({getJobOrdersByStatus('completed').length})
            </TabsTrigger>
            <TabsTrigger value="overdue" data-testid="tab-overdue">
              Overdue ({getOverdueJobOrders().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Job Orders</CardTitle>
                <CardDescription>
                  Complete overview of manufacturing orders and production status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Order #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Production Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobOrders.map((jobOrder: any) => (
                      <TableRow key={jobOrder.id}>
                        <TableCell className="font-medium">{jobOrder.jobOrderNumber}</TableCell>
                        <TableCell>{jobOrder.clientCode}</TableCell>
                        <TableCell>{new Date(jobOrder.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getPriorityBadge(jobOrder.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(jobOrder.status)}</TableCell>
                        <TableCell>
                          {jobOrder.productionDate 
                            ? new Date(jobOrder.productionDate).toLocaleDateString() 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedJobOrder(jobOrder.id)}
                              data-testid={`button-view-${jobOrder.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-edit-${jobOrder.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-print-${jobOrder.id}`}
                            >
                              <Printer className="h-4 w-4" />
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

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Job Orders</CardTitle>
                <CardDescription>
                  Job orders waiting to start production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Order #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Client Instructions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getJobOrdersByStatus('pending').map((jobOrder: any) => (
                      <TableRow key={jobOrder.id}>
                        <TableCell className="font-medium">{jobOrder.jobOrderNumber}</TableCell>
                        <TableCell>{jobOrder.clientCode}</TableCell>
                        <TableCell>{new Date(jobOrder.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getPriorityBadge(jobOrder.dueDate)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {jobOrder.orderInstructions || 'No special instructions'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700"
                            data-testid={`button-start-production-${jobOrder.id}`}
                          >
                            Start Production
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Orders In Production</CardTitle>
                <CardDescription>
                  Currently active manufacturing orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Order #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Production Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getJobOrdersByStatus('in_production').map((jobOrder: any) => (
                      <TableRow key={jobOrder.id}>
                        <TableCell className="font-medium">{jobOrder.jobOrderNumber}</TableCell>
                        <TableCell>{jobOrder.clientCode}</TableCell>
                        <TableCell>
                          {jobOrder.productionDate 
                            ? new Date(jobOrder.productionDate).toLocaleDateString() 
                            : 'Not started'
                          }
                        </TableCell>
                        <TableCell>{new Date(jobOrder.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: '60%' }}
                              ></div>
                            </div>
                            <span className="text-sm">60%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            data-testid={`button-complete-${jobOrder.id}`}
                          >
                            Mark Complete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Job Orders</CardTitle>
                <CardDescription>
                  Successfully completed manufacturing orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Order #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Quality Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getJobOrdersByStatus('completed').map((jobOrder: any) => (
                      <TableRow key={jobOrder.id}>
                        <TableCell className="font-medium">{jobOrder.jobOrderNumber}</TableCell>
                        <TableCell>{jobOrder.clientCode}</TableCell>
                        <TableCell>
                          {jobOrder.completedAt 
                            ? new Date(jobOrder.completedAt).toLocaleDateString() 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>5 days</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-view-completed-${jobOrder.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-download-${jobOrder.id}`}
                            >
                              <Download className="h-4 w-4" />
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

          <TabsContent value="overdue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Job Orders</CardTitle>
                <CardDescription>
                  Job orders that have passed their due date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Order #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getOverdueJobOrders().map((jobOrder: any) => {
                      const daysOverdue = Math.floor((new Date().getTime() - new Date(jobOrder.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <TableRow key={jobOrder.id} className="bg-red-50 dark:bg-red-950/20">
                          <TableCell className="font-medium">{jobOrder.jobOrderNumber}</TableCell>
                          <TableCell>{jobOrder.clientCode}</TableCell>
                          <TableCell>{new Date(jobOrder.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-red-600 font-medium">{daysOverdue} days</TableCell>
                          <TableCell>{getStatusBadge(jobOrder.status)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              data-testid={`button-escalate-${jobOrder.id}`}
                            >
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Escalate
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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