
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { CreditCard, CheckCircle, XCircle, ArrowLeft, Clock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NexusPayPayment } from "@/components/nexuspay-payment";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gcashNumber, setGcashNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState("");

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return response.json();
    },
    enabled: !!orderId,
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      return apiRequest(`/api/orders/${orderId}/payment`, {
        method: "POST",
        body: paymentData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Payment Submitted",
        description: "Your payment has been submitted for verification.",
      });
      setLocation(`/order-confirmation/${orderId}`);
    },
    onError: () => {
      toast({
        title: "Payment Error",
        description: "Failed to submit payment. Please try again.",
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

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "gcash" && (!gcashNumber || !referenceNumber)) {
      toast({
        title: "GCash Details Required",
        description: "Please provide your GCash number and reference number.",
        variant: "destructive",
      });
      return;
    }

    const paymentData = {
      paymentMethod,
      gcashNumber: paymentMethod === "gcash" ? gcashNumber : undefined,
      referenceNumber: paymentMethod === "gcash" ? referenceNumber : undefined,
      paymentProof,
    };

    confirmPaymentMutation.mutate(paymentData);
  };

  const handleNexusPaySuccess = (transactionId: string) => {
    setLocation(`/order-confirmation/${orderId}`);
  };

  const handleNexusPayError = (error: string) => {
    toast({
      title: "NexusPay Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4" />
            <div className="h-64 bg-white/10 rounded" />
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
              The order you're looking for doesn't exist.
            </p>
            <Button onClick={() => setLocation("/products")}>
              Continue Shopping
            </Button>
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
          <Button variant="outline" size="sm" onClick={() => setLocation(`/order-confirmation/${orderId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order
          </Button>
          <h1 className="text-3xl font-bold text-foreground neon-text-cyan">Complete Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                    <RadioGroupItem value="gcash" id="gcash" />
                    <Label htmlFor="gcash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-foreground">GCash</p>
                          <p className="text-sm text-muted-foreground">Send payment to our GCash account</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/20">
                    <RadioGroupItem value="nexuspay" id="nexuspay" />
                    <Label htmlFor="nexuspay" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-foreground">NexusPay Digital Wallet</p>
                          <p className="text-sm text-muted-foreground">Pay instantly with your digital wallet</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* GCash Payment Form */}
            {paymentMethod === "gcash" && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>GCash Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Send payment to:</p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                          <p className="font-mono text-blue-900 dark:text-blue-100">GCash Number: 09171234567</p>
                          <p className="font-mono text-blue-900 dark:text-blue-100">Account Name: Hibla Hair Extensions</p>
                          <p className="font-mono text-blue-900 dark:text-blue-100">Amount: {formatPrice(order.total || 0)}</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="gcashNumber">Your GCash Number</Label>
                    <Input
                      id="gcashNumber"
                      placeholder="09XXXXXXXXX"
                      value={gcashNumber}
                      onChange={(e) => setGcashNumber(e.target.value)}
                      className="glass"
                    />
                  </div>

                  <div>
                    <Label htmlFor="referenceNumber">GCash Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      placeholder="Enter reference number from GCash receipt"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="glass"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentProof">Additional Notes (Optional)</Label>
                    <Textarea
                      id="paymentProof"
                      placeholder="Any additional information about your payment"
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      className="glass"
                    />
                  </div>

                  <Button 
                    onClick={handlePaymentSubmit}
                    disabled={confirmPaymentMutation.isPending}
                    className="w-full"
                  >
                    {confirmPaymentMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Submitting Payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Payment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* NexusPay Payment */}
            {paymentMethod === "nexuspay" && (
              <NexusPayPayment
                orderId={orderId!}
                amount={parseFloat(order.total || "0")}
                onSuccess={handleNexusPaySuccess}
                onError={handleNexusPayError}
              />
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="glass-card sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Order Number:</span>
                  <Badge variant="outline">{order.orderNumber}</Badge>
                </div>

                <div className="space-y-2">
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
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total Amount</span>
                      <span>{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Payment Status: <Badge variant="secondary">Pending</Badge></p>
                    <p>Order Status: <Badge variant="secondary">{order.status}</Badge></p>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm">Your payment information is protected with SSL encryption.</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
