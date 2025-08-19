import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Download, Share, Printer, FileText, X } from 'lucide-react';
// import { QuotationPrintPreview } from './QuotationPrintPreview';

interface QuotationDetail {
  id: string;
  number: string;
  customerName: string;
  customerCode: string;
  country: string;
  priceListName: string;
  revisionNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  bankCharge: number;
  discount: number;
  others: number;
  createdAt: string;
  validUntil: string;
  createdByInitials: string;
  paymentMethod: string;
  shippingMethod: string;
  customerServiceInstructions: string;
  items: Array<{
    id: string;
    productName: string;
    specification: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

interface QuotationDetailModalProps {
  quotationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QuotationDetailModal({ quotationId, isOpen, onClose }: QuotationDetailModalProps) {
  const { toast } = useToast();
  const [quotation, setQuotation] = useState<QuotationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (isOpen && quotationId) {
      loadQuotationDetail();
    }
  }, [isOpen, quotationId]);

  const loadQuotationDetail = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${quotationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotation(data);
      } else {
        throw new Error('Failed to load quotation details');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quotation details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!quotation) return;
    
    setIsGeneratingPDF(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${quotationId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Quotation-${quotation.number}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Success",
          description: "PDF downloaded successfully"
        });
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const handleShare = async () => {
    if (!quotation) return;

    try {
      const shareData = {
        title: `Quotation ${quotation.number}`,
        text: `Quotation ${quotation.number} for ${quotation.customerName} - Total: $${quotation.total.toLocaleString()}`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Success",
          description: "Link copied to clipboard"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share quotation",
        variant: "destructive"
      });
    }
  };

  const convertToSalesOrder = async () => {
    if (!quotation) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${quotationId}/convert-to-sales-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Sales Order ${result.salesOrder.number} created successfully`
        });
        onClose();
      } else {
        throw new Error('Failed to convert to sales order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert to sales order",
        variant: "destructive"
      });
    }
  };

  if (showPrintPreview && quotation) {
    return (
      <Dialog open={true} onOpenChange={() => setShowPrintPreview(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Print preview for Quotation {quotation.number}</p>
            <p>This will be implemented with the full landscape PDF format</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl">
            {isLoading ? 'Loading...' : `Quotation ${quotation?.number}`}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isLoading || !quotation}
              className="gap-2"
            >
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading || !quotation}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isLoading || !quotation || isGeneratingPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading quotation details...</p>
            </div>
          </div>
        ) : quotation ? (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {quotation.customerName}</div>
                    <div><strong>Code:</strong> {quotation.customerCode}</div>
                    <div><strong>Country:</strong> {quotation.country}</div>
                    <div><strong>Price List:</strong> {quotation.priceListName}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Quotation Details</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Number:</strong> {quotation.number}</div>
                    <div><strong>Revision:</strong> {quotation.revisionNumber}</div>
                    <div><strong>Status:</strong> 
                      <Badge className="ml-2" variant={quotation.status === 'approved' ? 'default' : 'secondary'}>
                        {quotation.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div><strong>Created By:</strong> {quotation.createdByInitials}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Dates & Payment</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Created:</strong> {new Date(quotation.createdAt).toLocaleDateString()}</div>
                    <div><strong>Valid Until:</strong> {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'No limit'}</div>
                    <div><strong>Payment:</strong> {quotation.paymentMethod}</div>
                    <div><strong>Shipping:</strong> {quotation.shippingMethod}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Items Table */}
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Order Items</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Order Item</th>
                        <th className="text-left p-3 font-medium">Specification</th>
                        <th className="text-right p-3 font-medium">Quantity</th>
                        <th className="text-right p-3 font-medium">Unit Price</th>
                        <th className="text-right p-3 font-medium">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotation.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                          <td className="p-3">{item.productName}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {item.specification || '-'}
                          </td>
                          <td className="p-3 text-right font-mono">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-semibold">
                            ${item.lineTotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Financial Summary</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sub Total (A):</span>
                      <span className="font-mono">${quotation.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Charge USD (B):</span>
                      <span className="font-mono">${quotation.shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bank Charge USD (C):</span>
                      <span className="font-mono">${quotation.bankCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount USD (D):</span>
                      <span className="font-mono text-red-600">
                        {quotation.discount < 0 ? `(${Math.abs(quotation.discount).toFixed(2)})` : quotation.discount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others (E):</span>
                      <span className="font-mono">${quotation.others.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Please pay this amount USD:</span>
                      <span className="font-mono">${quotation.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Customer Service Instructions</h4>
                    <div className="text-sm text-muted-foreground p-3 bg-muted/20 rounded">
                      {quotation.customerServiceInstructions || 'No special instructions'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={convertToSalesOrder}
                className="gap-2"
                disabled={quotation.status !== 'approved'}
              >
                <FileText className="w-4 h-4" />
                Convert to Sales Order
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Quotation not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}