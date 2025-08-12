import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SalesOrderForm } from '@/components/forms/SalesOrderForm';
import { 
  ShoppingCart, 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  MoreHorizontal,
  Send,
  FileCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function SalesOrdersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: salesOrders = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/sales-orders'],
  });

  // Type-safe data access with fallbacks
  const safeSalesOrders = salesOrders as Array<{
    id?: string;
    salesOrderNumber?: string;
    revisionNumber?: string;
    customerCode?: string;
    orderDate?: string;
    dueDate?: string;
    status?: string;
    isConfirmed?: boolean;
    pleasePayThisAmountUsd?: string;
    createdBy?: string;
    createdAt?: string;
  }> || [];

  // Mutation for deleting sales order
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/sales-orders/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete sales order",
        variant: "destructive",
      });
    },
  });

  // Action handlers
  const handleView = (order: any) => {
    // TODO: Implement view modal
    toast({
      title: "View Order",
      description: `Viewing order ${order.salesOrderNumber}`,
    });
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sales order?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleGenerateInvoice = async (id: string) => {
    try {
      await apiRequest(`/api/sales-orders/${id}/invoice`, {
        method: 'POST',
      });
      toast({
        title: "Success",
        description: "Invoice generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate invoice",
        variant: "destructive",
      });
    }
  };

  const handleCreateJobOrder = async (id: string) => {
    try {
      await apiRequest(`/api/sales-orders/${id}/job-order`, {
        method: 'POST',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-orders'] });
      toast({
        title: "Success",
        description: "Job order created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create job order",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      await apiRequest(`/api/sales-orders/${id}/email`, {
        method: 'POST',
      });
      toast({
        title: "Success",
        description: "Email sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await fetch(`/api/sales-orders/${id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-order-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sales Orders</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Orders</h1>
          <p className="text-muted-foreground">
            Track and manage all sales orders from confirmed quotations
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Sales Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sales Order</DialogTitle>
            </DialogHeader>
            <SalesOrderForm onSuccess={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            All Sales Orders ({salesOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No sales orders found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sales orders are generated from approved quotations
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                salesOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.salesOrderNumber}
                    </TableCell>
                    <TableCell>{order.customerCode}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${order.pleasePayThisAmountUsd || order.total || '0.00'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(order)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(order)}
                          title="Edit Order"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleGenerateInvoice(order.id)}>
                              <FileCheck className="h-4 w-4 mr-2" />
                              Generate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateJobOrder(order.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Create Job Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleSendEmail(order.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send to Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(order.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(order.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Order
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
    </div>
  );
}