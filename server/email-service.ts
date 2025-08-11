import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

interface AppointmentReminderData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  staffName: string;
  spaName: string;
  spaEmail: string;
}

export async function sendAppointmentConfirmation(data: AppointmentReminderData): Promise<boolean> {
  const subject = `Appointment Confirmation - ${data.spaName}`;
  
  const text = `
Dear ${data.clientName},

Your appointment has been confirmed!

Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
Staff: ${data.staffName}

We look forward to seeing you at ${data.spaName}.

Best regards,
${data.spaName} Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #334155;">Appointment Confirmation</h2>
      
      <p>Dear <strong>${data.clientName}</strong>,</p>
      
      <p>Your appointment has been confirmed!</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #475569;">Appointment Details</h3>
        <p><strong>Service:</strong> ${data.serviceName}</p>
        <p><strong>Date:</strong> ${data.appointmentDate}</p>
        <p><strong>Time:</strong> ${data.appointmentTime}</p>
        <p><strong>Staff:</strong> ${data.staffName}</p>
      </div>
      
      <p>We look forward to seeing you at <strong>${data.spaName}</strong>.</p>
      
      <p>Best regards,<br>${data.spaName} Team</p>
    </div>
  `;

  return sendEmail({
    to: data.clientEmail,
    from: data.spaEmail,
    subject,
    text,
    html,
  });
}

// Manufacturing Email Services

interface QuotationEmailData {
  customerEmail: string;
  customerName: string;
  quotationNumber: string;
  quotationId: string;
  totalAmount: string;
  status: string;
  createdBy: string;
  approvalToken?: string;
}

interface OrderConfirmationEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  totalAmount: string;
  expectedDelivery?: string;
}

interface PaymentProofEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  paymentAmount: string;
  paymentMethod: string;
  referenceNumber: string;
}

interface ShippingUpdateEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  shippingMethod: string;
  estimatedDelivery: string;
}

export async function sendQuotationNotification(data: QuotationEmailData): Promise<boolean> {
  const { getQuotationEmailTemplate } = await import('./email-templates');
  
  const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
  const portalUrl = `https://${baseUrl}/customer-portal?token=${data.approvalToken}&quotation=${data.quotationId}`;
  
  const subject = `New Quotation #${data.quotationNumber} - Hibla Filipino Hair`;
  
  const quotationData = {
    quotationNumber: data.quotationNumber,
    customerCode: data.customerName,
    totalAmount: data.totalAmount,
    status: data.status
  };
  
  const html = getQuotationEmailTemplate(quotationData);
  
  const text = `
Dear ${data.customerName},

We have prepared a new quotation for your hair product requirements.

Quotation Details:
- Quotation Number: ${data.quotationNumber}
- Total Amount: $${data.totalAmount}
- Status: ${data.status}
- Created by: ${data.createdBy}

Please review the quotation details and let us know if you have any questions.

View Quotation: ${portalUrl}

Best regards,
Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: data.customerEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}

export async function sendQuotationApprovalRequest(data: QuotationEmailData): Promise<boolean> {
  const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
  const approvalUrl = `https://${baseUrl}/customer-portal?token=${data.approvalToken}&quotation=${data.quotationId}&action=approve`;
  
  const subject = `Action Required: Approve Quotation #${data.quotationNumber}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Quotation Approval Required</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0;">Hibla Filipino Hair</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <p>Dear <strong>${data.customerName}</strong>,</p>
        
        <p>Your quotation is ready for approval. Please review the details and confirm your order.</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #92400e;">Quotation Details</h3>
          <p><strong>Quotation Number:</strong> ${data.quotationNumber}</p>
          <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
          <p><strong>Status:</strong> ${data.status}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${approvalUrl}" style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; display: inline-block;">
            Review & Approve Quotation
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please don't hesitate to contact us.
        </p>
      </div>
    </div>
  `;
  
  const text = `
Dear ${data.customerName},

Your quotation #${data.quotationNumber} is ready for approval.

Quotation Details:
- Total Amount: $${data.totalAmount}
- Status: ${data.status}

Please review and approve: ${approvalUrl}

Best regards,
Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: data.customerEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}

export async function sendOrderConfirmationNotification(data: OrderConfirmationEmailData): Promise<boolean> {
  const { getOrderConfirmationEmailTemplate } = await import('./email-templates');
  
  const subject = `Order Confirmed #${data.orderNumber} - Hibla Filipino Hair`;
  
  const orderData = {
    orderNumber: data.orderNumber,
    customerCode: data.customerName,
    totalAmount: data.totalAmount,
    expectedDelivery: data.expectedDelivery || 'TBD'
  };
  
  const html = getOrderConfirmationEmailTemplate(orderData);
  
  const text = `
Dear ${data.customerName},

Your order has been confirmed and is now being processed.

Order Details:
- Order Number: ${data.orderNumber}
- Total Amount: $${data.totalAmount}
- Expected Delivery: ${data.expectedDelivery || 'TBD'}

We will keep you updated on the progress.

Best regards,
Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: data.customerEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}

export async function sendPaymentProofReceived(data: PaymentProofEmailData): Promise<boolean> {
  const { getPaymentReceivedEmailTemplate } = await import('./email-templates');
  
  const subject = `Payment Received for Order #${data.orderNumber}`;
  
  const paymentData = {
    amount: data.paymentAmount,
    paymentMethod: data.paymentMethod,
    referenceNumber: data.referenceNumber,
    paymentDate: new Date().toLocaleDateString()
  };
  
  const html = getPaymentReceivedEmailTemplate(paymentData);
  
  const text = `
Dear ${data.customerName},

We have received your payment for order #${data.orderNumber}.

Payment Details:
- Amount: $${data.paymentAmount}
- Payment Method: ${data.paymentMethod}
- Reference Number: ${data.referenceNumber}

Your order will now proceed to the next stage.

Best regards,
Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: data.customerEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}

export async function sendShippingUpdate(data: ShippingUpdateEmailData): Promise<boolean> {
  const subject = `Shipping Update: Order #${data.orderNumber} is on its way!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Your Order Has Shipped!</h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0;">Hibla Filipino Hair</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <p>Dear <strong>${data.customerName}</strong>,</p>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #065f46;">Shipping Details</h3>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
          <p><strong>Shipping Method:</strong> ${data.shippingMethod}</p>
          <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
        </div>
        
        <p>You can track your package using the tracking number provided above.</p>
        
        <p style="color: #6b7280; font-size: 14px;">
          Thank you for choosing Hibla Filipino Hair for your premium hair needs.
        </p>
      </div>
    </div>
  `;
  
  const text = `
Dear ${data.customerName},

Your order #${data.orderNumber} has been shipped!

Shipping Details:
- Tracking Number: ${data.trackingNumber}
- Shipping Method: ${data.shippingMethod}
- Estimated Delivery: ${data.estimatedDelivery}

Thank you for your business!

Best regards,
Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: data.customerEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}

