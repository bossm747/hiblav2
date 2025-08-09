import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  DollarSign, 
  Ruler, 
  Palette,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from '@/components/forms/ProductForm';
import { ProductDetailModal } from '@/components/ProductDetailModal';

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  hairType: string;
  texture?: string;
  length?: number;
  color?: string;
  weight?: string;
  unit: string;
  basePrice: string;
  costPrice?: string;
  priceListA?: string;
  priceListB?: string;
  priceListC?: string;
  priceListD?: string;
  lowStockThreshold?: string;
  isActive: boolean;
  createdAt: string;
}

export function ProductsManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Type-safe data access
  const safeProducts = products as Product[];
  const safeCategories = categories as Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  // Filter products based on search
  const filteredProducts = safeProducts.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.hairType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    totalProducts: safeProducts.length,
    activeProducts: safeProducts.filter(p => p.isActive).length,
    lowStockItems: safeProducts.filter(p => 
      parseFloat(p.lowStockThreshold || '10') > 5
    ).length,
    avgPrice: safeProducts.length > 0 
      ? (safeProducts.reduce((sum, p) => sum + parseFloat(p.basePrice || '0'), 0) / safeProducts.length).toFixed(2)
      : '0'
  };

  const toggleProductStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest(`/api/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Product status updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update product status',
        variant: 'destructive',
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/products/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setShowEditDialog(true);
  };

  const handleView = (productId: string) => {
    setSelectedProductId(productId);
    setShowDetailModal(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products Management</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">
            Manage Filipino hair product catalog with pricing and specifications
          </p>
        </div>
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
            <ProductForm onSuccess={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="text-xs text-muted-foreground">
              Filipino hair products
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
            <div className="text-xs text-muted-foreground">
              Ready for quotations
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
            <div className="text-xs text-muted-foreground">
              Need attention
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgPrice}</div>
            <div className="text-xs text-muted-foreground">
              Base pricing
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products, SKU, hair type..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge variant="outline">{filteredProducts.length} products</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Catalog ({filteredProducts.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Details</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Stock Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Package className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'No products match your search' : 'No products found'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <button
                          onClick={() => handleView(product.id)}
                          className="font-medium text-left hover:text-primary cursor-pointer"
                        >
                          {product.name}
                        </button>
                        <p className="text-sm text-muted-foreground">
                          {product.description || 'Premium Filipino hair'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {product.hairType || 'Human'}
                        </div>
                        {product.texture && (
                          <div className="flex items-center text-xs">
                            <Palette className="h-3 w-3 mr-1" />
                            {product.texture}
                          </div>
                        )}
                        {product.length && (
                          <div className="flex items-center text-xs">
                            <Ruler className="h-3 w-3 mr-1" />
                            {product.length}"
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {parseFloat(product.basePrice || '0').toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Base price ({product.unit || 'pcs'})
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {parseFloat(product.lowStockThreshold || '10') > 5 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        {product.lowStockThreshold || '10'} units
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(product.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductStatus.mutate({
                            id: product.id,
                            isActive: !product.isActive
                          })}
                          disabled={toggleProductStatus.isPending}
                        >
                          {product.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            productId={editingProductId || undefined}
            onSuccess={() => {
              setShowEditDialog(false);
              setEditingProductId(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <ProductDetailModal
        productId={selectedProductId}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
}