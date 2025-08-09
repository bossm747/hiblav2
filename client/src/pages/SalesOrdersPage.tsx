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
import { ShoppingCart, Plus, FileText } from 'lucide-react';

export function SalesOrdersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: salesOrders = [], isLoading } = useQuery({
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
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <Badge>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
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