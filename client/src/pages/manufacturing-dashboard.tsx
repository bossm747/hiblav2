import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, ShoppingCart, Package, TrendingUp, Users, DollarSign } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { apiRequest } from "@/lib/queryClient";

export default function ManufacturingDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/manufacturing"],
  });

  const { data: recentQuotations } = useQuery({
    queryKey: ["/api/quotations"],
  });

  const { data: recentSalesOrders } = useQuery({
    queryKey: ["/api/sales-orders"],
  });

  const { data: recentJobOrders } = useQuery({
    queryKey: ["/api/job-orders"],
  });

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manufacturing Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time overview of production and order management
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalQuotations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeQuotations || 0} active
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSalesOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.confirmedSalesOrders || 0} confirmed
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalJobOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  In production
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">
                  On-time delivery
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Quotations */}
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Quotations</CardTitle>
                <CardDescription>Latest customer quotations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuotations?.slice(0, 5).map((quotation: any) => (
                    <div key={quotation.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{quotation.quotationNumber}</p>
                        <p className="text-xs text-gray-500">{quotation.customerCode}</p>
                      </div>
                      <Badge 
                        variant={quotation.status === "approved" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {quotation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sales Orders */}
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Sales Orders</CardTitle>
                <CardDescription>Latest confirmed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSalesOrders?.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{order.salesOrderNumber}</p>
                        <p className="text-xs text-gray-500">{order.customerCode}</p>
                      </div>
                      <Badge 
                        variant={order.isConfirmed ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {order.isConfirmed ? "Confirmed" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Job Orders */}
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Job Orders</CardTitle>
                <CardDescription>Production orders in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobOrders?.slice(0, 5).map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{job.jobOrderNumber}</p>
                        <p className="text-xs text-gray-500">{job.customerCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Due: {new Date(job.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Status */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Warehouse Status</CardTitle>
                <CardDescription>Current inventory levels across locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { code: "NG", name: "Nigeria", level: 75 },
                    { code: "PH", name: "Philippines", level: 88 },
                    { code: "RESERVED", name: "Reserved", level: 45 },
                    { code: "RED", name: "Red Tag", level: 12 },
                    { code: "ADMIN", name: "Admin", level: 92 },
                    { code: "WIP", name: "Work in Progress", level: 67 }
                  ].map((warehouse) => (
                    <div key={warehouse.code} className="text-center">
                      <p className="text-sm font-medium">{warehouse.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{warehouse.code}</p>
                      <Progress value={warehouse.level} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{warehouse.level}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}