import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Package } from 'lucide-react';

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  unit: z.string().default('pcs'),
  hairType: z.enum(['human', 'synthetic']),
  priceListA: z.string().min(1, 'Price List A is required'),
  priceListB: z.string().min(1, 'Price List B is required'),
  priceListC: z.string().min(1, 'Price List C is required'),
  priceListD: z.string().min(1, 'Price List D is required'),
  costPrice: z.string().min(1, 'Cost price is required'),
  lowStockThreshold: z.string().default('10'),
  ngWarehouse: z.string().default('0'),
  phWarehouse: z.string().default('0'),
  reservedWarehouse: z.string().default('0'),
  redWarehouse: z.string().default('0'),
  adminWarehouse: z.string().default('0'),
  wipWarehouse: z.string().default('0'),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface InventoryFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export function InventoryForm({ productId, onSuccess }: InventoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      categoryId: '',
      unit: 'pcs',
      hairType: 'human',
      priceListA: '0.00',
      priceListB: '0.00',
      priceListC: '0.00',
      priceListD: '0.00',
      costPrice: '0.00',
      lowStockThreshold: '10',
      ngWarehouse: '0',
      phWarehouse: '0',
      reservedWarehouse: '0',
      redWarehouse: '0',
      adminWarehouse: '0',
      wipWarehouse: '0',
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: product } = useQuery({
    queryKey: ['/api/products', productId],
    enabled: !!productId,
  });

  React.useEffect(() => {
    if (product) {
      Object.keys(product).forEach((key) => {
        if (key in form.getValues()) {
          form.setValue(key as keyof ProductFormData, product[key]);
        }
      });
    }
  }, [product, form]);

  const createOrUpdateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${productId ? 'update' : 'create'} product`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Product ${productId ? 'updated' : 'created'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      if (!productId) {
        form.reset();
      }
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
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6 border-b border-border">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <Package className="h-5 w-5 text-primary" />
          {productId ? 'Update Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createOrUpdateProductMutation.mutate(data))} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 8 inch Machine Weft Straight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MW-8-STR-SD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description..."
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="bundles">Bundles</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hairType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hair Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="human">Human Hair</SelectItem>
                        <SelectItem value="synthetic">Synthetic Hair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <FormField
                  control={form.control}
                  name="priceListA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price List A (Premium)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priceListB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price List B (Standard)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priceListC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price List C (Bulk)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priceListD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price List D (Wholesale)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Warehouse Stock */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Warehouse Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <FormField
                  control={form.control}
                  name="ngWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NG Warehouse</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PH Warehouse</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reservedWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reserved</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="redWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Red Warehouse</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adminWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wipWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WIP</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                className="h-10 px-6 font-medium"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                className="h-10 px-6 font-medium"
                disabled={createOrUpdateProductMutation.isPending}
              >
                {createOrUpdateProductMutation.isPending 
                  ? (productId ? 'Updating...' : 'Creating...') 
                  : (productId ? 'Update Product' : 'Create Product')
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}