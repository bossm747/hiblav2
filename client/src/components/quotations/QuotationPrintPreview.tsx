import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Printer, Download } from 'lucide-react';

interface QuotationDetail {
  id: string;
  number: string;
  clientName: string;
  clientCode: string;
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
  clientServiceInstructions: string;
  items: Array<{
    id: string;
    productName: string;
    specification: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

interface QuotationPrintPreviewProps {
  quotation: QuotationDetail;
  onClose: () => void;
}

export function QuotationPrintPreview({ quotation, onClose }: QuotationPrintPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${quotation.id}/pdf`, {
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
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        {/* Print Controls - Hidden in print */}
        <div className="print:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Print Preview - Quotation {quotation.number}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Print Content - Landscape A4 Format */}
        <div className="p-8 bg-white" style={{ minHeight: '210mm', width: '297mm' }}>
          <div className="max-w-full mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">HIBLA FILIPINO HAIR</h1>
              <h2 className="text-xl font-semibold">QUOTATION</h2>
            </div>

            {/* Document Info */}
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>NO.</strong></div>
                  <div className="font-mono">{quotation.number}</div>
                  <div><strong>HAIR TAG</strong></div>
                  <div className="font-mono">{quotation.clientCode}</div>
                  <div><strong>ORDER DATE</strong></div>
                  <div>{new Date(quotation.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: '2-digit' 
                  })}</div>
                  <div><strong>DUE DATE</strong></div>
                  <div>
                    {quotation.validUntil 
                      ? new Date(quotation.validUntil).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: '2-digit' 
                        })
                      : 'No limit'
                    }
                  </div>
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>REVISION</strong></div>
                  <div className="font-mono">{quotation.revisionNumber}</div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Shipping Method</strong></div>
                  <div>{quotation.shippingMethod}</div>
                  <div><strong>Method of Payment</strong></div>
                  <div>{quotation.paymentMethod}</div>
                  <div><strong>Created By</strong></div>
                  <div className="font-mono">{quotation.createdByInitials}</div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-2 font-bold">order item</th>
                    <th className="text-center py-2 font-bold">specification</th>
                    <th className="text-center py-2 font-bold">quantity</th>
                    <th className="text-center py-2 font-bold">unit price</th>
                    <th className="text-right py-2 font-bold">line total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, index) => (
                    <tr key={item.id} className={index < quotation.items.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className="py-1">{item.productName}</td>
                      <td className="py-1 text-center">{item.specification || ''}</td>
                      <td className="py-1 text-center font-mono">{item.quantity}</td>
                      <td className="py-1 text-center font-mono">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-1 text-right font-mono">{item.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end mb-6">
              <div className="text-right text-sm space-y-1">
                <div className="grid grid-cols-2 gap-8">
                  <span>sub total</span>
                  <span className="font-mono">{quotation.subtotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <span>shipping charge USD</span>
                  <span className="font-mono">{quotation.shippingFee.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <span>bank charge USD</span>
                  <span className="font-mono">{quotation.bankCharge.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <span>discount USD</span>
                  <span className="font-mono">
                    {quotation.discount < 0 
                      ? `(${Math.abs(quotation.discount).toFixed(2)})`
                      : quotation.discount.toFixed(2)
                    }
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <span>others</span>
                  <span className="font-mono">{quotation.others.toFixed(2)}</span>
                </div>
                <div className="border-t border-black pt-2 mt-2">
                  <div className="grid grid-cols-2 gap-8 font-bold">
                    <span>please pay this amount.        USD</span>
                    <span className="font-mono text-lg">{quotation.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Service Instructions */}
            {quotation.clientServiceInstructions && (
              <div className="border-t border-black pt-4">
                <h3 className="text-center font-bold mb-2">client service instructions</h3>
                <div className="text-sm">
                  {quotation.clientServiceInstructions.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-8 print:fixed print:bottom-4 print:left-0 print:right-0">
              Hibla Filipino Hair Manufacturing & Supply • Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}