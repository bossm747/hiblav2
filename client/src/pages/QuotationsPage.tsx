import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QuotationDetailModal } from '@/components/modals/QuotationDetailModal';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Send, 
  CheckCircle, 
  XCircle,
  ShoppingCart,
  Calculator,
} from 'lucide-react';

export function QuotationsPage() {
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['/api/quotations'],
  });

  // Type-safe data access with fallbacks
  const safeQuotations = quotations as Array<{
    id?: string;
    quotationNumber?: string;
    revisionNumber?: string;
    customerCode?: string;
    country?: string;
    total?: string;
    status?: string;
    createdAt?: string;
    createdBy?: string;
  }> || [];

  // Mutation for updating quotation status
  const updateQuotationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest(`/api/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: "Success",
        description: "Quotation updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quotation",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Action handlers
  const handleViewDetails = (quotationId: string) => {
    setSelectedQuotationId(quotationId);
    setShowDetailModal(true);
  };

  const handleEdit = (quotationId: string) => {
    // Navigate to edit quotation
    window.location.href = `/quotations-vlookup?edit=${quotationId}`;
  };

  const handleCreateVLOOKUP = () => {
    // Navigate to VLOOKUP quotation creation
    window.location.href = '/quotations-vlookup';
  };

  const handleDuplicate = async (quotationId: string) => {
    try {
      const newQuotation = await apiRequest(`/api/quotations/${quotationId}/duplicate`, {
        method: 'POST'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: "Success",
        description: `Quotation duplicated as ${newQuotation.quotationNumber}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate quotation",
        variant: "destructive",
      });
    }
  };

  const handleApprove = (quotationId: string) => {
    updateQuotationMutation.mutate({
      id: quotationId,
      data: { status: 'approved' }
    });
  };

  const handleReject = (quotationId: string) => {
    updateQuotationMutation.mutate({
      id: quotationId,
      data: { status: 'rejected' }
    });
  };

  const handleConvertToSalesOrder = async (quotationId: string) => {
    try {
      const salesOrder = await apiRequest(`/api/quotations/${quotationId}/generate-sales-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: '2025-09-15', revisionNumber: 'R1' })
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
      toast({
        title: "Success",
        description: `Sales Order ${salesOrder.salesOrderNumber} created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to convert to sales order",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async (quotationId: string) => {
    try {
      await apiRequest(`/api/quotations/${quotationId}/send-email`, {
        method: 'POST'
      });
      toast({
        title: "Success",
        description: "Quotation sent via email successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async (quotationId: string) => {
    try {
      const pdfBlob = await apiRequest(`/api/quotations/${quotationId}/pdf`, {
        method: 'GET'
      });
      const blob = pdfBlob instanceof Blob ? pdfBlob : new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation-${quotationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quotations Management</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotations Management</h1>
          <p className="text-muted-foreground">
            Manage and track all customer quotations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleCreateVLOOKUP} className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>VLOOKUP Quotation</span>
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Quote
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="container-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search quotations..." className="pl-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card className="elevated-container">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            All Quotations ({quotations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No quotations found</p>
                      <Button className="mt-2" asChild>
                        <a href="/quotations-vlookup">Create your first quotation</a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((quotation: any) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.quotationNumber}
                    </TableCell>
                    <TableCell>{quotation.customerCode}</TableCell>
                    <TableCell>
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${quotation.total}</TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(quotation.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(quotation.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(quotation.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(quotation.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {quotation.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(quotation.id)} className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(quotation.id)} className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {quotation.status === 'approved' && (
                              <>
                                <DropdownMenuItem onClick={() => handleConvertToSalesOrder(quotation.id)} className="text-blue-600">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Convert to Sales Order
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleSendEmail(quotation.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(quotation.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quotation Detail Modal */}
      <QuotationDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        quotationId={selectedQuotationId}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onConvertToSalesOrder={handleConvertToSalesOrder}
        onApprove={handleApprove}
        onReject={handleReject}
        onSendEmail={handleSendEmail}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}