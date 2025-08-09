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
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Calculator } from 'lucide-react';

const quotationItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  productName: z.string(),
  quantity: z.string().min(1, 'Quantity is required'),
  unitPrice: z.string().min(1, 'Unit price is required'),
  lineTotal: z.string(),
  specification: z.string().optional(),
});

const quotationFormSchema = z.object({
  customerCode: z.string().min(1, 'Customer code is required'),
  country: z.string().min(1, 'Country is required'),
  priceListId: z.string().min(1, 'Price list is required'),
  paymentMethod: z.enum(['bank', 'cash', 'credit']),
  shippingMethod: z.enum(['DHL', 'FedEx', 'EMS', 'Sea']),
  createdBy: z.string().min(1, 'Created by is required'),
  subtotal: z.string().default('0.00'),
  shippingFee: z.string().default('0.00'),
  bankCharge: z.string().default('0.00'),
  discount: z.string().default('0.00'),
  others: z.string().default('0.00'),
  total: z.string().default('0.00'),
  customerServiceInstructions: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
});

type QuotationFormData = z.infer<typeof quotationFormSchema>;

interface QuotationFormProps {
  onSuccess?: () => void;
}

export function QuotationForm({ onSuccess }: QuotationFormProps) {
  const [items, setItems] = useState<z.infer<typeof quotationItemSchema>[]>([
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

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      customerCode: '',
      country: '',
      priceListId: 'A',
      paymentMethod: 'bank',
      shippingMethod: 'DHL',
      createdBy: 'staff-aama-real',
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

  // Fetch all dropdown data from database with proper error handling
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: customers = [], isLoading: customersLoading, error: customersError } = useQuery({
    queryKey: ['/api/customers'],
    queryFn: async () => {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: priceLists = [], isLoading: priceListsLoading, error: priceListsError } = useQuery({
    queryKey: ['/api/price-lists'],
    queryFn: async () => {
      const response = await fetch('/api/price-lists');
      if (!response.ok) {
        throw new Error(`Failed to fetch price lists: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: staff = [], isLoading: staffLoading, error: staffError } = useQuery({
    queryKey: ['/api/staff'],
    queryFn: async () => {
      const response = await fetch('/api/staff');
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Check if any dropdown data is loading
  const isLoadingDropdownData = productsLoading || customersLoading || priceListsLoading || staffLoading;
  
  // Check for any dropdown errors
  const hasDropdownErrors = productsError || customersError || priceListsError || staffError;
  
  // All dropdowns should now load data successfully

  const createQuotationMutation = useMutation({
    mutationFn: async (data: QuotationFormData) => {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotation: {
            customerCode: data.customerCode,
            country: data.country,
            priceListId: data.priceListId,
            paymentMethod: data.paymentMethod,
            shippingMethod: data.shippingMethod,
            createdBy: data.createdBy,
            subtotal: data.subtotal,
            shippingFee: data.shippingFee,
            bankCharge: data.bankCharge,
            discount: data.discount,
            others: data.others,
            total: data.total,
            customerServiceInstructions: data.customerServiceInstructions,
          },
          items: data.items,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create quotation');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Quotation created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      form.reset();
      setItems([
        {
          productId: '',
          productName: '',
          quantity: '1',
          unitPrice: '0.00',
          lineTotal: '0.00',
          specification: '',
        },
      ]);
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

  const handleProductChange = async (index: number, productId: string) => {
    const product = (products as any[]).find((p: any) => p.id === productId);
    if (product) {
      const priceListId = form.getValues('priceListId');
      
      // Fetch price using VLOOKUP
      try {
        const response = await fetch(
          `/api/products/price-lookup?productId=${productId}&priceListId=${priceListId}`
        );
        if (response.ok) {
          const priceData = await response.json();
          const newItems = [...items];
          newItems[index] = {
            ...newItems[index],
            productId,
            productName: product.name,
            unitPrice: priceData.price,
            lineTotal: (parseFloat(priceData.price) * parseFloat(newItems[index].quantity)).toFixed(2),
          };
          setItems(newItems);
          form.setValue('items', newItems);
          calculateTotals(newItems);
        }
      } catch (error) {
        console.error('Failed to fetch price:', error);
      }
    }
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      lineTotal: (parseFloat(newItems[index].unitPrice) * parseFloat(quantity)).toFixed(2),
    };
    setItems(newItems);
    form.setValue('items', newItems);
    calculateTotals(newItems);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Create New Quotation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createQuotationMutation.mutate(data))} className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="customerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customersLoading ? (
                          <SelectItem value="loading" disabled>Loading customers...</SelectItem>
                        ) : customersError ? (
                          <SelectItem value="error" disabled>Error: {(customersError as Error)?.message || 'Failed to load customers'}</SelectItem>
                        ) : !customers || (customers as any[]).length === 0 ? (
                          <SelectItem value="empty" disabled>No customers found</SelectItem>
                        ) : (
                          (customers as any[]).map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.customerCode}>
                              {customer.customerCode} - {customer.name}
                            </SelectItem>
                          ))
                        )}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Philippines">Philippines</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                        <SelectItem value="Thailand">Thailand</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priceListId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price List</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select price list" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priceListsLoading ? (
                          <SelectItem value="loading" disabled>Loading price lists...</SelectItem>
                        ) : priceListsError ? (
                          <SelectItem value="error" disabled>Error: {(priceListsError as Error)?.message || 'Failed to load price lists'}</SelectItem>
                        ) : (priceLists as any[]).length === 0 ? (
                          <SelectItem value="empty" disabled>No price lists available</SelectItem>
                        ) : (
                          (priceLists as any[]).map((priceList: any) => (
                            <SelectItem key={priceList.id} value={priceList.name}>
                              Price List {priceList.name} - {priceList.description}
                            </SelectItem>
                          ))
                        )}
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
                    <FormLabel>Created By</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffLoading ? (
                          <SelectItem value="loading" disabled>Loading staff...</SelectItem>
                        ) : staffError ? (
                          <SelectItem value="error" disabled>Error: {(staffError as Error)?.message || 'Failed to load staff'}</SelectItem>
                        ) : (staff as any[]).length === 0 ? (
                          <SelectItem value="empty" disabled>No staff available</SelectItem>
                        ) : (
                          (staff as any[]).map((member: any) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quotation Items</h3>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg mb-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Product</label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => handleProductChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productsLoading ? (
                          <SelectItem value="loading" disabled>Loading products...</SelectItem>
                        ) : productsError ? (
                          <SelectItem value="error" disabled>Error: {(productsError as Error)?.message || 'Failed to load products'}</SelectItem>
                        ) : !products || (products as any[]).length === 0 ? (
                          <SelectItem value="empty" disabled>No products found</SelectItem>
                        ) : (
                          (products as any[]).map((product: any) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Unit Price</label>
                    <Input value={`$${item.unitPrice}`} disabled />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Line Total</label>
                    <Input value={`$${item.lineTotal}`} disabled />
                  </div>
                  
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
                </div>
              ))}
            </div>

            {/* Totals Section */}
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="shippingFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Shipping Fee</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateTotals(items), 0);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bankCharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Bank Charge</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateTotals(items), 0);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Discount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateTotals(items), 0);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="others"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Others</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateTotals(items), 0);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
              <Button type="submit" disabled={createQuotationMutation.isPending}>
                {createQuotationMutation.isPending ? 'Creating...' : 'Create Quotation'}
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}