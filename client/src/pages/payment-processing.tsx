import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, Smartphone, Building, Receipt, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/navbar";

interface PaymentData {
  orderId: string;
  paymentMethod: string;
  amount: number;
  referenceNumber?: string;
  accountNumber?: string;
  proofOfPayment?: string;
  notes?: string;
}

export default function PaymentProcessing() {
  const [, params] = useRoute("/payment/:orderId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<PaymentData>({
    orderId: params?.orderId || "",
    paymentMethod: "",
    amount: 0,
    referenceNumber: "",
    accountNumber: "",
    proofOfPayment: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get order data from localStorage or API
    const orderData = localStorage.getItem('pendingOrder');
    if (orderData) {
      const order = JSON.parse(orderData);
      setPaymentData(prev => ({
        ...prev,
        paymentMethod: order.paymentMethod,
        amount: order.total
      }));
    }
  }, []);

  const processPaymentMutation = useMutation({
    mutationFn: async (data: PaymentData) => {
      const response = await apiRequest("POST", "/api/payments/process", data);
      return await response.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem('pendingOrder');
      toast({
        title: "Payment Processed!",
        description: "Your payment has been submitted successfully.",
      });
      setLocation(`/payment-success/${data.orderId}`);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await processPaymentMutation.mutateAsync(paymentData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const getPaymentIcon = () => {
    switch (paymentData.paymentMethod) {
      case "gcash":
        return <Smartphone className="h-6 w-6 text-blue-500" />;

      case "cod":
        return <Receipt className="h-6 w-6 text-orange-500" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPaymentInstructions = () => {
    switch (paymentData.paymentMethod) {
      case "gcash":
        return {
          title: "GCash P2P Transfer",
          instructions: [
            "Open your GCash app",
            "Go to Send Money",
            "Enter our GCash number: 09178-HIBLA-1 (09178-442521)",
            "Enter the exact amount: " + formatPrice(paymentData.amount),
            "Use your order ID as message: " + paymentData.orderId,
            "Complete the transaction",
            "Screenshot the confirmation receipt"
          ],
          accountInfo: "GCash Number: 09178-442521\nAccount Name: Maria Santos\nHibla Filipino Hair"
        };
      case "cod":
        return {
          title: "Cash on Delivery",
          instructions: [
            "Your order will be delivered to your address",
            "Prepare the exact amount: " + formatPrice(paymentData.amount),
            "Pay the delivery person when you receive your order",
            "No further action needed for now"
          ],
          accountInfo: "Amount to prepare: " + formatPrice(paymentData.amount)
        };
      default:
        return { title: "Payment", instructions: [], accountInfo: "" };
    }
  };

  const paymentInfo = getPaymentInstructions();

  if (paymentData.paymentMethod === "cod") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-foreground">Order Confirmed!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Cash on Delivery Selected
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your order has been confirmed! Pay {formatPrice(paymentData.amount)} when you receive your hair extensions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">Order ID: {paymentData.orderId}</p>
                  <p className="text-muted-foreground">Amount to pay: {formatPrice(paymentData.amount)}</p>
                </div>

                <Button 
                  onClick={() => setLocation(`/order-confirmation/${paymentData.orderId}`)}
                  className="w-full"
                >
                  View Order Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Instructions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  {getPaymentIcon()}
                  {paymentInfo.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Payment Instructions</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    {paymentInfo.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Details</h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line font-mono">
                    {paymentInfo.accountInfo}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important</h3>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please transfer the exact amount: {formatPrice(paymentData.amount)}. 
                    Upload your payment proof below to confirm your order.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Confirmation Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-foreground">Confirm Your Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="referenceNumber">Reference/Transaction Number</Label>
                    <Input
                      id="referenceNumber"
                      placeholder="Enter transaction reference number"
                      value={paymentData.referenceNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                      className="glass"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="accountNumber">Your Account Number (Last 4 digits)</Label>
                    <Input
                      id="accountNumber"
                      placeholder="XXXX"
                      value={paymentData.accountNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="glass"
                      maxLength={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Payment Screenshot Description</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe your payment screenshot (e.g., 'GCash receipt showing ₱2,500 sent to 09178-442521 at 3:15 PM today')"
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                      className="glass"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Describe your payment details so we can verify faster
                    </p>
                  </div>



                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatPrice(paymentData.amount)}
                      </span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || !paymentData.referenceNumber}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        "Confirm Payment"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}