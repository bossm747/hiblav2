import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Package, FileText, CreditCard, Truck, Upload, Eye } from 'lucide-react';
import { HiblaLogo } from '@/components/HiblaLogo';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface QuotationDetails {
  id: string;
  quotationNumber: string;
  customerCode: string;
  country: string;
  status: string;
  subtotal: string;
  shippingFee: string;
  bankCharge: string;
  discount: string;
  total: string;
  paymentMethod: string;
  shippingMethod: string;
  items: Array<{
    productName: string;
    specification: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  }>;
  createdAt: string;
}

interface OrderDetails {
  id: string;
  salesOrderNumber: string;
  status: string;
  total: string;
  paymentStatus?: string;
  shippingStatus?: string;
  trackingNumber?: string;
  createdAt: string;
}

export default function CustomerPortal() {
  const [location] = useLocation();
  const [loading, setLoading] = useState(false);
  const [quotation, setQuotation] = useState<QuotationDetails | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [activeTab, setActiveTab] = useState('quotation');
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const { toast } = useToast();

  // Parse query parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const quotationId = searchParams.get('quotation');
  const action = searchParams.get('action');

  useEffect(() => {
    if (quotationId && token) {
      fetchQuotationDetails();
      if (action === 'approve') {
        handleApproveQuotation();
      }
    }
    fetchCustomerOrders();
  }, [quotationId, token]);

  const fetchQuotationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotations/${quotationId}`);
      if (response.ok) {
        const data = await response.json();
        setQuotation(data);
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quotation details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async () => {
    try {
      // This would need customer authentication in production
      const response = await fetch('/api/customer-portal/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleApproveQuotation = async () => {
    if (!token || !quotationId) return;

    try {
      setLoading(true);
      const response = await apiRequest('/api/customer-portal/approve-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          quotationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success!',
          description: 'Quotation approved successfully. Sales order has been created.',
        });
        setQuotation({ ...quotation!, status: 'approved' });
        fetchCustomerOrders(); // Refresh orders
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to approve quotation',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving quotation:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve quotation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectQuotation = async () => {
    if (!quotationId) return;

    try {
      setLoading(true);
      const response = await apiRequest(`/api/quotations/${quotationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Customer rejected via portal',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Quotation Rejected',
          description: 'The quotation has been rejected.',
        });
        setQuotation({ ...quotation!, status: 'rejected' });
      }
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject quotation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentProofUpload = async (orderId: string, file: File) => {
    setUploadingPayment(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', orderId);
    formData.append('paymentMethod', 'Bank Transfer');
    formData.append('amount', quotation?.total || '0');
    formData.append('referenceNumber', `REF-${Date.now()}`);

    try {
      const response = await fetch('/api/payment-proofs', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Payment Proof Uploaded',
          description: 'Your payment proof has been submitted for verification.',
        });
        fetchCustomerOrders();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload payment proof. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPayment(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'pending':
      case 'draft':
        return 'secondary';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      case 'in_production':
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <HiblaLogo size="xl" showText />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Customer Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your quotations, orders, and shipments
          </p>
        </div>

        {loading && !quotation ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="quotation" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quotation
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping
              </TabsTrigger>
            </TabsList>

            {/* Quotation Tab */}
            <TabsContent value="quotation">
              {quotation ? (
                <Card className="max-w-4xl mx-auto shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">
                          Quotation #{quotation.quotationNumber}
                        </CardTitle>
                        <CardDescription>
                          Created on {format(new Date(quotation.createdAt), 'PPP')}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(quotation.status)}>
                        {quotation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Customer Info */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Customer Code:</span>
                          <span className="ml-2 font-medium">{quotation.customerCode}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Country:</span>
                          <span className="ml-2 font-medium">{quotation.country}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Items */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-4">Products</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Product</th>
                              <th className="text-left py-2">Specification</th>
                              <th className="text-right py-2">Qty</th>
                              <th className="text-right py-2">Unit Price</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quotation.items?.map((item, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2">{item.specification}</td>
                                <td className="text-right py-2">{item.quantity}</td>
                                <td className="text-right py-2">${item.unitPrice}</td>
                                <td className="text-right py-2">${item.lineTotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Pricing Summary */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-4">Pricing Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-medium">${quotation.subtotal}</span>
                        </div>
                        {quotation.shippingFee && (
                          <div className="flex justify-between">
                            <span>Shipping Fee:</span>
                            <span className="font-medium">${quotation.shippingFee}</span>
                          </div>
                        )}
                        {quotation.bankCharge && (
                          <div className="flex justify-between">
                            <span>Bank Charge:</span>
                            <span className="font-medium">${quotation.bankCharge}</span>
                          </div>
                        )}
                        {quotation.discount && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span className="font-medium">-${quotation.discount}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>${quotation.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {quotation.status === 'draft' || quotation.status === 'pending' ? (
                      <div className="flex gap-4 justify-end">
                        <Button
                          variant="outline"
                          onClick={handleRejectQuotation}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={handleApproveQuotation}
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve Quotation
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        {quotation.status === 'approved' && (
                          <p className="text-green-600 font-medium">
                            ✓ This quotation has been approved
                          </p>
                        )}
                        {quotation.status === 'rejected' && (
                          <p className="text-red-600 font-medium">
                            ✗ This quotation has been rejected
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No quotation selected</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Access this page through the link in your email
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="max-w-4xl mx-auto space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <Card key={order.id} className="shadow-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              Order #{order.salesOrderNumber}
                            </CardTitle>
                            <CardDescription>
                              Created on {format(new Date(order.createdAt), 'PPP')}
                            </CardDescription>
                          </div>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Total Amount:</span>
                            <p className="font-medium">${order.total}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment Status:</span>
                            <p className="font-medium">{order.paymentStatus || 'Pending'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Shipping Status:</span>
                            <p className="font-medium">{order.shippingStatus || 'Not Shipped'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Tracking:</span>
                            <p className="font-medium">{order.trackingNumber || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders found</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Your orders will appear here once created
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment">
              <Card className="max-w-2xl mx-auto shadow-card">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Upload payment proof for your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.filter(o => o.status === 'draft' || o.paymentStatus === 'pending').length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Select an order and upload your payment proof:
                      </p>
                      {orders
                        .filter(o => o.status === 'draft' || o.paymentStatus === 'pending')
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <p className="font-medium">Order #{order.salesOrderNumber}</p>
                                <p className="text-sm text-gray-500">Amount: ${order.total}</p>
                              </div>
                              <Badge variant="secondary">Payment Pending</Badge>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                id={`payment-${order.id}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handlePaymentProofUpload(order.id, file);
                                  }
                                }}
                              />
                              <label htmlFor={`payment-${order.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={uploadingPayment}
                                  asChild
                                >
                                  <span>
                                    {uploadingPayment ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    Upload Payment Proof
                                  </span>
                                </Button>
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pending payments</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Payment requirements will appear here when needed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Tab */}
            <TabsContent value="shipping">
              <Card className="max-w-2xl mx-auto shadow-card">
                <CardHeader>
                  <CardTitle>Shipping & Tracking</CardTitle>
                  <CardDescription>
                    Track your shipments and delivery status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.filter(o => o.shippingStatus === 'shipped' || o.trackingNumber).length > 0 ? (
                    <div className="space-y-4">
                      {orders
                        .filter(o => o.shippingStatus === 'shipped' || o.trackingNumber)
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium">Order #{order.salesOrderNumber}</p>
                                <p className="text-sm text-gray-500">
                                  Tracking: {order.trackingNumber || 'Processing'}
                                </p>
                              </div>
                              <Badge variant="outline">
                                <Truck className="h-3 w-3 mr-1" />
                                {order.shippingStatus || 'In Transit'}
                              </Badge>
                            </div>
                            {order.trackingNumber && (
                              <Button variant="outline" size="sm" className="w-full">
                                Track Package
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No shipments yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Tracking information will appear here once your order ships
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}