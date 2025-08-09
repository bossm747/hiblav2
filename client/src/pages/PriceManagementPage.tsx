import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, DollarSign, Edit, Package, Plus, Settings, TrendingUp, Calculator, Eye } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  sku?: string;
  categoryId: string;
  basePrice: number;
  srp?: number;
  unit: string;
  isActive: boolean;
}

interface PriceList {
  id: string;
  name: string;
  code: string;
  description?: string;
  priceMultiplier: number;
  isDefault: boolean;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductPriceList {
  id: string;
  productId: string;
  priceListId: string;
  customPrice?: number;
  markup?: number;
  isActive: boolean;
}

export default function PriceManagementPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPriceList, setSelectedPriceList] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch data
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: priceLists = [] } = useQuery<PriceList[]>({
    queryKey: ['/api/price-lists'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: productPrices = [] } = useQuery<ProductPriceList[]>({
    queryKey: ['/api/product-price-lists'],
  });

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedCategory && selectedCategory !== 'all' && product.categoryId !== selectedCategory) return false;
    return true;
  });

  // Calculate pricing statistics
  const pricingStats = {
    totalProducts: products.length,
    withCustomPricing: productPrices.filter(pp => pp.customPrice).length,
    activePriceLists: priceLists.filter(pl => pl.isActive).length,
    averageBasePrice: products.length > 0 ? products.reduce((sum, p) => sum + Number(p.basePrice || 0), 0) / products.length : 0,
  };

  // Get effective price for a product in a price list
  const getEffectivePrice = (product: Product, priceListId: string): number => {
    const customPrice = productPrices.find(pp => 
      pp.productId === product.id && pp.priceListId === priceListId
    );
    
    if (customPrice?.customPrice) {
      return customPrice.customPrice;
    }
    
    const priceList = priceLists.find(pl => pl.id === priceListId);
    if (priceList) {
      // Use SRP as base price for the showcase pricing system
      const basePrice = Number(product.srp || product.basePrice || 0);
      return basePrice * Number(priceList.priceMultiplier);
    }
    
    return Number(product.srp || product.basePrice || 0);
  };

  const updateProductPriceMutation = useMutation({
    mutationFn: async (data: {
      productId: string;
      priceListId: string;
      customPrice?: number;
      markup?: number;
    }) => {
      return apiRequest('/api/product-price-lists', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/product-price-lists'] });
      toast({
        title: 'Price Updated',
        description: 'Product pricing has been successfully updated.',
      });
      setIsProductModalOpen(false);
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Failed to update product pricing.',
        variant: 'destructive',
      });
    },
  });

  const bulkUpdatePricesMutation = useMutation({
    mutationFn: async (data: {
      categoryId?: string;
      priceListId: string;
      action: 'percentage' | 'fixed_amount';
      value: number;
    }) => {
      return apiRequest('/api/product-price-lists/bulk-update', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/product-price-lists'] });
      toast({
        title: 'Bulk Update Complete',
        description: 'Pricing has been updated for selected products.',
      });
      setIsBulkUpdateModalOpen(false);
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Failed to perform bulk price update.',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Management</h1>
          <p className="text-muted-foreground">
            Manage product pricing across different customer price lists
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsBulkUpdateModalOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Bulk Update
          </Button>
        </div>
      </div>

      {/* Pricing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold">{pricingStats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Custom Pricing</p>
                <p className="text-2xl font-bold">{pricingStats.withCustomPricing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Price Lists</p>
                <p className="text-2xl font-bold">{pricingStats.activePriceLists}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Avg Base Price</p>
                <p className="text-2xl font-bold">${pricingStats.averageBasePrice.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Product Pricing</TabsTrigger>
          <TabsTrigger value="matrix">Price Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Category Filter</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Price List</Label>
                  <Select value={selectedPriceList} onValueChange={setSelectedPriceList}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Price List" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceLists.map((priceList) => (
                        <SelectItem key={priceList.id} value={priceList.id}>
                          {priceList.name} ({priceList.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPriceList('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Pricing</CardTitle>
              <CardDescription>
                Manage individual product prices across different customer price lists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>SRP</TableHead>
                    {selectedPriceList && (
                      <TableHead>
                        {priceLists.find(pl => pl.id === selectedPriceList)?.name} Price
                      </TableHead>
                    )}
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.unit}</p>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku || 'N/A'}</TableCell>
                      <TableCell>${Number(product.basePrice || 0).toFixed(2)}</TableCell>
                      <TableCell>{product.srp ? `$${Number(product.srp).toFixed(2)}` : 'N/A'}</TableCell>
                      {selectedPriceList && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>${Number(getEffectivePrice(product, selectedPriceList)).toFixed(2)}</span>
                            {productPrices.find(pp => 
                              pp.productId === product.id && pp.priceListId === selectedPriceList && pp.customPrice
                            ) && (
                              <Badge variant="secondary" className="text-xs">Custom</Badge>
                            )}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsProductModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Matrix</CardTitle>
              <CardDescription>
                View pricing across all price lists for easy comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Base Price</TableHead>
                      {priceLists.map((priceList) => (
                        <TableHead key={priceList.id}>
                          {priceList.name}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            ({Number(priceList.priceMultiplier)}x)
                          </span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.slice(0, 10).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${Number(product.basePrice || 0).toFixed(2)}
                        </TableCell>
                        {priceLists.map((priceList) => (
                          <TableCell key={priceList.id}>
                            <div className="flex items-center gap-1">
                              <span>${Number(getEffectivePrice(product, priceList.id)).toFixed(2)}</span>
                              {productPrices.find(pp => 
                                pp.productId === product.id && pp.priceListId === priceList.id && pp.customPrice
                              ) && (
                                <Badge variant="outline" className="text-xs">C</Badge>
                              )}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredProducts.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Showing first 10 products. Use filters to narrow down the list.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Pricing Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product Pricing</DialogTitle>
            <DialogDescription>
              Customize pricing for {selectedProduct?.name} across different price lists
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProduct && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Price</Label>
                  <Input value={`$${Number(selectedProduct.basePrice || 0).toFixed(2)}`} disabled />
                </div>
                <div>
                  <Label>SRP</Label>
                  <Input value={selectedProduct.srp ? `$${Number(selectedProduct.srp).toFixed(2)}` : 'Not set'} disabled />
                </div>
              </div>
            )}
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Price List Customization</h4>
              {priceLists.map((priceList) => (
                <div key={priceList.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{priceList.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Default: ${selectedProduct ? (Number(selectedProduct.srp || selectedProduct.basePrice || 0) * Number(priceList.priceMultiplier)).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={selectedProduct ? Number(selectedProduct.srp || selectedProduct.basePrice || 0).toFixed(2) : 'SRP Price'}
                      className="w-32"
                    />
                    <Button size="sm" variant="outline">
                      Set
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Modal */}
      <Dialog open={isBulkUpdateModalOpen} onOpenChange={setIsBulkUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Price Update</DialogTitle>
            <DialogDescription>
              Apply pricing changes to multiple products at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price List</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Price List" />
                </SelectTrigger>
                <SelectContent>
                  {priceLists.map((priceList) => (
                    <SelectItem key={priceList.id} value={priceList.id}>
                      {priceList.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Update Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select update type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Increase/Decrease</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount Increase/Decrease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input type="number" placeholder="Enter value" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button>Apply Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}