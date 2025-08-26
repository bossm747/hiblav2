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
  clientCode: z.string().min(1, 'Client code is required'),
  country: z.string().min(1, 'Country is required'),
  priceListId: z.string().optional(),
  paymentMethod: z.enum(['bank', 'agent', 'money transfer', 'cash']),
  shippingMethod: z.enum(['DHL', 'UPS', 'Fed Ex', 'Agent', 'Client Pickup']),
  clientServiceInstructions: z.string().optional(),
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
interface Client {
  id: string;
  clientCode: string;
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

  // Fetch clients for dropdown - only when user is authenticated
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: !!user, // Simplified authentication check - the queryClient handles token automatically
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch products for line items - only when user is authenticated
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!user, // Simplified authentication check - the queryClient handles token automatically
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch price lists for VLOOKUP pricing - only when user is authenticated
  const { data: priceLists = [], isLoading: priceListsLoading, error: priceListsError } = useQuery<PriceList[]>({
    queryKey: ['/api/price-lists'],
    enabled: !!user, // Simplified authentication check - the queryClient handles token automatically
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Debug logging
  useEffect(() => {
    console.log('🔍 EnhancedQuotationForm Data Status:', {
      user: { authenticated: !!user, name: user?.name, email: user?.email },
      authToken: !!localStorage.getItem('auth_token'),
      clients: { count: clients.length, loading: clientsLoading, error: clientsError?.message },
      products: { count: products.length, loading: productsLoading, error: productsError?.message },
      priceLists: { count: priceLists.length, loading: priceListsLoading, error: priceListsError?.message }
    });
    
    // Show auth error if user is not authenticated and APIs are failing
    if (!user && !clientsLoading && clientsError) {
      toast({
        title: "Authentication Required", 
        description: "Please refresh the page or login again to access data",
        variant: "destructive",
      });
    }
  }, [user, clients, products, priceLists, clientsLoading, productsLoading, priceListsLoading, clientsError, productsError, priceListsError, toast]);

  // Fetch existing quotation if editing
  const { data: existingQuotation } = useQuery<any>({
    queryKey: ['/api/quotations', quotationId],
    enabled: !!quotationId,
  });

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      clientCode: '',
      country: '',
      paymentMethod: 'bank',
      shippingMethod: 'DHL',
      revisionNumber: 'R0',
      clientServiceInstructions: '',
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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="space-y-3 pb-6 border-b border-border">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            {quotationId ? 'Edit Quotation' : 'Create New Quotation'}
            {staffInitials && (
              <Badge variant="outline" className="ml-2">
                Creator: {staffInitials}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            {quotationId 
              ? `Update quotation details. ${!canRevise() ? 'Revision locked after next day.' : ''}`
              : 'Create a new quotation with line items and pricing details.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 pt-6">
            {/* Header Information */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">Quotation Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="clientCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Client Code * (Auto-populates details)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Auto-populate client details with flexibility to modify
                          const client = clients.find((c: any) => c.clientCode === value || c.id === value);
                          if (client) {
                            form.setValue('country', client.country || '');
                            form.setValue('priceListId', client.priceListId || '');
                            
                            // Recalculate all item prices when client (and their price list) changes
                            const items = form.getValues('items');
                            items.forEach((item, index) => {
                              if (item.productId) {
                                const product = products.find((p: any) => p.id === item.productId);
                                if (product) {
                                  const basePrice = parseFloat(product.basePrice || '0');
                                  const calculatedPrice = calculatePriceWithVLOOKUP(basePrice, client.priceListId);
                                  form.setValue(`items.${index}.unitPrice`, calculatedPrice);
                                  updateLineTotal(index);
                                }
                              }
                            });
                            
                            toast({
                              title: "Client Details Auto-Populated",
                              description: `Details for ${client.name} loaded. You can modify them if needed.`,
                              duration: 3000,
                            });
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-client-code" className="bg-background border-input text-foreground">
                            <SelectValue placeholder="Select client (details will auto-populate)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!user ? (
                            <SelectItem value="auth" disabled>
                              Please login to load clients
                            </SelectItem>
                          ) : clientsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading clients...
                            </SelectItem>
                          ) : clientsError ? (
                            <SelectItem value="error" disabled>
                              Authentication error - please refresh page
                            </SelectItem>
                          ) : clients.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              No clients available
                            </SelectItem>
                          ) : (
                            clients.map((client: any) => (
                              <SelectItem key={client.id} value={client.clientCode || client.id}>
                                {client.clientCode || client.name} - {client.country}
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
                      <FormLabel className="text-muted-foreground">Country * (Auto-populated, editable)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Auto-populated from client record" 
                          data-testid="input-country"
                          className="bg-background border-input text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Auto-filled from client record but can be modified
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceListId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Price Tier (VLOOKUP for pricing)</FormLabel>
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
                          <SelectTrigger data-testid="select-price-tier" className="bg-background border-input text-foreground">
                            <SelectValue placeholder="Select price tier for VLOOKUP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!user ? (
                            <SelectItem value="auth" disabled>
                              Please login to load price tiers
                            </SelectItem>
                          ) : priceListsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading price tiers...
                            </SelectItem>
                          ) : priceListsError ? (
                            <SelectItem value="error" disabled>
                              Authentication error - please refresh page
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
                      <FormLabel className="text-muted-foreground">Revision *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-revision" className="bg-background border-input text-foreground">
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
                      <FormLabel className="text-muted-foreground">Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-method" className="bg-background border-input text-foreground">
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
                      <FormLabel className="text-muted-foreground">Shipping Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-shipping-method" className="bg-background border-input text-foreground">
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="Fed Ex">FedEx</SelectItem>
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
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Valid Until</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          data-testid="input-valid-until"
                          className="bg-background border-input text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <FileUp className="h-5 w-5 text-primary" />
                  File Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="bg-background border-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
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
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-foreground">Product</TableHead>
                        <TableHead className="font-semibold text-foreground">Specification</TableHead>
                        <TableHead className="font-semibold text-foreground">Qty (1 decimal)</TableHead>
                        <TableHead className="font-semibold text-foreground">Unit Price</TableHead>
                        <TableHead className="font-semibold text-foreground">Line Total</TableHead>
                        <TableHead className="font-semibold text-foreground w-20">Actions</TableHead>
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
                                <SelectTrigger data-testid={`select-product-${index}`} className="bg-background border-input text-foreground">
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
                                className="bg-background border-input text-foreground"
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
                                className="bg-background border-input text-foreground"
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
                                className="bg-background border-input text-foreground"
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
                                className="bg-muted/50 font-semibold text-foreground text-right"
                                data-testid={`text-line-total-${index}`}
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
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
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 h-10 px-4 font-medium border-dashed border-2 hover:bg-muted/50 transition-colors"
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
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="shippingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Shipping Fee</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          className="bg-background border-input text-foreground"
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
                      <FormLabel className="text-muted-foreground">Bank Charge</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          className="bg-background border-input text-foreground"
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
                      <FormLabel className="text-muted-foreground">Discount</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          className="bg-background border-input text-foreground"
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
                      <FormLabel className="text-muted-foreground">Others</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          min="0"
                          className="bg-background border-input text-foreground"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-others"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 md:col-span-4">
                  <Separator className="my-6" />
                  <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-muted-foreground">Subtotal:</span>
                      <span className="text-base font-semibold" data-testid="text-subtotal">${form.watch('subtotal').toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-primary" data-testid="text-total">
                        ${form.watch('total').toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Instructions */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">Client Service Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="clientServiceInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter any special instructions or notes..."
                          className="bg-background border-input text-foreground"
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
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-6 font-medium"
                onClick={() => setDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 font-medium"
                disabled={createQuotationMutation.isPending || (!canRevise() && !!quotationId)}
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
              <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
                <span className="text-warning-foreground font-medium">
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