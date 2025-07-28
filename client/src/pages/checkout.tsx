import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { CreditCard, MapPin, User, Phone, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import type { Cart, Product } from "@shared/schema";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(11, "Valid phone number is required"),
  address: z.string().min(10, "Address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  paymentMethod: z.enum(["cod", "gcash", "maya", "card", "bank_transfer"]),
  shippingMethod: z.enum(["standard", "express", "pickup"]),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cartItems, isLoading } = useQuery<(Cart & { product: Product })[]>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      shippingMethod: "standard",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutFormData) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return await response.json();
    },
    onSuccess: (data) => {
      // Store order data for payment processing
      localStorage.setItem('pendingOrder', JSON.stringify(data));
      
      if (data.paymentMethod === 'cod') {
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${data.orderNumber} has been placed.`,
        });
        setLocation(`/order-confirmation/${data.id}`);
      } else {
        toast({
          title: "Order Created!",
          description: "Please proceed with payment to confirm your order.",
        });
        setLocation(`/payment/${data.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
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

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      await createOrderMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems?.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0) || 0;

  const shippingMethod = form.watch("shippingMethod");
  const getShippingCost = () => {
    if (subtotal > 2000) return 0; // Free shipping over ₱2000
    switch (shippingMethod) {
      case "standard": return 150;
      case "express": return 300;
      case "pickup": return 0;
      default: return 150;
    }
  };

  const shipping = getShippingCost();
  const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-white/10 rounded" />
                <div className="h-64 bg-white/10 rounded" />
              </div>
              <div className="h-96 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="glass-card p-12 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">No items to checkout</h2>
              <p className="text-muted-foreground mb-6">
                Your cart is empty. Add some hair extensions to proceed with checkout.
              </p>
              <Button onClick={() => setLocation("/products")}>
                Continue Shopping
              </Button>
            </div>
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
          <Button variant="outline" size="sm" onClick={() => setLocation("/cart")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-foreground neon-text-cyan">Checkout</h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="glass"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Juan"
                        className="glass"
                        {...form.register("firstName")}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Dela Cruz"
                        className="glass"
                        {...form.register("lastName")}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+63 9XX XXX XXXX"
                      className="glass"
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="House/Unit/Floor #, Building Name, Street Name"
                      className="glass"
                      {...form.register("address")}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Manila"
                        className="glass"
                        {...form.register("city")}
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        placeholder="Metro Manila"
                        className="glass"
                        {...form.register("province")}
                      />
                      {form.formState.errors.province && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.province.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="1000"
                      className="glass"
                      {...form.register("postalCode")}
                    />
                    {form.formState.errors.postalCode && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.postalCode.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={form.watch("shippingMethod")} 
                    onValueChange={(value) => form.setValue("shippingMethod", value as any)}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="standard" id="standard" />
                      <label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-foreground">Standard Delivery</p>
                            <p className="text-sm text-muted-foreground">5-7 business days</p>
                          </div>
                          <p className="font-medium text-foreground">
                            {subtotal > 2000 ? "FREE" : "₱150"}
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="express" id="express" />
                      <label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-foreground">Express Delivery</p>
                            <p className="text-sm text-muted-foreground">2-3 business days</p>
                          </div>
                          <p className="font-medium text-foreground">₱300</p>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-foreground">Store Pickup</p>
                            <p className="text-sm text-muted-foreground">Available next day</p>
                          </div>
                          <p className="font-medium text-foreground">FREE</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={form.watch("paymentMethod")} 
                    onValueChange={(value) => form.setValue("paymentMethod", value as any)}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="cod" id="cod" />
                      <label htmlFor="cod" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">Cash on Delivery (COD)</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="gcash" id="gcash" />
                      <label htmlFor="gcash" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">GCash</p>
                        <p className="text-sm text-muted-foreground">Pay instantly with GCash</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="maya" id="maya" />
                      <label htmlFor="maya" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">Maya (PayMaya)</p>
                        <p className="text-sm text-muted-foreground">Pay instantly with Maya</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">Transfer to our bank account</p>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for your order..."
                    className="glass"
                    {...form.register("notes")}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card sticky top-4">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.product.featuredImage || item.product.images?.[0] || "https://via.placeholder.com/60x60?text=Hair"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(parseFloat(item.product.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/20 pt-4 space-y-2">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Tax (VAT 12%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2">
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}