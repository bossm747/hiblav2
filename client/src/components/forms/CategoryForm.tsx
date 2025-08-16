import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  displayOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: any;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const isEditing = !!category;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      type: category?.type || 'product',
      description: category?.description || '',
      displayOrder: category?.displayOrder || 0,
      isActive: category?.isActive ?? true,
    },
  });

  // Auto-generate slug from name
  const watchName = form.watch('name');
  React.useEffect(() => {
    if (!isEditing && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  }, [watchName, isEditing, form]);

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const endpoint = isEditing ? `/api/categories/${category.id}` : '/api/categories';
      const method = isEditing ? 'PATCH' : 'POST';
      return apiRequest(endpoint, {
        method,
        body: JSON.stringify(data),
      });
    },
    onSuccess,
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Office Equipment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="e.g., office-equipment" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly version of the name (auto-generated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="product">Product (Hair Products)</SelectItem>
                  <SelectItem value="equipment">Equipment (Machinery)</SelectItem>
                  <SelectItem value="asset">Asset (Company Assets)</SelectItem>
                  <SelectItem value="tool">Tool (Work Tools)</SelectItem>
                  <SelectItem value="supply">Supply (Office Supplies)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of items this category will contain
              </FormDescription>
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
                <Textarea 
                  placeholder="Describe what items belong in this category..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Lower numbers appear first in lists
              </FormDescription>
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
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Active categories can be used for new items
                </FormDescription>
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

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
}