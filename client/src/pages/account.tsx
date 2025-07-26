import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { User, ShoppingBag, Heart, Settings, LogOut, Edit, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Customer, Order, Product } from "@shared/schema";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { toast } = useToast();

  // Mock customer data - replace with actual authentication
  const customer: Customer = {
    id: "customer-1",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+63 917 123 4567",
    shippingAddress: "123 Rizal Street, Makati City",
    billingAddress: "123 Rizal Street, Makati City",
    city: "Makati",
    province: "Metro Manila",
    postalCode: "1200",
    totalOrders: 15,
    totalSpent: "45,650.00",
    lastOrder: new Date(),
    status: "active",
    emailVerified: true,
    createdAt: new Date(),
  };

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders", { customerId: customer.id }],
    queryFn: async () => {
      const response = await fetch(`/api/orders?customerId=${customer.id}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  const { data: wishlist, isLoading: wishlistLoading } = useQuery<Product[]>({
    queryKey: ["/api/wishlist", { customerId: customer.id }],
    queryFn: async () => {
      const response = await fetch(`/api/wishlist?customerId=${customer.id}`);
      if (!response.ok) throw new Error("Failed to fetch wishlist");
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">{customer.name}</h2>
                <p className="text-muted-foreground mb-4">{customer.email}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{customer.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-sm text-muted-foreground">Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 glass-card">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-24 bg-white/10 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-white/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground">Order #{order.orderNumber}</h3>
                                <Badge className={`${getStatusColor(order.status)} text-white`}>
                                  {order.status.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.createdAt || new Date())}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Payment: {order.paymentMethod} • Shipping: {order.shippingMethod}
                                </p>
                                <p className="font-semibold text-foreground">
                                  Total: {formatPrice(order.total)}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Package className="h-4 w-4 mr-2" />
                                Track Order
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start shopping to see your order history here.
                        </p>
                        <Button>Browse Products</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">My Wishlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {wishlistLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-64 bg-white/10 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : wishlist && wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((product) => (
                          <div key={product.id} className="border border-white/20 rounded-lg p-4">
                            <img
                              src={product.featuredImage || product.images?.[0] || "https://via.placeholder.com/200x200?text=Hair+Extension"}
                              alt={product.name}
                              className="w-full h-40 object-cover rounded mb-3"
                            />
                            <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{product.hairType}</Badge>
                              {product.texture && <Badge variant="outline">{product.texture}</Badge>}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">
                                {formatPrice(product.price)}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button size="sm">
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-4">
                          Save your favorite hair extensions to your wishlist.
                        </p>
                        <Button>Browse Products</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Personal Information</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="text-foreground">{customer.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-foreground">{customer.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="text-foreground">{customer.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Address Information</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Shipping Address</p>
                            <p className="text-foreground">{customer.shippingAddress}</p>
                            <p className="text-foreground">{customer.city}, {customer.province} {customer.postalCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/20 pt-6">
                      <h3 className="font-semibold text-foreground mb-3">Account Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 border border-white/20 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{customer.totalOrders}</p>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                        <div className="text-center p-4 border border-white/20 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{formatPrice(customer.totalSpent)}</p>
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="text-center p-4 border border-white/20 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">4.9</p>
                          <p className="text-sm text-muted-foreground">Avg Rating</p>
                        </div>
                        <div className="text-center p-4 border border-white/20 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{formatDate(customer.createdAt)}</p>
                          <p className="text-sm text-muted-foreground">Member Since</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}