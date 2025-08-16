import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  Warehouse,
  TrendingDown,
  AlertCircle,
  BarChart3,
  ArrowUpDown,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  Monitor,
  FolderTree,
  Package2,
  ArrowRight,
} from 'lucide-react';
import { useLocation } from 'wouter';

export function InventoryWarehouseDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLocation] = useLocation();

  // Fetch inventory data
  const { data: warehouses = [] } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: inventoryTransactions = [] } = useQuery({
    queryKey: ['/api/inventory/transactions'],
  });

  // Calculate inventory metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter((product: any) => 
    product.stockLevel <= product.reorderPoint
  ).length;
  const totalWarehouses = warehouses.length;
  const totalInventoryValue = products.reduce((sum: number, product: any) => 
    sum + (product.stockLevel * product.price), 0
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory & Warehouse Management</h1>
          <p className="text-muted-foreground">
            Monitor stock levels, manage warehouses, and track inventory movements
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/warehouse-transfers')}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Transfer Stock
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Inventory Report
          </Button>
        </div>
      </div>

      {/* Inventory KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across all warehouses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products below reorder point
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">
              Active storage locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total stock value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500"
              onClick={() => setLocation('/assets')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-purple-600" />
                    Assets Management
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Track company equipment, tools, and assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage Assets</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Monitor equipment, assign to staff, track maintenance
                </p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500"
              onClick={() => setLocation('/categories')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-blue-600" />
                    Categories
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Organize products, equipment, and supplies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage Categories</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Create and manage categories for all inventory types
                </p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package2 className="h-5 w-5 text-green-600" />
                    Inventory Tracking
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Monitor stock levels and movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Track Inventory</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Real-time stock levels across all warehouses
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Products requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .filter((product: any) => product.stockLevel <= product.reorderPoint)
                    .slice(0, 5)
                    .map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stockLevel} | Reorder at: {product.reorderPoint}
                          </p>
                        </div>
                        <Badge variant="destructive">Low Stock</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Utilization</CardTitle>
                <CardDescription>Current storage capacity usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouses.map((warehouse: any) => {
                    const utilization = Math.random() * 100; // Mock utilization
                    return (
                      <div key={warehouse.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{warehouse.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {utilization.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={utilization} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Current stock levels and product information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: any) => {
                    const isLowStock = product.stockLevel <= product.reorderPoint;
                    const stockValue = product.stockLevel * product.price;
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stockLevel}</TableCell>
                        <TableCell>{product.reorderPoint}</TableCell>
                        <TableCell>${stockValue.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={isLowStock ? 'destructive' : 'default'}>
                            {isLowStock ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Locations</CardTitle>
              <CardDescription>Manage warehouse facilities and locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse: any) => {
                    const utilization = Math.random() * 100; // Mock utilization
                    
                    return (
                      <TableRow key={warehouse.id}>
                        <TableCell className="font-medium">{warehouse.name}</TableCell>
                        <TableCell>{warehouse.location}</TableCell>
                        <TableCell>{warehouse.type}</TableCell>
                        <TableCell>10,000 sq ft</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={utilization} className="w-16" />
                            <span className="text-sm">{utilization.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Transactions</CardTitle>
              <CardDescription>Track all inventory movements and transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mock transaction data */}
                  {[
                    {
                      id: 1,
                      date: '2025-01-14',
                      type: 'Stock In',
                      product: '12" Closure 4x4 Real',
                      quantity: '+50',
                      location: 'Main Warehouse',
                      reference: 'PO-2025-001',
                      status: 'Completed'
                    },
                    {
                      id: 2,
                      date: '2025-01-14',
                      type: 'Transfer',
                      product: '14" Straight Bundle',
                      quantity: '25',
                      location: 'Main → Reserved',
                      reference: 'SO-2025.01.003',
                      status: 'Completed'
                    },
                    {
                      id: 3,
                      date: '2025-01-13',
                      type: 'Stock Out',
                      product: '16" Body Wave Bundle',
                      quantity: '-30',
                      location: 'Reserved Warehouse',
                      reference: 'JO-2025.01.002',
                      status: 'Completed'
                    }
                  ].map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.type === 'Stock In' ? 'default' :
                            transaction.type === 'Transfer' ? 'secondary' : 'outline'
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell className={transaction.quantity.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {transaction.quantity}
                      </TableCell>
                      <TableCell>{transaction.location}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>
                        <Badge variant="default">{transaction.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}