import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle, XCircle, Clock, Wallet } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface NexusPayPaymentProps {
  orderId: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

interface NexusPayBalance {
  balance: number;
  currency: string;
}

export const NexusPayPayment: React.FC<NexusPayPaymentProps> = ({
  orderId,
  amount,
  onSuccess,
  onError,
}) => {
  const [description, setDescription] = useState('');
  const [balance, setBalance] = useState<NexusPayBalance | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get wallet balance
  const getBalanceMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/nexuspay/balance');
      return await response.json();
    },
    onSuccess: (data) => {
      setBalance(data);
    },
    onError: () => {
      toast({
        title: 'Balance Error',
        description: 'Unable to fetch wallet balance',
        variant: 'destructive',
      });
    },
  });

  // Process payment
  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/nexuspay/cash-in', {
        orderId,
        amount,
        description: description || `Payment for order ${orderId}`,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Payment Successful',
          description: `Payment processed successfully. Transaction ID: ${data.transactionId}`,
        });
        onSuccess(data.transactionId);
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      } else {
        const errorMessage = data.message || 'Payment processing failed';
        toast({
          title: 'Payment Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        onError(errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Payment processing failed';
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onError(errorMessage);
    },
  });

  const handlePayment = () => {
    if (balance && balance.balance < amount) {
      toast({
        title: 'Insufficient Balance',
        description: `Your wallet balance (₱${balance.balance.toFixed(2)}) is insufficient for this payment (₱${amount.toFixed(2)})`,
        variant: 'destructive',
      });
      return;
    }
    processPaymentMutation.mutate();
  };

  const getStatusIcon = () => {
    if (processPaymentMutation.isPending) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (processPaymentMutation.isSuccess) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (processPaymentMutation.isError) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getStatusText = () => {
    if (processPaymentMutation.isPending) return 'Processing payment...';
    if (processPaymentMutation.isSuccess) return 'Payment completed successfully';
    if (processPaymentMutation.isError) return 'Payment failed';
    return 'Ready to process payment';
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (processPaymentMutation.isPending) return 'outline';
    if (processPaymentMutation.isSuccess) return 'default';
    if (processPaymentMutation.isError) return 'destructive';
    return 'secondary';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CreditCard className="h-5 w-5" />
          NexusPay Digital Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge variant={getStatusVariant()}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Payment Amount</span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">₱{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700 dark:text-blue-300">Order ID</span>
              <span className="text-sm font-mono text-blue-800 dark:text-blue-200">{orderId}</span>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => getBalanceMutation.mutate()}
              disabled={getBalanceMutation.isPending}
              className="glass"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {getBalanceMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Check Balance'
              )}
            </Button>
            {balance && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Wallet Balance</div>
                <div className={`font-semibold ${
                  balance.balance >= amount ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₱{balance.balance.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Payment Description */}
          <div>
            <Label htmlFor="description">Payment Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Enter payment description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass"
              disabled={processPaymentMutation.isPending || processPaymentMutation.isSuccess}
            />
          </div>

          {/* Balance Warning */}
          {balance && balance.balance < amount && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient wallet balance. Please add funds to your NexusPay wallet before proceeding.
                Current balance: ₱{balance.balance.toFixed(2)}
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Instructions */}
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">How NexusPay Payment Works:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Check your wallet balance to ensure sufficient funds</li>
                  <li>Click "Process Payment" to initiate the transaction</li>
                  <li>Your wallet will be debited automatically</li>
                  <li>Payment confirmation will be instant</li>
                  <li>Order status will be updated immediately</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handlePayment}
            disabled={
              processPaymentMutation.isPending || 
              processPaymentMutation.isSuccess ||
              (balance && balance.balance < amount)
            }
            className="flex-1"
          >
            {processPaymentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : processPaymentMutation.isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Payment Completed
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NexusPayPayment;