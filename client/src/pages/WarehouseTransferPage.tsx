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
import { Progress } from '@/components/ui/progress';
import { DataTable } from '@/components/ui/data-table';
import { WarehouseTransferModal } from '@/components/warehouse/WarehouseTransferModal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Truck,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  Plus,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
} from 'lucide-react';

export function WarehouseTransferPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch transfer history
  const { data: transfers = [], refetch: refetchTransfers } = useQuery({
    queryKey: ['/api/warehouse-transfers'],
  });

  // Fetch inventory levels
  const { data: inventoryLevels = [] } = useQuery({
    queryKey: ['/api/warehouse-transfers/inventory-levels'],
  });

  // Fetch low stock alerts
  const { data: lowStockAlerts = [] } = useQuery({
    queryKey: ['/api/warehouse-transfers/low-stock'],
  });

  // Fetch warehouses for display
  const { data: warehouses = [] } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  // Calculate metrics
  const totalTransfers = transfers.length;
  const transfersToday = transfers.filter((t: any) => {
    const today = new Date().toDateString();
    return new Date(t.createdAt).toDateString() === today;
  }).length;
  const totalItemsTransferred = transfers.reduce((sum: number, t: any) => {
    return sum + Math.abs(t.quantity);
  }, 0) / 2; // Divide by 2 since each transfer has in and out
  const lowStockCount = lowStockAlerts.length;

  // Transfer history columns
  const transferColumns = [
    {
      key: 'referenceId',
      header: 'Transfer ID',
      accessor: (item: any) => item.referenceId,
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (item: any) => item.type,
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Transfer In', value: 'transfer_in' },
        { label: 'Transfer Out', value: 'transfer_out' },
      ],
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <ArrowRight className={`h-4 w-4 ${value === 'transfer_in' ? 'text-green-600 rotate-180' : 'text-red-600'}`} />
          <span className={value === 'transfer_in' ? 'text-green-600' : 'text-red-600'}>
            {value === 'transfer_in' ? 'IN' : 'OUT'}
          </span>
        </div>
      ),
    },
    {
      key: 'warehouseName',
      header: 'Warehouse',
      accessor: (item: any) => item.warehouseName,
      sortable: true,
      filterable: true,
    },
    {
      key: 'productName',
      header: 'Product',
      accessor: (item: any) => item.productName,
      sortable: true,
      filterable: true,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      accessor: (item: any) => Math.abs(item.quantity),
      sortable: true,
      filterable: true,
      filterType: 'number' as const,
      render: (value: number) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      accessor: (item: any) => item.notes || 'N/A',
      mobileHidden: true,
    },
    {
      key: 'createdAt',
      header: 'Date',
      accessor: (item: any) => item.createdAt,
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'createdBy',
      header: 'Created By',
      accessor: (item: any) => item.createdBy || 'System',
      mobileHidden: true,
    },
  ];

  // Inventory levels columns
  const inventoryColumns = [
    {
      key: 'warehouseName',
      header: 'Warehouse',
      accessor: (item: any) => item.warehouseName,
      sortable: true,
      filterable: true,
      render: (value: string) => {
        const warehouseCode = value?.split(' ')[0] || '';
        const badgeColor = {
          'NG': 'bg-blue-500',
          'PH': 'bg-green-500',
          'Reserved': 'bg-purple-500',
          'Red': 'bg-red-500',
          'Admin': 'bg-gray-500',
          'WIP': 'bg-yellow-500',
        }[warehouseCode] || 'bg-gray-500';
        
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${badgeColor}`} />
            {value}
          </div>
        );
      },
    },
    {
      key: 'productName',
      header: 'Product',
      accessor: (item: any) => item.productName,
      sortable: true,
      filterable: true,
    },
    {
      key: 'totalStock',
      header: 'Stock Level',
      accessor: (item: any) => item.totalStock,
      sortable: true,
      filterable: true,
      filterType: 'number' as const,
      render: (value: number) => {
        const isLow = value <= 10;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isLow ? 'text-red-600' : ''}`}>
              {value}
            </span>
            {isLow && <AlertTriangle className="h-4 w-4 text-red-600" />}
          </div>
        );
      },
    },
    {
      key: 'stockStatus',
      header: 'Status',
      accessor: (item: any) => {
        if (item.totalStock <= 0) return 'Out of Stock';
        if (item.totalStock <= 10) return 'Low Stock';
        if (item.totalStock <= 50) return 'Medium Stock';
        return 'In Stock';
      },
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Out of Stock', value: 'Out of Stock' },
        { label: 'Low Stock', value: 'Low Stock' },
        { label: 'Medium Stock', value: 'Medium Stock' },
        { label: 'In Stock', value: 'In Stock' },
      ],
      render: (value: string) => {
        const variant = {
          'Out of Stock': 'destructive',
          'Low Stock': 'secondary',
          'Medium Stock': 'outline',
          'In Stock': 'default',
        }[value] as any || 'outline';
        
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
  ];

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "Generating warehouse transfer report...",
    });
    // In real implementation, call PDF generation endpoint
  };

  const handleRefresh = () => {
    refetchTransfers();
    toast({
      title: "Data Refreshed",
      description: "Transfer history has been updated.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Transfer Tracking</h1>
          <p className="text-muted-foreground">
            Real-time inventory movement tracking between warehouses
          </p>
        </div>
        <div className="flex gap-2">
          <WarehouseTransferModal 
            trigger={
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
            }
          />
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransfers}</div>
            <p className="text-xs text-muted-foreground">
              All time transfers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transfers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfersToday}</div>
            <p className="text-xs text-muted-foreground">
              Transfers made today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Transferred</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsTransferred.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Total units moved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Items below threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transfers">Transfer History</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Warehouse Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Distribution</CardTitle>
                <CardDescription>Current stock distribution across warehouses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouses.map((warehouse: any) => {
                    const warehouseStock = inventoryLevels
                      .filter((item: any) => item.warehouseId === warehouse.id)
                      .reduce((sum: number, item: any) => sum + item.totalStock, 0);
                    const totalStock = inventoryLevels.reduce((sum: number, item: any) => sum + item.totalStock, 0);
                    const percentage = totalStock > 0 ? (warehouseStock / totalStock) * 100 : 0;
                    
                    return (
                      <div key={warehouse.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{warehouse.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {warehouseStock} units ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Products requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockAlerts.length > 0 ? (
                    lowStockAlerts.slice(0, 5).map((alert: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="font-medium text-sm">{alert.productName}</p>
                            <p className="text-xs text-muted-foreground">{alert.warehouseName}</p>
                          </div>
                        </div>
                        <Badge variant="destructive">{alert.totalStock} left</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <Package className="h-8 w-8 mx-auto mb-2" />
                      <p>No low stock alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>Latest warehouse transfer activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transfers.slice(0, 10).map((transfer: any) => (
                  <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transfer.type === 'transfer_in' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <ArrowRight className={`h-4 w-4 ${transfer.type === 'transfer_in' ? 'text-green-600 rotate-180' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{transfer.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {transfer.warehouseName} • {Math.abs(transfer.quantity)} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{transfer.referenceId}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(transfer.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>Complete log of all warehouse transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={transfers}
                columns={transferColumns}
                searchKeys={['referenceId', 'productName', 'warehouseName']}
                onView={(transfer) => toast({ 
                  title: "View Transfer", 
                  description: `Viewing transfer ${transfer.referenceId}` 
                })}
                pageSize={10}
                mobileCardView={true}
                stickyHeader={true}
                showPagination={true}
                showFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory Levels</CardTitle>
              <CardDescription>Real-time stock levels across all warehouses</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={inventoryLevels}
                columns={inventoryColumns}
                searchKeys={['productName', 'warehouseName']}
                pageSize={10}
                mobileCardView={true}
                stickyHeader={true}
                showPagination={true}
                showFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}