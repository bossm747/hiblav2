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
import { Factory, CalendarIcon, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

const jobOrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  specification: z.string().optional(),
  quantity: z.string(),
  shipment1: z.string().default('0'),
  shipment2: z.string().default('0'),
  shipment3: z.string().default('0'),
  shipment4: z.string().default('0'),
  shipment5: z.string().default('0'),
  shipment6: z.string().default('0'),
  shipment7: z.string().default('0'),
  shipment8: z.string().default('0'),
  shipped: z.string().default('0'),
  reserved: z.string().default('0'),
  ready: z.string().default('0'),
  toProduce: z.string().default('0'),
  orderBalance: z.string().default('0'),
});

const jobOrderFormSchema = z.object({
  hairTag: z.string().min(1, 'Hair Tag is required'),
  salesOrderId: z.string().optional(),
  clientId: z.string().min(1, 'Client is required'),
  date: z.date().default(() => new Date()),
  dueDate: z.date(),
  createdBy: z.string().min(1, 'Creator initials required'),
  productionDate: z.date().optional(),
  nameSignature: z.string().optional(),
  received: z.string().optional(),
  orderInstructions: z.string().optional(),
  items: z.array(jobOrderItemSchema).min(1, 'At least one item is required'),
});

type JobOrderFormData = z.infer<typeof jobOrderFormSchema>;

interface JobOrderFormProps {
  salesOrderId?: string;
  onSuccess?: () => void;
}

