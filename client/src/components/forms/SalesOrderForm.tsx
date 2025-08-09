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
import { ShoppingCart, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const salesOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  productName: z.string(),
  quantity: z.string().min(1, 'Quantity is required'),
  unitPrice: z.string().min(1, 'Unit price is required'),
  lineTotal: z.string(),
  specification: z.string().optional(),
});

const salesOrderFormSchema = z.object({
  customerCode: z.string().min(1, 'Customer code is required'),
  country: z.string().min(1, 'Country is required'),
  priceListId: z.string().min(1, 'Price list is required'),
  revisionNumber: z.enum(['R1', 'R2', 'R3', 'R4', 'R5']),
  paymentMethod: z.enum(['bank', 'cash', 'credit']),
  shippingMethod: z.enum(['DHL', 'FedEx', 'EMS', 'Sea']),
  dueDate: z.date(),
  subtotal: z.string().default('0.00'),
  shippingFee: z.string().default('0.00'),
  bankCharge: z.string().default('0.00'),
  discount: z.string().default('0.00'),
  others: z.string().default('0.00'),
  total: z.string().default('0.00'),
  customerServiceInstructions: z.string().optional(),
  items: z.array(salesOrderItemSchema).min(1, 'At least one item is required'),
});

type SalesOrderFormData = z.infer<typeof salesOrderFormSchema>;

interface SalesOrderFormProps {
  quotationId?: string;
  onSuccess?: () => void;
}

export function SalesOrderForm({ quotationId, onSuccess }: SalesOrderFormProps) {
  const [items, setItems] = useState<z.infer<typeof salesOrderItemSchema>[]>([
    {
      productId: '',
      productName: '',
      quantity: '1',
      unitPrice: '0.00',
      lineTotal: '0.00',
      specification: '',
    },
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderFormSchema),
    defaultValues: {
      customerCode: '',
      country: '',
      priceListId: 'A',
      revisionNumber: 'R1',
      paymentMethod: 'bank',
      shippingMethod: 'DHL',
      dueDate: new Date(),
      subtotal: '0.00',
      shippingFee: '0.00',
      bankCharge: '0.00',
      discount: '0.00',
      others: '0.00',
      total: '0.00',
      customerServiceInstructions: '',
      items: items,
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Load quotation data if quotationId is provided
  const { data: quotation } = useQuery({
    queryKey: ['/api/quotations', quotationId],
    enabled: !!quotationId,
  });

  React.useEffect(() => {
    if (quotation) {
      form.setValue('customerCode', quotation.customerCode);
      form.setValue('country', quotation.country);
      form.setValue('priceListId', quotation.priceListId);
      form.setValue('paymentMethod', quotation.paymentMethod);
      form.setValue('shippingMethod', quotation.shippingMethod);
      form.setValue('subtotal', quotation.subtotal);
      form.setValue('shippingFee', quotation.shippingFee || '0.00');
      form.setValue('bankCharge', quotation.bankCharge || '0.00');
      form.setValue('discount', quotation.discount || '0.00');
      form.setValue('others', quotation.others || '0.00');
      form.setValue('total', quotation.total);
      form.setValue('customerServiceInstructions', quotation.customerServiceInstructions || '');
      
      if (quotation.items) {
        setItems(quotation.items);
        form.setValue('items', quotation.items);
      }
    }
  }, [quotation, form]);

  const createSalesOrderMutation = useMutation({
    mutationFn: async (data: SalesOrderFormData) => {
      const response = await fetch('/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salesOrder: {
            customerCode: data.customerCode,
            country: data.country,
            priceListId: data.priceListId,
            revisionNumber: data.revisionNumber,
            paymentMethod: data.paymentMethod,
            shippingMethod: data.shippingMethod,
            dueDate: data.dueDate.toISOString(),
            subtotal: data.subtotal,
            shippingFee: data.shippingFee,
            bankCharge: data.bankCharge,
            discount: data.discount,
            others: data.others,
            total: data.total,
            customerServiceInstructions: data.customerServiceInstructions,
            quotationId: quotationId,
          },
          items: data.items,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create sales order');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Sales order created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
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

  const calculateTotals = (currentItems: typeof items) => {
    const subtotal = currentItems
      .reduce((sum, item) => sum + parseFloat(item.lineTotal || '0'), 0)
      .toFixed(2);
    
    form.setValue('subtotal', subtotal);
    
    const shippingFee = parseFloat(form.getValues('shippingFee') || '0');
    const bankCharge = parseFloat(form.getValues('bankCharge') || '0');
    const discount = parseFloat(form.getValues('discount') || '0');
    const others = parseFloat(form.getValues('others') || '0');
    
    const total = (
      parseFloat(subtotal) +
      shippingFee +
      bankCharge -
      discount +
      others
    ).toFixed(2);
    
    form.setValue('total', total);
  };

  const addItem = () => {
    const newItems = [
      ...items,
      {
        productId: '',
        productName: '',
        quantity: '1',
        unitPrice: '0.00',
        lineTotal: '0.00',
        specification: '',
      },
    ];
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      form.setValue('items', newItems);
      calculateTotals(newItems);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          {quotationId ? 'Create Sales Order from Quotation' : 'Create New Sales Order'}
        </CardTitle>
        {quotationId && (
          <Badge variant="outline">
            Based on Quotation #{quotation?.quotationNumber}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createSalesOrderMutation.mutate(data))} className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Philippines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="revisionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revision Number</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="R1">R1</SelectItem>
                        <SelectItem value="R2">R2</SelectItem>
                        <SelectItem value="R3">R3</SelectItem>
                        <SelectItem value="R4">R4</SelectItem>
                        <SelectItem value="R5">R5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Order Items</h3>
                {!quotationId && (
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                )}
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg mb-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Product</label>
                    <div className="p-2 bg-muted rounded border">
                      {item.productName || 'Product not selected'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="p-2 bg-muted rounded border">
                      {item.quantity}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Unit Price</label>
                    <div className="p-2 bg-muted rounded border">
                      ${item.unitPrice}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Line Total</label>
                    <div className="p-2 bg-muted rounded border font-medium">
                      ${item.lineTotal}
                    </div>
                  </div>
                  
                  {!quotationId && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DHL">DHL</SelectItem>
                            <SelectItem value="FedEx">FedEx</SelectItem>
                            <SelectItem value="EMS">EMS</SelectItem>
                            <SelectItem value="Sea">Sea Freight</SelectItem>
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
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">${form.watch('subtotal')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span>${form.watch('shippingFee')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Charge:</span>
                    <span>${form.watch('bankCharge')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-${form.watch('discount')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Others:</span>
                    <span>${form.watch('others')}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${form.watch('total')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createSalesOrderMutation.isPending}>
                {createSalesOrderMutation.isPending ? 'Creating...' : 'Create Sales Order'}
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