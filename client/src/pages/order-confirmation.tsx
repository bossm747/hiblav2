import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { CheckCircle, Package, MapPin, CreditCard, ArrowLeft, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Order, OrderItem } from "@shared/schema";

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return response.json();
    },
    enabled: !!orderId,
  });

  const { data: orderItems } = useQuery<OrderItem[]>({
    queryKey: ["/api/orders", orderId, "items"],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}/items`);
      if (!response.ok) throw new Error("Failed to fetch order items");
      return response.json();
    },
    enabled: !!orderId,
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      toast({
        title: "Copied!",
        description: "Order number copied to clipboard",
      });
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "cod": return "Cash on Delivery";
      case "gcash": return "GCash";
      case "maya": return "Maya";
      case "card": return "Credit/Debit Card";
      case "bank_transfer": return "Bank Transfer";
      default: return method;
    }
  };

  const getShippingMethodDisplay = (method: string) => {
    switch (method) {
      case "standard": return "Standard Shipping (5-7 days)";
      case "express": return "Express Shipping (2-3 days)";
      case "pickup": return "Store Pickup";
      default: return method;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-white/10 rounded" />
                <div className="h-64 bg-white/10 rounded" />
              </div>
              <div className="h-96 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground neon-text-cyan mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-4">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
              <span>Order #{order.orderNumber}</span>
              <Button variant="ghost" size="sm" onClick={copyOrderNumber}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  {order.trackingNumber && (
                    <div className="text-sm text-muted-foreground">
                      Tracking: {order.trackingNumber}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Order placed on {new Date(order.createdAt!).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-b-0">
                      <img
                        src={item.productImage || "https://via.placeholder.com/100x100?text=Hair+Extension"}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.productName}</h3>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {formatPrice(item.total)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress && (
                  <div className="text-foreground">
                    <div className="font-semibold">{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.phone}</div>
                    <div className="mt-2">
                      <div>{order.shippingAddress.address}</div>
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment & Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span>{parseFloat(order.shippingFee || "0") === 0 ? "FREE" : formatPrice(order.shippingFee || 0)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (VAT 12%)</span>
                  <span>{formatPrice(order.tax || 0)}</span>
                </div>
                {parseFloat(order.discount || "0") > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount || 0)}</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(order.total || 0)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/20">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Payment Method: </span>
                    <span className="text-foreground font-medium">
                      {getPaymentMethodDisplay(order.paymentMethod!)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Shipping Method: </span>
                    <span className="text-foreground font-medium">
                      {getShippingMethodDisplay(order.shippingMethod!)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Payment Status: </span>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                      {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Link href="/products">
                <Button className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
            </div>

            {/* Contact Support */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our customer service team for any questions about your order.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="text-foreground">
                    <span className="text-muted-foreground">Email: </span>
                    support@hibla.com
                  </div>
                  <div className="text-foreground">
                    <span className="text-muted-foreground">Phone: </span>
                    +63 917 123 4567
                  </div>
                  <div className="text-foreground">
                    <span className="text-muted-foreground">Hours: </span>
                    Mon-Fri 9AM-6PM
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}