import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InventoryForm } from '@/components/forms/InventoryForm';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  Warehouse,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  ArrowUpDown,
  History
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function InventoryPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: warehouses = [] } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  // Type-safe data access with fallbacks
  const safeProducts = products as Array<{
    id?: string;
    name?: string;
    sku?: string;
    ngWarehouse?: string;
    phWarehouse?: string;
    reservedWarehouse?: string;
    redWarehouse?: string;
    adminWarehouse?: string;
    wipWarehouse?: string;
    lowStockThreshold?: string;
    basePrice?: string;
    isActive?: boolean;
  }> || [];

  const safeWarehouses = warehouses as Array<{
    id?: string;
    name?: string;
    code?: string;
  }> || [];

  // Fallback warehouse data with proper typing
  const warehouseDisplayData = safeWarehouses.length > 0 ? safeWarehouses.map((w) => ({
    id: w.id || '',
    name: w.name || '',
    color: getWarehouseColor(w.name || '')
  })) : [
    { id: 'NG', name: 'NG Warehouse', color: 'bg-blue-500' },
    { id: 'PH', name: 'PH Warehouse', color: 'bg-green-500' },
    { id: 'Reserved', name: 'Reserved', color: 'bg-yellow-500' },
    { id: 'Red', name: 'Red Warehouse', color: 'bg-red-500' },
    { id: 'Admin', name: 'Admin', color: 'bg-purple-500' },
    { id: 'WIP', name: 'Work in Progress', color: 'bg-orange-500' }
  ];

  function getWarehouseColor(name: string): string {
    const colorMap: { [key: string]: string } = {
      'NG Warehouse': 'bg-blue-500',
      'PH Warehouse': 'bg-green-500',
      'Reserved': 'bg-yellow-500',
      'Red Warehouse': 'bg-red-500',
      'Admin': 'bg-purple-500',
      'Work in Progress': 'bg-orange-500',
      'WIP': 'bg-orange-500'
    };
    return colorMap[name] || 'bg-gray-500';
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const lowStockItems = safeProducts.filter((p) => 
    parseFloat(p.ngWarehouse || '0') + parseFloat(p.phWarehouse || '0') < parseFloat(p.lowStockThreshold || '10')
  );

  return (
    <div className="container-responsive space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-responsive-lg font-bold tracking-tight truncate">Inventory Management</h1>
          <p className="text-responsive-sm text-muted-foreground mt-1">
            Multi-warehouse inventory tracking and stock management
          </p>
        </div>
        <div className="flex items-center gap-2 mobile-action-buttons sm:flex-row sm:space-y-0">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Stock Transfer
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <InventoryForm onSuccess={() => setShowCreateDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Warehouse Overview */}
      <div className="grid gap-3 sm:gap-4 grid-responsive-3 lg:grid-cols-6">
        {warehouseDisplayData.map((warehouse) => (
          <Card key={warehouse.id}>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${warehouse.color}`} />
                <div>
                  <p className="text-sm font-medium">{warehouse.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {safeProducts.filter((p) => {
                      const warehouseKey = warehouse.id.toLowerCase() + 'Warehouse';
                      return parseFloat((p as any)[warehouseKey] || '0') > 0;
                    }).length} items
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert ({lowStockItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Some items are running low on stock. Consider reordering soon.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Inventory ({safeProducts.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>NG</TableHead>
                <TableHead>PH</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Package className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No products found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                safeProducts.map((product) => {
                  const totalStock = parseFloat(product.ngWarehouse || '0') + 
                                   parseFloat(product.phWarehouse || '0');
                  const isLowStock = totalStock < parseFloat(product.lowStockThreshold || '10');
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.hairType || 'Hair'}</Badge>
                      </TableCell>
                      <TableCell>{product.ngWarehouse || '0'}</TableCell>
                      <TableCell>{product.phWarehouse || '0'}</TableCell>
                      <TableCell>{product.reservedWarehouse || '0'}</TableCell>
                      <TableCell className="font-medium">{totalStock}</TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}