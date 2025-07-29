
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Package, Eye, ArrowLeft, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Order } from "@shared/schema";

export default function OrdersPage() {
  const customerId = "demo-customer-1"; // For demo purposes

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/customer", customerId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/customer/${customerId}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
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

  const filterOrdersByStatus = (status?: string) => {
    if (!orders) return [];
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground neon-text-cyan">My Orders</h1>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="all">All Orders ({orders?.length || 0})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterOrdersByStatus("pending").length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({filterOrdersByStatus("processing").length})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({filterOrdersByStatus("shipped").length})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({filterOrdersByStatus("delivered").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <OrdersList orders={orders || []} formatPrice={formatPrice} getStatusIcon={getStatusIcon} getStatusBadgeVariant={getStatusBadgeVariant} />
          </TabsContent>
          
          <TabsContent value="pending">
            <OrdersList orders={filterOrdersByStatus("pending")} formatPrice={formatPrice} getStatusIcon={getStatusIcon} getStatusBadgeVariant={getStatusBadgeVariant} />
          </TabsContent>
          
          <TabsContent value="processing">
            <OrdersList orders={filterOrdersByStatus("processing")} formatPrice={formatPrice} getStatusIcon={getStatusIcon} getStatusBadgeVariant={getStatusBadgeVariant} />
          </TabsContent>
          
          <TabsContent value="shipped">
            <OrdersList orders={filterOrdersByStatus("shipped")} formatPrice={formatPrice} getStatusIcon={getStatusIcon} getStatusBadgeVariant={getStatusBadgeVariant} />
          </TabsContent>
          
          <TabsContent value="delivered">
            <OrdersList orders={filterOrdersByStatus("delivered")} formatPrice={formatPrice} getStatusIcon={getStatusIcon} getStatusBadgeVariant={getStatusBadgeVariant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface OrdersListProps {
  orders: Order[];
  formatPrice: (price: string | number) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

function OrdersList({ orders, formatPrice, getStatusIcon, getStatusBadgeVariant }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass-card p-8">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet.
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground">
                  Order #{order.orderNumber}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt!).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod?.toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Shipping: {order.shippingMethod === "standard" ? "Standard (5-7 days)" : 
                           order.shippingMethod === "express" ? "Express (2-3 days)" : "Store Pickup"}
                </p>
                {order.trackingNumber && (
                  <p className="text-sm text-muted-foreground">
                    Tracking: {order.trackingNumber}
                  </p>
                )}
              </div>
              <div className="text-right space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  {formatPrice(order.total || 0)}
                </p>
                <div className="flex gap-2">
                  <Link href={`/order-confirmation/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  {order.status === "pending" && order.paymentMethod !== "cod" && (
                    <Link href={`/payment/${order.id}`}>
                      <Button size="sm">
                        Complete Payment
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
