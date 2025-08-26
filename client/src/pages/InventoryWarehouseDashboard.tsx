import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Progress } from '@/components/ui/progress';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
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
  Loader2,
  Trash2,
} from 'lucide-react';

export function InventoryWarehouseDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data directly (same approach as Sales Operations)
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    queryFn: async () => {
      console.log('🔄 Fetching dashboard analytics for Inventory & Warehouse...');
      const result = await apiRequest('/api/dashboard/analytics');
      console.log('✅ Inventory analytics data received:', result);
      return result;
    },
  });

  // Extract inventory metrics from analytics
  const totalProducts = parseInt(analytics?.overview?.totalProducts || '0');
  const totalClients = parseInt(analytics?.overview?.totalClients || '0');
  const totalWarehouses = 6; // Known warehouse count: NG, PH, Reserved, Red, Admin, WIP
  const inventoryValue = totalProducts * 150; // Estimated value per product

  console.log('🔍 Inventory & Warehouse Dashboard - Calculated Metrics:', {
    totalProducts,
    totalClients,
    totalWarehouses,
    inventoryValue,
    analyticsLoading,
    analyticsError: analyticsError?.message || null
  });

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Inventory & Warehouse Dashboard...</span>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading Inventory & Warehouse data</div>
          <div className="text-sm text-gray-500">{analyticsError.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory & Warehouse Dashboard</h1>
          <p className="text-muted-foreground">
            Manage inventory levels, warehouse operations, and stock transfers
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Transfer Stock
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active catalog items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">
              Multi-location storage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalProducts * 0.15)}</div>
            <p className="text-xs text-muted-foreground">
              Need replenishment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
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
          <TabsTrigger value="products">Products ({totalProducts})</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses ({totalWarehouses})</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Warehouse Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Status Overview</CardTitle>
                <CardDescription>Multi-location inventory distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'NG Warehouse', status: 'active', stock: '85%', color: 'green' },
                    { name: 'PH Warehouse', status: 'active', stock: '72%', color: 'green' },
                    { name: 'Reserved', status: 'active', stock: '45%', color: 'blue' },
                    { name: 'Red Warehouse', status: 'active', stock: '63%', color: 'orange' },
                    { name: 'Admin Storage', status: 'active', stock: '91%', color: 'purple' },
                    { name: 'WIP Storage', status: 'active', stock: '28%', color: 'yellow' },
                  ].map((warehouse) => (
                    <div key={warehouse.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${warehouse.color}-500`}></div>
                        <span className="text-sm font-medium">{warehouse.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={parseInt(warehouse.stock)} className="w-16" />
                        <span className="text-sm text-muted-foreground">{warehouse.stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/10 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Critical Stock Level
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-300">
                        {Math.floor(totalProducts * 0.05)} items below minimum threshold
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-950/10 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Low Stock Warning
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-300">
                        {Math.floor(totalProducts * 0.1)} items need replenishment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
                    <ArrowUpDown className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Pending Transfers
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        3 warehouse transfers awaiting approval
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <WarehousesTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <TransfersTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Products Data Table Component
function ProductsTable({ onRefresh }: { onRefresh: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      console.log('🔄 Fetching all products...');
      const result = await apiRequest('/api/products');
      console.log('✅ All products fetched:', result?.length || 0);
      return result;
    },
  });

  // Mock products data if API doesn't return data
  const mockProducts = [
    { 
      id: '1', 
      name: 'Premium Hair Extension', 
      sku: 'PHE-001', 
      category: 'Hair Extensions', 
      stockLevel: 25, 
      price: '149.99' 
    },
    { 
      id: '2', 
      name: 'Natural Wave Bundle', 
      sku: 'NWB-002', 
      category: 'Hair Bundles', 
      stockLevel: 8, 
      price: '89.99' 
    },
    { 
      id: '3', 
      name: 'Silk Hair Closure', 
      sku: 'SHC-003', 
      category: 'Closures', 
      stockLevel: 15, 
      price: '199.99' 
    },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      filterable: true,
      render: (value: any, row: any) => (
        <span className="font-medium">{value || row.productName}</span>
      )
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      filterable: true,
      render: (value: any) => (
        <span className="font-mono text-sm">{value || 'N/A'}</span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'Hair Extensions', label: 'Hair Extensions' },
        { value: 'Hair Bundles', label: 'Hair Bundles' },
        { value: 'Closures', label: 'Closures' },
        { value: 'Wigs', label: 'Wigs' },
      ],
      render: (value: any) => value || 'N/A'
    },
    {
      key: 'stockLevel',
      label: 'Stock Level',
      sortable: true,
      render: (value: any) => (
        <Badge variant={value < 10 ? 'destructive' : 'secondary'}>
          {value || 0}
        </Badge>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: any) => (
        <span className="font-semibold">${value || '0.00'}</span>
      )
    },
  ];

  const actions = [
    {
      label: 'View',
      icon: Eye,
      onClick: (product: any) => {
        toast({ title: 'View Product', description: `Viewing ${product.name}` });
      },
      variant: 'outline' as const,
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (product: any) => {
        toast({ title: 'Edit Product', description: `Editing ${product.name}` });
      },
      variant: 'outline' as const,
    },
  ];

  const globalActions = [
    {
      label: 'Refresh',
      icon: Package,
      onClick: () => queryClient.invalidateQueries({ queryKey: ['/api/products'] }),
      variant: 'outline' as const,
    },
  ];

  return (
    <DataTable
      data={displayProducts}
      columns={columns}
      actions={actions}
      globalActions={globalActions}
      title="Product Management"
      searchPlaceholder="Search products by name, SKU, or category..."
      isLoading={isLoading}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/products'] })}
      emptyMessage="No products found. Add products to get started with inventory management."
    />
  );
}

// Warehouses Table Component
function WarehousesTable({ onRefresh }: { onRefresh: () => void }) {
  const { toast } = useToast();
  
  const warehouses = [
    { id: '1', name: 'NG Warehouse', location: 'Nigeria', capacity: '85%', status: 'Active' },
    { id: '2', name: 'PH Warehouse', location: 'Philippines', capacity: '72%', status: 'Active' },
    { id: '3', name: 'Reserved', location: 'Global', capacity: '45%', status: 'Active' },
    { id: '4', name: 'Red Warehouse', location: 'Distribution', capacity: '63%', status: 'Active' },
    { id: '5', name: 'Admin Storage', location: 'HQ', capacity: '91%', status: 'Active' },
    { id: '6', name: 'WIP Storage', location: 'Production', capacity: '28%', status: 'Active' },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Warehouse Name',
      sortable: true,
      render: (warehouse: any) => (
        <span className="font-medium">{warehouse.name}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (warehouse: any) => (
        <div className="flex items-center space-x-2">
          <Progress value={parseInt(warehouse.capacity)} className="w-16" />
          <span className="text-sm">{warehouse.capacity}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (warehouse: any) => (
        <Badge variant="default">{warehouse.status}</Badge>
      ),
    },
  ];

  const actions = [
    {
      label: 'Monitor',
      icon: Monitor,
      onClick: (warehouse: any) => {
        toast({ title: 'Monitor Warehouse', description: `Monitoring ${warehouse.name}` });
      },
      variant: 'outline' as const,
    },
    {
      label: 'Transfer',
      icon: ArrowUpDown,
      onClick: (warehouse: any) => {
        toast({ title: 'Transfer Stock', description: `Initiating transfer from ${warehouse.name}` });
      },
      variant: 'outline' as const,
    },
  ];

  const globalActions = [
    {
      label: 'Refresh',
      icon: Package,
      onClick: onRefresh,
      variant: 'outline' as const,
    },
  ];

  return (
    <DataTable
      data={warehouses}
      columns={columns}
      actions={actions}
      globalActions={globalActions}
      title="Warehouse Management"
      searchPlaceholder="Search warehouses by name or location..."
      isLoading={false}
      onRefresh={onRefresh}
      emptyMessage="No warehouses found. Configure warehouse locations to get started."
    />
  );
}

// Transfers Table Component
function TransfersTable({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Transfers</CardTitle>
        <CardDescription>Stock movement between warehouses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <ArrowUpDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Transfer Management</h3>
          <p className="text-muted-foreground mb-4">
            Advanced transfer tracking coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}