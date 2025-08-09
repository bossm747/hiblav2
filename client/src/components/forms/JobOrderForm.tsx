import React, { useState } from 'react';
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
import { Factory, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const jobOrderFormSchema = z.object({
  customerCode: z.string().min(1, 'Customer code is required'),
  salesOrderId: z.string().optional(),
  customerServiceInstructions: z.string().optional(),
  dueDate: z.date(),
  status: z.enum(['active', 'completed', 'cancelled']),
});

type JobOrderFormData = z.infer<typeof jobOrderFormSchema>;

interface JobOrderFormProps {
  salesOrderId?: string;
  onSuccess?: () => void;
}

export function JobOrderForm({ salesOrderId, onSuccess }: JobOrderFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<JobOrderFormData>({
    resolver: zodResolver(jobOrderFormSchema),
    defaultValues: {
      customerCode: '',
      salesOrderId: salesOrderId,
      customerServiceInstructions: '',
      dueDate: new Date(),
      status: 'active',
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['/api/customers'],
  });

  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  // Load sales order data if salesOrderId is provided
  const { data: salesOrder } = useQuery({
    queryKey: ['/api/sales-orders', salesOrderId],
    enabled: !!salesOrderId,
  });

  React.useEffect(() => {
    if (salesOrder) {
      form.setValue('customerCode', salesOrder.customerCode);
      form.setValue('customerServiceInstructions', salesOrder.customerServiceInstructions || '');
      if (salesOrder.dueDate) {
        form.setValue('dueDate', new Date(salesOrder.dueDate));
      }
    }
  }, [salesOrder, form]);

  const createJobOrderMutation = useMutation({
    mutationFn: async (data: JobOrderFormData) => {
      const response = await fetch('/api/job-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerCode: data.customerCode,
          salesOrderId: data.salesOrderId,
          customerServiceInstructions: data.customerServiceInstructions,
          dueDate: data.dueDate.toISOString(),
          status: data.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create job order');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Job order created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] });
      form.reset();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Factory className="h-5 w-5 mr-2" />
          {salesOrderId ? 'Create Job Order from Sales Order' : 'Create New Job Order'}
        </CardTitle>
        {salesOrderId && (
          <Badge variant="outline">
            Based on Sales Order #{salesOrder?.salesOrderNumber}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createJobOrderMutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer: any) => (
                          <SelectItem key={customer.customerCode} value={customer.customerCode}>
                            {customer.customerCode} - {customer.name}
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
                name="salesOrderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Order (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sales order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {salesOrders.map((order: any) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.salesOrderNumber} - {order.customerCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
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
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customerServiceInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Service Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Special instructions for production..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={createJobOrderMutation.isPending}>
                {createJobOrderMutation.isPending ? 'Creating...' : 'Create Job Order'}
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