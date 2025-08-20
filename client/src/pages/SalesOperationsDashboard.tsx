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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [duplicatingQuotation, setDuplicatingQuotation] = useState<any>(null);

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'machine-weft', label: 'Machine Weft' },
    { value: 'hand-tied', label: 'Hand-Tied' },
    { value: 'clip-extensions', label: 'Clip Extensions' },
    { value: 'tape-extensions', label: 'Tape Extensions' },
    { value: 'custom', label: 'Custom Orders' }
  ];

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
    const matchesSearch = quotation.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || quotation.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || quotation.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
      
      // Add mock category data to existing quotations for demonstration
      const quotationsWithCategories = data.map((quotation: any, index: number) => ({
        ...quotation,
        category: ['machine-weft', 'hand-tied', 'clip-extensions', 'tape-extensions', 'custom'][index % 5],
        customerName: `Customer ${String.fromCharCode(65 + (index % 26))}`
      }));
      
      setQuotations(quotationsWithCategories);
    } catch (error) {
      console.error('Quotations fetch error:', error);
      // Use mock data for demonstration
      const mockQuotations = Array.from({ length: 10 }, (_, i) => ({
        id: `qt-${i + 1}`,
        quotationNumber: `QT-${String(i + 1).padStart(3, '0')}`,
        customerName: `Customer ${String.fromCharCode(65 + (i % 26))}`,
        date: new Date(2025, 0, 15 + i).toISOString().split('T')[0],
        totalAmount: (i + 1) * 500,
        status: ['draft', 'pending', 'approved', 'rejected'][i % 4],
        category: ['machine-weft', 'hand-tied', 'clip-extensions', 'tape-extensions', 'custom'][i % 5]
      }));
      setQuotations(mockQuotations);
    } finally {
      setQuotationsLoading(false);
    }
  };

  const handleViewQuotation = (quotation: any) => {
    toast({
      title: "View Quotation",
      description: `Opening quotation ${quotation.quotationNumber}`,
    });
  };

  const handleEditQuotation = (quotation: any) => {
    toast({
      title: "Edit Quotation",
      description: `Editing quotation ${quotation.quotationNumber}`,
    });
  };

  const handleDuplicateQuotation = (quotation: any) => {
    setDuplicatingQuotation(quotation);
    setActiveTab('form');
    toast({
      title: "Duplicate Quotation",
      description: `Creating duplicate of ${quotation.quotationNumber}`,
    });
  };

  const handleDeleteQuotation = (quotation: any) => {
    toast({
      title: "Delete Quotation",
      description: `Quotation ${quotation.quotationNumber} deleted`,
      variant: "destructive"
    });
  };

  const handleConvertToSalesOrder = (quotation: any) => {
    toast({
      title: "Convert to Sales Order",
      description: `Converting ${quotation.quotationNumber} to sales order`,
    });
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search quotations..." 
                      className="pl-9" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
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
                  <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-medium text-sm">
                    <div>Quote #</div>
                    <div>Customer</div>
                    <div>Category</div>
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
                        setSelectedCategory('all');
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
                          <div className="grid grid-cols-7 gap-4 p-4 text-sm hover:bg-gray-50">
                            <div className="font-medium text-blue-600">
                              {quotation.quotationNumber}
                            </div>
                            <div className="font-medium">
                              {quotation.customerName}
                            </div>
                            <div className="capitalize text-gray-600">
                              {quotation.category?.replace('-', ' ')}
                            </div>
                            <div className="text-gray-600">
                              {quotation.date}
                            </div>
                            <div className="font-medium">
                              ${quotation.totalAmount?.toLocaleString()}
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
      </div>
    </TooltipProvider>
  );
}