import { db } from "./db";
import { productionReceipts, jobOrders, jobOrderItems, inventoryTransactions, warehouses } from "@shared/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export class ProductionService {
  /**
   * Create production receipt for completed job order items
   */
  async createProductionReceipt(data: {
    jobOrderId: string;
    productId: string;
    quantity: number;
    warehouseId: string;
    quality: string;
    notes?: string;
    producedBy: string;
  }) {
    const [receipt] = await db
      .insert(productionReceipts)
      .values({
        receiptNumber: `PR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        jobOrderId: data.jobOrderId,
        productId: data.productId,
        quantity: data.quantity,
        warehouseId: data.warehouseId,
        quality: data.quality,
        notes: data.notes,
        producedBy: data.producedBy,
        status: 'completed',
        productionDate: new Date(),
      })
      .returning();

    // Update inventory in the warehouse
    await this.updateWarehouseInventory({
      warehouseId: data.warehouseId,
      productId: data.productId,
      quantity: data.quantity,
      type: 'production',
      referenceId: receipt.id,
    });

    return receipt;
  }

  /**
   * Update warehouse inventory after production
   */
  async updateWarehouseInventory(data: {
    warehouseId: string;
    productId: string;
    quantity: number;
    type: string;
    referenceId: string;
  }) {
    // Create inventory transaction record
    await db.insert(inventoryTransactions).values({
      warehouseId: data.warehouseId,
      productId: data.productId,
      quantity: data.quantity,
      type: data.type,
      referenceId: data.referenceId,
      notes: `Production receipt - ${data.quantity} units produced`,
    });

    // Update job order item status if all quantities are produced
    if (data.type === 'production') {
      await this.updateJobOrderItemStatus(data.referenceId);
    }
  }

  /**
   * Update job order item status based on production completion
   */
  async updateJobOrderItemStatus(productionReceiptId: string) {
    const [receipt] = await db
      .select()
      .from(productionReceipts)
      .where(eq(productionReceipts.id, productionReceiptId));

    if (receipt) {
      // Get total produced quantity for this job order item
      const produced = await db
        .select({
          totalQuantity: sql<number>`sum(${productionReceipts.quantity})`,
        })
        .from(productionReceipts)
        .where(
          and(
            eq(productionReceipts.jobOrderId, receipt.jobOrderId),
            eq(productionReceipts.productId, receipt.productId)
          )
        );

      // Get the job order item
      const [jobOrderItem] = await db
        .select()
        .from(jobOrderItems)
        .where(
          and(
            eq(jobOrderItems.jobOrderId, receipt.jobOrderId),
            eq(jobOrderItems.productId, receipt.productId)
          )
        );

      if (jobOrderItem && produced[0]) {
        const totalProduced = produced[0].totalQuantity || 0;
        const status = totalProduced >= jobOrderItem.quantity ? 'completed' : 'in-progress';
        
        // Update job order item status
        await db
          .update(jobOrderItems)
          .set({ status })
          .where(eq(jobOrderItems.id, jobOrderItem.id));

        // Check if all items in job order are completed
        await this.updateJobOrderStatus(receipt.jobOrderId);
      }
    }
  }

  /**
   * Update job order status based on item completion
   */
  async updateJobOrderStatus(jobOrderId: string) {
    const items = await db
      .select()
      .from(jobOrderItems)
      .where(eq(jobOrderItems.jobOrderId, jobOrderId));

    const allCompleted = items.every(item => item.status === 'completed');
    const anyInProgress = items.some(item => item.status === 'in-progress');

    let status = 'pending';
    if (allCompleted) {
      status = 'completed';
    } else if (anyInProgress) {
      status = 'in-progress';
    }

    await db
      .update(jobOrders)
      .set({ productionStatus: status })
      .where(eq(jobOrders.id, jobOrderId));
  }

  /**
   * Get production receipts with filters
   */
  async getProductionReceipts(filters?: {
    jobOrderId?: string;
    warehouseId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    let query = db.select().from(productionReceipts);

    if (filters?.jobOrderId) {
      query = query.where(eq(productionReceipts.jobOrderId, filters.jobOrderId));
    }

    if (filters?.warehouseId) {
      query = query.where(eq(productionReceipts.warehouseId, filters.warehouseId));
    }

    return query.orderBy(desc(productionReceipts.productionDate));
  }

  /**
   * Get production metrics for dashboard
   */
  async getProductionMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [metrics] = await db
      .select({
        totalProduced: sql<number>`count(*)`,
        todayProduced: sql<number>`count(*) filter (where ${productionReceipts.productionDate} >= ${today})`,
        totalQuantity: sql<number>`sum(${productionReceipts.quantity})`,
        todayQuantity: sql<number>`sum(${productionReceipts.quantity}) filter (where ${productionReceipts.productionDate} >= ${today})`,
      })
      .from(productionReceipts);

    const qualityMetrics = await db
      .select({
        quality: productionReceipts.quality,
        count: sql<number>`count(*)`,
      })
      .from(productionReceipts)
      .groupBy(productionReceipts.quality);

    return {
      totalProduced: metrics?.totalProduced || 0,
      todayProduced: metrics?.todayProduced || 0,
      totalQuantity: metrics?.totalQuantity || 0,
      todayQuantity: metrics?.todayQuantity || 0,
      qualityBreakdown: qualityMetrics,
    };
  }
}