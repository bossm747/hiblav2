export function generateInvoiceHTML(data: any): string {
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
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(item.totalPrice)}</td>
    </tr>
  `).join('');

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      'paid': '#d4edda',
      'pending': '#fff3cd',
      'overdue': '#f8d7da',
      'partial': '#d1ecf1'
    };
    return colors[status as keyof typeof colors] || '#fff3cd';
  };

  const getPaymentStatusText = (status: string) => {
    const statusText = {
      'paid': 'PAID',
      'pending': 'PENDING',
      'overdue': 'OVERDUE',
      'partial': 'PARTIALLY PAID'
    };
    return statusText[status as keyof typeof statusText] || 'PENDING';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${data.invoiceNumber}</title>
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
            color: #28a745;
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
        .payment-status {
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 2px solid;
        }
        .payment-info-box {
            background-color: #f8f9fa;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .payment-info-title {
            font-size: 14px;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        .payment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
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
            background-color: #28a745 !important;
            color: white !important;
        }
        .payment-terms {
            background-color: #e9ecef;
            border-left: 4px solid #6c757d;
            padding: 15px;
            margin: 30px 0;
        }
        .payment-terms h4 {
            margin-bottom: 10px;
            color: #495057;
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
        .urgent-notice {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .urgent-notice h4 {
            color: #856404;
            margin-bottom: 5px;
        }
        .bank-details {
            background-color: #d1ecf1;
            border: 1px solid #b8daff;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .bank-details h4 {
            color: #004085;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">HIBLA FILIPINO HAIR</div>
        <div class="company-tagline">Premium Real Filipino Hair Manufacturing & Supply</div>
        <div class="document-title">INVOICE</div>
    </div>

    <div class="info-section">
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Invoice No:</span>
                <span class="info-value"><strong>${data.invoiceNumber}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Invoice Date:</span>
                <span class="info-value">${data.date}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Due Date:</span>
                <span class="info-value"><strong>${data.dueDate}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${data.paymentMethod}</span>
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
                <span class="info-label">Payment Status:</span>
                <span class="info-value">
                    <span class="payment-status" style="background-color: ${getPaymentStatusColor(data.paymentStatus)}; border-color: ${getPaymentStatusColor(data.paymentStatus)};">
                        ${getPaymentStatusText(data.paymentStatus)}
                    </span>
                </span>
            </div>
        </div>
    </div>

    ${data.paymentStatus !== 'paid' ? `
    <div class="urgent-notice">
        <h4>⚠️ PAYMENT REMINDER</h4>
        <p>This invoice is ${data.paymentStatus.toUpperCase()}. Please remit payment by the due date to avoid late fees.</p>
    </div>
    ` : ''}

    <div class="payment-info-box">
        <div class="payment-info-title">💰 Payment Information</div>
        <div class="payment-grid">
            <div>
                <div class="info-row">
                    <span class="info-label">Total Amount:</span>
                    <span class="info-value"><strong>${formatCurrency(data.total)}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Amount Paid:</span>
                    <span class="info-value">${formatCurrency(data.paidAmount || 0)}</span>
                </div>
            </div>
            <div>
                <div class="info-row">
                    <span class="info-label">Balance Due:</span>
                    <span class="info-value"><strong>${formatCurrency(parseFloat(data.total) - parseFloat(data.paidAmount || 0))}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Status:</span>
                    <span class="info-value"><strong>${getPaymentStatusText(data.paymentStatus)}</strong></span>
                </div>
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
                <th style="width: 13%;">Total Price</th>
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
                <td class="label-col">TOTAL AMOUNT DUE:</td>
                <td class="amount-col">${formatCurrency(data.total)}</td>
            </tr>
        </table>
    </div>

    <div class="bank-details">
        <h4>🏦 Bank Details for Payment</h4>
        <div style="font-size: 11px; line-height: 1.5;">
            <strong>Account Name:</strong> Hibla Filipino Hair Manufacturing<br>
            <strong>Bank Name:</strong> [Bank Name]<br>
            <strong>Account Number:</strong> [Account Number]<br>
            <strong>Swift Code:</strong> [Swift Code]<br>
            <strong>Routing Number:</strong> [Routing Number]<br>
        </div>
    </div>

    <div class="payment-terms">
        <h4>📋 Payment Terms & Conditions</h4>
        <ul style="margin-left: 20px; font-size: 11px;">
            <li>Payment is due within 30 days of invoice date unless otherwise specified.</li>
            <li>A 2% service charge per month may be applied to overdue accounts.</li>
            <li>Please include invoice number as payment reference.</li>
            <li>For payment inquiries, contact our accounting department.</li>
            <li>All prices are in USD and final unless otherwise noted.</li>
        </ul>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Customer Acknowledgment</div>
            <div style="font-size: 10px;">Date: _____________</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Authorized Signature</div>
            <div style="font-size: 10px;">Hibla Filipino Hair</div>
        </div>
    </div>

    <div class="print-info">
        <p>Generated on ${new Date().toLocaleString()} | Hibla Filipino Hair Manufacturing System</p>
        <p><strong>Note:</strong> This invoice was automatically generated from confirmed Sales Order ${data.invoiceNumber}</p>
        <p>For inquiries: Contact our customer service team | Email: support@hibla.com</p>
    </div>
</body>
</html>`;
}