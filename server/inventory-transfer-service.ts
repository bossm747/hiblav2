import { db } from "./db";
import { inventoryTransactions, warehouses, products } from "@shared/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export class InventoryTransferService {
  /**
   * Create inventory transfer between warehouses
   */
  async createTransfer(data: {
    fromWarehouseId: string;
    toWarehouseId: string;
    productId: string;
    quantity: number;
    reason: string;
    transferredBy: string;
  }) {
    // Check available stock in source warehouse
    const availableStock = await this.getWarehouseStock(data.fromWarehouseId, data.productId);
    
    if (availableStock < data.quantity) {
      throw new Error(`Insufficient stock. Available: ${availableStock}, Requested: ${data.quantity}`);
    }

    const transferId = `TRF-${Date.now()}`;

    // Create outbound transaction (from warehouse)
    await db.insert(inventoryTransactions).values({
      warehouseId: data.fromWarehouseId,
      productId: data.productId,
      quantity: -data.quantity, // Negative for outbound
      type: 'transfer_out',
      referenceId: transferId,
      notes: `Transfer to ${await this.getWarehouseName(data.toWarehouseId)} - ${data.reason}`,
      createdBy: data.transferredBy,
    });

    // Create inbound transaction (to warehouse)
    await db.insert(inventoryTransactions).values({
      warehouseId: data.toWarehouseId,
      productId: data.productId,
      quantity: data.quantity, // Positive for inbound
      type: 'transfer_in',
      referenceId: transferId,
      notes: `Transfer from ${await this.getWarehouseName(data.fromWarehouseId)} - ${data.reason}`,
      createdBy: data.transferredBy,
    });

    return {
      transferId,
      fromWarehouse: data.fromWarehouseId,
      toWarehouse: data.toWarehouseId,
      productId: data.productId,
      quantity: data.quantity,
      status: 'completed',
    };
  }

  /**
   * Get current stock level for a product in a warehouse
   */
  async getWarehouseStock(warehouseId: string, productId: string): Promise<number> {
    const [result] = await db
      .select({
        totalStock: sql<number>`COALESCE(SUM(${inventoryTransactions.quantity}), 0)`,
      })
      .from(inventoryTransactions)
      .where(
        and(
          eq(inventoryTransactions.warehouseId, warehouseId),
          eq(inventoryTransactions.productId, productId)
        )
      );

    return result?.totalStock || 0;
  }

  /**
   * Get warehouse name by ID
   */
  async getWarehouseName(warehouseId: string): Promise<string> {
    const [warehouse] = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.id, warehouseId));

    return warehouse?.name || 'Unknown Warehouse';
  }

  /**
   * Get inventory levels across all warehouses
   */
  async getInventoryLevels() {
    const results = await db
      .select({
        warehouseId: inventoryTransactions.warehouseId,
        warehouseName: warehouses.name,
        productId: inventoryTransactions.productId,
        productName: products.name,
        totalStock: sql<number>`SUM(${inventoryTransactions.quantity})`,
      })
      .from(inventoryTransactions)
      .leftJoin(warehouses, eq(inventoryTransactions.warehouseId, warehouses.id))
      .leftJoin(products, eq(inventoryTransactions.productId, products.id))
      .groupBy(
        inventoryTransactions.warehouseId,
        warehouses.name,
        inventoryTransactions.productId,
        products.name
      )
      .having(sql`SUM(${inventoryTransactions.quantity}) > 0`);

    return results;
  }

  /**
   * Get transfer history
   */
  async getTransferHistory(filters?: {
    warehouseId?: string;
    productId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    let query = db
      .select({
        id: inventoryTransactions.id,
        warehouseId: inventoryTransactions.warehouseId,
        warehouseName: warehouses.name,
        productId: inventoryTransactions.productId,
        productName: products.name,
        quantity: inventoryTransactions.quantity,
        type: inventoryTransactions.type,
        referenceId: inventoryTransactions.referenceId,
        notes: inventoryTransactions.notes,
        createdAt: inventoryTransactions.createdAt,
        createdBy: inventoryTransactions.createdBy,
      })
      .from(inventoryTransactions)
      .leftJoin(warehouses, eq(inventoryTransactions.warehouseId, warehouses.id))
      .leftJoin(products, eq(inventoryTransactions.productId, products.id))
      .where(
        sql`${inventoryTransactions.type} IN ('transfer_in', 'transfer_out')`
      );

    if (filters?.warehouseId) {
      query = query.where(eq(inventoryTransactions.warehouseId, filters.warehouseId));
    }

    if (filters?.productId) {
      query = query.where(eq(inventoryTransactions.productId, filters.productId));
    }

    return query.orderBy(desc(inventoryTransactions.createdAt));
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(threshold: number = 10) {
    const stockLevels = await this.getInventoryLevels();
    
    return stockLevels.filter(item => item.totalStock <= threshold);
  }

  /**
   * Adjust inventory (for corrections, damages, etc.)
   */
  async adjustInventory(data: {
    warehouseId: string;
    productId: string;
    quantity: number; // Can be positive or negative
    reason: string;
    adjustedBy: string;
  }) {
    await db.insert(inventoryTransactions).values({
      warehouseId: data.warehouseId,
      productId: data.productId,
      quantity: data.quantity,
      type: data.quantity > 0 ? 'adjustment_in' : 'adjustment_out',
      referenceId: `ADJ-${Date.now()}`,
      notes: `Inventory adjustment: ${data.reason}`,
      createdBy: data.adjustedBy,
    });

    return {
      success: true,
      newStock: await this.getWarehouseStock(data.warehouseId, data.productId),
    };
  }
}