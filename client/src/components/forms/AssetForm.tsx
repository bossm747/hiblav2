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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const assetFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  assetType: z.string().min(1, 'Asset type is required'),
  assetTag: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.date().optional(),
  purchasePrice: z.string().optional(),
  currentValue: z.string().optional(),
  condition: z.string().min(1, 'Condition is required'),
  ngWarehouse: z.number().min(0).default(0),
  phWarehouse: z.number().min(0).default(0),
  reservedWarehouse: z.number().min(0).default(0),
  redWarehouse: z.number().min(0).default(0),
  adminWarehouse: z.number().min(0).default(0),
  wipWarehouse: z.number().min(0).default(0),
  assignedTo: z.string().optional(),
  assignedDate: z.date().optional(),
  lastMaintenanceDate: z.date().optional(),
  nextMaintenanceDate: z.date().optional(),
  warrantyExpiry: z.date().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

type AssetFormData = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  asset?: any;
  categories: any[];
  staff: any[];
  warehouses: any[];
  onSuccess: () => void;
}

export function AssetForm({ asset, categories, staff, warehouses, onSuccess }: AssetFormProps) {
  const isEditing = !!asset;

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: asset?.name || '',
      description: asset?.description || '',
      categoryId: asset?.categoryId || '',
      assetType: asset?.assetType || 'equipment',
      assetTag: asset?.assetTag || '',
      serialNumber: asset?.serialNumber || '',
      manufacturer: asset?.manufacturer || '',
      model: asset?.model || '',
      purchaseDate: asset?.purchaseDate ? new Date(asset.purchaseDate) : undefined,
      purchasePrice: asset?.purchasePrice || '',
      currentValue: asset?.currentValue || '',
      condition: asset?.condition || 'good',
      ngWarehouse: asset?.ngWarehouse || 0,
      phWarehouse: asset?.phWarehouse || 0,
      reservedWarehouse: asset?.reservedWarehouse || 0,
      redWarehouse: asset?.redWarehouse || 0,
      adminWarehouse: asset?.adminWarehouse || 0,
      wipWarehouse: asset?.wipWarehouse || 0,
      assignedTo: asset?.assignedTo || '',
      assignedDate: asset?.assignedDate ? new Date(asset.assignedDate) : undefined,
      lastMaintenanceDate: asset?.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate) : undefined,
      nextMaintenanceDate: asset?.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate) : undefined,
      warrantyExpiry: asset?.warrantyExpiry ? new Date(asset.warrantyExpiry) : undefined,
      notes: asset?.notes || '',
      isActive: asset?.isActive ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AssetFormData) => {
      const endpoint = isEditing ? `/api/assets/${asset.id}` : '/api/assets';
      const method = isEditing ? 'PATCH' : 'POST';
      return apiRequest(endpoint, {
        method,
        body: JSON.stringify(data),
      });
    },
    onSuccess,
  });

  const onSubmit = (data: AssetFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dell OptiPlex Desktop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assetTag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Tag</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., IT-2024-001" {...field} />
                </FormControl>
                <FormDescription>Unique identifier for tracking</FormDescription>
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
                  placeholder="Describe the asset..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                    {categories.map((category) => (
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
            name="assetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="computer">Computer</SelectItem>
                    <SelectItem value="printer">Printer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., OptiPlex 7090" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SN123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Warehouse Quantities</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ngWarehouse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NG Warehouse</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
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
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
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
                  <FormLabel>Admin Warehouse</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
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
            name="warrantyExpiry"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Warranty Expiry</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes..."
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
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Set whether this asset is currently active and in use
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update Asset' : 'Create Asset'}
          </Button>
        </div>
      </form>
    </Form>
  );
}