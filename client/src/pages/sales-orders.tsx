import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, Eye, Edit3, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { SalesOrder } from "@shared/schema";
import { Navbar } from "@/components/navbar";

export default function SalesOrdersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: salesOrders, isLoading } = useQuery({
    queryKey: ["/api/sales-orders"],
  });

  const confirmOrderMutation = useMutation({
    mutationFn: (orderId: string) => 
      apiRequest(`/api/sales-orders/${orderId}/confirm`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "confirmed": return "success";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
            <p className="text-muted-foreground">
              Manage sales orders generated from quotations
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Sales Order
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesOrders?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Orders</CardTitle>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesOrders?.filter((so: SalesOrder) => so.status === "draft").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesOrders?.filter((so: SalesOrder) => so.isConfirmed).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${salesOrders?.reduce((sum: number, so: SalesOrder) => 
                  sum + parseFloat(so.total || "0"), 0).toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Orders</CardTitle>
            <CardDescription>
              All sales orders from newest to oldest
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : salesOrders?.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sales orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Sales orders will appear here when generated from quotations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {salesOrders?.map((salesOrder: SalesOrder) => (
                  <div
                    key={salesOrder.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{salesOrder.salesOrderNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {salesOrder.customerCode} • {salesOrder.country} • Rev {salesOrder.revisionNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(salesOrder.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${parseFloat(salesOrder.total || "0").toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(salesOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(salesOrder.status || "draft")}>
                          {salesOrder.status}
                        </Badge>
                        {salesOrder.isConfirmed && (
                          <Badge variant="success">Confirmed</Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!salesOrder.isConfirmed && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => confirmOrderMutation.mutate(salesOrder.id)}
                            disabled={confirmOrderMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
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