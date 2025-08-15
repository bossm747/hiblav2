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
  TrendingUp,
  Users,
  Grid3X3
} from 'lucide-react';
import { SalesWorkflowVisualizer } from '@/components/sales/SalesWorkflowVisualizer';
import { QuotationStatusCard } from '@/components/sales/QuotationStatusCard';

export function QuotationsPage() {
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch quotations
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['/api/quotations'],
  });

  // Fetch sales orders for workflow visualization
  const { data: salesOrders = [] } = useQuery({
    queryKey: ['/api/sales-orders'],
  });

  // Fetch job orders for workflow visualization
  const { data: jobOrders = [] } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  // Fetch invoices for workflow visualization (mock for now)
  const invoicesCount = 0; // TODO: Add when invoices API is ready

  // Filter quotations based on search
  const filteredQuotations = (quotations as any[]).filter((quotation: any) =>
    quotation?.quotationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quotation?.customerCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quotation?.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Type-safe data access with fallbacks
  const safeQuotations = filteredQuotations as Array<{
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
        body: JSON.stringify({ dueDate: '2025-09-15', revisionNumber: 'R1', autoCreateJobOrder: true })
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] });
      
      // Show enhanced success message for automated workflow
      toast({
        title: "Automated Workflow Complete",
        description: `Sales Order ${salesOrder.salesOrderNumber} created successfully. Job Order will be auto-generated.`,
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

  const handleStepClick = (step: string) => {
    switch (step) {
      case 'quotations':
        // Already on quotations page
        break;
      case 'sales-orders':
        window.location.href = '/sales-orders';
        break;
      case 'job-orders':
        window.location.href = '/job-orders';
        break;
      case 'invoices':
        window.location.href = '/invoices';
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Process Hub</h1>
          <p className="text-muted-foreground">
            Automated workflow from quotation to invoice • {safeQuotations.length} active quotations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
          <Button 
            variant="outline" 
            onClick={handleCreateVLOOKUP} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0"
          >
            <Calculator className="h-4 w-4 mr-2" />
            VLOOKUP Quotation
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Quote
          </Button>
        </div>
      </div>

      {/* Sales Workflow Visualizer */}
      <SalesWorkflowVisualizer
        quotationsCount={safeQuotations.length}
        salesOrdersCount={(salesOrders as any[]).length}
        jobOrdersCount={(jobOrders as any[]).length}
        invoicesCount={invoicesCount}
        onStepClick={handleStepClick}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Approval Rate</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {safeQuotations.length > 0 ? Math.round((safeQuotations.filter(q => q.status === 'approved').length / safeQuotations.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500 text-white">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-300">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {safeQuotations.length > 0 ? Math.round(((salesOrders as any[]).length / safeQuotations.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Active Customers</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {new Set(safeQuotations.map(q => q.customerCode)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search quotations..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Content */}
      {safeQuotations.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No quotations found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No quotations match your search criteria' : 'Start by creating your first quotation'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={handleCreateVLOOKUP} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Create VLOOKUP Quotation
                </Button>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeQuotations.map((quotation: any) => (
            <QuotationStatusCard
              key={quotation.id}
              quotation={{
                id: quotation.id || '',
                quotationNumber: quotation.quotationNumber || 'N/A',
                customerCode: quotation.customerCode || 'N/A',
                customerName: quotation.customerName,
                total: quotation.total || '0',
                status: quotation.status || 'draft',
                createdAt: quotation.createdAt || new Date().toISOString(),
                canConvert: quotation.status === 'approved'
              }}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onApprove={handleApprove}
              onReject={handleReject}
              onConvertToSalesOrder={handleConvertToSalesOrder}
              onSendEmail={handleSendEmail}
              onDownloadPDF={handleDownloadPDF}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              All Quotations ({safeQuotations.length})
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
                {safeQuotations.map((quotation: any) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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