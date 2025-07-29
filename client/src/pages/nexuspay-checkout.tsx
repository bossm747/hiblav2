import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { NexusPayPayment } from '@/components/nexuspay-payment';
import { ArrowLeft, CreditCard, ShoppingCart, Clock, CheckCircle } from 'lucide-react';

interface NexusPayCheckoutProps {
  orderId?: string;
  amount?: number;
}

export default function NexusPayCheckout({ orderId, amount }: NexusPayCheckoutProps = {}) {
  const [, setLocation] = useLocation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');

  // Get URL params if not provided as props
  const urlParams = new URLSearchParams(window.location.search);
  const finalOrderId = orderId || urlParams.get('orderId') || '';
  const finalAmount = amount || parseFloat(urlParams.get('amount') || '0');

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['/api/orders', finalOrderId],
    enabled: !!finalOrderId,
  });

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId);
    setPaymentSuccess(true);
    
    // Redirect to order confirmation after 3 seconds
    setTimeout(() => {
      setLocation(`/order-confirmation/${finalOrderId}`);
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Could redirect to payment failed page or show retry option
  };

  if (!finalOrderId || !finalAmount) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="glass-card max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Invalid Payment Request</h2>
              <p className="text-muted-foreground mb-6">Missing order information. Please try again.</p>
              <Button onClick={() => setLocation('/checkout')}>
                Return to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card text-center">
              <CardContent className="py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Your payment has been processed successfully using NexusPay.
                </p>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Transaction ID:</span>
                      <span className="text-sm font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Order ID:</span>
                      <span className="text-sm font-mono">{finalOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount Paid:</span>
                      <span className="text-sm font-bold">₱{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Redirecting to order confirmation in 3 seconds...
                </p>

                <Button onClick={() => setLocation(`/order-confirmation/${finalOrderId}`)}>
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
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation('/checkout')}
              className="glass"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkout
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">NexusPay Payment</h1>
              <p className="text-muted-foreground">Complete your payment using NexusPay digital wallet</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ) : order ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-mono text-sm">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <Badge 
                        variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <hr className="border-white/20" />
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-2xl">₱{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Unable to load order details. Please check your order ID and try again.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Payment Method Info */}
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">NexusPay Digital Wallet</span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Fast, secure, and instant payment processing using NexusPay's digital wallet system.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* NexusPay Payment Component */}
            <NexusPayPayment
              orderId={finalOrderId}
              amount={finalAmount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {/* Additional Information */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Payment Security & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-foreground">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">All payments are encrypted and secure</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-foreground">Instant Processing</h3>
                  <p className="text-sm text-muted-foreground">Payments are processed immediately</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-foreground">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Get help anytime you need it</p>
                </div>
              </div>
              
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  <strong>Need help?</strong> If you encounter any issues with your NexusPay payment, 
                  please contact our support team at support@hibla.com or call +63 917 844 2521.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}