import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  const { data: quotations = [] } = useQuery({
    queryKey: ['/api/quotations'],
  });

  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  const { data: jobOrders = [] } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  const metrics = [
    {
      title: 'Active Quotations',
      value: quotations.length,
      icon: FileText,
      description: '+12% from last month',
      trend: 'up'
    },
    {
      title: 'Sales Orders',
      value: salesOrders.length,
      icon: ShoppingCart,
      description: 'Processing orders',
      trend: 'stable'
    },
    {
      title: 'Job Orders',
      value: jobOrders.length,
      icon: Factory,
      description: 'In production',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: products.length,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manufacturing Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of your manufacturing operations
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          System Online
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border-l-4 border-l-primary">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Production Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Machine Weft Production</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Lace Closure Production</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Quality Control</span>
                  <span className="text-sm text-muted-foreground">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">Quotation Q001 approved</p>
                  <p className="text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">New order from ABA Hair</p>
                  <p className="text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">Inventory alert: Low stock</p>
                  <p className="text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.label} variant={action.variant} asChild>
                  <a href={action.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
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