import { db } from "./db";
import { salesOrders, inventoryTransactions, products, warehouses } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class OrderConfirmationService {
  /**
   * Confirm a sales order - this triggers inventory requirements update
   * and allows invoice and job order generation
   */
  async confirmSalesOrder(salesOrderId: string, confirmedBy: string) {
    try {
      // Get the sales order
      const [salesOrder] = await db
        .select()
        .from(salesOrders)
        .where(eq(salesOrders.id, salesOrderId));

      if (!salesOrder) {
        throw new Error("Sales order not found");
      }

      if (salesOrder.isConfirmed) {
        throw new Error("Sales order is already confirmed");
      }

      // Update sales order to confirmed status
      const [confirmedOrder] = await db
        .update(salesOrders)
        .set({
          isConfirmed: true,
          status: "confirmed",
          confirmedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(salesOrders.id, salesOrderId))
        .returning();

      // Update inventory requirements
      await this.updateInventoryRequirements(salesOrderId);

      return confirmedOrder;
    } catch (error) {
      console.error("Error confirming sales order:", error);
      throw error;
    }
  }

  /**
   * Update inventory requirements based on confirmed sales order
   * This adds order quantities to the reserved warehouse
   */
  private async updateInventoryRequirements(salesOrderId: string) {
    try {
      // Get the sales order items
      const orderItems = await db
        .select()
        .from(salesOrderItems)
        .where(eq(salesOrderItems.salesOrderId, salesOrderId));

      // Get the reserved warehouse
      const [reservedWarehouse] = await db
        .select()
        .from(warehouses)
        .where(eq(warehouses.code, "RESERVED"));

      if (!reservedWarehouse) {
        throw new Error("Reserved warehouse not found");
      }

      // Create inventory transactions for each order item
      for (const item of orderItems) {
        // Create a deposit transaction to reserved warehouse
        await db.insert(inventoryTransactions).values({
          productId: item.productId,
          warehouseId: reservedWarehouse.id,
          movementType: "deposit",
          quantity: item.quantity,
          reason: "Sales order confirmation - reserved for production",
          reference: salesOrderId,
          referenceType: "sales_order",
          salesOrderId,
          staffId: confirmedBy || 'system',
        });

        // Update product's order requirements (if you have such a field)
        // This is where you'd update the order_requirements field if it exists
      }
    } catch (error) {
      console.error("Error updating inventory requirements:", error);
      throw error;
    }
  }

  /**
   * Check if a sales order can be modified
   * (Draft orders can be modified, confirmed orders need revision)
   */
  canModifySalesOrder(salesOrder: any) {
    return !salesOrder.isConfirmed;
  }

  /**
   * Get all draft sales orders
   */
  async getDraftSalesOrders() {
    return await db
      .select()
      .from(salesOrders)
      .where(and(
        eq(salesOrders.isConfirmed, false),
        eq(salesOrders.status, "draft")
      ));
  }

  /**
   * Get all confirmed sales orders
   */
  async getConfirmedSalesOrders() {
    return await db
      .select()
      .from(salesOrders)
      .where(eq(salesOrders.isConfirmed, true));
  }
}

export const orderConfirmationService = new OrderConfirmationService();

// Import the salesOrderItems table
import { salesOrderItems } from "@shared/schema";