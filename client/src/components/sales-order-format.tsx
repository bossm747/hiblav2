import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SalesOrderFormatProps {
  salesOrder: any;
  items: any[];
}

export function SalesOrderFormat({ salesOrder, items }: SalesOrderFormatProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  };

  return (
    <Card className="max-w-5xl mx-auto bg-white print:shadow-none">
      <CardContent className="p-8 print:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">SALES ORDER</h1>
        </div>

        {/* Sales Order Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">NO.</span>
              <span>{salesOrder.salesOrderNumber}</span>
              <span className="ml-8">{salesOrder.revisionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">HAIR TAG</span>
              <span>{salesOrder.customerCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">ORDER DATE</span>
              <span>{formatDate(salesOrder.orderDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">DUE DATE</span>
              <span>{formatDate(salesOrder.dueDate)}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Shipping Method</span>
              <span>{salesOrder.shippingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Method of Payment</span>
              <span>{salesOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Created By</span>
              <span>{salesOrder.createdBy}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">order item</th>
                <th className="text-center py-2 px-2">specification</th>
                <th className="text-center py-2 px-2">quantity</th>
                <th className="text-center py-2 px-2">unit price</th>
                <th className="text-right py-2 pl-4">line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{item.productName}</td>
                  <td className="text-center py-2 px-2">{item.specification || ''}</td>
                  <td className="text-center py-2 px-2">{formatCurrency(item.quantity)}</td>
                  <td className="text-center py-2 px-2">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-2 pl-4">{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-2">
            <div className="flex justify-between py-1">
              <span>sub total</span>
              <span>{formatCurrency(salesOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>shipping charge USD</span>
              <span>{formatCurrency(salesOrder.shippingChargeUsd)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>bank charge USD</span>
              <span>{formatCurrency(salesOrder.bankChargeUsd)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>discount USD</span>
              <span>({formatCurrency(salesOrder.discountUsd)})</span>
            </div>
            <div className="flex justify-between py-1">
              <span>others</span>
              <span>{formatCurrency(salesOrder.others)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-300 font-semibold">
              <span>please pay this amount.</span>
              <span>USD {formatCurrency(salesOrder.pleasePayThisAmountUsd)}</span>
            </div>
          </div>
        </div>

        {/* Customer Service Instructions */}
        {salesOrder.customerServiceInstructions && (
          <div className="border-t pt-6">
            <h3 className="text-center font-semibold mb-4">client service instructions</h3>
            <div className="whitespace-pre-line text-center">
              {salesOrder.customerServiceInstructions}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}