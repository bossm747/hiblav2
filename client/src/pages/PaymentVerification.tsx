import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, FileImage, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentProof {
  id: string;
  salesOrderId: string;
  salesOrderNumber?: string;
  customerId: string;
  customerName?: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  proofDocument: string;
  referenceNumber: string;
  notes: string;
  status: string;
  verificationNotes?: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function PaymentVerification() {
  const { toast } = useToast();
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: paymentProofs = [], isLoading } = useQuery<PaymentProof[]>({
    queryKey: ["/api/admin/payment-proofs", statusFilter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/payment-proofs?status=${statusFilter}`);
      if (!response.ok) throw new Error("Failed to fetch payment proofs");
      return response.json();
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const response = await fetch(`/api/admin/payment-proofs/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, verificationNotes: notes }),
      });
      if (!response.ok) throw new Error("Failed to verify payment");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-proofs"] });
      setVerificationDialog(false);
      setSelectedProof(null);
      toast({
        title: "Success",
        description: `Payment ${variables.status === "approved" ? "approved" : "rejected"} successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
    },
  });

  const handleVerification = (status: "approved" | "rejected") => {
    if (!selectedProof) return;
    verifyMutation.mutate({
      id: selectedProof.id,
      status,
      notes: verificationNotes,
    });
  };

  const openVerificationDialog = (proof: PaymentProof) => {
    setSelectedProof(proof);
    setVerificationNotes("");
    setVerificationDialog(true);
  };

  const viewProofDocument = (proof: PaymentProof) => {
    if (proof.proofDocument.startsWith("http")) {
      window.open(proof.proofDocument, "_blank");
    } else {
      window.open(`/${proof.proofDocument}`, "_blank");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "outline" as const, icon: Clock },
      approved: { variant: "default" as const, icon: CheckCircle },
      rejected: { variant: "destructive" as const, icon: XCircle },
    };
    const { variant, icon: Icon } = config[status as keyof typeof config] || config.pending;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: string, currency: string) => {
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Payment Verification
          </h1>
          <p className="text-muted-foreground">Review and verify customer payment proofs</p>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="">All</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Payment Proofs</CardTitle>
              <CardDescription>
                {statusFilter ? `Showing ${statusFilter} payment proofs` : "Showing all payment proofs"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading payment proofs...</div>
              ) : paymentProofs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payment proofs found for this status.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Sales Order</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentProofs.map((proof) => (
                      <TableRow key={proof.id}>
                        <TableCell className="font-mono">{proof.referenceNumber}</TableCell>
                        <TableCell>{proof.customerName || "Unknown"}</TableCell>
                        <TableCell className="font-mono">{proof.salesOrderNumber || "N/A"}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(proof.amount, proof.currency)}
                        </TableCell>
                        <TableCell>{proof.paymentMethod}</TableCell>
                        <TableCell>{new Date(proof.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(proof.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewProofDocument(proof)}
                            >
                              <FileImage className="h-4 w-4" />
                            </Button>
                            {proof.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openVerificationDialog(proof)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verification Dialog */}
      <Dialog open={verificationDialog} onOpenChange={setVerificationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verify Payment Proof</DialogTitle>
            <DialogDescription>
              Review the payment details and approve or reject the payment proof
            </DialogDescription>
          </DialogHeader>
          
          {selectedProof && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reference Number</Label>
                  <div className="font-mono">{selectedProof.referenceNumber}</div>
                </div>
                <div>
                  <Label>Amount</Label>
                  <div className="font-medium">
                    {formatCurrency(selectedProof.amount, selectedProof.currency)}
                  </div>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <div>{selectedProof.paymentMethod}</div>
                </div>
                <div>
                  <Label>Sales Order</Label>
                  <div className="font-mono">{selectedProof.salesOrderNumber || "N/A"}</div>
                </div>
              </div>
              
              {selectedProof.notes && (
                <div>
                  <Label>Customer Notes</Label>
                  <div className="p-2 bg-muted rounded">{selectedProof.notes}</div>
                </div>
              )}
              
              <div>
                <Label htmlFor="verification-notes">Verification Notes</Label>
                <Textarea
                  id="verification-notes"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => viewProofDocument(selectedProof)}
                  className="mr-2"
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  View Proof Document
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerificationDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleVerification("rejected")}
              disabled={verifyMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleVerification("approved")}
              disabled={verifyMutation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}