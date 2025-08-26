import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { dashboardApi, type DashboardAnalytics } from '@/api/dashboard';
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
  const { data: analytics, isLoading, error } = useQuery<DashboardAnalytics>({
    queryKey: ['dashboard', 'analytics'],
    queryFn: dashboardApi.getAnalytics,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale
  });

  // Add comprehensive error and data logging for debugging
  React.useEffect(() => {
    console.log('🔍 Dashboard Component State:', {
      isLoading,
      hasError: !!error,
      hasData: !!analytics,
      errorMessage: error?.message,
      token: localStorage.getItem('auth_token') ? 'Present' : 'Missing'
    });
    
    if (error) {
      console.error('❌ Dashboard API Error:', error);
    }
    
    if (analytics) {
      console.log('✅ Dashboard analytics received:', analytics);
    }
  }, [isLoading, error, analytics]);

  // Analytics data with error handling

  // Type-safe data access with proper conversion - matching actual API response
  const overview = analytics?.overview || {
    activeQuotations: 0,
    activeSalesOrders: 0,
    activeJobOrders: 0,
    totalProducts: 0,
    totalClients: 0
  };
  
  const metrics = [
    {
      title: 'Active Quotations',
      value: parseInt(overview.activeQuotations?.toString() || '0'),
      icon: FileText,
      description: 'Current quotations'
    },
    {
      title: 'Sales Orders',
      value: parseInt(overview.activeSalesOrders?.toString() || '0'),
      icon: ShoppingCart,
      description: 'Processing orders'
    },
    {
      title: 'Job Orders',
      value: parseInt(overview.activeJobOrders?.toString() || '0'),
      icon: Factory,
      description: 'In production'
    },
    {
      title: 'Total Products',
      value: parseInt(overview.totalProducts?.toString() || '0'),
      icon: Package,
      description: 'Active catalog items'
    }
  ];

  const quickActions = [
    { label: 'New Quotation', href: '/quotations-vlookup', icon: FileText, variant: 'default' as const },
    { label: 'View Reports', href: '/reports', icon: TrendingUp, variant: 'outline' as const },
    { label: 'Check Inventory', href: '/inventory', icon: Package, variant: 'outline' as const },
    { label: 'Job Orders', href: '/job-orders', icon: Factory, variant: 'outline' as const }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Debug Info - Only show when there are issues */}
      {(error || (!analytics && !isLoading)) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="text-muted-foreground">
              Loading: {isLoading ? 'Yes' : 'No'} | 
              Error: {error ? 'Yes' : 'No'} | 
              Data: {analytics ? 'Loaded' : 'None'} | 
              Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}
            </p>
            {error && (
              <p className="text-destructive font-mono text-xs">
                Error: {error.message}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome back! Here's an overview of your business operations.
            {isLoading ? " (Loading...)" : ""}
            {analytics ? ` (Last updated: ${new Date().toLocaleTimeString()})` : ""}
          </p>
        </div>
        <Badge variant="outline" className="text-sm flex-shrink-0 w-fit h-10 px-6 font-medium">
          <div className={`w-2 h-2 ${isLoading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'} rounded-full mr-2`} />
          {isLoading ? 'Loading...' : error ? 'Error' : 'System Online'}
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value}
                </div>
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
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Production Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
<<<<<<< HEAD
                    <div className="h-4 bg-muted rounded mb-3"></div>
=======
                    <div className="h-4 bg-muted rounded mb-2"></div>
>>>>>>> 100c3e4b4c704f425bbf4870b479d96d3f65ae0e
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Job Orders</span>
                    <span className="text-sm font-bold">{overview.activeJobOrders || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeJobOrders?.toString() || '0') * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sales Orders Processing</span>
                    <span className="text-sm font-bold">{overview.activeSalesOrders || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeSalesOrders?.toString() || '0') * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pending Quotations</span>
                    <span className="text-sm font-bold">{overview.activeQuotations || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeQuotations?.toString() || '0') * 5, 100)} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="w-3 h-3 bg-muted rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{overview.activeQuotations || 0} Active Quotations</p>
                    <p className="text-muted-foreground">Manufacturing pipeline</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{overview.activeSalesOrders || 0} Sales Orders</p>
                    <p className="text-muted-foreground">Processing orders</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{overview.totalClients || 0} Client Accounts</p>
                    <p className="text-muted-foreground">Internal tracking</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status Summary */}
      <Card className="border-0 bg-card shadow-sm">
        <CardHeader>
          <CardTitle>System Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{overview.activeQuotations || 0}</div>
              <div className="text-sm text-muted-foreground">Active Quotations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{overview.activeSalesOrders || 0}</div>
              <div className="text-sm text-muted-foreground">Sales Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{overview.activeJobOrders || 0}</div>
              <div className="text-sm text-muted-foreground">Job Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={action.label} 
                  variant={action.variant} 
                  asChild 
                  className="h-12 justify-start font-medium hover:scale-105 transition-transform duration-200"
                >
                  <a href={action.href} className="flex items-center w-full">
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
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