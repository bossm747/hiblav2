import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Package,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Save,
  X,
} from 'lucide-react';

const transferFormSchema = z.object({
  fromWarehouseId: z.string().min(1, 'Source warehouse is required'),
  toWarehouseId: z.string().min(1, 'Destination warehouse is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Transfer reason is required'),
});

type TransferFormData = z.infer<typeof transferFormSchema>;

interface WarehouseTransferModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WarehouseTransferModal({
  trigger,
  open,
  onOpenChange,
}: WarehouseTransferModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedFromWarehouse, setSelectedFromWarehouse] = useState<string>('');
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  // Fetch warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromWarehouseId: '',
      toWarehouseId: '',
      productId: '',
      quantity: 1,
      reason: '',
    },
  });

  // Check stock when product and warehouse are selected
  const checkStock = async () => {
    if (!selectedProduct || !selectedFromWarehouse) {
      setAvailableStock(null);
      return;
    }

    setIsCheckingStock(true);
    try {
      const response = await apiRequest(
        `/api/warehouse-transfers/${selectedFromWarehouse}/${selectedProduct}/stock`
      );
      setAvailableStock(response.stock);
    } catch (error) {
      console.error('Error checking stock:', error);
      setAvailableStock(null);
    } finally {
      setIsCheckingStock(false);
    }
  };

  React.useEffect(() => {
    checkStock();
  }, [selectedProduct, selectedFromWarehouse]);

  // Create transfer mutation
  const createTransferMutation = useMutation({
    mutationFn: async (data: TransferFormData) => {
      return apiRequest('/api/warehouse-transfers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Transfer Created',
        description: 'Warehouse transfer has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-transfers/inventory-levels'] });
      setDialogOpen(false);
      form.reset();
      setAvailableStock(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create transfer.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: TransferFormData) => {
    if (data.fromWarehouseId === data.toWarehouseId) {
      toast({
        title: 'Invalid Transfer',
        description: 'Source and destination warehouses must be different.',
        variant: 'destructive',
      });
      return;
    }

    if (availableStock !== null && data.quantity > availableStock) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${availableStock} units available in the source warehouse.`,
        variant: 'destructive',
      });
      return;
    }

    createTransferMutation.mutate(data);
  };

  const getWarehouseBadgeColor = (warehouseCode: string) => {
    const colors: Record<string, string> = {
      'NG': 'bg-blue-500',
      'PH': 'bg-green-500',
      'Reserved': 'bg-purple-500',
      'Red': 'bg-red-500',
      'Admin': 'bg-gray-500',
      'WIP': 'bg-yellow-500',
    };
    return colors[warehouseCode] || 'bg-gray-500';
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Create Warehouse Transfer
          </DialogTitle>
          <DialogDescription>
            Transfer inventory between warehouses with real-time tracking
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Transfer Direction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Transfer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromWarehouseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Warehouse *</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedFromWarehouse(value);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-from-warehouse">
                              <SelectValue placeholder="Select source warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(warehouses as any[])?.map((warehouse: any) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getWarehouseBadgeColor(warehouse.code)}`} />
                                  {warehouse.name}
                                </div>
                              </SelectItem>
                            )) || []}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="toWarehouseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Warehouse *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-to-warehouse">
                              <SelectValue placeholder="Select destination warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(warehouses as any[])?.map((warehouse: any) => (
                              <SelectItem 
                                key={warehouse.id} 
                                value={warehouse.id}
                                disabled={warehouse.id === form.watch('fromWarehouseId')}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getWarehouseBadgeColor(warehouse.code)}`} />
                                  {warehouse.name}
                                </div>
                              </SelectItem>
                            )) || []}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedProduct(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-product">
                            <SelectValue placeholder="Select product to transfer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(products as any[])?.map((product: any) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                {product.name} ({product.sku})
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-quantity"
                          />
                        </FormControl>
                        {availableStock !== null && (
                          <p className="text-sm text-muted-foreground">
                            Available: {availableStock} units
                          </p>
                        )}
                        {isCheckingStock && (
                          <p className="text-sm text-muted-foreground">
                            Checking stock...
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Status</label>
                    {availableStock !== null && selectedProduct && selectedFromWarehouse ? (
                      <div className="space-y-2">
                        <Progress 
                          value={Math.min((form.watch('quantity') / availableStock) * 100, 100)} 
                          className={form.watch('quantity') > availableStock ? 'bg-red-100' : ''}
                        />
                        <div className="flex items-center gap-2">
                          {form.watch('quantity') <= availableStock ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Stock available</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">Insufficient stock</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Select warehouse and product</span>
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transfer Reason *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter reason for transfer (e.g., Stock rebalancing, Client order fulfillment)"
                          className="resize-none"
                          {...field}
                          data-testid="textarea-reason"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={createTransferMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTransferMutation.isPending || (availableStock !== null && form.watch('quantity') > availableStock)}
              >
                {createTransferMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating Transfer...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Transfer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}