import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { OrderAutomationVisualization } from '@/components/OrderAutomationVisualization';
import {
  Factory,
  FileText,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';

export function Dashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard analytics');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale
  });

  // Add error logging for debugging
  if (error) {
    console.error('Dashboard API Error:', error);
  }

  // Add loading state logging
  if (isLoading) {
    console.log('Dashboard loading analytics data...');
  }

  if (analytics) {
    console.log('Dashboard analytics data:', analytics);
  }

  // Analytics data with error handling

  // Type-safe data access with fallbacks - matching actual API response
  const safeAnalytics = analytics as {
    overview?: {
      totalCustomers?: string | number;
      totalProducts?: string | number;
      activeQuotations?: string | number;
      activeSalesOrders?: string | number;
      activeJobOrders?: string | number;
    };
    inventory?: {
      lowStockCount?: number;
      totalProducts?: number;
    };
    revenue?: {
      total?: number;
      trend?: string;
      growth?: string;
    };
    orders?: {
      total?: number;
      trend?: string;
      growth?: string;
    };
    conversion?: {
      rate?: number;
      trend?: string;
      growth?: string;
    };
    avgOrderValue?: {
      value?: number;
      trend?: string;
      growth?: string;
    };
  } | undefined;

  const metrics = [
    {
      title: 'Active Quotations',
      value: Number(safeAnalytics?.overview?.activeQuotations || 0),
      icon: FileText,
      description: 'Current quotations',
      trend: 'up'
    },
    {
      title: 'Sales Orders',
      value: Number(safeAnalytics?.overview?.activeSalesOrders || 0),
      icon: ShoppingCart,
      description: 'Processing orders',
      trend: 'stable'
    },
    {
      title: 'Job Orders',
      value: Number(safeAnalytics?.overview?.activeJobOrders || 0),
      icon: Factory,
      description: 'In production',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: Number(safeAnalytics?.overview?.totalProducts || 0),
      icon: Package,
      description: 'Active catalog items',
      trend: 'stable'
    }
  ];

  const quickActions = [
    { label: 'New Quotation', href: '/quotations-vlookup', icon: FileText, variant: 'default' as const },
    { label: 'View Reports', href: '/reports', icon: TrendingUp, variant: 'outline' as const },
    { label: 'Check Inventory', href: '/inventory', icon: Package, variant: 'outline' as const },
    { label: 'Job Orders', href: '/job-orders', icon: Factory, variant: 'outline' as const }
  ];

  return (
    <div className="container-responsive space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-responsive-lg font-bold tracking-tight truncate">Dashboard</h1>
          <p className="text-responsive-sm text-muted-foreground mt-1">
            Real-time overview of your manufacturing operations
            {isLoading ? " (Loading...)" : ""}
            {analytics ? ` (Last updated: ${new Date().toLocaleTimeString()})` : ""}
          </p>
        </div>
        <Badge variant="outline" className="text-xs sm:text-sm flex-shrink-0 w-fit">
          <div className={`w-2 h-2 ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} rounded-full mr-2`} />
          {isLoading ? 'Loading...' : 'System Online'}
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-responsive-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border-l-4 border-l-primary floating-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 elevated-container">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Production Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Job Orders</span>
                    <span className="text-sm text-muted-foreground">{safeAnalytics?.overview?.activeJobOrders || 0}</span>
                  </div>
                  <Progress value={Math.min((Number(safeAnalytics?.overview?.activeJobOrders) || 0) * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sales Orders Processing</span>
                    <span className="text-sm text-muted-foreground">{safeAnalytics?.overview?.activeSalesOrders || 0}</span>
                  </div>
                  <Progress value={Math.min((Number(safeAnalytics?.overview?.activeSalesOrders) || 0) * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pending Quotations</span>
                    <span className="text-sm text-muted-foreground">{safeAnalytics?.overview?.activeQuotations || 0}</span>
                  </div>
                  <Progress value={Math.min((Number(safeAnalytics?.overview?.activeQuotations) || 0) * 5, 100)} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 elevated-container">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium">{safeAnalytics?.overview?.activeQuotations || 0} Active Quotations</p>
                    <p className="text-muted-foreground">Manufacturing pipeline</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium">{safeAnalytics?.overview?.activeSalesOrders || 0} Sales Orders</p>
                    <p className="text-muted-foreground">Processing orders</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium">{safeAnalytics?.inventory?.lowStockCount || 0} Low Stock Items</p>
                    <p className="text-muted-foreground">Inventory alerts</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Automation Visualization */}
      <OrderAutomationVisualization
        quotationsCount={Number(safeAnalytics?.overview?.activeQuotations) || 0}
        salesOrdersCount={Number(safeAnalytics?.overview?.activeSalesOrders) || 0}
        jobOrdersCount={Number(safeAnalytics?.overview?.activeJobOrders) || 0}
        invoicesCount={0}
        paymentsCount={0}
        className="mb-6"
      />

      {/* Quick Actions */}
      <Card className="container-shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.label} variant={action.variant} asChild className="btn-touch justify-start">
                  <a href={action.href} className="flex items-center w-full">
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">{action.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}