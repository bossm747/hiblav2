import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  FileText,
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Copy,
  Trash2,
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { QuotationForm } from '@/components/forms/QuotationForm';

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const { toast } = useToast();
  
  // Analytics state
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Quotations state
  const [quotations, setQuotations] = useState<any[]>([]);
  const [quotationsLoading, setQuotationsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [duplicatingQuotation, setDuplicatingQuotation] = useState<any>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [showQuotationDetails, setShowQuotationDetails] = useState(false);

  // Calculated metrics
  const totalQuotations = analytics ? parseInt(analytics.overview?.activeQuotations || '0') : 0;
  const totalSalesOrders = analytics ? parseInt(analytics.overview?.activeSalesOrders || '0') : 0;
  const totalJobOrders = analytics ? parseInt(analytics.overview?.activeJobOrders || '0') : 0;
  const totalCustomers = analytics ? parseInt(analytics.overview?.totalCustomers || '0') : 0;
  const conversionRate = totalQuotations > 0 ? ((totalSalesOrders / totalQuotations) * 100).toFixed(1) : '0.0';
  const totalRevenue = totalSalesOrders * 500;

  // Load dashboard analytics and quotations
  useEffect(() => {
    fetchAnalytics();
    fetchQuotations();
  }, []);

  // Filter quotations based on search and filters
  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateFrom = !dateFrom || new Date(quotation.createdAt) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(quotation.createdAt) <= new Date(dateTo + 'T23:59:59');
    const matchesStatus = selectedStatus === 'all' || quotation.status === selectedStatus;
    
    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus;
  });

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/dashboard/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setAnalyticsError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchQuotations = async () => {
    try {
      setQuotationsLoading(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/quotations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch quotations: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Quotations loaded:', data?.length || 0);
      setQuotations(data || []);
    } catch (error) {
      console.error('❌ Error fetching quotations:', error);
      toast({
        title: "Error",
        description: "Failed to load quotations. Please try again.",
        variant: "destructive"
      });
      setQuotations([]);
    } finally {
      setQuotationsLoading(false);
    }
  };

  const handleViewQuotation = (quotation: any) => {
    setSelectedQuotation(quotation);
    setShowQuotationDetails(true);
  };

  const handleEditQuotation = (quotation: any) => {
    setDuplicatingQuotation(quotation);
    setActiveTab('form');
    toast({
      title: "Edit Mode",
      description: `Editing quotation ${quotation.number}`,
    });
  };

  const handleDuplicateQuotation = (quotation: any) => {
    setDuplicatingQuotation(quotation);
    setActiveTab('form');
    toast({
      title: "Duplicate Mode",
      description: `Creating duplicate of ${quotation.number}`,
    });
  };

  const handleDeleteQuotation = async (quotation: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${quotation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Quotation ${quotation.number} deleted successfully`,
        });
        fetchQuotations(); // Refresh the list
      } else {
        throw new Error('Failed to delete quotation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive"
      });
    }
  };

  const handleConvertToSalesOrder = async (quotation: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/sales-orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quotationId: quotation.id
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Quotation converted to sales order successfully`,
        });
        fetchQuotations(); // Refresh to show updated status
      } else {
        throw new Error('Failed to convert quotation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert quotation to sales order",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'draft': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return FileCheck;
      case 'pending': return Clock;
      case 'draft': return Edit;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  // Chart data
  const monthlyData = [
    { month: 'Jan', quotations: 18, orders: 8, revenue: 4000 },
    { month: 'Feb', quotations: 22, orders: 12, revenue: 6000 },
    { month: 'Mar', quotations: totalQuotations, orders: totalSalesOrders, revenue: totalRevenue },
  ];

  const customerTiers = [
    { name: 'New Customer', value: 25, fill: '#3b82f6' },
    { name: 'Regular', value: 45, fill: '#10b981' },
    { name: 'Premier', value: 20, fill: '#f59e0b' },
    { name: 'Custom', value: 10, fill: '#ef4444' }
  ];

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Operations</h1>
            <p className="text-gray-600">Manage quotations, orders, and track sales performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={fetchAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="orders">Sales Orders</TabsTrigger>
            <TabsTrigger value="form">New Quotation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuotations}</div>
                  <p className="text-xs text-muted-foreground">Active quotations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSalesOrders}</div>
                  <p className="text-xs text-muted-foreground">Confirmed orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">Quote to order</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Pipeline value</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Quotations and orders over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="quotations" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Customers by pricing tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerTiers}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {customerTiers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quotations Tab */}
          <TabsContent value="quotations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quotations Management</CardTitle>
                    <CardDescription>View and manage all quotations with advanced filtering</CardDescription>
                  </div>
                  <Button onClick={() => setActiveTab('form')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Quotation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Enhanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search quotations..." 
                      className="pl-9" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date-from" className="text-sm font-medium">From Date</Label>
                    <Input 
                      id="date-from"
                      type="date" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date-to" className="text-sm font-medium">To Date</Label>
                    <Input 
                      id="date-to"
                      type="date" 
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={fetchQuotations}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {filteredQuotations.length} of {quotations.length} quotations
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{quotations.filter(q => q.status === 'pending').length} Pending</Badge>
                    <Badge variant="default">{quotations.filter(q => q.status === 'approved').length} Approved</Badge>
                  </div>
                </div>
                
                {/* Quotations Table */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm">
                    <div>Quote #</div>
                    <div>Customer</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  <Separator />
                  
                  {quotationsLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading quotations...</p>
                    </div>
                  ) : filteredQuotations.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Quotations Found</h3>
                      <p className="text-gray-600 mb-4">No quotations match your current filters</p>
                      <Button onClick={() => {
                        setSearchTerm('');
                        setDateFrom('');
                        setDateTo('');
                        setSelectedStatus('all');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    filteredQuotations.map((quotation, index) => {
                      const StatusIcon = getStatusIcon(quotation.status);
                      return (
                        <div key={quotation.id}>
                          <div className="grid grid-cols-6 gap-4 p-4 text-sm hover:bg-gray-50">
                            <div className="font-medium text-blue-600">
                              {quotation.number}
                            </div>
                            <div className="font-medium">
                              {quotation.customerName || quotation.customerCode}
                            </div>
                            <div className="text-gray-600">
                              {new Date(quotation.createdAt).toLocaleDateString()}
                            </div>
                            <div className="font-medium">
                              ${quotation.total?.toLocaleString() || '0.00'}
                            </div>
                            <div>
                              <Badge variant={getStatusBadgeVariant(quotation.status)} className="capitalize">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {quotation.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleViewQuotation(quotation)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Quotation</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEditQuotation(quotation)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Quotation</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDuplicateQuotation(quotation)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Duplicate Quotation</TooltipContent>
                              </Tooltip>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewQuotation(quotation)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditQuotation(quotation)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicateQuotation(quotation)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {quotation.status === 'approved' && (
                                    <DropdownMenuItem onClick={() => handleConvertToSalesOrder(quotation)}>
                                      <FileCheck className="h-4 w-4 mr-2" />
                                      Convert to Sales Order
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteQuotation(quotation)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          {index < filteredQuotations.length - 1 && <Separator />}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Orders</CardTitle>
                <CardDescription>Track confirmed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Sales Orders Management</h3>
                  <p className="mb-4">Complete order tracking system</p>
                  <Badge variant="outline">{totalSalesOrders} Active Orders</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Tab - Single Container */}
          <TabsContent value="form" className="space-y-6">
            <Card className="max-w-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {duplicatingQuotation ? `Duplicate Quotation: ${duplicatingQuotation.quotationNumber}` : 'Create New Quotation'}
                    </CardTitle>
                    <CardDescription>
                      {duplicatingQuotation 
                        ? 'Creating an editable copy of the selected quotation'
                        : 'Generate a new quotation for customer inquiry'
                      }
                    </CardDescription>
                  </div>
                  {duplicatingQuotation && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setDuplicatingQuotation(null);
                        toast({
                          title: "Duplicate Cancelled",
                          description: "Switched to new quotation mode",
                        });
                      }}
                    >
                      Cancel Duplicate
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <QuotationForm duplicateData={duplicatingQuotation} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quotation Details Dialog */}
        <Dialog open={showQuotationDetails} onOpenChange={setShowQuotationDetails}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quotation Details - {selectedQuotation?.number}</DialogTitle>
              <DialogDescription>
                Complete details and items for this quotation
              </DialogDescription>
            </DialogHeader>
            
            {selectedQuotation && (
              <div className="space-y-6">
                {/* Header Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Quotation Number</Label>
                    <p className="text-lg font-mono">{selectedQuotation.number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Customer</Label>
                    <p className="text-lg">{selectedQuotation.customerName || selectedQuotation.customerCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedQuotation.status)} className="mt-1">
                      {selectedQuotation.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Created Date</Label>
                    <p className="text-lg">{new Date(selectedQuotation.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Valid Until</Label>
                    <p className="text-lg">{selectedQuotation.validUntil ? new Date(selectedQuotation.validUntil).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Total Amount</Label>
                    <p className="text-xl font-bold text-green-600">${selectedQuotation.total?.toLocaleString() || '0.00'}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quotation Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Product</div>
                      <div>Specification</div>
                      <div>Quantity</div>
                      <div>Unit Price</div>
                      <div>Line Total</div>
                    </div>
                    {selectedQuotation.items?.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-5 gap-4 p-3 border-t">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-gray-600">{item.specification || '-'}</div>
                        <div>{item.quantity}</div>
                        <div>${item.unitPrice?.toFixed(2)}</div>
                        <div className="font-medium">${item.lineTotal?.toFixed(2)}</div>
                      </div>
                    )) || (
                      <div className="p-4 text-center text-gray-500">No items found</div>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Subtotal</Label>
                    <p className="text-lg">${selectedQuotation.subtotal?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Shipping Fee</Label>
                    <p className="text-lg">${selectedQuotation.shippingFee?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Bank Charge</Label>
                    <p className="text-lg">${selectedQuotation.bankCharge?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Discount</Label>
                    <p className="text-lg text-red-600">${selectedQuotation.discount?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Other Charges</Label>
                    <p className="text-lg">${selectedQuotation.others?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Total Amount</Label>
                    <p className="text-xl font-bold text-green-600">${selectedQuotation.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Payment Method</Label>
                    <p className="text-lg">{selectedQuotation.paymentMethod || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Shipping Method</Label>
                    <p className="text-lg">{selectedQuotation.shippingMethod || 'Not specified'}</p>
                  </div>
                </div>

                {selectedQuotation.customerServiceInstructions && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Customer Service Instructions</Label>
                    <p className="text-lg p-3 bg-gray-50 rounded-lg mt-2">{selectedQuotation.customerServiceInstructions}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => handleEditQuotation(selectedQuotation)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleDuplicateQuotation(selectedQuotation)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button onClick={() => handleConvertToSalesOrder(selectedQuotation)}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Convert to Sales Order
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}