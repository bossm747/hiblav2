import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Eye, Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";

export default function AdminPaymentApprovals() {
  const [selectedProof, setSelectedProof] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingProofs = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ["/api/admin/payment-proofs", "pending"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/payment-proofs?status=pending", {});
      return await response.json();
    },
  });

  const { data: allProofs = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["/api/admin/payment-proofs", "all"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/payment-proofs", {});
      return await response.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await apiRequest("POST", `/api/admin/payment-proofs/${id}/approve`, {
        adminNotes: notes,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-proofs"] });
      setSelectedProof(null);
      setAdminNotes("");
      toast({
        title: "Payment Approved",
        description: "Payment has been approved and order updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await apiRequest("POST", `/api/admin/payment-proofs/${id}/reject`, {
        adminNotes: notes,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-proofs"] });
      setSelectedProof(null);
      setAdminNotes("");
      toast({
        title: "Payment Rejected",
        description: "Payment has been rejected with notes",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const PaymentProofCard = ({ proof }: { proof: any }) => (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-foreground">Order #{proof.orderId}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {proof.paymentMethod?.toUpperCase()} • {formatPrice(proof.amount)}
            </p>
          </div>
          {getStatusBadge(proof.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">Customer</Label>
            <p className="font-medium">{proof.customerName || "Unknown"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Reference</Label>
            <p className="font-medium">{proof.referenceNumber || "N/A"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Submitted</Label>
            <p className="font-medium">{formatDate(proof.createdAt)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Amount</Label>
            <p className="font-medium">{formatPrice(proof.amount)}</p>
          </div>
        </div>

        {proof.customerNotes && (
          <div>
            <Label className="text-muted-foreground">Customer Notes</Label>
            <p className="text-sm bg-muted/20 p-2 rounded">{proof.customerNotes}</p>
          </div>
        )}

        {proof.adminNotes && (
          <div>
            <Label className="text-muted-foreground">Admin Notes</Label>
            <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">{proof.adminNotes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedProof(proof)}>
                <Eye className="h-4 w-4 mr-1" />
                Review
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Payment Proof Review - Order #{proof.orderId}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payment Method</Label>
                    <p className="font-medium">{proof.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="font-medium">{formatPrice(proof.amount)}</p>
                  </div>
                  <div>
                    <Label>Reference Number</Label>
                    <p className="font-medium">{proof.referenceNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    {getStatusBadge(proof.status)}
                  </div>
                </div>

                {proof.proofImageUrl && (
                  <div>
                    <Label>Payment Screenshot</Label>
                    <div className="mt-2 border border-white/20 rounded-lg overflow-hidden">
                      <img 
                        src={proof.proofImageUrl} 
                        alt="Payment proof"
                        className="w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {proof.customerNotes && (
                  <div>
                    <Label>Customer Notes</Label>
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <p className="text-sm">{proof.customerNotes}</p>
                    </div>
                  </div>
                )}

                {proof.status === "pending" && (
                  <div>
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this payment verification..."
                      className="glass mt-2"
                      rows={3}
                    />
                  </div>
                )}

                {proof.adminNotes && (
                  <div>
                    <Label>Previous Admin Notes</Label>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm">{proof.adminNotes}</p>
                    </div>
                  </div>
                )}

                {proof.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => approveMutation.mutate({ id: proof.id, notes: adminNotes })}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => rejectMutation.mutate({ id: proof.id, notes: adminNotes })}
                      disabled={rejectMutation.isPending}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Payment
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {proof.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => approveMutation.mutate({ id: proof.id, notes: "" })}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => rejectMutation.mutate({ id: proof.id, notes: "Payment rejected" })}
                disabled={rejectMutation.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Payment Approvals</h1>
          <p className="text-muted-foreground">Review and approve customer payment proofs</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="pending">
              Pending Review ({pendingProofs.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Payments ({allProofs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {isLoadingPending ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : pendingProofs.length === 0 ? (
              <Card className="glass-card text-center py-12">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Payments</h3>
                  <p className="text-muted-foreground">
                    All payment proofs have been reviewed
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingProofs.map((proof: any) => (
                  <PaymentProofCard key={proof.id} proof={proof} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {isLoadingAll ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProofs.map((proof: any) => (
                  <PaymentProofCard key={proof.id} proof={proof} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}