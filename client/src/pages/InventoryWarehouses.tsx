import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  ArrowLeftRight, 
  Package2, 
  Warehouse, 
  Zap,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function InventoryWarehouses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');

  // Fetch inventory data
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json();
    },
  });

  // Fetch warehouse data
  const { data: warehouses, isLoading: warehousesLoading } = useQuery({
    queryKey: ['/api/warehouses'],
    queryFn: async () => {
      const response = await fetch('/api/warehouses');
      if (!response.ok) throw new Error('Failed to fetch warehouses');
      return response.json();
    },
  });

  // Fetch products data
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const getStockStatusColor = (level: string) => {
    const colors = {
      'low': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'normal': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'high': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'out': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    };
    return colors[level as keyof typeof colors] || colors.normal;
  };

  // Calculate total inventory value and low stock count
  const totalInventoryValue = inventoryData?.reduce((sum: number, item: any) => 
    sum + (item.quantity * item.unitCost || 0), 0) || 0;
  const lowStockCount = inventoryData?.filter((item: any) => item.stockLevel === 'low').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory & Warehouses</h1>
          <p className="text-muted-foreground">
            Manage stock levels, transfers, and warehouse operations across 6 locations
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Stock Transfer</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products?.length || 0}</p>
              </div>
              <Package2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Warehouses</p>
                <p className="text-2xl font-bold">{warehouses?.length || 6}</p>
              </div>
              <Warehouse className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
                <p className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inventory">Current Stock</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
          <TabsTrigger value="products">Product Master</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory, products, warehouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Stock Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Current Stock Levels</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inventoryLoading ? (
                  <div className="text-center py-8">Loading inventory...</div>
                ) : (
                  <div className="space-y-4">
                    {inventoryData?.slice(0, 8).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                          <div className="text-sm text-muted-foreground">Warehouse: {item.warehouseLocation}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.quantity} units</div>
                          <Badge className={getStockStatusColor(item.stockLevel)}>
                            {item.stockLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline">View Full Inventory</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warehouse Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Warehouse className="h-5 w-5" />
                  <span>Warehouse Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'NG Warehouse', utilization: 85, capacity: '10,000', current: '8,500' },
                    { name: 'PH Warehouse', utilization: 72, capacity: '15,000', current: '10,800' },
                    { name: 'Reserved Warehouse', utilization: 45, capacity: '5,000', current: '2,250' },
                    { name: 'Red Warehouse', utilization: 60, capacity: '8,000', current: '4,800' },
                    { name: 'Admin Warehouse', utilization: 30, capacity: '2,000', current: '600' },
                    { name: 'WIP Warehouse', utilization: 90, capacity: '12,000', current: '10,800' }
                  ].map((warehouse) => (
                    <div key={warehouse.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{warehouse.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {warehouse.current}/{warehouse.capacity} units
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${warehouse.utilization}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {warehouse.utilization}% utilized
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowLeftRight className="h-5 w-5" />
                <span>Stock Transfers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ArrowLeftRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Manage stock transfers between warehouses</p>
                <Button className="mt-4">Create Transfer Request</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package2 className="h-5 w-5" />
                <span>Product Master Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : (
                <div className="space-y-4">
                  {products?.slice(0, 6).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                        <div className="text-sm text-muted-foreground">Category: {product.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${product.price}</div>
                        <div className="text-sm text-muted-foreground">Unit Price</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline">View All Products</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Warehouse className="h-5 w-5" />
                <span>Warehouse Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'NG Warehouse', manager: 'Custodian', access: 'Manager', status: 'Active' },
                  { name: 'PH Warehouse', manager: 'Custodian', access: 'Manager', status: 'Active' },
                  { name: 'Reserved Warehouse', manager: 'Custodian', access: 'Manager Only', status: 'Active' },
                  { name: 'Red Warehouse', manager: 'Custodian', access: 'Manager Only', status: 'Active' },
                  { name: 'Admin', manager: 'Custodian', access: 'Admin Only', status: 'Active' },
                  { name: 'WIP Warehouse', manager: 'Custodian', access: 'Manager Only', status: 'Active' }
                ].map((warehouse) => (
                  <Card key={warehouse.name} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium">{warehouse.name}</div>
                        <div className="text-sm text-muted-foreground">Manager: {warehouse.manager}</div>
                        <div className="text-sm text-muted-foreground">Access: {warehouse.access}</div>
                        <Badge className={getStockStatusColor('normal')}>
                          {warehouse.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI Inventory Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <p className="text-muted-foreground">AI-powered demand forecasting and inventory optimization</p>
                <Button className="mt-4">Generate Insights</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}