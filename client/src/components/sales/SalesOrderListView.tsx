import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, Download, Share, 
  Printer, FileText, CheckCircle, X, Clock, Package,
  ArrowRight
} from 'lucide-react';

interface SalesOrder {
  id: string;
  salesOrderNumber: string;
  quotationId?: string;
  customerCode: string;
  customerName: string;
  country: string;
  revisionNumber: string;
  status: 'draft' | 'confirmed' | 'cancelled' | 'completed';
  dueDate: string;
  dateOfRevision?: string;
  total: number;
  createdAt: string;
  createdByInitials: string;
  itemCount: number;
  isConfirmed: boolean;
}

interface SalesOrderFilters {
  search: string;
  status: string;
  country: string;
  customerCode: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

export function SalesOrderListView() {
  const { toast } = useToast();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SalesOrderFilters>({
    search: '',
    status: '',
    country: '',
    customerCode: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    loadSalesOrders();
    loadFilterData();
  }, []);

  const loadSalesOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/sales-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSalesOrders(data || []);
      } else {
        throw new Error('Failed to load sales orders');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sales orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [customersRes] = await Promise.all([
        fetch('/api/customers', { headers })
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData || []);
        const uniqueCountries = Array.from(new Set(customersData.map((c: any) => c.country)));
        setCountries(uniqueCountries);
      }
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const handleConfirmOrder = async (id: string) => {
    if (!confirm('Confirm this sales order? This will make it available for invoice and job order generation.')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sales-orders/${id}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sales order confirmed successfully"
        });
        loadSalesOrders();
      } else {
        throw new Error('Failed to confirm sales order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm sales order",
        variant: "destructive"
      });
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (!confirm('Cancel this sales order? This will automatically cancel related job orders and release reserved stock.')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sales-orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sales order cancelled successfully"
        });
        loadSalesOrders();
      } else {
        throw new Error('Failed to cancel sales order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel sales order",
        variant: "destructive"
      });
    }
  };

  const handleGenerateInvoice = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sales-orders/${id}/generate-invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Invoice ${result.invoiceNumber} generated successfully`
        });
      } else {
        throw new Error('Failed to generate invoice');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive"
      });
    }
  };

  const handleGenerateJobOrder = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sales-orders/${id}/generate-job-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Job Order ${result.jobOrder.jobOrderNumber} generated successfully`
        });
      } else {
        throw new Error('Failed to generate job order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate job order",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sales-orders/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Sales Order duplicated as ${result.salesOrder.salesOrderNumber}`
        });
        loadSalesOrders();
      } else {
        throw new Error('Failed to duplicate sales order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate sales order",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string, isConfirmed: boolean) => {
    if (status === 'cancelled') {
      return <Badge variant="destructive">CANCELLED</Badge>;
    }
    if (status === 'completed') {
      return <Badge variant="default">COMPLETED</Badge>;
    }
    if (!isConfirmed) {
      return <Badge variant="secondary">DRAFT</Badge>;
    }
    return <Badge variant="default">CONFIRMED</Badge>;
  };

  const filteredOrders = salesOrders.filter(order => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!order.salesOrderNumber.toLowerCase().includes(searchTerm) &&
          !order.customerName.toLowerCase().includes(searchTerm) &&
          !order.customerCode.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Order Management</h1>
          <p className="text-muted-foreground">
            Manage sales orders with order confirmation and document generation
          </p>
        </div>
        <Button className="gap-2" data-testid="button-new-sales-order">
          <Plus className="w-4 h-4" />
          New Sales Order
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search sales orders, customers, or numbers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button onClick={loadSalesOrders} data-testid="button-search">
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select 
                    value={filters.country} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredOrders.length} of {salesOrders.length} sales orders
        </span>
        <span>
          Total Value: ${filteredOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
        </span>
      </div>

      {/* Sales Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Revision</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading sales orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No sales orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                    <TableCell className="font-mono font-semibold">
                      {order.salesOrderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.country}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {order.revisionNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.itemCount} items</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status, order.isConfirmed)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {order.createdByInitials}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrder(order.id);
                            setShowDetailModal(true);
                          }}
                          data-testid={`button-view-${order.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {!order.isConfirmed && order.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleConfirmOrder(order.id)}
                            data-testid={`button-confirm-${order.id}`}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}

                        {order.isConfirmed && order.status !== 'cancelled' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleGenerateInvoice(order.id)}
                              data-testid={`button-invoice-${order.id}`}
                            >
                              <FileText className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleGenerateJobOrder(order.id)}
                              data-testid={`button-job-order-${order.id}`}
                            >
                              <Package className="w-4 h-4 text-purple-600" />
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicate(order.id)}
                          data-testid={`button-duplicate-${order.id}`}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>

                        {order.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelOrder(order.id)}
                            data-testid={`button-cancel-${order.id}`}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales Order Detail Modal */}
      {selectedOrder && showDetailModal && (
        <Dialog open={showDetailModal} onOpenChange={() => {
          setShowDetailModal(false);
          setSelectedOrder(null);
        }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Sales Order Details</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Sales Order ID: {selectedOrder}</p>
              <p>Detail modal will be implemented with full order information</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}