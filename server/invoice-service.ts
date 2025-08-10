import { db } from "./db";
import { invoices, salesOrders, salesOrderItems, customers } from "@shared/schema";
import { eq } from "drizzle-orm";

export class InvoiceService {
  /**
   * Generate an invoice from a confirmed sales order
   * Invoice number uses the same series as the sales order per requirements
   */
  async generateInvoiceFromSalesOrder(salesOrderId: string, createdBy: string) {
    try {
      // Get the sales order
      const [salesOrder] = await db
        .select()
        .from(salesOrders)
        .where(eq(salesOrders.id, salesOrderId));

      if (!salesOrder) {
        throw new Error("Sales order not found");
      }

      if (!salesOrder.isConfirmed) {
        throw new Error("Cannot generate invoice from unconfirmed sales order");
      }

      // Check if invoice already exists for this sales order
      const existingInvoice = await db
        .select()
        .from(invoices)
        .where(eq(invoices.salesOrderId, salesOrderId));

      if (existingInvoice.length > 0) {
        throw new Error("Invoice already exists for this sales order");
      }

      // Create invoice with same number series as sales order
      const invoiceNumber = salesOrder.salesOrderNumber; // Same series per requirements

      const [newInvoice] = await db
        .insert(invoices)
        .values({
          invoiceNumber,
          salesOrderId,
          customerId: salesOrder.customerId,
          customerCode: salesOrder.customerCode,
          country: salesOrder.country,
          dueDate: salesOrder.dueDate,
          subtotal: salesOrder.subtotal,
          shippingFee: salesOrder.shippingChargeUsd,
          bankCharge: salesOrder.bankChargeUsd,
          discount: salesOrder.discountUsd,
          others: salesOrder.others,
          total: salesOrder.pleasePayThisAmountUsd,
          paymentMethod: salesOrder.paymentMethod,
          shippingMethod: salesOrder.shippingMethod,
          paymentStatus: "pending",
          createdBy,
        })
        .returning();

      return newInvoice;
    } catch (error) {
      console.error("Error generating invoice:", error);
      throw error;
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(id: string) {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));

    return invoice;
  }

  /**
   * Get invoice by sales order ID
   */
  async getInvoiceBySalesOrder(salesOrderId: string) {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.salesOrderId, salesOrderId));

    return invoice;
  }

  /**
   * Update invoice payment status
   */
  async updatePaymentStatus(id: string, paymentStatus: string, paidAmount?: string) {
    const updates: any = { paymentStatus };
    
    if (paidAmount) {
      updates.paidAmount = paidAmount;
    }
    
    if (paymentStatus === "paid") {
      updates.paidAt = new Date();
    }

    const [updated] = await db
      .update(invoices)
      .set(updates)
      .where(eq(invoices.id, id))
      .returning();

    return updated;
  }

  /**
   * Get all invoices with optional filters
   */
  async getInvoices(filters?: {
    customerId?: string;
    paymentStatus?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    let query = db.select().from(invoices);

    if (filters?.customerId) {
      query = query.where(eq(invoices.customerId, filters.customerId));
    }

    if (filters?.paymentStatus) {
      query = query.where(eq(invoices.paymentStatus, filters.paymentStatus));
    }

    // Add date filtering if needed
    // ...

    return await query;
  }
}

export const invoiceService = new InvoiceService();