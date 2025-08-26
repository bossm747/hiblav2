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
  Factory,
  ClipboardList,
  Timer,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Play,
  Package,
  Loader2,
  Trash2,
} from 'lucide-react';

export function ProductionManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data directly (same approach as Sales Operations)
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    queryFn: async () => {
      console.log('🔄 Fetching dashboard analytics for Production Management...');
      const result = await apiRequest('/api/dashboard/analytics');
      console.log('✅ Production analytics data received:', result);
      return result;
    },
  });

  // Extract production metrics from analytics
  const totalJobOrders = parseInt(analytics?.overview?.activeJobOrders || '0');
  const totalSalesOrders = parseInt(analytics?.overview?.activeSalesOrders || '0');
  const totalProducts = parseInt(analytics?.overview?.totalProducts || '0');
  const productionEfficiency = totalJobOrders > 0 ? (totalJobOrders / totalSalesOrders * 100) : 0;

  console.log('🔍 Production Management Dashboard - Calculated Metrics:', {
    totalJobOrders,
    totalSalesOrders,
    totalProducts,
    productionEfficiency: productionEfficiency.toFixed(1) + '%',
    analyticsLoading,
    analyticsError: analyticsError?.message || null
  });

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Production Management Dashboard...</span>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading Production Management data</div>
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
          <h1 className="text-3xl font-bold tracking-tight">Production Management Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor job orders, production progress, and manufacturing operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <Plus className="h-4 w-4 mr-2" />
            New Job Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobOrders}</div>
            <p className="text-xs text-muted-foreground">
              Currently in production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Queue</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSalesOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders awaiting production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionEfficiency.toFixed(1)}%</div>
            <Progress value={productionEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              In production catalog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="job-orders">Job Orders ({totalJobOrders})</TabsTrigger>
          <TabsTrigger value="production-schedule">Production Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Production Status Overview</CardTitle>
                <CardDescription>Current manufacturing progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Completed Orders</span>
                    </div>
                    <Badge variant="secondary">{Math.floor(totalJobOrders * 0.6)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <Badge variant="secondary">{Math.floor(totalJobOrders * 0.3)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Delayed</span>
                    </div>
                    <Badge variant="secondary">{Math.floor(totalJobOrders * 0.1)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Production Metrics</CardTitle>
                <CardDescription>Key manufacturing indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Daily Production Target</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Quality Control Rate</span>
                      <span className="text-sm text-muted-foreground">96%</span>
                    </div>
                    <Progress value={96} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="job-orders" className="space-y-4">
          <JobOrdersTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
        </TabsContent>

        <TabsContent value="production-schedule" className="space-y-4">
          <ProductionScheduleTable onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard/analytics'] })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Job Orders Data Table Component
function JobOrdersTable({ onRefresh }: { onRefresh: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobOrders = [], isLoading, error } = useQuery({
    queryKey: ['/api/job-orders'],
    queryFn: async () => {
      console.log('🔄 Fetching all job orders...');
      const result = await apiRequest('/api/job-orders');
      console.log('✅ All job orders fetched:', result?.length || 0);
      return result;
    },
  });

  // Mock job orders data if API doesn't return data
  const mockJobOrders = [
    { 
      id: '1', 
      jobOrderNumber: 'JO-2025-001', 
      clientCode: 'CLI001', 
      status: 'in-progress', 
      priority: 'high', 
      progress: 75, 
      dueDate: '2025-01-25' 
    },
    { 
      id: '2', 
      jobOrderNumber: 'JO-2025-002', 
      clientCode: 'CLI002', 
      status: 'pending', 
      priority: 'normal', 
      progress: 0, 
      dueDate: '2025-01-30' 
    },
  ];

  const displayJobOrders = jobOrders.length > 0 ? jobOrders : mockJobOrders;

  const handleDeleteJobOrder = async (jobOrder: any) => {
    if (confirm(`Delete job order ${jobOrder.jobOrderNumber}?`)) {
      try {
        await apiRequest(`/api/job-orders/${jobOrder.id}`, { method: 'DELETE' });
        queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] });
        onRefresh();
        toast({
          title: "Success",
          description: "Job order deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job order",
          variant: "destructive",
        });
      }
    }
  };

  const columns = [
    {
      key: 'jobOrderNumber',
      label: 'Job Order #',
      sortable: true,
      render: (value: any, row: any) => (
        <span className="font-mono text-sm">{value || row.id}</span>
      )
    },
    {
      key: 'clientCode',
      label: 'Client',
      sortable: true,
      filterable: true,
      render: (value: any, row: any) => value || row.client || 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
      ],
      render: (value: any) => (
        <Badge 
          variant={
            value === 'completed' ? 'default' : 
            value === 'in-progress' ? 'secondary' : 
            'outline'
          }
        >
          {value || 'pending'}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
      ],
      render: (value: any) => (
        <Badge variant={value === 'high' ? 'destructive' : 'outline'}>
          {value || 'normal'}
        </Badge>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center space-x-2">
          <Progress value={value || 0} className="w-16" />
          <span className="text-sm">{value || 0}%</span>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value: any) => (
        <span className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
  ];

  const actions = [
    {
      label: 'View',
      icon: Eye,
      onClick: (order: any) => {
        toast({ title: 'View Job Order', description: `Viewing ${order.jobOrderNumber}` });
      },
      variant: 'outline' as const,
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (order: any) => {
        toast({ title: 'Edit Job Order', description: `Editing ${order.jobOrderNumber}` });
      },
      variant: 'outline' as const,
    },
    {
      label: 'Start/Resume',
      icon: Play,
      onClick: (order: any) => {
        toast({ title: 'Start Job Order', description: `Starting ${order.jobOrderNumber}` });
      },
      variant: 'outline' as const,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDeleteJobOrder,
      variant: 'outline' as const,
    },
  ];

  const globalActions = [
    {
      label: 'Refresh',
      icon: ClipboardList,
      onClick: () => queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] }),
      variant: 'outline' as const,
    },
  ];

  return (
    <DataTable
      data={displayJobOrders}
      columns={columns}
      actions={actions}
      globalActions={globalActions}
      title="Job Order Management"
      searchPlaceholder="Search job orders by number or client..."
      isLoading={isLoading}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] })}
      emptyMessage="No job orders found. Create job orders from confirmed sales orders."
    />
  );
}

// Production Schedule Table Component
function ProductionScheduleTable({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Schedule</CardTitle>
        <CardDescription>Manufacturing timeline and resource allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Timer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Production Schedule</h3>
          <p className="text-muted-foreground mb-4">
            Advanced scheduling features coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}