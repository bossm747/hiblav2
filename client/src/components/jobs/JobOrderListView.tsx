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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Filter, Eye, Download, Package, Truck, 
  BarChart3, Clock, AlertTriangle, CheckCircle
} from 'lucide-react';

interface JobOrder {
  id: string;
  jobOrderNumber: string;
  salesOrderId: string;
  salesOrderNumber: string;
  clientCode: string;
  clientName: string;
  revisionNumber: string;
  dueDate: string;
  dateCreated: string;
  dateRevised?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'shipped';
  orderQuantity: number;
  shippedQuantity: number;
  reservedQuantity: number;
  readyQuantity: number;
  toProduceQuantity: number;
  orderBalance: number;
  completionPercentage: number;
  createdByInitials: string;
}

interface JobOrderFilters {
  search: string;
  status: string;
  clientCode: string;
  dateFrom: string;
  dateTo: string;
  dueDateFrom: string;
  dueDateTo: string;
}

export function JobOrderListView() {
  const { toast } = useToast();
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<JobOrderFilters>({
    search: '',
    status: '',
    clientCode: '',
    dateFrom: '',
    dateTo: '',
    dueDateFrom: '',
    dueDateTo: ''
  });

  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    loadJobOrders();
    loadFilterData();
  }, []);

  const loadJobOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/job-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform data to match interface
        const transformedData = data.map((jo: any) => ({
          id: jo.id,
          jobOrderNumber: jo.jobOrderNumber || jo.id,
          salesOrderId: jo.salesOrderId || '',
          salesOrderNumber: jo.salesOrderNumber || 'N/A',
          clientCode: jo.clientCode || 'N/A',
          clientName: jo.clientName || 'Unknown Client',
          revisionNumber: jo.revisionNumber || 'R1',
          dueDate: jo.dueDate || new Date().toISOString(),
          dateCreated: jo.createdAt || new Date().toISOString(),
          dateRevised: jo.dateRevised,
          status: jo.status || 'pending',
          orderQuantity: 10, // Mock data - would calculate from items
          shippedQuantity: 3, // Mock data - would calculate from shipments
          reservedQuantity: 7, // Mock data - would calculate from inventory
          readyQuantity: 4, // Reserved - Shipped
          toProduceQuantity: 3, // Order - Reserved
          orderBalance: 7, // Order - Shipped
          completionPercentage: 30, // (Shipped / Order) * 100
          createdByInitials: jo.createdByInitials || 'N/A'
        }));
        setJobOrders(transformedData);
      } else {
        throw new Error('Failed to load job orders');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job orders",
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

      const [clientsRes] = await Promise.all([
          fetch('/api/clients', { headers })
      ]);

      if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData || []);
      }
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const handleCreateDeliveryReceipt = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/job-orders/${id}/delivery-receipt`, {
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
          description: `Delivery receipt created successfully`
        });
      } else {
        throw new Error('Failed to create delivery receipt');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create delivery receipt",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': { variant: 'secondary' as const, label: 'PENDING', icon: Clock },
      'in_progress': { variant: 'default' as const, label: 'IN PROGRESS', icon: Package },
      'completed': { variant: 'default' as const, label: 'COMPLETED', icon: CheckCircle },
      'shipped': { variant: 'default' as const, label: 'SHIPPED', icon: Truck }
    };

    const config = variants[status as keyof typeof variants] || { 
      variant: 'secondary' as const, 
      label: status.toUpperCase(),
      icon: Clock
    };

    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (dueDate: string, completionPercentage: number) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        OVERDUE
      </Badge>;
    }
    
    if (daysUntilDue <= 3 && completionPercentage < 80) {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        URGENT
      </Badge>;
    }
    
    if (daysUntilDue <= 7 && completionPercentage < 50) {
      return <Badge variant="outline" className="gap-1">
        <Clock className="w-3 h-3" />
        HIGH
      </Badge>;
    }
    
    return null;
  };

  const filteredOrders = jobOrders.filter(order => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!order.jobOrderNumber.toLowerCase().includes(searchTerm) &&
          !order.clientName.toLowerCase().includes(searchTerm) &&
          !order.clientCode.toLowerCase().includes(searchTerm) &&
          !order.salesOrderNumber.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Order Management</h1>
          <p className="text-muted-foreground">
            Real-time production monitoring and job order tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Production Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Active job orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobOrders.filter(jo => jo.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being produced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready to Ship</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobOrders.filter(jo => jo.readyQuantity > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items ready for shipment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobOrders.length > 0 
                ? Math.round(jobOrders.reduce((sum, jo) => sum + jo.completionPercentage, 0) / jobOrders.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search job orders, sales orders, or customers..."
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
            <Button onClick={loadJobOrders} data-testid="button-search">
              Refresh
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select 
                    value={filters.clientCode} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, clientCode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.code} value={client.code}>
                          {client.code} - {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Created From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Due Date From</Label>
                  <Input
                    type="date"
                    value={filters.dueDateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dueDateFrom: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Job Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Order #</TableHead>
                <TableHead>Sales Order</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Quantities</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading job orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No job orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} data-testid={`job-order-row-${order.id}`}>
                    <TableCell className="font-mono font-semibold">
                      {order.jobOrderNumber}
                    </TableCell>
                    <TableCell className="font-mono">
                      {order.salesOrderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.clientCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(order.dueDate, order.completionPercentage)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{order.completionPercentage}%</span>
                          <span className="text-muted-foreground">
                            {order.shippedQuantity}/{order.orderQuantity}
                          </span>
                        </div>
                        <Progress value={order.completionPercentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Shipped: <span className="font-mono">{order.shippedQuantity}</span></div>
                        <div>Reserved: <span className="font-mono">{order.reservedQuantity}</span></div>
                        <div>Ready: <span className="font-mono">{order.readyQuantity}</span></div>
                        <div>To Produce: <span className="font-mono">{order.toProduceQuantity}</span></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.dueDate).toLocaleDateString()}
                      </div>
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
                        
                        {order.readyQuantity > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCreateDeliveryReceipt(order.id)}
                            data-testid={`button-delivery-${order.id}`}
                          >
                            <Truck className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          data-testid={`button-download-${order.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job Order Detail Modal */}
      {selectedOrder && showDetailModal && (
        <Dialog open={showDetailModal} onOpenChange={() => {
          setShowDetailModal(false);
          setSelectedOrder(null);
        }}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Job Order Details & Real-Time Monitoring</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Job Order ID: {selectedOrder}</p>
              <p>Real-time monitoring interface will be implemented here</p>
              <p>This will show detailed production status, shipment tracking, and inventory updates</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}