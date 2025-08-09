import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIProductEnhancer } from '@/components/AIProductEnhancer';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Bot, Package } from 'lucide-react';

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  hairType: z.string().min(1, 'Hair type is required'),
  texture: z.string().optional(),
  length: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  basePrice: z.string().min(1, 'Base price is required'),
  costPrice: z.string().optional(),
  priceListA: z.string().optional(),
  priceListB: z.string().optional(),
  priceListC: z.string().optional(),
  priceListD: z.string().optional(),
  lowStockThreshold: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  productId?: string;
  onSuccess: () => void;
}

export function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const isEdit = !!productId;

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: product } = useQuery({
    queryKey: ['/api/products', productId],
    enabled: isEdit,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      hairType: 'human',
      texture: '',
      length: '',
      color: '',
      weight: '',
      unit: 'pcs',
      basePrice: '',
      costPrice: '',
      priceListA: '',
      priceListB: '',
      priceListC: '',
      priceListD: '',
      lowStockThreshold: '10',
      categoryId: '',
      isActive: true,
      ...product,
    },
  });

  React.useEffect(() => {
    if (product && isEdit) {
      form.reset({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        hairType: product.hairType || 'human',
        texture: product.texture || '',
        length: product.length?.toString() || '',
        color: product.color || '',
        weight: product.weight || '',
        unit: product.unit || 'pcs',
        basePrice: product.basePrice || '',
        costPrice: product.costPrice || '',
        priceListA: product.priceListA || '',
        priceListB: product.priceListB || '',
        priceListC: product.priceListC || '',
        priceListD: product.priceListD || '',
        lowStockThreshold: product.lowStockThreshold || '10',
        categoryId: product.categoryId || '',
        isActive: product.isActive ?? true,
      });
    }
  }, [product, isEdit, form]);

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/products/${productId}` : '/api/products';
      
      return apiRequest(url, {
        method,
        body: JSON.stringify({
          ...data,
          length: data.length ? parseInt(data.length) : null,
          basePrice: parseFloat(data.basePrice),
          costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
          priceListA: data.priceListA ? parseFloat(data.priceListA) : null,
          priceListB: data.priceListB ? parseFloat(data.priceListB) : null,
          priceListC: data.priceListC ? parseFloat(data.priceListC) : null,
          priceListD: data.priceListD ? parseFloat(data.priceListD) : null,
          lowStockThreshold: data.lowStockThreshold ? parseFloat(data.lowStockThreshold) : 10,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: `Product ${isEdit ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEdit ? 'update' : 'create'} product`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  const safeCategories = categories as Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  const handleAIEnhancedData = (aiData: any) => {
    // Apply AI-generated data to form
    if (aiData.description) {
      form.setValue('description', aiData.description);
    }
    if (aiData.hairType) {
      form.setValue('hairType', aiData.hairType);
    }
    if (aiData.texture) {
      form.setValue('texture', aiData.texture);
    }
    if (aiData.color) {
      form.setValue('color', aiData.color);
    }
    if (aiData.weight) {
      form.setValue('weight', aiData.weight.toString());
    }
    if (aiData.unit) {
      form.setValue('unit', aiData.unit);
    }
    if (aiData.lowStockThreshold) {
      form.setValue('lowStockThreshold', aiData.lowStockThreshold.toString());
    }
    if (aiData.suggestedPrice) {
      form.setValue('basePrice', aiData.suggestedPrice.toString());
    }
  };

  const handleImageGenerated = (imageData: { imageUrl: string; altText: string }) => {
    toast({
      title: 'Image Generated Successfully',
      description: 'Product image has been created and can be used for this product.',
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Details
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Enhancement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-6">
          <AIProductEnhancer
            productData={{
              name: form.watch('name') || '',
              category: safeCategories?.find(cat => cat.id === form.watch('categoryId'))?.name || '',
              hairType: form.watch('hairType') || '',
              length: form.watch('length') ? parseFloat(form.watch('length')) : undefined,
              texture: form.watch('texture') || '',
              color: form.watch('color') || '',
              description: form.watch('description') || '',
            }}
            onEnhancedData={handleAIEnhancedData}
            onImageGenerated={handleImageGenerated}
          />
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 20&quot; Machine Weft Single Drawn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Premium Filipino hair product description" {...field} />
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
                    <Input placeholder="Auto-generated if empty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {safeCategories.map((category) => (
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
                </div>

                {/* Specifications */}
                <div className="space-y-4">
            <h3 className="text-lg font-medium">Specifications</h3>
            
            <FormField
              control={form.control}
              name="hairType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hair Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hair type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="human">Human Hair</SelectItem>
                      <SelectItem value="virgin">Virgin Hair</SelectItem>
                      <SelectItem value="remy">Remy Hair</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="texture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texture</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select texture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="wavy">Wavy</SelectItem>
                      <SelectItem value="curly">Curly</SelectItem>
                      <SelectItem value="kinky">Kinky</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (inches)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Natural Black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="100g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="bundles">Bundles</SelectItem>
                        <SelectItem value="closures">Closures</SelectItem>
                        <SelectItem value="frontals">Frontals</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pricing (USD)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price *</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceListA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price List A</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                  <FormLabel>Price List B</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                  <FormLabel>Price List C</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                  <FormLabel>Price List D</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
          <h3 className="text-lg font-medium">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Product</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Available for quotations and orders
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createProductMutation.isPending}>
            {createProductMutation.isPending
              ? (isEdit ? 'Updating...' : 'Creating...')
              : (isEdit ? 'Update Product' : 'Create Product')
            }
          </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}