import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Clipboard, Eye, Edit3, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { JobOrder, JobOrderItem } from "@shared/schema";
import { Navbar } from "@/components/navbar";

export default function JobOrdersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobOrders, isLoading } = useQuery({
    queryKey: ["/api/job-orders"],
  });

  const { data: summaryData } = useQuery({
    queryKey: ["/api/job-orders/summary"],
  });

  const calculateProgress = (item: JobOrderItem) => {
    const totalQuantity = parseFloat(item.quantity || "0");
    const readyQuantity = parseFloat(item.ready || "0");
    return totalQuantity > 0 ? (readyQuantity / totalQuantity) * 100 : 0;
  };

  const getUrgencyColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return "destructive";
    if (daysUntilDue <= 7) return "warning";
    if (daysUntilDue <= 14) return "default";
    return "success";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Orders</h1>
            <p className="text-muted-foreground">
              Production management and order tracking
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Job Order
          </Button>
        </div>

        {/* Production Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Job Orders</CardTitle>
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobOrders?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData?.readyItems || 0}</div>
              <p className="text-xs text-muted-foreground">items ready to ship</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Production</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData?.inProduction || 0}</div>
              <p className="text-xs text-muted-foreground">items being produced</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData?.shippedItems || 0}</div>
              <p className="text-xs text-muted-foreground">items shipped</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Orders</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summaryData?.overdueOrders || 0}</div>
              <p className="text-xs text-muted-foreground">past due date</p>
            </CardContent>
          </Card>
        </div>

        {/* Job Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Production Job Orders</CardTitle>
            <CardDescription>
              Track production progress and shipment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobOrders?.length === 0 ? (
              <div className="text-center py-8">
                <Clipboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No job orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Job orders will appear here when generated from confirmed sales orders
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobOrders?.map((jobOrder: JobOrder) => (
                  <div
                    key={jobOrder.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium text-lg">{jobOrder.jobOrderNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            {jobOrder.customerCode} • Rev {jobOrder.revisionNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Due: {new Date(jobOrder.dueDate).toLocaleDateString()}
                          </p>
                          <Badge variant={getUrgencyColor(jobOrder.dueDate)}>
                            {Math.ceil((new Date(jobOrder.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Customer Instructions */}
                    {jobOrder.customerInstructions && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <h5 className="text-sm font-medium mb-1">Customer Instructions:</h5>
                        <p className="text-sm text-muted-foreground">{jobOrder.customerInstructions}</p>
                      </div>
                    )}

                    {/* Production Progress would be shown here for each item */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Production Progress</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* This would be populated with actual job order items */}
                        <div className="p-3 border rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Sample Item</span>
                            <span className="text-xs text-muted-foreground">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                          <div className="mt-2 text-xs text-muted-foreground">
                            Ready: 0.75 | To Produce: 0.25
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}