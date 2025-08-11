import nodemailer, { Transporter } from 'nodemailer';
import { db } from './db';
import { emailSettings } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export class EmailNotificationService {
  private transporter: Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Get email settings from database
      const settings = await this.getEmailSettings();
      if (settings && settings.enabled) {
        this.config = {
          host: settings.smtpHost || 'smtp.hostinger.com',
          port: settings.smtpPort || 465,
          secure: settings.smtpSecure !== false, // true for 465, false for other ports
          auth: {
            user: settings.smtpUsername || '',
            pass: settings.smtpPassword || '',
          },
          from: settings.fromEmail || settings.smtpUsername || '',
        };

        this.transporter = nodemailer.createTransporter(this.config);
        
        // Verify configuration
        await this.verifyConnection();
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  private async getEmailSettings() {
    try {
      const [settings] = await db
        .select()
        .from(emailSettings)
        .where(eq(emailSettings.id, 'default'))
        .limit(1);
      return settings;
    } catch (error) {
      console.error('Failed to fetch email settings:', error);
      return null;
    }
  }

  async updateEmailSettings(settings: any) {
    try {
      // Update or insert email settings
      await db
        .insert(emailSettings)
        .values({
          id: 'default',
          ...settings,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: emailSettings.id,
          set: {
            ...settings,
            updatedAt: new Date(),
          },
        });

      // Reinitialize transporter with new settings
      await this.initialize();
      return true;
    } catch (error) {
      console.error('Failed to update email settings:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }

  async sendEmail(to: string | string[], subject: string, html: string, text?: string) {
    if (!this.transporter || !this.config) {
      throw new Error('Email service not configured');
    }

    try {
      const mailOptions = {
        from: this.config.from,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  // Email Templates
  async sendPaymentReceivedEmail(paymentData: any) {
    const template = this.getPaymentReceivedTemplate(paymentData);
    return this.sendEmail(paymentData.customerEmail, template.subject, template.html);
  }

  async sendInvoiceEmail(invoiceData: any) {
    const template = this.getInvoiceTemplate(invoiceData);
    return this.sendEmail(invoiceData.customerEmail, template.subject, template.html);
  }

  async sendQuotationEmail(quotationData: any) {
    const template = this.getQuotationTemplate(quotationData);
    return this.sendEmail(quotationData.customerEmail, template.subject, template.html);
  }

  async sendOrderConfirmationEmail(orderData: any) {
    const template = this.getOrderConfirmationTemplate(orderData);
    return this.sendEmail(orderData.customerEmail, template.subject, template.html);
  }

  async sendShipmentNotificationEmail(shipmentData: any) {
    const template = this.getShipmentNotificationTemplate(shipmentData);
    return this.sendEmail(shipmentData.customerEmail, template.subject, template.html);
  }

  // Template generators
  private getPaymentReceivedTemplate(data: any): EmailTemplate {
    return {
      subject: `Payment Received - Invoice ${data.invoiceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 24px; color: #4CAF50; font-weight: bold; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 10px 0; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Received</h1>
              <p>Thank you for your payment!</p>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>We have successfully received your payment of <span class="amount">$${data.amount}</span></p>
              
              <div class="details">
                <h3>Payment Details</h3>
                <table>
                  <tr>
                    <td><strong>Invoice Number:</strong></td>
                    <td>${data.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Date:</strong></td>
                    <td>${new Date(data.paymentDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Method:</strong></td>
                    <td>${data.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td><strong>Reference Number:</strong></td>
                    <td>${data.referenceNumber || 'N/A'}</td>
                  </tr>
                </table>
              </div>
              
              <p>If you have any questions about this payment, please don't hesitate to contact us.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Hibla Filipino Hair. All rights reserved.</p>
                <p>This is an automated email. Please do not reply directly to this message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private getInvoiceTemplate(data: any): EmailTemplate {
    return {
      subject: `Invoice ${data.invoiceNumber} - Hibla Filipino Hair`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .invoice-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .total { font-size: 24px; color: #333; font-weight: bold; text-align: right; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f0f0f0; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
              <p>${data.invoiceNumber}</p>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Please find your invoice details below:</p>
              
              <div class="invoice-details">
                <table>
                  <tr>
                    <td><strong>Invoice Date:</strong></td>
                    <td>${new Date(data.createdAt).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Due Date:</strong></td>
                    <td>${new Date(data.dueDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Customer Code:</strong></td>
                    <td>${data.customerCode}</td>
                  </tr>
                </table>
                
                <h3 style="margin-top: 30px;">Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.items?.map((item: any) => `
                      <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                        <td>$${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    `).join('') || ''}
                  </tbody>
                </table>
                
                <div class="total">
                  Total: $${data.total}
                </div>
              </div>
              
              <p>Payment Status: <strong>${data.paymentStatus}</strong></p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Hibla Filipino Hair. All rights reserved.</p>
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private getQuotationTemplate(data: any): EmailTemplate {
    return {
      subject: `Quotation ${data.quotationNumber} - Hibla Filipino Hair`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .quotation-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .total { font-size: 24px; color: #333; font-weight: bold; text-align: right; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f0f0f0; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quotation</h1>
              <p>${data.quotationNumber}</p>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Thank you for your interest in our products. Please find your quotation details below:</p>
              
              <div class="quotation-details">
                <table>
                  <tr>
                    <td><strong>Quotation Date:</strong></td>
                    <td>${new Date(data.createdAt).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Valid Until:</strong></td>
                    <td>${new Date(data.validUntil).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Customer Code:</strong></td>
                    <td>${data.customerCode}</td>
                  </tr>
                </table>
                
                <h3 style="margin-top: 30px;">Quoted Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.items?.map((item: any) => `
                      <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                        <td>$${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    `).join('') || ''}
                  </tbody>
                </table>
                
                <div class="total">
                  Total: $${data.total}
                </div>
              </div>
              
              <p>This quotation is valid until ${new Date(data.validUntil).toLocaleDateString()}. To proceed with your order, please contact us.</p>
              
              <center>
                <a href="#" class="button">Accept Quotation</a>
              </center>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Hibla Filipino Hair. All rights reserved.</p>
                <p>Thank you for considering our products!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private getOrderConfirmationTemplate(data: any): EmailTemplate {
    return {
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .status { display: inline-block; padding: 5px 15px; background: #4CAF50; color: white; border-radius: 20px; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 10px 0; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
              <p>Thank you for your order</p>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>We're pleased to confirm that we've received your order and it's being processed.</p>
              
              <div class="order-details">
                <h3>Order Information</h3>
                <table>
                  <tr>
                    <td><strong>Order Number:</strong></td>
                    <td>${data.orderNumber}</td>
                  </tr>
                  <tr>
                    <td><strong>Order Date:</strong></td>
                    <td>${new Date(data.orderDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td><span class="status">${data.status}</span></td>
                  </tr>
                  <tr>
                    <td><strong>Estimated Delivery:</strong></td>
                    <td>${data.estimatedDelivery || 'To be confirmed'}</td>
                  </tr>
                </table>
              </div>
              
              <p>We'll send you another email when your order ships.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Hibla Filipino Hair. All rights reserved.</p>
                <p>If you have any questions, please contact our customer service.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private getShipmentNotificationTemplate(data: any): EmailTemplate {
    return {
      subject: `Your Order Has Shipped - ${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .tracking-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50; }
            .tracking-number { font-size: 20px; color: #667eea; font-weight: bold; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Order Has Shipped!</h1>
              <p>It's on the way</p>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Great news! Your order has been shipped and is on its way to you.</p>
              
              <div class="tracking-info">
                <h3>Tracking Information</h3>
                <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                <p><strong>Tracking Number:</strong> <span class="tracking-number">${data.trackingNumber}</span></p>
                <p><strong>Carrier:</strong> ${data.carrier}</p>
                <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
              </div>
              
              <center>
                <a href="${data.trackingUrl || '#'}" class="button">Track Your Package</a>
              </center>
              
              <p style="margin-top: 30px;">You can track your package at any time using the tracking number above.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Hibla Filipino Hair. All rights reserved.</p>
                <p>Thank you for your order!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ').trim();
  }

  async testEmailConnection(recipientEmail: string): Promise<boolean> {
    try {
      await this.sendEmail(
        recipientEmail,
        'Test Email - Hibla Filipino Hair',
        `
          <h2>Test Email Successful</h2>
          <p>This is a test email from your Hibla Filipino Hair system.</p>
          <p>Your email configuration is working correctly!</p>
        `
      );
      return true;
    } catch (error) {
      console.error('Test email failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService();