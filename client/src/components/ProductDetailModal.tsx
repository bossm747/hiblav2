import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Barcode from 'react-barcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package,
  DollarSign,
  Ruler,
  Palette,
  Tag,
  Warehouse,
  AlertTriangle,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Copy,
  TrendingUp,
  History,
  Power,
  Printer,
  Trash2,
  BarChart3,
} from 'lucide-react';

interface ProductDetailModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

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
  ngWarehouse?: string;
  phWarehouse?: string;
  reservedWarehouse?: string;
  redWarehouse?: string;
  adminWarehouse?: string;
  wipWarehouse?: string;
  lowStockThreshold?: string;
  featuredImage?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
}

export function ProductDetailModal({ productId, isOpen, onClose }: ProductDetailModalProps) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', productId],
    enabled: !!productId && isOpen,
  });

  if (!productId || !isOpen) return null;

  const safeProduct = product as Product;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Product...</DialogTitle>
            <DialogDescription>
              Please wait while we load the product details
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!safeProduct) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Not Found</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Calculate total stock across warehouses
  const totalStock = [
    'ngWarehouse',
    'phWarehouse', 
    'reservedWarehouse',
    'redWarehouse',
    'adminWarehouse',
    'wipWarehouse'
  ].reduce((sum, warehouse) => {
    return sum + parseFloat(safeProduct[warehouse as keyof Product] as string || '0');
  }, 0);

  const isLowStock = totalStock < parseFloat(safeProduct.lowStockThreshold || '10');

  // Warehouse data for display
  const warehouseData = [
    { name: 'NG Warehouse', key: 'ngWarehouse', color: 'bg-blue-500' },
    { name: 'PH Warehouse', key: 'phWarehouse', color: 'bg-green-500' },
    { name: 'Reserved', key: 'reservedWarehouse', color: 'bg-yellow-500' },
    { name: 'Red', key: 'redWarehouse', color: 'bg-red-500' },
    { name: 'Admin', key: 'adminWarehouse', color: 'bg-purple-500' },
    { name: 'WIP', key: 'wipWarehouse', color: 'bg-orange-500' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {safeProduct.name}
            {safeProduct.isActive ? (
              <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">Active</Badge>
            ) : (
              <Badge variant="secondary" className="ml-2">Inactive</Badge>
            )}
          </DialogTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Product
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <TrendingUp className="h-4 w-4 mr-2" />
                Adjust Stock
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <History className="h-4 w-4 mr-2" />
                View History
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                Sales Analytics
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print Barcode
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Power className="h-4 w-4 mr-2" />
                {safeProduct.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Image */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  {safeProduct.featuredImage ? (
                    <img
                      src={safeProduct.featuredImage}
                      alt={safeProduct.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No image available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SKU Barcode */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">SKU Barcode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center bg-white p-4 rounded-lg">
                  {safeProduct.sku ? (
                    <Barcode
                      value={safeProduct.sku}
                      width={2}
                      height={50}
                      fontSize={12}
                      background="#ffffff"
                      lineColor="#000000"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No SKU available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Product Details */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{safeProduct.description || 'Premium Filipino hair product'}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SKU</p>
                    <p className="text-sm font-mono">{safeProduct.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unit</p>
                    <p className="text-sm">{safeProduct.unit}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 mr-2" />
                    <span className="font-medium">Hair Type:</span>
                    <span className="ml-2">{safeProduct.hairType}</span>
                  </div>
                  
                  {safeProduct.texture && (
                    <div className="flex items-center text-sm">
                      <Palette className="h-4 w-4 mr-2" />
                      <span className="font-medium">Texture:</span>
                      <span className="ml-2">{safeProduct.texture}</span>
                    </div>
                  )}
                  
                  {safeProduct.length && (
                    <div className="flex items-center text-sm">
                      <Ruler className="h-4 w-4 mr-2" />
                      <span className="font-medium">Length:</span>
                      <span className="ml-2">{safeProduct.length}"</span>
                    </div>
                  )}
                  
                  {safeProduct.color && (
                    <div className="flex items-center text-sm">
                      <Palette className="h-4 w-4 mr-2" />
                      <span className="font-medium">Color:</span>
                      <span className="ml-2">{safeProduct.color}</span>
                    </div>
                  )}
                  
                  {safeProduct.weight && (
                    <div className="flex items-center text-sm">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="font-medium">Weight:</span>
                      <span className="ml-2">{safeProduct.weight}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pricing (USD)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                    <p className="text-lg font-bold">${parseFloat(safeProduct.basePrice || '0').toFixed(2)}</p>
                  </div>
                  {safeProduct.costPrice && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                      <p className="text-sm">${parseFloat(safeProduct.costPrice).toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {safeProduct.priceListA && (
                    <div>
                      <span className="text-muted-foreground">Price List A:</span>
                      <span className="ml-1">${parseFloat(safeProduct.priceListA).toFixed(2)}</span>
                    </div>
                  )}
                  {safeProduct.priceListB && (
                    <div>
                      <span className="text-muted-foreground">Price List B:</span>
                      <span className="ml-1">${parseFloat(safeProduct.priceListB).toFixed(2)}</span>
                    </div>
                  )}
                  {safeProduct.priceListC && (
                    <div>
                      <span className="text-muted-foreground">Price List C:</span>
                      <span className="ml-1">${parseFloat(safeProduct.priceListC).toFixed(2)}</span>
                    </div>
                  )}
                  {safeProduct.priceListD && (
                    <div>
                      <span className="text-muted-foreground">Price List D:</span>
                      <span className="ml-1">${parseFloat(safeProduct.priceListD).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Inventory */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Warehouse className="h-4 w-4 mr-2" />
                  Warehouse Inventory
                  {isLowStock && (
                    <AlertTriangle className="h-4 w-4 ml-2 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{totalStock}</p>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  {isLowStock && (
                    <Badge variant="destructive" className="mt-1">
                      Low Stock Alert
                    </Badge>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  {warehouseData.map((warehouse) => {
                    const stock = parseFloat(safeProduct[warehouse.key as keyof Product] as string || '0');
                    return (
                      <div key={warehouse.key} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${warehouse.color} mr-2`} />
                          <span className="text-sm">{warehouse.name}</span>
                        </div>
                        <span className="text-sm font-medium">{stock}</span>
                      </div>
                    );
                  })}
                </div>
                
                <Separator />
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Low Stock Threshold:</span>
                  <span className="ml-2 font-medium">{safeProduct.lowStockThreshold || '10'} units</span>
                </div>
              </CardContent>
            </Card>

            {/* Additional Images */}
            {safeProduct.images && safeProduct.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Additional Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {safeProduct.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${safeProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}