export function JobOrderForm({ salesOrderId, onSuccess }: JobOrderFormProps) {
  const [items, setItems] = useState<z.infer<typeof jobOrderItemSchema>[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<JobOrderFormData>({
    resolver: zodResolver(jobOrderFormSchema),
    defaultValues: {
      hairTag: '',
      salesOrderId: salesOrderId,
      clientId: '',
      date: new Date(),
      dueDate: new Date(),
      createdBy: '',
      productionDate: undefined,
      nameSignature: '',
      received: '',
      orderInstructions: '',
      items: [],
    },
  });

  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ['/api/clients'],
  });

  const { data: salesOrders = [] } = useQuery<any[]>({
    queryKey: ['/api/sales-orders'],
  });

  // Load sales order data if salesOrderId is provided
  const { data: salesOrder } = useQuery<any>({
    queryKey: ['/api/sales-orders', salesOrderId],
    enabled: !!salesOrderId,
  });

  const { data: salesOrderItems = [] } = useQuery<any[]>({
    queryKey: ['/api/sales-order-items', salesOrderId],
    enabled: !!salesOrderId,
  });

  useEffect(() => {
    if (salesOrder) {
      form.setValue('hairTag', salesOrder.clientCode || '');
      form.setValue('clientId', salesOrder.clientId || '');
      form.setValue('createdBy', salesOrder.createdBy || '');
      if (salesOrder.dueDate) {
        form.setValue('dueDate', new Date(salesOrder.dueDate));
      }
      form.setValue('orderInstructions', salesOrder.clientServiceInstructions || '');
      
      // Load items from sales order
      if (salesOrderItems && salesOrderItems.length > 0) {
        const jobOrderItems = salesOrderItems.map((item: any) => ({
          productId: item.productId || '',
          productName: item.productName || '',
          specification: item.specification || '',
          quantity: item.quantity || '0.0',
          shipment1: '0',
          shipment2: '0',
          shipment3: '0',
          shipment4: '0',
          shipment5: '0',
          shipment6: '0',
          shipment7: '0',
          shipment8: '0',
          shipped: '0',
          reserved: '0',
          ready: '0',
          toProduce: item.quantity || '0.0',
          orderBalance: item.quantity || '0.0',
        }));
        setItems(jobOrderItems);
        form.setValue('items', jobOrderItems);
      }
    }
  }, [salesOrder, salesOrderItems, form]);

  const createJobOrderMutation = useMutation({
    mutationFn: async (data: JobOrderFormData) => {
      const response = await apiRequest('/api/job-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobOrder: {
            salesOrderId: data.salesOrderId,
            clientId: data.clientId,
            clientCode: data.hairTag,
            date: data.date.toISOString(),
            dueDate: data.dueDate.toISOString(),
            createdBy: data.createdBy,
            productionDate: data.productionDate?.toISOString(),
            nameSignature: data.nameSignature,
            received: data.received,
            orderInstructions: data.orderInstructions,
          },
          items: data.items,
        }),
      });

      return response;
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

  const updateShipment = (itemIndex: number, shipmentIndex: number, value: string) => {
    const newItems = [...items];
    const shipmentKey = `shipment${shipmentIndex}` as keyof typeof newItems[0];
    (newItems[itemIndex] as any)[shipmentKey] = value;
    
    // Calculate totals
    const item = newItems[itemIndex];
    const shipped = (parseFloat(item.shipment1 || '0') +
                    parseFloat(item.shipment2 || '0') +
                    parseFloat(item.shipment3 || '0') +
                    parseFloat(item.shipment4 || '0') +
                    parseFloat(item.shipment5 || '0') +
                    parseFloat(item.shipment6 || '0') +
                    parseFloat(item.shipment7 || '0') +
                    parseFloat(item.shipment8 || '0')).toFixed(1);
    
    const quantity = parseFloat(item.quantity || '0');
    const reserved = parseFloat(item.reserved || '0');
    
    newItems[itemIndex].shipped = shipped;
    newItems[itemIndex].orderBalance = (quantity - parseFloat(shipped)).toFixed(1);
    newItems[itemIndex].ready = (reserved - parseFloat(shipped)).toFixed(1);
    newItems[itemIndex].toProduce = (quantity - reserved).toFixed(1);
    
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const updateReserved = (itemIndex: number, value: string) => {
    const newItems = [...items];
    newItems[itemIndex].reserved = value;
    
    const item = newItems[itemIndex];
    const quantity = parseFloat(item.quantity || '0');
    const shipped = parseFloat(item.shipped || '0');
    const reserved = parseFloat(value || '0');
    
    newItems[itemIndex].ready = (reserved - shipped).toFixed(1);
    newItems[itemIndex].toProduce = (quantity - reserved).toFixed(1);
    
    setItems(newItems);
    form.setValue('items', newItems);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center text-foreground">
          <Factory className="h-5 w-5 mr-2" />
          {salesOrderId ? 'Create Job Order from Sales Order' : 'Create New Job Order'}
        </CardTitle>
        {salesOrderId && (
          <Badge variant="outline">
            Based on Sales Order #{salesOrder?.salesOrderNumber}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createJobOrderMutation.mutate(data))} className="space-y-8">
            
            {/* JOB ORDER FORM Header - Matching PDF Format */}
            <div className="bg-gradient-to-b from-muted/30 to-background border border-border shadow-sm p-6 rounded-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-foreground">JOB ORDER FORM</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <FormField
                  control={form.control}
                  name="createdBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Created By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter initials" {...field} className="uppercase" maxLength={10} />
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
                      <FormLabel className="text-muted-foreground">Production Date</FormLabel>
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
                              {field.value ? format(field.value, 'MMM dd, yyyy') : 'Select date'}
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
                  name="nameSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Name / Signature</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
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
                      <FormLabel className="text-muted-foreground">Received</FormLabel>
                      <FormControl>
                        <Input placeholder="Received by" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hairTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">HAIR TAG</FormLabel>
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
                
                <div>
                  <label className="text-muted-foreground">DATE</label>
                  <div className="bg-background border border-input p-2 rounded text-foreground font-semibold">
                    {format(new Date(), 'MMMM dd, yyyy')}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">DUE DATE</FormLabel>
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
              </div>
            </div>
            
            {/* Order Instructions */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="orderInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold border-b pb-2">order instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Silky Bundles\nBrushed Back Closure/Frontal"
                        className="min-h-[80px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Job Order Items Table - Exact PDF Format */}
            {items.length > 0 && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg overflow-x-auto shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold min-w-[200px] text-foreground">order item</TableHead>
                        <TableHead className="font-semibold min-w-[120px] text-foreground">specification</TableHead>
                        <TableHead className="text-center font-semibold w-20 text-foreground">quantity</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">1</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">2</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">3</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">4</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">5</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">6</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">7</TableHead>
                        <TableHead className="text-center font-semibold w-12 text-foreground">8</TableHead>
                        <TableHead className="text-center font-semibold w-20 text-foreground">order balance</TableHead>
                        <TableHead className="text-center font-semibold w-20 text-foreground">shipped</TableHead>
                        <TableHead className="text-center font-semibold w-20 text-foreground">reserved</TableHead>
                        <TableHead className="text-center font-semibold w-20 text-foreground">ready</TableHead>
                        <TableHead className="text-center font-semibold w-20 text-foreground">to produce</TableHead>
                      </TableRow>
                      <TableRow className="bg-muted/30">
                        <TableHead colSpan={3} className="font-normal text-center italic text-muted-foreground">Shipments</TableHead>
                        <TableHead colSpan={8} className="font-normal text-center italic text-muted-foreground">Real-time Monitoring</TableHead>
                        <TableHead colSpan={4} className="font-normal text-center italic text-muted-foreground">Production Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell>{item.specification || '-'}</TableCell>
                          <TableCell className="text-center font-semibold">{item.quantity}</TableCell>
                          
                          {/* Shipment columns 1-8 */}
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((shipNum) => (
                            <TableCell key={shipNum} className="text-center p-1">
                              <Input
                                value={(item as any)[`shipment${shipNum}`] || '0'}
                                onChange={(e) => updateShipment(index, shipNum, e.target.value)}
                                className="w-12 text-center text-xs p-1"
                                type="number"
                                step="0.1"
                                min="0"
                              />
                            </TableCell>
                          ))}
                          
                          {/* Calculated fields */}
                          <TableCell className="text-center font-semibold bg-yellow-50 dark:bg-yellow-900">
                            {item.orderBalance}
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-blue-50 dark:bg-blue-900">
                            {item.shipped}
                          </TableCell>
                          <TableCell className="text-center p-1">
                            <Input
                              value={item.reserved}
                              onChange={(e) => updateReserved(index, e.target.value)}
                              className="w-16 text-center text-xs p-1"
                              type="number"
                              step="0.1"
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-green-50 dark:bg-green-900">
                            {item.ready}
                          </TableCell>
                          <TableCell className="text-center font-semibold bg-red-50 dark:bg-red-900">
                            {item.toProduce}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 text-right">
                  <div className="bg-gradient-to-r from-muted/30 to-primary/10 p-4 rounded-lg border border-border font-bold text-foreground shadow-sm">
                    JOB ORDER NO. Auto-Generated
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-4 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={() => form.reset()} className="h-10 px-6 font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={createJobOrderMutation.isPending || items.length === 0} className="h-10 px-6 font-medium">
                {createJobOrderMutation.isPending ? 'Creating...' : 'Create Job Order'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}