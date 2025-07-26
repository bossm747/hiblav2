import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { Package, Search, Filter, Eye, Edit, CheckCircle, Truck, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Order, OrderItem } from "@shared/schema";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders", { status: statusFilter !== "all" ? statusFilter : undefined }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("limit", "100");
      
      const response = await fetch(`/api/orders?${params}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  const { data: orderStats } = useQuery<{ totalOrders: number; totalRevenue: number; pendingOrders: number; shippedOrders: number }>({
    queryKey: ["/api/admin/orders/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders/stats");
      if (!response.ok) throw new Error("Failed to fetch order stats");
      return response.json();
    },
  });

  const { data: orderItems } = useQuery<OrderItem[]>({
    queryKey: ["/api/orders", selectedOrder?.id, "items"],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${selectedOrder?.id}/items`);
      if (!response.ok) throw new Error("Failed to fetch order items");
      return response.json();
    },
    enabled: !!selectedOrder?.id,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, updates }: { orderId: string; updates: { status?: string; paymentStatus?: string; trackingNumber?: string } }) => {
      return apiRequest(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders/stats"] });
      setIsUpdateDialogOpen(false);
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "processing": return "default";
      case "shipped": return "outline";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      case "refunded": return "outline";
      default: return "secondary";
    }
  };

  const filteredOrders = orders?.filter(order => {
    if (searchQuery) {
      return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.shippingAddress?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) || [];

  const quickUpdateStatus = (orderId: string, status: string, paymentStatus?: string) => {
    updateOrderMutation.mutate({ orderId, updates: { status, paymentStatus } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <RoleBasedSidebar />
          <div className="flex-1 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/10 rounded w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-white/10 rounded" />
                ))}
              </div>
              <div className="h-96 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <RoleBasedSidebar />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground neon-text-cyan">Order Management</h1>
                <p className="text-muted-foreground">Manage and track customer orders</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-cyan-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">
                        {orderStats?.totalOrders || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatPrice(orderStats?.totalRevenue || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Orders</p>
                      <p className="text-2xl font-bold text-foreground">
                        {orderStats?.pendingOrders || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Truck className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Shipped Orders</p>
                      <p className="text-2xl font-bold text-foreground">
                        {orderStats?.shippedOrders || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by order number or customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 glass"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 glass">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-white/10 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-semibold text-foreground">#{order.orderNumber}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleDateString("en-PH")}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Customer</div>
                            <div className="font-medium text-foreground">
                              {order.shippingAddress?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {formatPrice(order.total)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.paymentMethod?.toUpperCase()}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedOrder(order);
                                setIsUpdateDialogOpen(true);
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Status
                              </DropdownMenuItem>
                              {order.status === "pending" && (
                                <DropdownMenuItem onClick={() => quickUpdateStatus(order.id, "processing")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === "processing" && (
                                <DropdownMenuItem onClick={() => quickUpdateStatus(order.id, "shipped")}>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Mark Shipped
                                </DropdownMenuItem>
                              )}
                              {order.status !== "cancelled" && (
                                <DropdownMenuItem onClick={() => quickUpdateStatus(order.id, "cancelled")}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== "all" 
                          ? "Try adjusting your search or filter criteria."
                          : "Orders will appear here when customers place them."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl glass max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> {selectedOrder.shippingAddress?.name}</div>
                    <div><span className="text-muted-foreground">Phone:</span> {selectedOrder.shippingAddress?.phone}</div>
                    <div><span className="text-muted-foreground">Address:</span> {selectedOrder.shippingAddress?.address}</div>
                    <div><span className="text-muted-foreground">City:</span> {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Status:</span> 
                      <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="ml-2">
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                    <div><span className="text-muted-foreground">Payment:</span> 
                      <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.paymentStatus)} className="ml-2">
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                    <div><span className="text-muted-foreground">Payment Method:</span> {selectedOrder.paymentMethod?.toUpperCase()}</div>
                    <div><span className="text-muted-foreground">Shipping:</span> {selectedOrder.shippingMethod}</div>
                    {selectedOrder.trackingNumber && (
                      <div><span className="text-muted-foreground">Tracking:</span> {selectedOrder.trackingNumber}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div>{formatPrice(item.total || 0)}</div>
                          <div className="text-muted-foreground">{formatPrice(item.price || 0)} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatPrice(selectedOrder.shippingFee || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatPrice(selectedOrder.tax || 0)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-white/20 pt-1">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderUpdateForm 
              order={selectedOrder} 
              onUpdate={(updates) => updateOrderMutation.mutate({ orderId: selectedOrder.id, updates })}
              isLoading={updateOrderMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderUpdateForm({ 
  order, 
  onUpdate, 
  isLoading 
}: { 
  order: Order; 
  onUpdate: (updates: any) => void; 
  isLoading: boolean;
}) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      status,
      paymentStatus,
      trackingNumber: trackingNumber || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Order Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
        <Input
          id="trackingNumber"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="glass"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Updating..." : "Update Order"}
        </Button>
      </div>
    </form>
  );
}