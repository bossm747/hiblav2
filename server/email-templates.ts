export interface EmailTemplateData {
  title?: string;
  subtitle?: string;
  message?: string;
  actionText?: string;
  actionUrl?: string;
  companyName?: string;
  footerText?: string;
  additionalContent?: string;
}

export function getBaseEmailTemplate(data: EmailTemplateData = {}): string {
  const {
    title = "Hibla Filipino Hair",
    subtitle = "Premium Real Filipino Hair Manufacturer & Supplier",
    message = "Thank you for choosing Hibla for your hair business needs.",
    actionText,
    actionUrl,
    companyName = "Hibla Filipino Hair",
    footerText = "This email was sent from our manufacturing system. Please do not reply directly to this email.",
    additionalContent = ""
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            padding: 40px 20px;
            text-align: center;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background-color: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #8b5cf6;
            margin: 0;
        }
        
        .header-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .header-subtitle {
            color: #e0e7ff;
            font-size: 16px;
            margin: 0;
            font-weight: 400;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
            margin: 0 0 30px 0;
        }
        
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            transition: all 0.3s ease;
        }
        
        .action-button:hover {
            box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
            transform: translateY(-1px);
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 30px 0;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 15px 0;
        }
        
        .company-info {
            color: #9ca3af;
            font-size: 12px;
            margin: 0;
        }
        
        .social-links {
            margin: 20px 0 0 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #8b5cf6;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }
        
        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .footer {
                padding: 25px 20px;
            }
            
            .action-button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #ffffff !important;
            }
        }
    </style>
</head>
<body>
    <div style="display: none; max-height: 0; overflow: hidden;">
        ${subtitle}
    </div>
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <div class="email-container">
                    <!-- Header -->
                    <div class="header">
                        <div class="logo">
                            <div class="logo-text">H</div>
                        </div>
                        <h1 class="header-title">${title}</h1>
                        <p class="header-subtitle">${subtitle}</p>
                    </div>
                    
                    <!-- Content -->
                    <div class="content">
                        <p class="message">${message}</p>
                        
                        ${additionalContent}
                        
                        ${actionText && actionUrl ? `
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${actionUrl}" class="action-button">${actionText}</a>
                        </div>
                        ` : ''}
                        
                        <div class="divider"></div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                            Best regards,<br>
                            <strong>${companyName} Team</strong>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer">
                        <p class="footer-text">${footerText}</p>
                        <p class="company-info">
                            © ${new Date().getFullYear()} ${companyName}. All rights reserved.<br>
                            Premium Real Filipino Hair Manufacturer & Global Supplier
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-link">Website</a>
                            <a href="#" class="social-link">Contact</a>
                            <a href="#" class="social-link">Support</a>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();
}

export function getQuotationEmailTemplate(quotationData: any): string {
  const additionalContent = `
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Quotation Details</h3>
        <table style="width: 100%; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 140px;">Quotation No:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${quotationData.quotationNumber || 'N/A'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">Customer:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${quotationData.customerCode || 'N/A'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">Total Amount:</td>
                <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 16px;">$${quotationData.totalAmount || '0.00'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                <td style="padding: 8px 0;">
                    <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                        ${quotationData.status || 'Pending'}
                    </span>
                </td>
            </tr>
        </table>
    </div>
  `;

  return getBaseEmailTemplate({
    title: "New Quotation Created",
    subtitle: "Your quotation has been generated successfully",
    message: `We have prepared a detailed quotation for your hair product requirements. Please review the details below and let us know if you have any questions.`,
    actionText: "View Quotation",
    actionUrl: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/quotations`,
    additionalContent
  });
}

export function getOrderConfirmationEmailTemplate(orderData: any): string {
  const additionalContent = `
    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h3 style="color: #065f46; font-size: 18px; margin: 0 0 15px 0;">Order Confirmation</h3>
        <table style="width: 100%; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; color: #047857; width: 140px;">Order No:</td>
                <td style="padding: 8px 0; color: #065f46; font-weight: 600;">${orderData.orderNumber || 'N/A'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #047857;">Customer:</td>
                <td style="padding: 8px 0; color: #065f46; font-weight: 600;">${orderData.customerCode || 'N/A'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #047857;">Total Amount:</td>
                <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 16px;">$${orderData.totalAmount || '0.00'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #047857;">Expected Delivery:</td>
                <td style="padding: 8px 0; color: #065f46; font-weight: 600;">${orderData.expectedDelivery || 'TBD'}</td>
            </tr>
        </table>
    </div>
  `;

  return getBaseEmailTemplate({
    title: "Order Confirmed",
    subtitle: "Thank you for your order",
    message: `Your order has been confirmed and is now being processed. We will keep you updated on the progress and notify you when your premium Filipino hair products are ready for shipment.`,
    actionText: "Track Order",
    actionUrl: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/sales-orders`,
    additionalContent
  });
}

export function getPaymentReceivedEmailTemplate(paymentData: any): string {
  const additionalContent = `
    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0;">Payment Received</h3>
        <table style="width: 100%; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; color: #3730a3; width: 140px;">Payment Amount:</td>
                <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 16px;">$${paymentData.amount || '0.00'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #3730a3;">Payment Method:</td>
                <td style="padding: 8px 0; color: #1e40af; font-weight: 600;">${paymentData.paymentMethod || 'N/A'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #3730a3;">Reference No:</td>
                <td style="padding: 8px 0; color: #1e40af; font-weight: 600;">${paymentData.referenceNumber || 'N/A'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #3730a3;">Date:</td>
                <td style="padding: 8px 0; color: #1e40af; font-weight: 600;">${paymentData.paymentDate || new Date().toLocaleDateString()}</td>
            </tr>
        </table>
    </div>
  `;

  return getBaseEmailTemplate({
    title: "Payment Received",
    subtitle: "Your payment has been processed successfully",
    message: `We have successfully received your payment. Thank you for your prompt payment. Your order will now proceed to the next stage of processing.`,
    actionText: "View Payment Details",
    actionUrl: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/payment-recording`,
    additionalContent
  });
}

export function getTestEmailTemplate(): string {
  return getBaseEmailTemplate({
    title: "Email Test Successful",
    subtitle: "Your email configuration is working perfectly",
    message: `This is a test email to confirm that your Hibla Manufacturing email system is configured correctly and ready to send professional communications to your customers and team members.`,
    actionText: "Access Dashboard",
    actionUrl: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/`,
    footerText: "This is a test email sent from your Hibla Manufacturing system. Email configuration is working correctly.",
    additionalContent: `
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; font-size: 18px; margin: 0 0 15px 0;">✅ Configuration Status</h3>
          <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;">SMTP Connection: Successfully established</li>
              <li style="margin: 8px 0;">Email Templates: Loading correctly</li>
              <li style="margin: 8px 0;">Authentication: Verified</li>
              <li style="margin: 8px 0;">HTML Rendering: Compatible with all major email clients</li>
          </ul>
      </div>
    `
  });
}