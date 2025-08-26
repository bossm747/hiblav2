import React, { useState, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, CalendarIcon, Plus, Trash2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

const salesOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  productName: z.string(),
  specification: z.string().optional(),
  quantity: z.string().regex(/^\d+\.\d$/, 'Quantity must be decimal with 1 decimal place'),
  unitPrice: z.string().min(1, 'Unit price is required'),
  lineTotal: z.string(),
});

const salesOrderFormSchema = z.object({
  hairTag: z.string().min(1, 'Hair Tag (Client Code) is required'),
  clientId: z.string().min(1, 'Client is required'),
  shippingMethod: z.enum(['DHL', 'UPS', 'Fed Ex', 'Agent', 'Client Pickup']),
  paymentMethod: z.enum(['bank', 'agent', 'money transfer', 'cash']),
  orderDate: z.date().default(() => new Date()),
  dueDate: z.date(),
  revisionNumber: z.enum(['R1', 'R2', 'R3', 'R4', 'R5']).default('R1'),
  createdBy: z.string().min(1, 'Creator initials required'),
  subtotal: z.string().default('0.00'),
  shippingChargeUsd: z.string().default('0.00'),
  bankChargeUsd: z.string().default('0.00'),
  discountUsd: z.string().default('0.00'),
  others: z.string().default('0.00'),
  pleasePayThisAmountUsd: z.string().default('0.00'),
  clientServiceInstructions: z.string().optional(),
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
      specification: '',
      quantity: '1.0',
      unitPrice: '0.00',
      lineTotal: '0.00',
    },
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderFormSchema),
    defaultValues: {
      hairTag: '',
      clientId: '',
      shippingMethod: 'DHL',
      paymentMethod: 'bank',
      orderDate: new Date(),
      dueDate: new Date(),
      revisionNumber: 'R1',
      createdBy: '',
      subtotal: '0.00',
      shippingChargeUsd: '0.00',
      bankChargeUsd: '0.00',
      discountUsd: '0.00',
      others: '0.00',
      pleasePayThisAmountUsd: '0.00',
      clientServiceInstructions: '',
      items: items,
    },
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  const { data: priceLists = [] } = useQuery<any[]>({
    queryKey: ['/api/price-lists'],
  });

  // Load quotation data if quotationId is provided
  const { data: quotation } = useQuery<any>({
    queryKey: ['/api/quotations', quotationId],
    enabled: !!quotationId,
  });

  useEffect(() => {
    if (quotation) {
      const client = clients.find((c: any) => c.clientCode === quotation.clientCode);
      form.setValue('hairTag', quotation.clientCode || '');
      form.setValue('clientId', client?.id || '');
      form.setValue('paymentMethod', quotation.paymentMethod || 'bank');
      form.setValue('shippingMethod', quotation.shippingMethod || 'DHL');
      form.setValue('subtotal', quotation.subtotal || '0.00');
      form.setValue('shippingChargeUsd', quotation.shippingFee || '0.00');
      form.setValue('bankChargeUsd', quotation.bankCharge || '0.00');
      form.setValue('discountUsd', quotation.discount || '0.00');
      form.setValue('others', quotation.others || '0.00');
      form.setValue('clientServiceInstructions', quotation.clientServiceInstructions || '');
      
      if (quotation.items && quotation.items.length > 0) {
        const formattedItems = quotation.items.map((item: any) => ({
          ...item,
          quantity: parseFloat(item.quantity || '0').toFixed(1),
        }));
        setItems(formattedItems);
        form.setValue('items', formattedItems);
      }
      
      calculateTotals(items);
    }
  }, [quotation, clients, form, items]);

  const createSalesOrderMutation = useMutation({
    mutationFn: async (data: SalesOrderFormData) => {
      const selectedClient = clients.find((c: any) => c.id === data.clientId);
      
      const response = await apiRequest('/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salesOrder: {
            clientId: data.clientId,
            clientCode: data.hairTag,
            country: selectedClient?.country || '',
            revisionNumber: data.revisionNumber,
            paymentMethod: data.paymentMethod,
            shippingMethod: data.shippingMethod,
            orderDate: data.orderDate.toISOString(),
            dueDate: data.dueDate.toISOString(),
            createdBy: data.createdBy,
            subtotal: data.subtotal,
            shippingChargeUsd: data.shippingChargeUsd,
            bankChargeUsd: data.bankChargeUsd,
            discountUsd: data.discountUsd,
            others: data.others,
            pleasePayThisAmountUsd: data.pleasePayThisAmountUsd,
            clientServiceInstructions: data.clientServiceInstructions,
            quotationId: quotationId,
          },
          items: data.items,
        }),
      });

      return response;
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
    
    const shippingChargeUsd = parseFloat(form.getValues('shippingChargeUsd') || '0');
    const bankChargeUsd = parseFloat(form.getValues('bankChargeUsd') || '0');
    const discountUsd = parseFloat(form.getValues('discountUsd') || '0');
    const others = parseFloat(form.getValues('others') || '0');
    
    const pleasePayThisAmountUsd = (
      parseFloat(subtotal) +
      shippingChargeUsd +
      bankChargeUsd -
      discountUsd +
      others
    ).toFixed(2);
    
    form.setValue('pleasePayThisAmountUsd', pleasePayThisAmountUsd);
  };

  const addItem = () => {
    const newItems = [
      ...items,
      {
        productId: '',
        productName: '',
        specification: '',
        quantity: '1.0',
        unitPrice: '0.00',
        lineTotal: '0.00',
      },
    ];
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    
    // Calculate line total when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity || '0');
      const unitPrice = parseFloat(newItems[index].unitPrice || '0');
      newItems[index].lineTotal = (quantity * unitPrice).toFixed(2);
    }
    
    // Update product name when product is selected
    if (field === 'productId') {
      const selectedProduct = products.find((p: any) => p.id === value);
      if (selectedProduct) {
        newItems[index].productName = selectedProduct.name;
        newItems[index].unitPrice = selectedProduct.basePrice || '0.00';
        const quantity = parseFloat(newItems[index].quantity || '0');
        const unitPrice = parseFloat(selectedProduct.basePrice || '0');
        newItems[index].lineTotal = (quantity * unitPrice).toFixed(2);
      }
    }
    
    setItems(newItems);
    form.setValue('items', newItems);
    calculateTotals(newItems);
  };

  const formatDecimalInput = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    if (parts.length === 2) {
      return parts[0] + '.' + parts[1].substring(0, 1);
    }
    return cleaned;
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
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center text-foreground">
          <ShoppingCart className="h-5 w-5 mr-2" />
          {quotationId ? 'Create Sales Order from Quotation' : 'Create New Sales Order'}
        </CardTitle>
        {quotationId && (
          <Badge variant="outline">
            Based on Quotation #{quotation?.quotationNumber}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createSalesOrderMutation.mutate(data))} className="space-y-8">
            {/* SALES ORDER Header - Matching PDF Format */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-border shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-foreground">SALES ORDER</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NO.</label>
                  <div className="bg-background border border-input p-2 rounded font-semibold text-foreground">
                    Auto-Generated
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="hairTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">HAIR TAG</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        const client = clients.find((c: any) => c.clientCode === value);
                        if (client) {
                          form.setValue('clientId', client.id);
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client: any) => (
                            <SelectItem key={client.id} value={client.clientCode}>
                              {client.clientCode}
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
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">Shipping Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="Fed Ex">Fed Ex</SelectItem>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Client Pickup">Client Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="revisionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">Revision</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ORDER DATE</label>
                  <div className="bg-background border border-input p-2 rounded font-semibold text-foreground">
                    {format(new Date(), 'MMMM dd, yyyy')}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">DUE DATE</FormLabel>
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
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">Method of Payment</FormLabel>
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
                  name="createdBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">Created By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter initials" {...field} className="uppercase" maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Order Items Table - Matching PDF Format */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold uppercase text-foreground border-b pb-2">Order Items</h3>
                {!quotationId && (
                  <Button type="button" onClick={addItem} size="sm" variant="outline" className="h-10 px-4 font-medium">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                )}
              </div>
              
              <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">order item</TableHead>
                      <TableHead className="font-semibold">specification</TableHead>
                      <TableHead className="text-center font-semibold">quantity</TableHead>
                      <TableHead className="text-right font-semibold">unit price</TableHead>
                      <TableHead className="text-right font-semibold">line total</TableHead>
                      {!quotationId && <TableHead className="w-16">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {quotationId ? (
                            <div className="font-medium">{item.productName || 'N/A'}</div>
                          ) : (
                            <Select 
                              value={item.productId} 
                              onValueChange={(value) => updateItem(index, 'productId', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product: any) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {quotationId ? (
                            <div>{item.specification || '-'}</div>
                          ) : (
                            <Input 
                              value={item.specification || ''}
                              onChange={(e) => updateItem(index, 'specification', e.target.value)}
                              placeholder="Specification"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {quotationId ? (
                            <div className="font-semibold">{item.quantity}</div>
                          ) : (
                            <Input 
                              value={item.quantity}
                              onChange={(e) => {
                                const formatted = formatDecimalInput(e.target.value);
                                if (formatted.match(/^\d*\.?\d?$/)) {
                                  updateItem(index, 'quantity', formatted);
                                }
                              }}
                              className="text-center font-semibold"
                              placeholder="1.0"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {quotationId ? (
                            <div>{parseFloat(item.unitPrice || '0').toFixed(2)}</div>
                          ) : (
                            <Input 
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                              className="text-right"
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {parseFloat(item.lineTotal || '0').toFixed(2)}
                        </TableCell>
                        {!quotationId && (
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              disabled={items.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Financial Summary - Exact PDF Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FormField
                  control={form.control}
                  name="clientServiceInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold lowercase text-foreground border-b pb-2">client service instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Silky Bundles\nBrushed Back Closure/Frontal"
                          className="min-h-[120px] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                {/* Financial Breakdown exactly matching PDF */}
                <div className="bg-gradient-to-b from-muted/30 to-background border border-border p-6 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-right font-medium">sub total</span>
                      <span className="font-semibold text-lg">{form.watch('subtotal')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-right">shipping charge USD</span>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="shippingChargeUsd"
                          render={({ field }) => (
                            <Input 
                              {...field}
                              className="w-20 text-right"
                              type="number"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                calculateTotals(items);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-right">bank charge USD</span>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="bankChargeUsd"
                          render={({ field }) => (
                            <Input 
                              {...field}
                              className="w-20 text-right"
                              type="number"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                calculateTotals(items);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-right">discount USD</span>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="discountUsd"
                          render={({ field }) => (
                            <Input 
                              {...field}
                              className="w-20 text-right"
                              type="number"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                calculateTotals(items);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-right">others</span>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="others"
                          render={({ field }) => (
                            <Input 
                              {...field}
                              className="w-20 text-right"
                              type="number"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                calculateTotals(items);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-right font-bold text-foreground">please pay this amount.</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">USD</span>
                          <span className="font-bold text-xl text-foreground">{form.watch('pleasePayThisAmountUsd')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => form.reset()} className="h-10 px-6 font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={createSalesOrderMutation.isPending} className="h-10 px-6 font-medium">
                {createSalesOrderMutation.isPending ? 'Creating...' : 'Create Sales Order'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}