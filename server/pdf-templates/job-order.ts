export function generateJobOrderHTML(data: any): string {
  const itemsHTML = data.items.map((item: any, index: number) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.specification || ''}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.orderBalance || item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.toProduceQuantity || item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px; height: 40px;"></td>
    </tr>
  `).join('');

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': '#fff3cd',
      'in-progress': '#d1ecf1',
      'completed': '#d4edda',
      'on-hold': '#f8d7da'
    };
    return colors[status as keyof typeof colors] || '#fff3cd';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': '#e2e3e5',
      'normal': '#d1ecf1',
      'high': '#fff3cd',
      'urgent': '#f8d7da'
    };
    return colors[priority as keyof typeof colors] || '#d1ecf1';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Order - ${data.jobOrderNumber}</title>
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
            color: #d32f2f;
        }
        .subtitle {
            font-size: 12px;
            color: #666;
            font-style: italic;
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
            border: 1px solid rgba(0,0,0,0.1);
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #dee2e6;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
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
        .production-section {
            margin: 30px 0;
            border: 2px solid #007bff;
            border-radius: 8px;
            overflow: hidden;
        }
        .production-header {
            background-color: #007bff;
            color: white;
            padding: 15px;
            font-weight: bold;
            font-size: 14px;
        }
        .production-content {
            padding: 20px;
            background-color: #f8f9fa;
        }
        .production-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .production-box {
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            background-color: white;
        }
        .production-box h4 {
            margin-bottom: 10px;
            color: #495057;
            font-size: 12px;
            text-transform: uppercase;
        }
        .notes-section {
            margin: 30px 0;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .notes-title {
            font-weight: bold;
            margin-bottom: 15px;
            color: #495057;
        }
        .notes-box {
            background-color: white;
            border: 1px solid #dee2e6;
            border-radius: 3px;
            padding: 15px;
            min-height: 100px;
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
        .warehouse-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .warehouse-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">HIBLA FILIPINO HAIR</div>
        <div class="company-tagline">Premium Real Filipino Hair Manufacturing & Supply</div>
        <div class="document-title">JOB ORDER</div>
        <div class="subtitle">Production Reference Document</div>
    </div>

    <div class="info-section">
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Job Order No:</span>
                <span class="info-value"><strong>${data.jobOrderNumber}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Revision No:</span>
                <span class="info-value">${data.revisionNumber || 'R0'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date Created:</span>
                <span class="info-value">${data.dateCreated}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date Revised:</span>
                <span class="info-value">${data.dateRevised || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Due Date:</span>
                <span class="info-value"><strong>${data.dueDate}</strong></span>
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
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span class="status-badge" style="background-color: ${getStatusColor(data.status)};">
                        ${data.status || 'Pending'}
                    </span>
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Priority:</span>
                <span class="info-value">
                    <span class="status-badge" style="background-color: ${getPriorityColor(data.priority)};">
                        ${data.priority || 'Normal'}
                    </span>
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Progress:</span>
                <span class="info-value">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.progress || 0}%;">
                            ${data.progress || 0}%
                        </div>
                    </div>
                </span>
            </div>
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 30%;">Product Name</th>
                <th style="width: 25%;">Specification</th>
                <th style="width: 10%;">Order Qty</th>
                <th style="width: 10%;">Order Balance</th>
                <th style="width: 10%;">To Produce</th>
                <th style="width: 10%;">Production Notes</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHTML}
        </tbody>
    </table>

    <div class="warehouse-info">
        <div class="warehouse-title">📦 Inventory Movement Information</div>
        <div style="font-size: 11px;">
            <strong>Batch Shipments:</strong> Calculated from inventory entries (Movement: Withdrawal, Location: Reserved Stocks)<br>
            <strong>Reserved Quantity:</strong> Sum from inventory entries (Movement: Deposit, Location: Reserved Stocks)<br>
            <strong>Ready Quantity:</strong> Reserved Quantity Less Shipped<br>
            <strong>To Produce:</strong> Order Quantity Less Reserved Quantity
        </div>
    </div>

    <div class="production-section">
        <div class="production-header">
            🏭 PRODUCTION TRACKING
        </div>
        <div class="production-content">
            <div class="production-grid">
                <div class="production-box">
                    <h4>🎯 Production Status</h4>
                    <div style="height: 60px; border: 1px solid #dee2e6; background: white; border-radius: 3px;"></div>
                </div>
                <div class="production-box">
                    <h4>📋 Quality Control</h4>
                    <div style="height: 60px; border: 1px solid #dee2e6; background: white; border-radius: 3px;"></div>
                </div>
                <div class="production-box">
                    <h4>📦 Packaging Status</h4>
                    <div style="height: 60px; border: 1px solid #dee2e6; background: white; border-radius: 3px;"></div>
                </div>
                <div class="production-box">
                    <h4>🚚 Shipping Preparation</h4>
                    <div style="height: 60px; border: 1px solid #dee2e6; background: white; border-radius: 3px;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="notes-section">
        <div class="notes-title">📝 Customer Instructions & Production Notes</div>
        <div class="notes-box">
            ${data.customerInstructions || '(No specific customer instructions provided)'}
        </div>
    </div>

    <div class="notes-section">
        <div class="notes-title">🔧 Production Receipts & Updates</div>
        <div class="notes-box" style="min-height: 120px;">
            <div style="font-style: italic; color: #666;">
                Production team: Please attach production receipts and update progress here.
                Include batch numbers, completion dates, and quality check results.
            </div>
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Production Manager</div>
            <div style="font-size: 10px;">Date: _____________</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Quality Control</div>
            <div style="font-size: 10px;">Date: _____________</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Shipping Department</div>
            <div style="font-size: 10px;">Date: _____________</div>
        </div>
    </div>

    <div class="print-info">
        <p>Generated on ${new Date().toLocaleString()} | Hibla Filipino Hair Manufacturing System</p>
        <p><strong>Note:</strong> This Job Order is automatically generated from confirmed Sales Order. All revisions from Sales Order take effect here.</p>
        <p><strong>Inventory Tracking:</strong> Reserved stocks will be automatically updated based on production progress.</p>
    </div>
</body>
</html>`;
}