import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface ReceiptData {
  id: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  createdAt: string;
  cashier?: string;
}

interface ThermalReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptData: ReceiptData | null;
}

export default function ThermalReceipt({ open, onOpenChange, receiptData }: ThermalReceiptProps) {
  if (!receiptData) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${receiptData.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              margin: 0;
              padding: 10px;
              width: 80mm;
              background: white;
              color: black;
            }
            .receipt {
              text-align: center;
              border: 1px dashed #000;
              padding: 10px;
            }
            .header {
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .store-name {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              text-align: left;
              margin-bottom: 2px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 5px 0;
            }
            .total-row {
              font-weight: bold;
              font-size: 14px;
            }
            .footer {
              border-top: 1px dashed #000;
              padding-top: 5px;
              margin-top: 10px;
              font-size: 10px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${document.getElementById('thermal-receipt-content')?.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('thermal-receipt-content');
    if (element) {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${receiptData.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              margin: 0;
              padding: 10px;
              width: 80mm;
              background: white;
              color: black;
            }
            .receipt {
              text-align: center;
              border: 1px dashed #000;
              padding: 10px;
            }
            .header {
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .store-name {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              text-align: left;
              margin-bottom: 2px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 5px 0;
            }
            .total-row {
              font-weight: bold;
              font-size: 14px;
            }
            .footer {
              border-top: 1px dashed #000;
              padding-top: 5px;
              margin-top: 10px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `;
      
      const blob = new Blob([printContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receiptData.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass-card border-white/20 neon-purple bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground neon-text-purple flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Receipt Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Receipt Preview */}
          <div 
            id="thermal-receipt-content"
            className="receipt bg-white text-black p-4 rounded border-2 border-dashed border-gray-400"
            style={{ 
              fontFamily: 'Courier New, monospace', 
              fontSize: '12px',
              lineHeight: '1.2',
              width: '300px',
              margin: '0 auto'
            }}
          >
            {/* Header */}
            <div className="header text-center border-b border-dashed border-gray-400 pb-2 mb-3">
              <div className="store-name font-bold text-lg mb-1">HIBLA FILIPINO HAIR</div>
              <div className="text-xs">Premium Human Hair Extensions</div>
              <div className="text-xs">Instagram: @hibla.filipinohumanhair</div>
              <div className="text-xs">Phone: +63 917 844 2521</div>
            </div>

            {/* Receipt Details */}
            <div className="text-center text-xs mb-3">
              <div>Receipt #: {receiptData.id.slice(0, 8).toUpperCase()}</div>
              <div>Date: {format(new Date(receiptData.createdAt), 'MMM dd, yyyy HH:mm')}</div>
              {receiptData.cashier && <div>Cashier: {receiptData.cashier}</div>}
            </div>

            {/* Items */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>
            {receiptData.items.map((item, index) => (
              <div key={index} className="mb-1">
                <div className="flex justify-between">
                  <span className="flex-1">{item.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{item.quantity} x ₱{item.price.toFixed(2)}</span>
                  <span>₱{item.total.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>
            <div className="flex justify-between text-xs">
              <span>Subtotal:</span>
              <span>₱{receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>VAT (12%):</span>
              <span>₱{receiptData.tax.toFixed(2)}</span>
            </div>
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>₱{receiptData.total.toFixed(2)}</span>
            </div>

            {/* Payment */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>
            <div className="flex justify-between text-xs">
              <span>Payment ({receiptData.paymentMethod}):</span>
              <span>₱{receiptData.amountPaid.toFixed(2)}</span>
            </div>
            {receiptData.change > 0 && (
              <div className="flex justify-between text-xs font-bold">
                <span>Change:</span>
                <span>₱{receiptData.change.toFixed(2)}</span>
              </div>
            )}

            {/* Footer */}
            <div className="footer text-center border-t border-dashed border-gray-400 pt-2 mt-3 text-xs">
              <div className="mb-1">Thank you for your purchase!</div>
              <div className="mb-1">Follow us: @hibla.filipinohumanhair</div>
              <div className="mb-1">Visit us for more premium hair extensions</div>
              <div className="text-xs opacity-70">
                This receipt was generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-white/20 hover:bg-primary/20 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}