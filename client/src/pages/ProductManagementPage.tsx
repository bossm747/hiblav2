import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Layers,
} from 'lucide-react';
import type { Product, InsertProduct } from '@shared/schema';

export default function ProductManagementPage() {
  const { toast } = useToast();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState<InsertProduct>({
    name: '',
    description: '',
    categoryId: '',
    hairType: 'human',
    texture: 'straight',
    length: 8,
    color: '',
    weight: '',
    sku: '',
    unit: 'pcs',
    basePrice: '0.00',
    srp: '0.00',
    ngWarehouse: '0',
    phWarehouse: '0',
    reservedWarehouse: '0',
    redWarehouse: '0',
    adminWarehouse: '0',
    wipWarehouse: '0',
    lowStockThreshold: '5',
    isActive: true,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    product.hairType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      return apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product Created',
        description: 'New product has been successfully added.',
      });
      setIsProductModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (productData: Product) => {
      return apiRequest(`/api/products/${productData.id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product Updated',
        description: 'Product has been successfully updated.',
      });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      resetForm();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest(`/api/products/${productId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product Deleted',
        description: 'Product has been successfully removed.',
      });
    },
  });

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      categoryId: '',
      hairType: 'human',
      texture: 'straight',
      length: 8,
      color: '',
      weight: '',
      sku: '',
      unit: 'pcs',
      basePrice: '0.00',
      srp: '0.00',
      ngWarehouse: '0',
      phWarehouse: '0',
      reservedWarehouse: '0',
      redWarehouse: '0',
      adminWarehouse: '0',
      wipWarehouse: '0',
      lowStockThreshold: '5',
      isActive: true,
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    resetForm();
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      hairType: product.hairType,
      texture: product.texture || 'straight',
      length: product.length || 8,
      color: product.color || '',
      weight: product.weight || '',
      sku: product.sku || '',
      unit: product.unit,
      basePrice: product.basePrice,
      srp: product.srp || '0.00',
      ngWarehouse: product.ngWarehouse,
      phWarehouse: product.phWarehouse,
      reservedWarehouse: product.reservedWarehouse,
      redWarehouse: product.redWarehouse,
      adminWarehouse: product.adminWarehouse,
      wipWarehouse: product.wipWarehouse,
      lowStockThreshold: product.lowStockThreshold,
      isActive: product.isActive,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate({
        ...newProduct,
        id: editingProduct.id,
        createdAt: editingProduct.createdAt,
        updatedAt: new Date(),
      } as Product);
    } else {
      createProductMutation.mutate(newProduct);
    }
  };

  const getTotalStock = (product: Product) => {
    return (
      parseFloat(product.ngWarehouse) +
      parseFloat(product.phWarehouse) +
      parseFloat(product.reservedWarehouse) +
      parseFloat(product.redWarehouse) +
      parseFloat(product.adminWarehouse) +
      parseFloat(product.wipWarehouse)
    );
  };

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p: Product) => p.isActive).length,
    lowStock: products.filter((p: Product) => 
      getTotalStock(p) <= parseFloat(p.lowStockThreshold)
    ).length,
    totalValue: products.reduce((sum: number, p: Product) => 
      sum + (getTotalStock(p) * parseFloat(p.basePrice)), 0
    ),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your Filipino hair product catalog and inventory
          </p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Products</p>
                <p className="text-2xl font-bold">{stats.activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product List */}
      <Card className="elevated-container">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name, SKU, or hair type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products found.</p>
              <Button onClick={handleAddProduct} className="mt-4">
                Add First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Hair Type</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: Product) => {
                    const totalStock = getTotalStock(product);
                    const isLowStock = totalStock <= parseFloat(product.lowStockThreshold);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.texture} • {product.length}" • {product.color}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.hairType}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {product.sku || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">${product.basePrice}</div>
                            {product.srp && (
                              <div className="text-sm text-muted-foreground">
                                SRP: ${product.srp}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isLowStock ? 'destructive' : 'secondary'}>
                            {totalStock.toFixed(1)} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Hair Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hair Specifications</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="texture">Texture</Label>
                  <Select
                    value={newProduct.texture}
                    onValueChange={(value) => setNewProduct({ ...newProduct, texture: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select texture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="wavy">Wavy</SelectItem>
                      <SelectItem value="curly">Curly</SelectItem>
                      <SelectItem value="kinky">Kinky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length (inches)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={newProduct.length}
                    onChange={(e) => setNewProduct({ ...newProduct, length: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="Enter hair color"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="Enter weight (e.g., 100g)"
                    value={newProduct.weight}
                    onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={newProduct.unit}
                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="bundles">Bundles</SelectItem>
                      <SelectItem value="closures">Closures</SelectItem>
                      <SelectItem value="frontals">Frontals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (USD) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srp">Suggested Retail Price (USD)</Label>
                  <Input
                    id="srp"
                    type="number"
                    step="0.01"
                    value={newProduct.srp}
                    onChange={(e) => setNewProduct({ ...newProduct, srp: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Warehouse Inventory</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ngWarehouse">NG Warehouse</Label>
                  <Input
                    id="ngWarehouse"
                    type="number"
                    step="0.1"
                    value={newProduct.ngWarehouse}
                    onChange={(e) => setNewProduct({ ...newProduct, ngWarehouse: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phWarehouse">PH Warehouse</Label>
                  <Input
                    id="phWarehouse"
                    type="number"
                    step="0.1"
                    value={newProduct.phWarehouse}
                    onChange={(e) => setNewProduct({ ...newProduct, phWarehouse: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservedWarehouse">Reserved Warehouse</Label>
                  <Input
                    id="reservedWarehouse"
                    type="number"
                    step="0.1"
                    value={newProduct.reservedWarehouse}
                    onChange={(e) => setNewProduct({ ...newProduct, reservedWarehouse: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="redWarehouse">Red Warehouse</Label>
                  <Input
                    id="redWarehouse"
                    type="number"
                    step="0.1"
                    value={newProduct.redWarehouse}
                    onChange={(e) => setNewProduct({ ...newProduct, redWarehouse: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminWarehouse">Admin Warehouse</Label>
                  <Input
                    id="adminWarehouse"
                    type="number"
                    step="0.1"
                    value={newProduct.adminWarehouse}
                    onChange={(e) => setNewProduct({ ...newProduct, adminWarehouse: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wipWarehouse">WIP Warehouse</Label>
                  <Input
                    id="wipWarehouse"
                    type="number"
                    step="0.1"
                    value={newProduct.wipWarehouse}
                    onChange={(e) => setNewProduct({ ...newProduct, wipWarehouse: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  step="0.1"
                  value={newProduct.lowStockThreshold}
                  onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newProduct.isActive}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isActive: checked })}
              />
              <Label htmlFor="isActive">Active Product</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProduct}
              disabled={!newProduct.name || !newProduct.basePrice}
            >
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}