import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus,
  Trash2,
  FileUp,
  Calendar,
  User,
  Calculator,
  Save,
  X,
  Download,
  Send,
  AlertCircle,
} from 'lucide-react';

// Enhanced quotation schema with client requirements
const quotationFormSchema = z.object({
  customerCode: z.string().min(1, 'Customer code is required'),
  country: z.string().min(1, 'Country is required'),
  priceListId: z.string().optional(),
  paymentMethod: z.enum(['bank', 'agent', 'money transfer', 'cash']),
  shippingMethod: z.enum(['DHL', 'UPS', 'Fed Ex', 'Agent', 'Pick Up']),
  customerServiceInstructions: z.string().optional(),
  revisionNumber: z.enum(['R0', 'R1', 'R2', 'R3', 'R4', 'R5']).default('R0'),
  validUntil: z.string().optional(), // Date string
  attachments: z.array(z.string()).default([]),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    productName: z.string().min(1, 'Product name is required'),
    specification: z.string().optional(),
    quantity: z.number().min(0.1, 'Quantity must be at least 0.1').max(9999.9, 'Quantity too large'),
    unitPrice: z.number().min(0, 'Price must be positive'),
    lineTotal: z.number().min(0, 'Line total must be positive'),
  })).min(1, 'At least one item is required'),
  subtotal: z.number().min(0),
  shippingFee: z.number().min(0).default(0),
  bankCharge: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  others: z.number().min(0).default(0),
  total: z.number().min(0),
});

type QuotationFormData = z.infer<typeof quotationFormSchema>;

interface EnhancedQuotationFormProps {
  quotationId?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Types for API responses
interface Customer {
  id: string;
  customerCode: string;
  name: string;
  country: string;
  priceListId: string;
}

interface Product {
  id: string;
  name: string;
  basePrice: string;
}

interface PriceList {
  id: string;
  name: string;
  code: string;
  priceMultiplier: string;
}

export function EnhancedQuotationForm({
  quotationId,
  trigger,
  open,
  onOpenChange,
}: EnhancedQuotationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [staffInitials, setStaffInitials] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  // Get current staff member for initials from authentication context
  const { user } = useAuth();
  
  useEffect(() => {
    // Automatically generate creator initials from logged-in user
    const getCreatorInitials = () => {
      if (user?.name) {
        const names = user.name.split(' ');
        return names.length > 1 
          ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
          : `${names[0][0]}${names[0][1] || ''}`.toUpperCase();
      }
      if (user?.email) {
        return user.email.substring(0, 2).toUpperCase();
      }
      return 'AA'; // Fallback
    };
    
    setStaffInitials(getCreatorInitials());
  }, [user]);

  // Fetch customers for dropdown
  const { data: customers = [], isLoading: customersLoading, error: customersError } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch products for line items
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch price lists for VLOOKUP pricing
  const { data: priceLists = [], isLoading: priceListsLoading, error: priceListsError } = useQuery<PriceList[]>({
    queryKey: ['/api/price-lists'],
    retry: 3,
    retryDelay: 1000,
  });

  // Debug logging
  useEffect(() => {
    console.log('🔍 EnhancedQuotationForm Data Status:', {
      user: { authenticated: !!user, name: user?.name, email: user?.email },
      authToken: !!localStorage.getItem('auth_token'),
      customers: { count: customers.length, loading: customersLoading, error: customersError?.message },
      products: { count: products.length, loading: productsLoading, error: productsError?.message },
      priceLists: { count: priceLists.length, loading: priceListsLoading, error: priceListsError?.message }
    });
    
    // Show auth error if user is not authenticated
    if (!user && !customersLoading) {
      toast({
        title: "Authentication Required",
        description: "Please login to access customer and pricing data",
        variant: "destructive",
      });
    }
  }, [user, customers, products, priceLists, customersLoading, productsLoading, priceListsLoading, customersError, productsError, priceListsError, toast]);

  // Fetch existing quotation if editing
  const { data: existingQuotation } = useQuery({
    queryKey: ['/api/quotations', quotationId],
    enabled: !!quotationId,
  });

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      customerCode: '',
      country: '',
      paymentMethod: 'bank',
      shippingMethod: 'DHL',
      revisionNumber: 'R0',
      customerServiceInstructions: '',
      attachments: [],
      items: [{ productId: '', productName: '', specification: '', quantity: 1.0, unitPrice: 0, lineTotal: 0 }],
      subtotal: 0,
      shippingFee: 0,
      bankCharge: 0,
      discount: 0,
      others: 0,
      total: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Check if quotation can be revised (client requirement: no revision after next day)
  const canRevise = () => {
    if (!existingQuotation) return true;
    const createdDate = new Date(existingQuotation.createdAt);
    const nextDay = new Date(createdDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return new Date() <= nextDay;
  };

  // Calculate totals
  const watchedItems = form.watch('items');
  const watchedShippingFee = form.watch('shippingFee');
  const watchedBankCharge = form.watch('bankCharge');
  const watchedDiscount = form.watch('discount');
  const watchedOthers = form.watch('others');

  useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    const total = subtotal + (watchedShippingFee || 0) + (watchedBankCharge || 0) - (watchedDiscount || 0) + (watchedOthers || 0);
    
    form.setValue('subtotal', subtotal);
    form.setValue('total', total);
  }, [watchedItems, watchedShippingFee, watchedBankCharge, watchedDiscount, watchedOthers, form]);

