import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, DollarSign, Receipt, RefreshCw, CheckCircle, XCircle, Clock, CreditCard, Banknote, Smartphone, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PaymentRecording() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Fetch invoices
  const { data: invoices = [] } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Fetch payments for selected invoice
  const { data: invoicePayments = [] } = useQuery({
    queryKey: selectedInvoice ? [`/api/payments/invoice/${selectedInvoice}`] : [],
    enabled: !!selectedInvoice,
  });

  // Fetch payments for selected customer
  const { data: customerPayments = [] } = useQuery({
    queryKey: selectedCustomer ? [`/api/payments/customer/${selectedCustomer}`] : [],
    enabled: !!selectedCustomer,
  });

  // Record payment mutation
  const recordPaymentMutation = useMutation({
    mutationFn: (paymentData: any) => apiRequest("/api/payments/record", "POST", paymentData),
    onSuccess: () => {
      toast({
        title: "Payment Recorded",
        description: "Payment has been successfully recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: [`/api/payments/invoice/${selectedInvoice}`] });
      if (selectedCustomer) {
        queryClient.invalidateQueries({ queryKey: [`/api/payments/customer/${selectedCustomer}`] });
      }
      // Reset form
      (document.getElementById("payment-form") as HTMLFormElement)?.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  // Process refund mutation
  const processRefundMutation = useMutation({
    mutationFn: ({ paymentId, amount, notes }: any) => 
      apiRequest(`/api/payments/${paymentId}/refund`, "POST", { amount, notes }),
    onSuccess: () => {
      toast({
        title: "Refund Processed",
        description: "Refund has been successfully processed.",
      });
      queryClient.invalidateQueries();
      setShowRefundDialog(false);
      setSelectedPayment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process refund",
        variant: "destructive",
      });
    },
  });

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const paymentData = {
      invoiceId: formData.get("invoiceId"),
      salesOrderId: formData.get("salesOrderId"),
      customerCode: formData.get("customerCode"),
      amount: formData.get("amount"),
      paymentMethod: formData.get("paymentMethod"),
      paymentDate: paymentDate,
      referenceNumber: formData.get("referenceNumber"),
      notes: formData.get("notes"),
      status: "completed",
      createdBy: "system", // In production, this would be the current user
    };

    recordPaymentMutation.mutate(paymentData);
  };

  const handleRefundSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    processRefundMutation.mutate({
      paymentId: selectedPayment?.id,
      amount: parseFloat(formData.get("refundAmount") as string),
      notes: formData.get("refundNotes") as string,
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "bank_transfer":
        return <Building className="h-4 w-4" />;
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "mobile_payment":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500"><RefreshCw className="h-3 w-3 mr-1" />Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Recording</h1>
        <p className="text-muted-foreground">Record and manage customer payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Recording Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Record Payment
              </CardTitle>
              <CardDescription>Enter payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* Invoice Selection */}
                <div className="space-y-2">
                  <Label htmlFor="invoiceId">Invoice</Label>
                  <Select 
                    name="invoiceId" 
                    value={selectedInvoice} 
                    onValueChange={setSelectedInvoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.map((invoice: any) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber} - ${invoice.total}
                          {invoice.paymentStatus === "paid" && " (Paid)"}
                          {invoice.paymentStatus === "partial" && ` (Partial - $${invoice.paidAmount})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Code */}
                <div className="space-y-2">
                  <Label htmlFor="customerCode">Customer</Label>
                  <Select 
                    name="customerCode" 
                    value={selectedCustomer} 
                    onValueChange={setSelectedCustomer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer: any) => (
                        <SelectItem key={customer.customerCode} value={customer.customerCode}>
                          {customer.customerCode} - {customer.businessName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select name="paymentMethod" defaultValue="bank_transfer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          Cash
                        </div>
                      </SelectItem>
                      <SelectItem value="credit_card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="mobile_payment">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Mobile Payment
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Date */}
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={(date) => date && setPaymentDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Reference Number */}
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    name="referenceNumber"
                    placeholder="Transaction ID or Check Number"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Additional payment notes..."
                    rows={3}
                  />
                </div>

                {/* Hidden fields for now */}
                <input type="hidden" name="salesOrderId" value="" />

                <Button type="submit" className="w-full">
                  Record Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="invoice" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invoice">Invoice Payments</TabsTrigger>
              <TabsTrigger value="customer">Customer Payments</TabsTrigger>
            </TabsList>

            {/* Invoice Payments Tab */}
            <TabsContent value="invoice">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Payment History</CardTitle>
                  <CardDescription>
                    {selectedInvoice ? "Payments for selected invoice" : "Select an invoice to view payments"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invoicePayments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoicePayments.map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.paymentDate), "PP")}</TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                {payment.paymentMethod}
                              </div>
                            </TableCell>
                            <TableCell>{payment.referenceNumber || "-"}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell>
                              {payment.status === "completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setShowRefundDialog(true);
                                  }}
                                >
                                  Refund
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {selectedInvoice ? "No payments recorded for this invoice" : "Select an invoice to view payments"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Payments Tab */}
            <TabsContent value="customer">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Payment History</CardTitle>
                  <CardDescription>
                    {selectedCustomer ? "All payments from selected customer" : "Select a customer to view payments"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customerPayments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerPayments.map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.paymentDate), "PP")}</TableCell>
                            <TableCell>{payment.invoiceId || "-"}</TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                {payment.paymentMethod}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {selectedCustomer ? "No payments recorded for this customer" : "Select a customer to view payments"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Refund payment of ${selectedPayment?.amount} from {selectedPayment?.paymentDate && format(new Date(selectedPayment.paymentDate), "PP")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRefundSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="refundAmount"
                  name="refundAmount"
                  type="number"
                  step="0.01"
                  max={selectedPayment?.amount}
                  placeholder="0.00"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundNotes">Refund Notes</Label>
              <Textarea
                id="refundNotes"
                name="refundNotes"
                placeholder="Reason for refund..."
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowRefundDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Process Refund</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}