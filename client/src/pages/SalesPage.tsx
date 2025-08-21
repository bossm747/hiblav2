import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SalesOrder {
  id: string;
  number: string;
  quotationNumber?: string;
  customerName: string;
  customerCode: string;
  status: string;
  total: number;
  dueDate: string;
  createdAt: string;
  isConfirmed: boolean;
}

export function SalesPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('/api/sales-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSalesOrders(data);
      }
    } catch (error) {
      console.error('Error loading sales orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSalesOrders = salesOrders.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'draft': return 'secondary';
      case 'shipped': return 'outline';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const totalOrders = salesOrders.length;
  const confirmedOrders = salesOrders.filter(order => order.isConfirmed).length;
  const draftOrders = salesOrders.filter(order => order.status === 'draft').length;
  const totalRevenue = salesOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground">
            Manage and track sales orders from confirmed quotations
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Sales Order
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Active sales orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Ready for production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pending confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by order number, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Sales Orders Table */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-medium text-sm">
              <div>Order #</div>
              <div>Customer</div>
              <div>Quotation #</div>
              <div>Due Date</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading sales orders...</p>
              </div>
            ) : filteredSalesOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No sales orders match your search criteria.' 
                  : 'No sales orders found. Create your first sales order from a quotation.'}
              </div>
            ) : (
              filteredSalesOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-7 gap-4 p-4 text-sm hover:bg-gray-50 border-t">
                  <div className="font-medium text-blue-600">
                    {order.number}
                  </div>
                  <div className="font-medium">
                    {order.customerName || order.customerCode}
                  </div>
                  <div className="text-gray-600">
                    {order.quotationNumber || '-'}
                  </div>
                  <div className="text-gray-600">
                    {new Date(order.dueDate).toLocaleDateString()}
                  </div>
                  <div className="font-medium">
                    ${Number(order.total || 0).toLocaleString()}
                  </div>
                  <div>
                    <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}