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
import { AlertTriangle, DollarSign, Edit, Package, Plus, Settings, TrendingUp, Calculator, Eye, Trash2, Pencil } from 'lucide-react';
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
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPriceListCrudModalOpen, setIsPriceListCrudModalOpen] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState<PriceList | null>(null);
  const [isAddPriceListModalOpen, setIsAddPriceListModalOpen] = useState(false);
  const [isBulkPricingModalOpen, setIsBulkPricingModalOpen] = useState(false);
  const [isCustomPricingModalOpen, setIsCustomPricingModalOpen] = useState(false);
  const [newPriceListData, setNewPriceListData] = useState({
    name: '',
    code: '',
    description: '',
    priceMultiplier: 1.0,
  });
  const [bulkPricingData, setBulkPricingData] = useState({
    priceListId: '',
    action: 'add', // 'add', 'discount', 'custom'
    percentage: 0,
  });
  const [customPrices, setCustomPrices] = useState<{[productId: string]: number}>({});
  const { toast } = useToast();

  // Fetch data
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: priceLists = [] } = useQuery<PriceList[]>({
    queryKey: ['/api/price-lists'],
  });

  const { data: productPrices = [] } = useQuery<ProductPriceList[]>({
    queryKey: ['/api/product-price-lists'],
  });

  // All products (no filtering needed)
  const filteredProducts = products;

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

  const addPriceListMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      code: string;
      description?: string;
      priceMultiplier: number;
    }) => {
      return apiRequest('/api/price-lists', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          isDefault: false,
          isActive: true,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/price-lists'] });
      toast({
        title: 'Price List Added',
        description: 'New price list has been successfully created.',
      });
      setIsAddPriceListModalOpen(false);
      setNewPriceListData({
        name: '',
        code: '',
        description: '',
        priceMultiplier: 1.0,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to Create',
        description: 'Failed to create new price list.',
        variant: 'destructive',
      });
    },
  });

  const bulkPricingMutation = useMutation({
    mutationFn: async (data: {
      priceListId: string;
      action: string;
      percentage: number;
    }) => {
      return apiRequest('/api/product-price-lists/bulk-pricing', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/product-price-lists'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Bulk Pricing Applied',
        description: 'Pricing changes have been successfully applied to all products.',
      });
      setIsBulkPricingModalOpen(false);
      setBulkPricingData({
        priceListId: '',
        action: 'add',
        percentage: 0,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to Apply',
        description: 'Failed to apply bulk pricing changes.',
        variant: 'destructive',
      });
    },
  });

  const customPricingMutation = useMutation({
    mutationFn: async (data: {
      priceListId: string;
      customPrices: {[productId: string]: number};
    }) => {
      return apiRequest('/api/product-price-lists/custom-pricing', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/product-price-lists'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Custom Pricing Saved',
        description: 'Individual product prices have been successfully updated.',
      });
      setIsCustomPricingModalOpen(false);
      setCustomPrices({});
    },
    onError: () => {
      toast({
        title: 'Failed to Save',
        description: 'Failed to save custom pricing changes.',
        variant: 'destructive',
      });
    },
  });

  const updatePriceListMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      code: string;
      description?: string;
      priceMultiplier: number;
    }) => {
      return apiRequest(`/api/price-lists/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/price-lists'] });
      toast({
        title: 'Price List Updated',
        description: 'Price list has been successfully updated.',
      });
      setEditingPriceList(null);
      setIsPriceListCrudModalOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to Update',
        description: 'Failed to update price list.',
        variant: 'destructive',
      });
    },
  });

  const deletePriceListMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/price-lists/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/price-lists'] });
      toast({
        title: 'Price List Deleted',
        description: 'Price list has been successfully deleted.',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to Delete',
        description: 'Failed to delete price list.',
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
          <Button onClick={() => setIsAddPriceListModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Price List
          </Button>
          <Button variant="outline" onClick={() => setIsBulkPricingModalOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Bulk Pricing
          </Button>
          <Button variant="outline" onClick={() => setIsCustomPricingModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Custom Pricing
          </Button>
          <Button variant="outline" onClick={() => setIsPriceListCrudModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Price Lists
          </Button>
        </div>
      </div>

      {/* Pricing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="floating-card">
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
        <Card className="floating-card">
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
        <Card className="floating-card">
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
        <Card className="floating-card">
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
          {/* Price List Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Price List Filter</Label>
                  <Select value={selectedPriceList} onValueChange={setSelectedPriceList}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Price List to View Pricing" />
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
                  onClick={() => setSelectedPriceList('')}
                >
                  Clear Filter
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

      {/* Add Price List Modal */}
      <Dialog open={isAddPriceListModalOpen} onOpenChange={setIsAddPriceListModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Price List</DialogTitle>
            <DialogDescription>
              Create a new price list for customer tier pricing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="price-list-name">Price List Name</Label>
              <Input
                id="price-list-name"
                value={newPriceListData.name}
                onChange={(e) => setNewPriceListData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., VIP Customer, Wholesale"
                required
              />
            </div>
            <div>
              <Label htmlFor="price-list-code">Code</Label>
              <Input
                id="price-list-code"
                value={newPriceListData.code}
                onChange={(e) => setNewPriceListData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., VIP, WSL"
                required
              />
            </div>
            <div>
              <Label htmlFor="price-multiplier">Price Multiplier</Label>
              <Input
                id="price-multiplier"
                type="number"
                step="0.01"
                min="0.1"
                max="10"
                value={newPriceListData.priceMultiplier}
                onChange={(e) => setNewPriceListData(prev => ({ ...prev, priceMultiplier: Number(e.target.value) }))}
                placeholder="1.0 = SRP, 0.85 = 15% discount, 1.25 = 25% markup"
                required
              />
            </div>
            <div>
              <Label htmlFor="price-list-description">Description (Optional)</Label>
              <Input
                id="price-list-description"
                value={newPriceListData.description}
                onChange={(e) => setNewPriceListData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this price tier"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPriceListModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => addPriceListMutation.mutate(newPriceListData)}
              disabled={!newPriceListData.name || !newPriceListData.code || addPriceListMutation.isPending}
            >
              {addPriceListMutation.isPending ? 'Creating...' : 'Create Price List'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Pricing Modal */}
      <Dialog open={isBulkPricingModalOpen} onOpenChange={setIsBulkPricingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Pricing Management</DialogTitle>
            <DialogDescription>
              Apply percentage-based pricing changes to all products in a price list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-price-list">Select Price List</Label>
              <Select 
                value={bulkPricingData.priceListId}
                onValueChange={(value) => setBulkPricingData(prev => ({ ...prev, priceListId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a price list" />
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
              <Label htmlFor="bulk-action">Pricing Action</Label>
              <Select 
                value={bulkPricingData.action}
                onValueChange={(value) => setBulkPricingData(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Bulk Price Add (%)</SelectItem>
                  <SelectItem value="discount">Bulk Price Discount (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bulk-percentage">
                {bulkPricingData.action === 'add' ? 'Increase Percentage' : 'Discount Percentage'}
              </Label>
              <Input
                id="bulk-percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={bulkPricingData.percentage}
                onChange={(e) => setBulkPricingData(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                placeholder="e.g., 15 for 15%"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                {bulkPricingData.action === 'add' 
                  ? `All products will be increased by ${bulkPricingData.percentage}%`
                  : `All products will be discounted by ${bulkPricingData.percentage}%`
                }
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkPricingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => bulkPricingMutation.mutate(bulkPricingData)}
              disabled={!bulkPricingData.priceListId || !bulkPricingData.percentage || bulkPricingMutation.isPending}
            >
              {bulkPricingMutation.isPending ? 'Applying...' : 'Apply Bulk Pricing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Pricing Modal */}
      <Dialog open={isCustomPricingModalOpen} onOpenChange={setIsCustomPricingModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Custom Pricing Management</DialogTitle>
            <DialogDescription>
              Set individual prices for each product manually
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-price-list">Select Price List</Label>
              <Select value={selectedPriceList} onValueChange={setSelectedPriceList}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a price list for custom pricing" />
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
            
            {selectedPriceList && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current SRP</TableHead>
                      <TableHead>Custom Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sku || 'No SKU'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${Number(product.srp || product.basePrice || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={Number(product.srp || product.basePrice || 0).toFixed(2)}
                            value={customPrices[product.id] || ''}
                            onChange={(e) => setCustomPrices(prev => ({
                              ...prev,
                              [product.id]: Number(e.target.value)
                            }))}
                            className="w-32"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomPricingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => customPricingMutation.mutate({
                priceListId: selectedPriceList,
                customPrices
              })}
              disabled={!selectedPriceList || Object.keys(customPrices).length === 0 || customPricingMutation.isPending}
            >
              {customPricingMutation.isPending ? 'Saving...' : 'Save Custom Prices'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price List CRUD Management Modal */}
      <Dialog open={isPriceListCrudModalOpen} onOpenChange={setIsPriceListCrudModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Price Lists</DialogTitle>
            <DialogDescription>
              Create, edit, and delete price lists for your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Price Lists Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Multiplier</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceLists.map((priceList) => (
                    <TableRow key={priceList.id}>
                      <TableCell>
                        <div className="font-medium">{priceList.name}</div>
                        {priceList.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="px-2 py-1 bg-muted rounded text-sm">
                          {priceList.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          {Number(priceList.priceMultiplier).toFixed(2)}x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Number(priceList.priceMultiplier) > 1 
                            ? `+${((Number(priceList.priceMultiplier) - 1) * 100).toFixed(0)}%`
                            : Number(priceList.priceMultiplier) < 1
                            ? `-${((1 - Number(priceList.priceMultiplier)) * 100).toFixed(0)}%`
                            : 'Base Price'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {priceList.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priceList.isActive ? 'default' : 'secondary'}>
                          {priceList.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPriceList(priceList);
                              setNewPriceListData({
                                name: priceList.name,
                                code: priceList.code,
                                description: priceList.description || '',
                                priceMultiplier: Number(priceList.priceMultiplier),
                              });
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          {!priceList.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deletePriceListMutation.mutate(priceList.id)}
                              disabled={deletePriceListMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Edit Price List Form */}
            {editingPriceList && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Price List: {editingPriceList.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={newPriceListData.name}
                        onChange={(e) => setNewPriceListData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Premium Customer Pricing"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-code">Code</Label>
                      <Input
                        id="edit-code"
                        value={newPriceListData.code}
                        onChange={(e) => setNewPriceListData(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="e.g., PREMIUM"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-multiplier">Price Multiplier</Label>
                      <Input
                        id="edit-multiplier"
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="10"
                        value={newPriceListData.priceMultiplier}
                        onChange={(e) => setNewPriceListData(prev => ({ ...prev, priceMultiplier: Number(e.target.value) }))}
                        placeholder="1.0"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {newPriceListData.priceMultiplier > 1 
                          ? `${((newPriceListData.priceMultiplier - 1) * 100).toFixed(0)}% markup`
                          : newPriceListData.priceMultiplier < 1
                          ? `${((1 - newPriceListData.priceMultiplier) * 100).toFixed(0)}% discount`
                          : 'Base pricing'
                        }
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Input
                        id="edit-description"
                        value={newPriceListData.description}
                        onChange={(e) => setNewPriceListData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        updatePriceListMutation.mutate({
                          id: editingPriceList.id,
                          ...newPriceListData,
                        });
                      }}
                      disabled={!newPriceListData.name || !newPriceListData.code || updatePriceListMutation.isPending}
                    >
                      {updatePriceListMutation.isPending ? 'Updating...' : 'Update Price List'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPriceList(null);
                        setNewPriceListData({
                          name: '',
                          code: '',
                          description: '',
                          priceMultiplier: 1.0,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPriceListCrudModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}