export async function sendTestEmail(toEmail: string): Promise<boolean> {
  const { getTestEmailTemplate } = await import('./email-templates');
  
  const subject = 'Hibla Manufacturing - Email Test Successful';
  const html = getTestEmailTemplate();
  
  const text = `
Email Test Successful!

Your Hibla Manufacturing email system is configured correctly and ready to send professional communications.

Configuration Status:
✅ SMTP Connection: Successfully established
✅ Email Templates: Loading correctly  
✅ Authentication: Verified
✅ HTML Rendering: Compatible with all major email clients

This test confirms your email system is working perfectly.

Best regards,
Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: toEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}

interface PaymentProofNotificationData {
  orderId: string;
  amount: string;
  paymentMethod: string;
  referenceNumber: string;
  adminEmail: string;
}

export async function sendPaymentProofNotification(data: PaymentProofNotificationData): Promise<boolean> {
  const subject = 'New Payment Proof Uploaded - Action Required';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b5cf6;">Payment Proof Received</h2>
      
      <p>A customer has uploaded payment proof for verification:</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #475569;">Payment Details</h3>
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Amount:</strong> $${data.amount}</p>
        <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        <p><strong>Reference Number:</strong> ${data.referenceNumber}</p>
      </div>
      
      <p style="background-color: #fef3c7; padding: 15px; border-radius: 8px;">
        <strong>Action Required:</strong> Please verify this payment proof and update the order status accordingly.
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Hibla Filipino Hair - Manufacturing System</p>
      </div>
    </div>
  `;
  
  const text = `
Payment Proof Received

A customer has uploaded payment proof for verification:

Order ID: ${data.orderId}
Amount: $${data.amount}
Payment Method: ${data.paymentMethod}
Reference Number: ${data.referenceNumber}

Action Required: Please verify this payment proof and update the order status accordingly.

Hibla Filipino Hair Team
  `.trim();

  return sendEmail({
    to: data.adminEmail,
    from: 'noreply@hibla.com',
    subject,
    text,
    html,
  });
}