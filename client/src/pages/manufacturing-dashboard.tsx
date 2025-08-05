import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Warehouse
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function ManufacturingDashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/manufacturing"],
  });

  const { data: warehouseData } = useQuery({
    queryKey: ["/api/warehouses/summary"],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/dashboard/recent-activity"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hibla Manufacturing Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of your hair manufacturing operations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.activeOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData?.newOrdersThisWeek || 0} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboardData?.monthlyRevenue?.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData?.revenueGrowth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.productionEfficiency || 0}%</div>
              <Progress value={dashboardData?.productionEfficiency || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.customerSatisfaction || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Based on recent orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your manufacturing operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity?.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Urgent Actions Required</CardTitle>
                  <CardDescription>Items that need immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Overdue Orders</p>
                          <p className="text-xs text-muted-foreground">3 orders past due date</p>
                        </div>
                      </div>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Warehouse className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Low Stock Alert</p>
                          <p className="text-xs text-muted-foreground">5 items below threshold</p>
                        </div>
                      </div>
                      <Badge variant="warning">Warning</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Pending Quotations</p>
                          <p className="text-xs text-muted-foreground">2 quotations awaiting approval</p>
                        </div>
                      </div>
                      <Badge variant="default">Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Production Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ready to Ship</span>
                      <span className="font-medium">156 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Production</span>
                      <span className="font-medium">89 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">To Produce</span>
                      <span className="font-medium">234 items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247 items</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pass Rate</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Review</span>
                      <span className="font-medium">23 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rejected</span>
                      <span className="font-medium text-red-600">2 items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {warehouseData?.map((warehouse: any) => (
                <Card key={warehouse.code}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {warehouse.name}
                      <Badge variant="outline">{warehouse.code}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Items</span>
                        <span className="font-medium">{warehouse.totalItems}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Value</span>
                        <span className="font-medium">${warehouse.totalValue?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Utilization</span>
                        <span className="font-medium">{warehouse.utilization}%</span>
                      </div>
                      <Progress value={warehouse.utilization} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="col-span-3 text-center py-8">
                  <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No warehouse data</h3>
                  <p className="text-muted-foreground">Warehouse information will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Draft Quotations</p>
                        <p className="text-sm text-muted-foreground">Awaiting completion</p>
                      </div>
                      <Badge variant="secondary">5</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sent Quotations</p>
                        <p className="text-sm text-muted-foreground">Awaiting customer response</p>
                      </div>
                      <Badge variant="default">12</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Confirmed Orders</p>
                        <p className="text-sm text-muted-foreground">In production queue</p>
                      </div>
                      <Badge variant="success">28</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">2025.08.00{i}</p>
                          <p className="text-xs text-muted-foreground">Customer AB{i}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">$1,247.00</p>
                          <Badge variant="success" className="text-xs">Confirmed</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}