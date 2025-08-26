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
      description: 'Current quotations',
      trend: 'up',
      change: '+12%',
      color: 'blue',
      iconBg: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Sales Orders',
      value: parseInt(overview.activeSalesOrders?.toString() || '0'),
      icon: ShoppingCart,
      description: 'Processing orders',
      trend: 'up',
      change: '+8%',
      color: 'emerald',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Job Orders',
      value: parseInt(overview.activeJobOrders?.toString() || '0'),
      icon: Factory,
      description: 'In production',
      trend: 'up',
      change: '+15%',
      color: 'orange',
      iconBg: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Total Products',
      value: parseInt(overview.totalProducts?.toString() || '0'),
      icon: Package,
      description: 'Active catalog items',
      trend: 'stable',
      change: '0%',
      color: 'violet',
      iconBg: 'bg-violet-50 dark:bg-violet-950',
      iconColor: 'text-violet-600 dark:text-violet-400'
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
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 dark:text-blue-200 text-sm flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="text-blue-700 dark:text-blue-300">
              Loading: {isLoading ? 'Yes' : 'No'} | 
              Error: {error ? 'Yes' : 'No'} | 
              Data: {analytics ? 'Loaded' : 'None'} | 
              Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}
            </p>
            {error && (
              <p className="text-red-600 dark:text-red-400 font-mono text-xs">
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
            <Card key={metric.title} className="group relative overflow-hidden border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {metric.title}
                      </p>
                      <div className={`p-2.5 rounded-xl ${metric.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tracking-tight">
                        {metric.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge 
                    variant={metric.trend === 'up' ? 'default' : 'secondary'} 
                    className="text-xs font-medium px-2.5 py-1"
                  >
                    {metric.trend === 'up' ? '↗' : '→'} {metric.change}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    vs last month
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-0 bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 mr-4">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-foreground">
                Production Overview
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-3"></div>
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Active Job Orders</span>
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{overview.activeJobOrders || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeJobOrders?.toString() || '0') * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Sales Orders Processing</span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{overview.activeSalesOrders || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeSalesOrders?.toString() || '0') * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Pending Quotations</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{overview.activeQuotations || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeQuotations?.toString() || '0') * 5, 100)} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-0 bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 mr-4">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-foreground">
                Recent Activity
              </span>
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
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">System Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{overview.activeQuotations || 0}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Quotations</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{overview.activeSalesOrders || 0}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sales Orders</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{overview.activeJobOrders || 0}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Job Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
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