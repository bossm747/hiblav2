import { db } from './db';
import { payments, invoices, salesOrders, Payment, InsertPayment } from '@shared/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

export class PaymentService {
  /**
   * Record a new payment for an invoice
   */
  async recordPayment(paymentData: InsertPayment): Promise<Payment> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Insert the payment record
        const [payment] = await tx.insert(payments).values(paymentData).returning();
        
        // Update the invoice with the payment
        const [invoice] = await tx
          .select()
          .from(invoices)
          .where(eq(invoices.id, paymentData.invoiceId));
        
        if (!invoice) {
          throw new Error('Invoice not found');
        }
        
        // Calculate new paid amount and balance
        const currentPaid = parseFloat(invoice.paidAmount || '0');
        const paymentAmount = parseFloat(paymentData.amount.toString());
        const totalAmount = parseFloat(invoice.total.toString());
        const newPaidAmount = currentPaid + paymentAmount;
        const newBalance = totalAmount - newPaidAmount;
        
        // Determine payment status
        let paymentStatus = 'unpaid';
        if (newBalance <= 0) {
          paymentStatus = 'paid';
        } else if (newPaidAmount > 0) {
          paymentStatus = 'partial';
        }
        
        // Update invoice with new payment info
        await tx
          .update(invoices)
          .set({
            paidAmount: newPaidAmount.toString(),
            paymentStatus,
            paidAt: paymentStatus === 'paid' ? new Date() : invoice.paidAt,
            updatedAt: new Date(),
          })
          .where(eq(invoices.id, paymentData.invoiceId));
        
        // If invoice is fully paid, update sales order status
        if (paymentStatus === 'paid' && invoice.salesOrderId) {
          await tx
            .update(salesOrders)
            .set({
              status: 'paid',
              updatedAt: new Date(),
            })
            .where(eq(salesOrders.id, invoice.salesOrderId));
        }
        
        console.log(`Payment recorded: ${paymentAmount} for invoice ${invoice.invoiceNumber}`);
        return payment;
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      throw new Error('Failed to record payment');
    }
  }
  
  /**
   * Get all payments for an invoice
   */
  async getInvoicePayments(invoiceId: string): Promise<Payment[]> {
    try {
      return await db
        .select()
        .from(payments)
        .where(eq(payments.invoiceId, invoiceId))
        .orderBy(desc(payments.paymentDate));
    } catch (error) {
      console.error('Error fetching invoice payments:', error);
      throw new Error('Failed to fetch invoice payments');
    }
  }
  
  /**
   * Get all payments for a customer
   */
  async getCustomerPayments(customerCode: string): Promise<Payment[]> {
    try {
      return await db
        .select()
        .from(payments)
        .where(eq(payments.customerCode, customerCode))
        .orderBy(desc(payments.paymentDate));
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      throw new Error('Failed to fetch customer payments');
    }
  }
  
  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | undefined> {
    try {
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId));
      
      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw new Error('Failed to fetch payment');
    }
  }
  
  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId: string, status: string): Promise<Payment | undefined> {
    try {
      const [updated] = await db
        .update(payments)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId))
        .returning();
      
      return updated;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }
  
  /**
   * Process refund
   */
  async processRefund(paymentId: string, refundAmount: number, notes: string): Promise<Payment> {
    try {
      return await db.transaction(async (tx) => {
        // Get the original payment
        const [originalPayment] = await tx
          .select()
          .from(payments)
          .where(eq(payments.id, paymentId));
        
        if (!originalPayment) {
          throw new Error('Payment not found');
        }
        
        // Create refund payment record
        const [refund] = await tx
          .insert(payments)
          .values({
            invoiceId: originalPayment.invoiceId,
            salesOrderId: originalPayment.salesOrderId,
            customerCode: originalPayment.customerCode,
            amount: (-refundAmount).toString(), // Negative amount for refund
            paymentMethod: originalPayment.paymentMethod,
            paymentDate: new Date(),
            referenceNumber: `REFUND-${originalPayment.referenceNumber}`,
            notes: `Refund: ${notes}`,
            status: 'refunded',
            createdBy: originalPayment.createdBy,
          })
          .returning();
        
        // Update original payment status
        await tx
          .update(payments)
          .set({
            status: 'refunded',
            updatedAt: new Date(),
          })
          .where(eq(payments.id, paymentId));
        
        // Update invoice paid amount
        const [invoice] = await tx
          .select()
          .from(invoices)
          .where(eq(invoices.id, originalPayment.invoiceId));
        
        if (invoice) {
          const currentPaid = parseFloat(invoice.paidAmount || '0');
          const newPaidAmount = Math.max(0, currentPaid - refundAmount);
          const totalAmount = parseFloat(invoice.total.toString());
          
          let paymentStatus = 'unpaid';
          if (newPaidAmount >= totalAmount) {
            paymentStatus = 'paid';
          } else if (newPaidAmount > 0) {
            paymentStatus = 'partial';
          }
          
          await tx
            .update(invoices)
            .set({
              paidAmount: newPaidAmount.toString(),
              paymentStatus,
              updatedAt: new Date(),
            })
            .where(eq(invoices.id, originalPayment.invoiceId));
        }
        
        console.log(`Refund processed: ${refundAmount} for payment ${paymentId}`);
        return refund;
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }
  
  /**
   * Get payment summary for a date range
   */
  async getPaymentSummary(startDate: Date, endDate: Date): Promise<{
    totalReceived: number;
    totalRefunded: number;
    netAmount: number;
    paymentCount: number;
    byMethod: Record<string, number>;
  }> {
    try {
      const paymentsInRange = await db
        .select()
        .from(payments)
        .where(
          and(
            sql`${payments.paymentDate} >= ${startDate}`,
            sql`${payments.paymentDate} <= ${endDate}`
          )
        );
      
      let totalReceived = 0;
      let totalRefunded = 0;
      let paymentCount = 0;
      const byMethod: Record<string, number> = {};
      
      for (const payment of paymentsInRange) {
        const amount = parseFloat(payment.amount.toString());
        
        if (payment.status === 'refunded' || amount < 0) {
          totalRefunded += Math.abs(amount);
        } else {
          totalReceived += amount;
          paymentCount++;
        }
        
        const method = payment.paymentMethod || 'unknown';
        byMethod[method] = (byMethod[method] || 0) + Math.abs(amount);
      }
      
      return {
        totalReceived,
        totalRefunded,
        netAmount: totalReceived - totalRefunded,
        paymentCount,
        byMethod,
      };
    } catch (error) {
      console.error('Error getting payment summary:', error);
      throw new Error('Failed to get payment summary');
    }
  }
}

export const paymentService = new PaymentService();