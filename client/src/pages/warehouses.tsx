import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Plus,
  Minus
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Warehouse {
  id: string;
  code: string;
  name: string;
  description: string;
  manager: string;
  totalProducts: number;
  totalValue: number;
  lastActivity: string;
  status: 'active' | 'inactive';
}

interface InventoryMovement {
  id: string;
  productName: string;
  warehouseName: string;
  movementType: 'deposit' | 'withdrawal' | 'transfer';
  quantity: number;
  reference: string;
  referenceType: string;
  date: string;
  staff: string;
}

const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    code: 'NG',
    name: 'NG Warehouse',
    description: 'Main Nigeria distribution center',
    manager: 'Custodian',
    totalProducts: 245,
    totalValue: 125000,
    lastActivity: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    code: 'PH',
    name: 'PH Warehouse',
    description: 'Philippines production facility',
    manager: 'Custodian',
    totalProducts: 189,
    totalValue: 89500,
    lastActivity: '4 hours ago',
    status: 'active'
  },
  {
    id: '3',
    code: 'RESERVED',
    name: 'Reserved Warehouse',
    description: 'Stock reserved for confirmed orders',
    manager: 'Custodian',
    totalProducts: 67,
    totalValue: 34200,
    lastActivity: '1 hour ago',
    status: 'active'
  },
  {
    id: '4',
    code: 'RED',
    name: 'Red Warehouse',
    description: 'Quality control and returns',
    manager: 'Custodian',
    totalProducts: 23,
    totalValue: 12800,
    lastActivity: '6 hours ago',
    status: 'active'
  },
  {
    id: '5',
    code: 'ADMIN',
    name: 'Admin Warehouse',
    description: 'Administrative inventory',
    manager: 'Custodian',
    totalProducts: 45,
    totalValue: 28900,
    lastActivity: '3 hours ago',
    status: 'active'
  },
  {
    id: '6',
    code: 'WIP',
    name: 'WIP Warehouse',
    description: 'Work in Progress inventory',
    manager: 'Custodian',
    totalProducts: 78,
    totalValue: 42300,
    lastActivity: '5 hours ago',
    status: 'active'
  }
];

const mockMovements: InventoryMovement[] = [
  {
    id: '1',
    productName: '8" Machine Weft Single Drawn, STRAIGHT',
    warehouseName: 'Reserved Warehouse',
    movementType: 'deposit',
    quantity: 25,
    reference: '2025.08.001',
    referenceType: 'sales_order',
    date: '2025-08-06T14:30:00Z',
    staff: 'AAMA'
  },
  {
    id: '2',
    productName: '10" Closure 4x4 Swiss Lace',
    warehouseName: 'Reserved Warehouse',
    movementType: 'withdrawal',
    quantity: 12,
    reference: 'PL-2025-001',
    referenceType: 'packing_list',
    date: '2025-08-06T13:15:00Z',
    staff: 'BBMA'
  },
  {
    id: '3',
    productName: '12" Body Wave Bundle',
    warehouseName: 'PH Warehouse',
    movementType: 'deposit',
    quantity: 50,
    reference: 'PR-2025-002',
    referenceType: 'production',
    date: '2025-08-06T11:45:00Z',
    staff: 'CCMA'
  }
];

export default function WarehousesPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [movementFilter, setMovementFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // In a real implementation, these would be API calls
  const warehouses = mockWarehouses;
  const movements = mockMovements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = !selectedWarehouse || movement.warehouseName.includes(selectedWarehouse);
    const matchesType = movementFilter === 'all' || movement.movementType === movementFilter;
    return matchesSearch && matchesWarehouse && matchesType;
  });

  const totalValue = warehouses.reduce((sum, wh) => sum + wh.totalValue, 0);
  const totalProducts = warehouses.reduce((sum, wh) => sum + wh.totalProducts, 0);
  const activeWarehouses = warehouses.filter(wh => wh.status === 'active').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Plus className="h-4 w-4 text-green-500" />;
      case 'withdrawal': return <Minus className="h-4 w-4 text-red-500" />;
      default: return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
    }
  };

  const getMovementBadge = (type: string) => {
    const variants = {
      deposit: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      withdrawal: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    return variants[type as keyof typeof variants] || variants.transfer;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Warehouse Management</h1>
          <p className="text-muted-foreground">
            Multi-warehouse inventory tracking and movement monitoring across all locations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Warehouses</p>
                  <p className="text-2xl font-bold text-foreground">{activeWarehouses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{totalProducts.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Warehouse Overview</TabsTrigger>
            <TabsTrigger value="movements">Inventory Movements</TabsTrigger>
            <TabsTrigger value="valuation">Valuation Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses.map((warehouse) => (
                <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {warehouse.code}
                        </Badge>
                      </div>
                      <Badge 
                        variant={warehouse.status === 'active' ? 'default' : 'secondary'}
                        className={warehouse.status === 'active' ? 'bg-green-500' : ''}
                      >
                        {warehouse.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{warehouse.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Manager:</span>
                        <span className="text-sm text-muted-foreground">{warehouse.manager}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Products:</span>
                        <span className="text-sm font-bold">{warehouse.totalProducts}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Value:</span>
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(warehouse.totalValue)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Activity:</span>
                        <span className="text-sm text-muted-foreground">{warehouse.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Inventory Movements</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track all inventory movements across warehouses
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search movements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-full md:w-64"
                      />
                    </div>
                    
                    <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Warehouses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Warehouses</SelectItem>
                        {warehouses.map((wh) => (
                          <SelectItem key={wh.id} value={wh.name}>
                            {wh.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={movementFilter} onValueChange={setMovementFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Staff</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{movement.productName}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getMovementIcon(movement.movementType)}
                            <Badge 
                              variant="outline" 
                              className={getMovementBadge(movement.movementType)}
                            >
                              {movement.movementType}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{movement.warehouseName}</TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1 rounded">
                            {movement.reference}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(movement.date)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{movement.staff}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valuation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Valuation</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Inventory value by warehouse location
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {warehouses.map((warehouse) => {
                      const percentage = (warehouse.totalValue / totalValue) * 100;
                      return (
                        <div key={warehouse.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{warehouse.name}</span>
                            <span className="font-bold">{formatCurrency(warehouse.totalValue)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{warehouse.totalProducts} products</span>
                            <span>{percentage.toFixed(1)}% of total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Movement Summary</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Recent activity overview
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Total Deposits</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {movements.filter(m => m.movementType === 'deposit').length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Minus className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Total Withdrawals</span>
                      </div>
                      <span className="font-bold text-red-600">
                        {movements.filter(m => m.movementType === 'withdrawal').length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ArrowUpDown className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Total Transfers</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {movements.filter(m => m.movementType === 'transfer').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}