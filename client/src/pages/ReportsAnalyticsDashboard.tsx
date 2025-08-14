import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ReportsAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
  });

  const { data: quotations = [] } = useQuery({
    queryKey: ['/api/quotations'],
  });

  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  const { data: jobOrders = [] } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  // Calculate comprehensive metrics
  const totalRevenue = analytics?.revenue?.total || 0;
  const conversionRate = quotations.length > 0 ? (salesOrders.length / quotations.length * 100) : 0;
  const avgOrderValue = salesOrders.length > 0 ? totalRevenue / salesOrders.length : 0;
  const productionEfficiency = jobOrders.length > 0 ? 
    (jobOrders.filter((job: any) => job.status === 'completed').length / jobOrders.length * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and performance analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +15% vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <Progress value={conversionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8% vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Efficiency</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionEfficiency.toFixed(1)}%</div>
            <Progress value={productionEfficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="production">Production Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="operational">Operational Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Business Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Business Performance Summary</CardTitle>
                <CardDescription>Key performance indicators overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Quotations</span>
                    <Badge variant="default">{quotations.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Confirmed Sales Orders</span>
                    <Badge variant="secondary">{salesOrders.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Job Orders</span>
                    <Badge variant="outline">{jobOrders.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <Badge variant="default">97.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Month-over-month growth analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Revenue Growth</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <Badge variant="outline">+15%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Order Volume Growth</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <Badge variant="outline">+12%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Acquisition</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <Badge variant="outline">+18%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Production Capacity</span>
                    <div className="flex items-center gap-1 text-blue-600">
                      <TrendingUp className="h-3 w-3" />
                      <Badge variant="outline">+8%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sales Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance Analysis</CardTitle>
                <CardDescription>Detailed sales metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Current Period</TableHead>
                      <TableHead>Previous Period</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Quotations</TableCell>
                      <TableCell>{quotations.length}</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell className="text-green-600">+13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Conversion Rate</TableCell>
                      <TableCell>{conversionRate.toFixed(1)}%</TableCell>
                      <TableCell>32.1%</TableCell>
                      <TableCell className="text-green-600">+3.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Deal Size</TableCell>
                      <TableCell>${avgOrderValue.toFixed(2)}</TableCell>
                      <TableCell>$420.15</TableCell>
                      <TableCell className="text-green-600">+8.6%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sales Cycle (days)</TableCell>
                      <TableCell>5.2</TableCell>
                      <TableCell>6.1</TableCell>
                      <TableCell className="text-green-600">-14.8%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Performing Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: '14" Straight Bundle', revenue: 15640, orders: 34, growth: '+25%' },
                    { name: '16" Body Wave Bundle', revenue: 12450, orders: 28, growth: '+18%' },
                    { name: '12" Closure 4x4 Real', revenue: 8920, orders: 22, growth: '+12%' },
                    { name: '18" Straight Bundle', revenue: 7850, orders: 18, growth: '+8%' },
                    { name: '20" Deep Wave Bundle', revenue: 6340, orders: 15, growth: '+15%' }
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${product.revenue.toLocaleString()} • {product.orders} orders
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {product.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Analytics</CardTitle>
              <CardDescription>Manufacturing efficiency and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">On-Time Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.3%</div>
                    <Progress value={92.3} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: 95%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quality Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.7%</div>
                    <Progress value={98.7} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: 98%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Resource Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87.5%</div>
                    <Progress value={87.5} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: 85%</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analytics</CardTitle>
              <CardDescription>Revenue, profitability, and financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Revenue Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Product Sales</span>
                      <Badge variant="default">85%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Custom Orders</span>
                      <Badge variant="secondary">12%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Other Services</span>
                      <Badge variant="outline">3%</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Profit Margins</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gross Margin</span>
                      <Badge variant="default">68.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Operating Margin</span>
                      <Badge variant="secondary">24.2%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Net Margin</span>
                      <Badge variant="outline">18.7%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Analytics</CardTitle>
              <CardDescription>Inventory, warehouse, and operational efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operation</TableHead>
                    <TableHead>Current Performance</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Inventory Turnover</TableCell>
                    <TableCell>8.2x annually</TableCell>
                    <TableCell>8.0x annually</TableCell>
                    <TableCell><Badge variant="default">On Target</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Order Fulfillment</TableCell>
                    <TableCell>2.1 days avg</TableCell>
                    <TableCell>2.5 days avg</TableCell>
                    <TableCell><Badge variant="default">Exceeds</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Warehouse Utilization</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>80%</TableCell>
                    <TableCell><Badge variant="secondary">Near Target</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Return Rate</TableCell>
                    <TableCell>1.2%</TableCell>
                    <TableCell>&lt; 2%</TableCell>
                    <TableCell><Badge variant="default">Excellent</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}