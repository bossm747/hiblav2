// PDF Generation Service for Sales Orders and Job Orders
// Based on exact PDF formats provided by client

export interface SalesOrderData {
  orderNumber: string;
  revision: string;
  date: string;
  customerCode: string;
  customerName: string;
  country: string;
  paymentMethod: string;
  shippingMethod: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    specification?: string;
  }>;
  subtotal: string;
  shippingFee: string;
  bankCharge: string;
  discount: string;
  others: string;
  total: string;
  customerServiceInstructions?: string;
}

export interface JobOrderData {
  jobOrderNumber: string;
  revision: string;
  date: string;
  customerCode: string;
  customerName: string;
  salesOrderNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
    specification?: string;
    status: string;
  }>;
  customerInstructions?: string;
  productionStatus: string;
  shipmentStatus: string;
  dueDate: string;
}

export function generateSalesOrderHTML(data: SalesOrderData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sales Order ${data.orderNumber}</title>
    <style>
        @media print { @page { margin: 0.5in; } }
        body { 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            line-height: 1.4;
            margin: 0;
            padding: 20px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #8B5CF6;
            margin-bottom: 5px;
        }
        .document-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin: 15px 0;
        }
        .order-info {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .customer-info {
            background: #f1f5f9;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #8B5CF6;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
        }
        th { 
            background-color: #8B5CF6; 
            color: white;
            font-weight: bold;
        }
        .total-section {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .grand-total {
            font-weight: bold;
            font-size: 16px;
            background: #8B5CF6;
            color: white;
            padding: 10px;
            border-radius: 5px;
        }
        .instructions {
            margin-top: 30px;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
        }
        .print-only { display: none; }
        @media print { 
            .print-only { display: block; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">HIBLA MANUFACTURING & SUPPLY</div>
        <div>Premium Real Filipino Hair Manufacturer and Supplier</div>
        <div class="document-title">SALES ORDER</div>
    </div>

    <div class="order-info">
        <div>
            <strong>Sales Order No.:</strong> ${data.orderNumber}<br>
            <strong>Revision:</strong> ${data.revision}<br>
            <strong>Date:</strong> ${data.date}
        </div>
        <div>
            <strong>Payment Method:</strong> ${data.paymentMethod}<br>
            <strong>Shipping Method:</strong> ${data.shippingMethod}
        </div>
    </div>

    <div class="customer-info">
        <strong>Customer Information</strong><br>
        <strong>Customer Code:</strong> ${data.customerCode}<br>
        <strong>Customer Name:</strong> ${data.customerName}<br>
        <strong>Country:</strong> ${data.country}
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 50%">Product Description</th>
                <th style="width: 10%">Qty</th>
                <th style="width: 15%">Unit Price</th>
                <th style="width: 15%">Total Price</th>
                <th style="width: 10%">Specification</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map(item => `
                <tr>
                    <td>${item.productName}</td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td style="text-align: right">$${item.unitPrice}</td>
                    <td style="text-align: right">$${item.totalPrice}</td>
                    <td>${item.specification || ''}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div style="clear: both;">
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${data.subtotal}</span>
            </div>
            <div class="total-row">
                <span>Shipping Fee:</span>
                <span>$${data.shippingFee}</span>
            </div>
            <div class="total-row">
                <span>Bank Charge:</span>
                <span>$${data.bankCharge}</span>
            </div>
            <div class="total-row">
                <span>Discount:</span>
                <span>-$${data.discount}</span>
            </div>
            <div class="total-row">
                <span>Others:</span>
                <span>$${data.others}</span>
            </div>
            <div class="grand-total">
                <div style="display: flex; justify-content: space-between;">
                    <span>TOTAL:</span>
                    <span>$${data.total}</span>
                </div>
            </div>
        </div>
    </div>

    ${data.customerServiceInstructions ? `
    <div class="instructions" style="clear: both; margin-top: 80px;">
        <strong>Customer Service Instructions:</strong><br>
        ${data.customerServiceInstructions}
    </div>
    ` : ''}

    <div class="print-only" style="margin-top: 50px; text-align: center; font-size: 10px; color: #666;">
        Generated on ${new Date().toLocaleString()} | Hibla Manufacturing & Supply System
    </div>

    <script class="no-print">
        // Auto-print when opened in new window
        if (window.opener) {
            window.print();
        }
    </script>
</body>
</html>`;
}

export function generateJobOrderHTML(data: JobOrderData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Job Order ${data.jobOrderNumber}</title>
    <style>
        @media print { @page { margin: 0.5in; } }
        body { 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            line-height: 1.4;
            margin: 0;
            padding: 20px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #8B5CF6;
            margin-bottom: 5px;
        }
        .document-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin: 15px 0;
        }
        .order-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .status-section {
            background: #e7f3ff;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #2196F3;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: left;
        }
        th { 
            background-color: #2196F3; 
            color: white;
            font-weight: bold;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-in-progress {
            background: #fff3cd;
            color: #856404;
        }
        .status-completed {
            background: #d4edda;
            color: #155724;
        }
        .status-pending {
            background: #f8d7da;
            color: #721c24;
        }
        .instructions {
            margin-top: 30px;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
        }
        .print-only { display: none; }
        @media print { 
            .print-only { display: block; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">HIBLA MANUFACTURING & SUPPLY</div>
        <div>Premium Real Filipino Hair Manufacturer and Supplier</div>
        <div class="document-title">JOB ORDER</div>
    </div>

    <div class="order-info">
        <div>
            <strong>Job Order No.:</strong> ${data.jobOrderNumber}<br>
            <strong>Revision:</strong> ${data.revision}<br>
            <strong>Date:</strong> ${data.date}<br>
            <strong>Due Date:</strong> ${data.dueDate}
        </div>
        <div>
            <strong>Customer Code:</strong> ${data.customerCode}<br>
            <strong>Customer Name:</strong> ${data.customerName}<br>
            <strong>Sales Order No.:</strong> ${data.salesOrderNumber}
        </div>
    </div>

    <div class="status-section">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <strong>Production Status:</strong><br>
                <span class="status-badge ${data.productionStatus === 'completed' ? 'status-completed' : 
                    data.productionStatus === 'in-progress' ? 'status-in-progress' : 'status-pending'}">
                    ${data.productionStatus}
                </span>
            </div>
            <div>
                <strong>Shipment Status:</strong><br>
                <span class="status-badge ${data.shipmentStatus === 'shipped' ? 'status-completed' : 
                    data.shipmentStatus === 'ready' ? 'status-in-progress' : 'status-pending'}">
                    ${data.shipmentStatus}
                </span>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 50%">Product Description</th>
                <th style="width: 10%">Quantity</th>
                <th style="width: 25%">Specification</th>
                <th style="width: 15%">Status</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map(item => `
                <tr>
                    <td>${item.productName}</td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td>${item.specification || 'Standard'}</td>
                    <td>
                        <span class="status-badge ${item.status === 'completed' ? 'status-completed' : 
                            item.status === 'in-progress' ? 'status-in-progress' : 'status-pending'}">
                            ${item.status}
                        </span>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    ${data.customerInstructions ? `
    <div class="instructions">
        <strong>Customer Instructions:</strong><br>
        ${data.customerInstructions}
    </div>
    ` : ''}

    <div class="print-only" style="margin-top: 50px; text-align: center; font-size: 10px; color: #666;">
        Generated on ${new Date().toLocaleString()} | Hibla Manufacturing & Supply System<br>
        Job Order tracking and production management
    </div>

    <script class="no-print">
        // Auto-print when opened in new window
        if (window.opener) {
            window.print();
        }
    </script>
</body>
</html>`;
}