  // Update line total when quantity or unit price changes
  const updateLineTotal = (index: number) => {
    const quantity = form.getValues(`items.${index}.quantity`);
    const unitPrice = form.getValues(`items.${index}.unitPrice`);
    const lineTotal = quantity * unitPrice;
    form.setValue(`items.${index}.lineTotal`, lineTotal);
  };

  // VLOOKUP function to calculate price based on price list/tier
  const calculatePriceWithVLOOKUP = (basePrice: number, priceListId?: string) => {
    if (!priceListId || !priceLists.length) {
      return basePrice; // Return base price if no price list selected
    }
    
    const selectedPriceList = priceLists.find((pl: any) => pl.id === priceListId);
    if (!selectedPriceList) {
      return basePrice;
    }
    
    const multiplier = parseFloat(selectedPriceList.priceMultiplier || '1.0');
    return basePrice * multiplier;
  };

  // Create/Update quotation mutation
  const createQuotationMutation = useMutation({
    mutationFn: async (data: QuotationFormData) => {
      const url = quotationId ? `/api/quotations/${quotationId}` : '/api/quotations';
      const method = quotationId ? 'PATCH' : 'POST';
      
      return apiRequest(url, {
        method,
        body: JSON.stringify({
          ...data,
          createdByInitials: staffInitials,
          attachments: uploadedFiles,
          validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
          canRevise: canRevise(),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: quotationId ? 'Quotation Updated' : 'Quotation Created',
        description: `Quotation has been ${quotationId ? 'updated' : 'created'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      setDialogOpen(false);
      form.reset();
      setUploadedFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${quotationId ? 'update' : 'create'} quotation.`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: QuotationFormData) => {
    createQuotationMutation.mutate(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In real implementation, upload files to server/storage
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
      form.setValue('attachments', [...uploadedFiles, ...fileNames]);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileName));
    form.setValue('attachments', uploadedFiles.filter(f => f !== fileName));
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            {quotationId ? 'Edit Quotation' : 'Create New Quotation'}
            {staffInitials && (
              <Badge variant="outline" className="ml-2">
                Creator: {staffInitials}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {quotationId 
              ? `Update quotation details. ${!canRevise() ? 'Revision locked after next day.' : ''}`
              : 'Create a new quotation with line items and pricing details.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Header Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quotation Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="customerCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Code * (Auto-populates details)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Auto-populate customer details with flexibility to modify
                          const customer = customers.find((c: any) => c.customerCode === value || c.id === value);
                          if (customer) {
                            form.setValue('country', customer.country || '');
                            form.setValue('priceListId', customer.priceListId || '');
                            
                            // Recalculate all item prices when customer (and their price list) changes
                            const items = form.getValues('items');
                            items.forEach((item, index) => {
                              if (item.productId) {
                                const product = products.find((p: any) => p.id === item.productId);
                                if (product) {
                                  const basePrice = parseFloat(product.basePrice || '0');
                                  const calculatedPrice = calculatePriceWithVLOOKUP(basePrice, customer.priceListId);
                                  form.setValue(`items.${index}.unitPrice`, calculatedPrice);
                                  updateLineTotal(index);
                                }
                              }
                            });
                            
                            toast({
                              title: "Customer Details Auto-Populated",
                              description: `Details for ${customer.name} loaded. You can modify them if needed.`,
                              duration: 3000,
                            });
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-customer-code">
                            <SelectValue placeholder="Select customer (details will auto-populate)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customersLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading customers...
                            </SelectItem>
                          ) : customersError ? (
                            <SelectItem value="error" disabled>
                              Error loading customers
                            </SelectItem>
                          ) : customers.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              No customers available
                            </SelectItem>
                          ) : (
                            customers.map((customer: any) => (
                              <SelectItem key={customer.id} value={customer.customerCode || customer.id}>
                                {customer.customerCode || customer.name} - {customer.country}
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
                      <FormLabel>Country * (Auto-populated, editable)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Auto-populated from customer record" 
                          data-testid="input-country"
                          className="bg-blue-50 dark:bg-blue-950/20"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Auto-filled from customer record but can be modified
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceListId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Tier (VLOOKUP for pricing)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Recalculate all item prices when price tier changes
                          const items = form.getValues('items');
                          items.forEach((item, index) => {
                            if (item.productId) {
                              const product = products.find((p: any) => p.id === item.productId);
                              if (product) {
                                const basePrice = parseFloat(product.basePrice || '0');
                                const calculatedPrice = calculatePriceWithVLOOKUP(basePrice, value);
                                form.setValue(`items.${index}.unitPrice`, calculatedPrice);
                                updateLineTotal(index);
                              }
                            }
                          });
                          
                          const selectedPriceList = priceLists.find((pl: any) => pl.id === value);
                          if (selectedPriceList) {
                            const multiplier = parseFloat(selectedPriceList.priceMultiplier || '1.0');
                            const percentChange = (multiplier - 1) * 100;
                            toast({
                              title: "Price Tier Applied",
                              description: `Using ${selectedPriceList.name} pricing (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(0)}% from base)`,
                              duration: 3000,
                            });
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-price-tier" className="bg-amber-50 dark:bg-amber-950/20">
                            <SelectValue placeholder="Select price tier for VLOOKUP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priceListsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading price tiers...
                            </SelectItem>
                          ) : priceListsError ? (
                            <SelectItem value="error" disabled>
                              Error loading price tiers
                            </SelectItem>
                          ) : priceLists.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              No price tiers available
                            </SelectItem>
                          ) : (
                            priceLists.map((priceList: any) => {
                              const multiplier = parseFloat(priceList.priceMultiplier || '1.0');
                              const percentChange = (multiplier - 1) * 100;
                              return (
                                <SelectItem key={priceList.id} value={priceList.id}>
                                  {priceList.name} ({priceList.code}) - {percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}% from base
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        VLOOKUP: Automatically calculates prices based on selected tier
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="revisionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revision *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-revision">
                            <SelectValue placeholder="Select revision" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="R0">R0 - Original</SelectItem>
                          <SelectItem value="R1">R1 - Revision 1</SelectItem>
                          <SelectItem value="R2">R2 - Revision 2</SelectItem>
                          <SelectItem value="R3">R3 - Revision 3</SelectItem>
                          <SelectItem value="R4">R4 - Revision 4</SelectItem>
                          <SelectItem value="R5">R5 - Revision 5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
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
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-shipping-method">
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="Fed Ex">FedEx</SelectItem>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Pick Up">Pick Up</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          data-testid="input-valid-until"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileUp className="h-5 w-5" />
                  File Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    data-testid="input-file-upload"
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((fileName, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {fileName}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeFile(fileName)}
                            data-testid={`button-remove-file-${index}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Specification</TableHead>
                      <TableHead>Qty (1 decimal)</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Line Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const product = products.find((p: any) => p.id === value);
                                  if (product) {
                                    form.setValue(`items.${index}.productName`, product.name);
                                    
                                    // VLOOKUP: Calculate price based on selected price tier
                                    const basePrice = parseFloat(product.basePrice || '0');
                                    const selectedPriceListId = form.getValues('priceListId');
                                    const calculatedPrice = calculatePriceWithVLOOKUP(basePrice, selectedPriceListId);
                                    
                                    form.setValue(`items.${index}.unitPrice`, calculatedPrice);
                                    updateLineTotal(index);
                                    
                                    // Show price calculation info
                                    if (selectedPriceListId) {
                                      const priceList = priceLists.find((pl: any) => pl.id === selectedPriceListId);
                                      if (priceList) {
                                        toast({
                                          title: "VLOOKUP Price Calculated",
                                          description: `Base: $${basePrice.toFixed(2)} × ${priceList.name} = $${calculatedPrice.toFixed(2)}`,
                                          duration: 2000,
                                        });
                                      }
                                    } else {
                                      toast({
                                        title: "Using Base Price",
                                        description: `No price tier selected. Using base price: $${basePrice.toFixed(2)}`,
                                        duration: 2000,
                                      });
                                    }
                                  }
                                }}
                                defaultValue={field.value}
                              >
                                <SelectTrigger data-testid={`select-product-${index}`}>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map((product: any) => {
                                    const basePrice = parseFloat(product.basePrice || '0');
                                    const selectedPriceListId = form.getValues('priceListId');
                                    const displayPrice = calculatePriceWithVLOOKUP(basePrice, selectedPriceListId);
                                    
                                    return (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.name} - ${displayPrice.toFixed(2)} {selectedPriceListId && `(base: $${basePrice.toFixed(2)})`}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.specification`}
                            render={({ field }) => (
                              <Input 
                                {...field} 
                                placeholder="Enter specification" 
                                data-testid={`input-specification-${index}`}
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.1"
                                min="0.1"
                                max="9999.9"
                                placeholder="1.0"
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                  updateLineTotal(index);
                                }}
                                data-testid={`input-quantity-${index}`}
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                  updateLineTotal(index);
                                }}
                                data-testid={`input-unit-price-${index}`}
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.lineTotal`}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                readOnly
                                className="bg-gray-50"
                                data-testid={`text-line-total-${index}`}
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => append({ 
                    productId: '', 
                    productName: '', 
                    specification: '', 
                    quantity: 1.0, 
                    unitPrice: 0, 
                    lineTotal: 0 
                  })}
                  data-testid="button-add-item"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="shippingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Fee</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-shipping-fee"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankCharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Charge</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-bank-charge"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-discount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="others"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Others</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-others"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 md:col-span-4">
                  <Separator />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold">Subtotal:</span>
                    <span className="text-lg" data-testid="text-subtotal">${form.watch('subtotal').toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-xl font-bold text-green-600" data-testid="text-total">
                      ${form.watch('total').toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Service Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="customerServiceInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter any special instructions or notes..."
                          rows={3}
                          data-testid="textarea-instructions"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createQuotationMutation.isPending || (!canRevise() && quotationId)}
                data-testid="button-save"
              >
                {createQuotationMutation.isPending ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    {quotationId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {quotationId ? 'Update Quotation' : 'Create Quotation'}
                  </>
                )}
              </Button>
            </div>

            {/* Revision Lock Warning */}
            {quotationId && !canRevise() && (
              <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800">
                  This quotation cannot be revised after the next day from creation.
                </span>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}