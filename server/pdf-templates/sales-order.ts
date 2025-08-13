export function generateSalesOrderHTML(data: any): string {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${num.toFixed(2)}`;
  };

  const itemsHTML = data.items.map((item: any, index: number) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.specification || ''}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(item.lineTotal)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Order - ${data.salesOrderNumber}</title>
    <style>
        @page {
            margin: 1in;
            size: A4;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
        }
        .company-tagline {
            font-size: 14px;
            color: #666;
            font-style: italic;
        }
        .document-title {
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-box {
            width: 48%;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
            color: #000;
        }
        .info-value {
            flex: 1;
            color: #333;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-draft {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .status-confirmed {
            background-color: #d1edff;
            color: #004085;
            border: 1px solid #b8daff;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
        }
        .items-table th {
            background-color: #f8f9fa;
            border: 2px solid #000;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            color: #000;
        }
        .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .totals-section {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
        .totals-table {
            width: 300px;
            font-size: 12px;
        }
        .totals-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
        }
        .totals-table .label-col {
            font-weight: bold;
            text-align: right;
            width: 60%;
        }
        .totals-table .amount-col {
            text-align: right;
            width: 40%;
        }
        .total-final {
            border-top: 2px solid #000 !important;
            border-bottom: 3px double #000 !important;
            font-weight: bold;
            font-size: 14px;
            background-color: #f8f9fa;
        }
        .footer-section {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .signature-box {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-top: 1px solid #000;
            margin: 40px 0 10px 0;
        }
        .print-info {
            font-size: 10px;
            color: #666;
            text-align: center;
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        @media print {
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">HIBLA FILIPINO HAIR</div>
        <div class="company-tagline">Premium Real Filipino Hair Manufacturing & Supply</div>
        <div class="document-title">SALES ORDER</div>
    </div>

    <div class="info-section">
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Sales Order No:</span>
                <span class="info-value"><strong>${data.salesOrderNumber}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Revision No:</span>
                <span class="info-value">${data.revisionNumber || 'R0'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${data.date}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Due Date:</span>
                <span class="info-value">${data.dueDate}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span class="status-badge ${data.status === 'confirmed' ? 'status-confirmed' : 'status-draft'}">
                        ${data.status || 'Draft'}
                    </span>
                </span>
            </div>
        </div>
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Customer Code:</span>
                <span class="info-value"><strong>${data.customerCode}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Customer Name:</span>
                <span class="info-value">${data.customerName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Country:</span>
                <span class="info-value">${data.country}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${data.paymentMethod}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Shipping Method:</span>
                <span class="info-value">${data.shippingMethod}</span>
            </div>
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 35%;">Product Name</th>
                <th style="width: 25%;">Specification</th>
                <th style="width: 10%;">Quantity</th>
                <th style="width: 12%;">Unit Price</th>
                <th style="width: 13%;">Line Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHTML}
        </tbody>
    </table>

    <div class="totals-section">
        <table class="totals-table">
            <tr>
                <td class="label-col">Subtotal (A):</td>
                <td class="amount-col">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
                <td class="label-col">Shipping Fee (B):</td>
                <td class="amount-col">${formatCurrency(data.shippingFee || 0)}</td>
            </tr>
            <tr>
                <td class="label-col">Bank Charge (C):</td>
                <td class="amount-col">${formatCurrency(data.bankCharge || 0)}</td>
            </tr>
            <tr>
                <td class="label-col">Discount (D):</td>
                <td class="amount-col">${formatCurrency(data.discount || 0)}</td>
            </tr>
            <tr>
                <td class="label-col">Others (E):</td>
                <td class="amount-col">${formatCurrency(data.others || 0)}</td>
            </tr>
            <tr class="total-final">
                <td class="label-col">TOTAL (A+B+C+D+E):</td>
                <td class="amount-col">${formatCurrency(data.total)}</td>
            </tr>
        </table>
    </div>

    ${data.customerInstructions ? `
    <div class="footer-section">
        <div class="info-row">
            <span class="info-label">Customer Instructions:</span>
        </div>
        <div style="margin-top: 10px; padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9;">
            ${data.customerInstructions}
        </div>
    </div>
    ` : ''}

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Customer Signature</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Authorized Signature</div>
            <div style="margin-top: 5px; font-size: 10px;">Created by: ${data.creatorInitials || 'System'}</div>
        </div>
    </div>

    <div class="print-info">
        <p>Generated on ${new Date().toLocaleString()} | Hibla Filipino Hair Manufacturing System</p>
        <p>This is a system-generated document. All revisions take effect on related Job Orders.</p>
    </div>
</body>
</html>`;
}