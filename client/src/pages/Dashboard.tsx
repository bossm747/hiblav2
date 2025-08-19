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
    totalCustomers: 0
  };
  
  const metrics = [
    {
      title: 'Active Quotations',
      value: parseInt(overview.activeQuotations?.toString() || '0'),
      icon: FileText,
      description: 'Current quotations',
      trend: 'up',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Sales Orders',
      value: parseInt(overview.activeSalesOrders?.toString() || '0'),
      icon: ShoppingCart,
      description: 'Processing orders',
      trend: 'stable',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Job Orders',
      value: parseInt(overview.activeJobOrders?.toString() || '0'),
      icon: Factory,
      description: 'In production',
      trend: 'up',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Total Products',
      value: parseInt(overview.totalProducts?.toString() || '0'),
      icon: Package,
      description: 'Active catalog items',
      trend: 'stable',
      gradient: 'from-indigo-500 via-purple-500 to-cyan-500',
      bgGradient: 'from-indigo-50 to-cyan-50 dark:from-indigo-950/50 dark:to-cyan-950/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
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
      {/* Debug Info - Only show when there are issues */}
      {(error || (!analytics && !isLoading)) && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg">
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
          <div className={`w-2 h-2 ${isLoading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'} rounded-full mr-2`} />
          {isLoading ? 'Loading...' : error ? 'Error' : 'System Online'}
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-responsive-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className={`relative overflow-hidden floating-card bg-gradient-to-br ${metric.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} opacity-10`} />
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${metric.gradient}`} />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} shadow-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-2xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 elevated-container relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg mr-3">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Production Overview
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 relative z-10">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"></div>
                    <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Job Orders</span>
                    <span className="text-sm bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">{overview.activeJobOrders || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeJobOrders?.toString() || '0') * 10, 100)} className="h-3 bg-gradient-to-r from-orange-200 to-red-200 dark:from-orange-900 dark:to-red-900" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sales Orders Processing</span>
                    <span className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">{overview.activeSalesOrders || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeSalesOrders?.toString() || '0') * 10, 100)} className="h-3 bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-900 dark:to-emerald-900" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pending Quotations</span>
                    <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">{overview.activeQuotations || 0}</span>
                  </div>
                  <Progress value={Math.min(parseInt(overview.activeQuotations?.toString() || '0') * 5, 100)} className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 elevated-container relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg mr-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">
                Recent Activity
              </span>
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
                    <p className="font-medium">{overview.activeQuotations || 0} Active Quotations</p>
                    <p className="text-muted-foreground">Manufacturing pipeline</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium">{overview.activeSalesOrders || 0} Sales Orders</p>
                    <p className="text-muted-foreground">Processing orders</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <div className="text-sm">
                    <p className="font-medium">{overview.totalCustomers || 0} Total Customers</p>
                    <p className="text-muted-foreground">Business relationships</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Automation Status Summary */}
      <Card className="mb-6 container-shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">System Automation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overview.activeQuotations || 0}</div>
              <div className="text-sm text-muted-foreground">Active Quotations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overview.activeSalesOrders || 0}</div>
              <div className="text-sm text-muted-foreground">Sales Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{overview.activeJobOrders || 0}</div>
              <div className="text-sm text-muted-foreground">Job Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>

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