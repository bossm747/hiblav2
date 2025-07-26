import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  Filter
} from "lucide-react";

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30d");

  // Mock analytics data - replace with real API calls
  const analyticsData = {
    revenue: {
      current: 245800,
      previous: 189600,
      change: 29.6
    },
    orders: {
      current: 156,
      previous: 142,
      change: 9.9
    },
    customers: {
      current: 89,
      previous: 67,
      change: 32.8
    },
    averageOrder: {
      current: 1576,
      previous: 1335,
      change: 18.0
    },
    topProducts: [
      { name: "Korean HD Lace 22\"", sales: 45, revenue: 202500 },
      { name: "European HD Lace 20\"", sales: 32, revenue: 185600 },
      { name: "Single Drawn 18\"", sales: 28, revenue: 126000 },
      { name: "Double Drawn 24\"", sales: 24, revenue: 139200 },
      { name: "Premium Closure 16\"", sales: 18, revenue: 81000 }
    ],
    salesByDay: [
      { day: "Mon", sales: 15600 },
      { day: "Tue", sales: 23400 },
      { day: "Wed", sales: 18900 },
      { day: "Thu", sales: 31200 },
      { day: "Fri", sales: 28700 },
      { day: "Sat", sales: 45600 },
      { day: "Sun", sales: 38200 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const renderChangeIndicator = (change: number) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span className="ml-1 text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <RoleBasedSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="border-b border-white/20 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground neon-text-purple">Analytics & Reports</h1>
                    <p className="text-sm text-muted-foreground">Business performance insights</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={dateRange === "7d" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setDateRange("7d")}
                    >
                      7 Days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={dateRange === "30d" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setDateRange("30d")}
                    >
                      30 Days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={dateRange === "90d" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setDateRange("90d")}
                    >
                      90 Days
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(analyticsData.revenue.current)}
                      </p>
                      {renderChangeIndicator(analyticsData.revenue.change)}
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">{analyticsData.orders.current}</p>
                      {renderChangeIndicator(analyticsData.orders.change)}
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New Customers</p>
                      <p className="text-2xl font-bold text-foreground">{analyticsData.customers.current}</p>
                      {renderChangeIndicator(analyticsData.customers.change)}
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Order</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(analyticsData.averageOrder.current)}
                      </p>
                      {renderChangeIndicator(analyticsData.averageOrder.change)}
                    </div>
                    <TrendingUp className="h-8 w-8 text-cyan-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-foreground neon-text-cyan">Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales by Day */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-foreground neon-text-purple">Daily Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.salesByDay.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{day.day}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatCurrency(day.sales)}</p>
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(day.sales / 50000) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Sections */}
            <div className="mt-8">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-foreground neon-text-cyan">Quick Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                      <Package className="h-5 w-5 mb-2" />
                      <span>Inventory Report</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 mb-2" />
                      <span>Customer Analysis</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                      <TrendingUp className="h-5 w-5 mb-2" />
                      <span>Sales Forecast</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}