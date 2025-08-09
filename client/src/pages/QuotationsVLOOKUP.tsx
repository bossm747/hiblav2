import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VLOOKUPQuotationForm } from '@/components/VLOOKUP-QuotationForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { Plus, FileText, Download, Copy } from 'lucide-react';

export function QuotationsVLOOKUP() {
  const queryClient = useQueryClient();

  // Fetch quotations with comprehensive details
  const { data: quotations, isLoading } = useQuery({
    queryKey: ['/api/quotations'],
    queryFn: () => apiRequest('/api/quotations')
  });

  // Generate Sales Order mutation
  const generateSalesOrderMutation = useMutation({
    mutationFn: async (quotationId: string) => {
      return apiRequest(`/api/quotations/${quotationId}/generate-sales-order`, {
        method: 'POST',
        body: JSON.stringify({ dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
      });
    },
    onSuccess: () => {
      toast({ title: "Sales Order Generated", description: "Sales order has been created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-orders'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate sales order", variant: "destructive" });
    }
  });

  // Duplicate Quotation mutation
  const duplicateQuotationMutation = useMutation({
    mutationFn: async (quotationId: string) => {
      return apiRequest(`/api/quotations/${quotationId}/duplicate`, { method: 'POST' });
    },
    onSuccess: () => {
      toast({ title: "Quotation Duplicated", description: "Quotation has been duplicated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to duplicate quotation", variant: "destructive" });
    }
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quotations with VLOOKUP</h1>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations with VLOOKUP Pricing</h1>
          <p className="text-muted-foreground mt-2">
            Create quotations with automatic price lookup from product database
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <FileText className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* New Quotation Form */}
      <VLOOKUPQuotationForm onSuccess={handleRefresh} />

      {/* Existing Quotations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Quotations</h2>
        
        {quotations && quotations.length > 0 ? (
          <div className="grid gap-4">
            {quotations.map((quotation: any) => (
              <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {quotation.quotationNumber}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        Customer: {quotation.customerCode} | Country: {quotation.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${quotation.total}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        quotation.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        quotation.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quotation.status?.toUpperCase() || 'DRAFT'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Price List:</span> {quotation.priceListId || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Payment:</span> {quotation.paymentMethod || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Shipping:</span> {quotation.shippingMethod || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {
                        quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : 'N/A'
                      }
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => generateSalesOrderMutation.mutate(quotation.id)}
                      disabled={generateSalesOrderMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Generate Sales Order
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateQuotationMutation.mutate(quotation.id)}
                      disabled={duplicateQuotationMutation.isPending}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Quotations Found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first quotation using the form above
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}