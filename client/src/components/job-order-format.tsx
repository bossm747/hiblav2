import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface JobOrderFormatProps {
  jobOrder: any;
  items: any[];
  onShipmentUpdate?: (itemId: string, shipmentNumber: number, value: string) => void;
  isEditable?: boolean;
}

export function JobOrderFormat({ jobOrder, items, onShipmentUpdate, isEditable = false }: JobOrderFormatProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    });
  };

  const formatQuantity = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(Number(amount));
  };

  const calculateShipped = (item: any) => {
    const shipments = [
      item.shipment1 || 0, item.shipment2 || 0, item.shipment3 || 0, item.shipment4 || 0,
      item.shipment5 || 0, item.shipment6 || 0, item.shipment7 || 0, item.shipment8 || 0
    ];
    return shipments.reduce((sum, val) => sum + Number(val), 0);
  };

  return (
    <Card className="max-w-7xl mx-auto bg-white print:shadow-none">
      <CardContent className="p-8 print:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">JOB ORDER FORM</h1>
          </div>
          <div className="text-right space-y-2">
            <div className="flex justify-between gap-8">
              <span className="font-semibold">Created By</span>
              <span>{jobOrder.createdBy}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="font-semibold">Production Date</span>
              <span>{jobOrder.productionDate ? formatDate(jobOrder.productionDate) : ''}</span>
            </div>
            <div className="border-t pt-2 mt-4">
              <div className="text-center font-semibold mb-2">Name / Signature</div>
              <div className="text-center">{jobOrder.nameSignature || ''}</div>
            </div>
            <div className="border-t pt-2">
              <div className="text-center font-semibold">Received</div>
              <div className="text-center">{jobOrder.received || ''}</div>
            </div>
          </div>
        </div>

        {/* Job Order Details */}
        <div className="mb-8 space-y-4">
          <div className="flex">
            <span className="font-semibold w-32">HAIR TAG</span>
            <span>{jobOrder.customerCode}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">DATE</span>
            <span>{formatDate(jobOrder.date)}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">DUE DATE</span>
            <span>{formatDate(jobOrder.dueDate)}</span>
          </div>
        </div>

        {/* Order Instructions */}
        {jobOrder.orderInstructions && (
          <div className="mb-8">
            <h3 className="text-center font-semibold mb-4">order instructions</h3>
            <div className="whitespace-pre-line text-center border-t border-b py-4">
              {jobOrder.orderInstructions}
            </div>
          </div>
        )}

        {/* Items Table with Shipments */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 min-w-[300px]">order item</th>
                <th className="text-center py-2 px-2">specification</th>
                <th className="text-center py-2 px-2">quantity</th>
                {/* Shipments 1-8 */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <th key={num} className="text-center py-2 px-1 w-12">{num}</th>
                ))}
                <th className="text-center py-2 px-2">order balance</th>
                <th className="text-center py-2 px-2">shipped</th>
                <th className="text-center py-2 px-2">reserved</th>
                <th className="text-center py-2 px-2">ready</th>
                <th className="text-center py-2 px-2">to produce</th>
              </tr>
              <tr className="border-b text-center font-semibold">
                <td colSpan={3}></td>
                <td className="py-1">Shipments</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const shipped = calculateShipped(item);
                const orderBalance = Number(item.quantity) - shipped;
                
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{item.productName}</td>
                    <td className="text-center py-2 px-2">{item.specification || ''}</td>
                    <td className="text-center py-2 px-2">{formatQuantity(item.quantity)}</td>
                    {/* Shipment columns 1-8 */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(shipmentNum => {
                      const fieldName = `shipment${shipmentNum}`;
                      const value = item[fieldName] || 0;
                      
                      return (
                        <td key={shipmentNum} className="text-center py-1 px-1">
                          {isEditable && onShipmentUpdate ? (
                            <Input
                              type="number"
                              step="0.1"
                              value={value}
                              onChange={(e) => onShipmentUpdate(item.id, shipmentNum, e.target.value)}
                              className="w-16 h-8 text-xs text-center"
                            />
                          ) : (
                            <span>{value > 0 ? formatQuantity(value) : ''}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-center py-2 px-2">{formatQuantity(orderBalance)}</td>
                    <td className="text-center py-2 px-2">{formatQuantity(item.shipped || 0)}</td>
                    <td className="text-center py-2 px-2">{formatQuantity(item.reserved || 0)}</td>
                    <td className="text-center py-2 px-2">{formatQuantity(item.ready || 0)}</td>
                    <td className="text-center py-2 px-2">{formatQuantity(item.toProduce || 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Job Order Number */}
        <div className="flex justify-end">
          <div className="text-right">
            <div className="font-semibold">JOB ORDER NO.</div>
            <div className="text-lg">{jobOrder.jobOrderNumber} {jobOrder.revisionNumber}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}