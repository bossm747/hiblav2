import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Clock } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function PaymentSuccess() {
  const [, params] = useRoute("/payment-success/:orderId");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Clear any pending order data
    localStorage.removeItem('pendingOrder');
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-foreground">Payment Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Thank You for Your Payment
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  We've received your payment details and will verify them within 24 hours. 
                  You'll receive an email confirmation once your payment is verified.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Next Steps</h4>
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Payment verification (24 hours)</li>
                    <li>• Order processing (1-2 days)</li>
                    <li>• Shipping preparation</li>
                    <li>• Delivery tracking sent</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Order Status</h4>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Track your order status in your account dashboard
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground">Order ID: {params?.orderId}</p>
                <p className="text-sm text-muted-foreground">
                  Keep this order ID for your records and customer support inquiries
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => setLocation(`/order-confirmation/${params?.orderId}`)}
                  className="flex-1"
                >
                  View Order Details
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/products")}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-muted-foreground">
                  Questions about your order? Contact us at <br />
                  <span className="text-foreground font-medium">support@hibla.com</span> or <span className="text-foreground font-medium">09178-442521</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}