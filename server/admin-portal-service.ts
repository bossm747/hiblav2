import { db } from './db';
import { customers, orders, orderItems, quotations, quotationItems, salesOrders, staff } from '@shared/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

export class AdminPortalService {
  
  // Authenticate admin/staff login
  async authenticateAdmin(email: string, password: string) {
    try {
      const [admin] = await db
        .select()
        .from(staff)
        .where(eq(staff.email, email))
        .limit(1);

      if (!admin) {
        return null;
      }

      // For now, compare plain text passwords (in production, should use bcrypt)
      const isValidPassword = admin.password === password;

      if (!isValidPassword) {
        return null;
      }

      // Return admin data without password
      const { password: _, ...adminData } = admin;
      return {
        ...adminData,
        role: admin.role || 'admin',
        permissions: ['read', 'write', 'admin'] // Default permissions
      };
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return null;
    }
  }

  // Get all customers for admin management
  async getAllCustomers() {
    try {
      const allCustomers = await db
        .select({
          id: customers.id,
          customerCode: customers.customerCode,
          name: customers.name,
          email: customers.email,
          phone: customers.phone,
          country: customers.country,
          status: customers.status,
          totalOrders: customers.totalOrders,
          totalSpent: customers.totalSpent,
          lastOrder: customers.lastOrder,
          createdAt: customers.createdAt,
        })
        .from(customers)
        .orderBy(desc(customers.createdAt));

      return allCustomers;
    } catch (error) {
      console.error('Error fetching all customers:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  // Get all orders for admin management
  async getAllOrders() {
    try {
      const allOrders = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          customerId: orders.customerId,
          customerName: customers.name,
          customerCode: customers.customerCode,
          status: orders.status,
          paymentStatus: orders.paymentStatus,
          total: orders.total,
          createdAt: orders.createdAt,
          trackingNumber: orders.trackingNumber,
        })
        .from(orders)
        .leftJoin(customers, eq(orders.customerId, customers.id))
        .orderBy(desc(orders.createdAt));

      return allOrders;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  // Get all quotations for admin management
  async getAllQuotations() {
    try {
      const allQuotations = await db
        .select({
          id: quotations.id,
          quotationNumber: quotations.quotationNumber,
          customerId: quotations.customerId,
          customerName: customers.name,
          customerCode: customers.customerCode,
          status: quotations.status,
          totalAmount: quotations.totalAmount,
          validUntil: quotations.validUntil,
          createdAt: quotations.createdAt,
        })
        .from(quotations)
        .leftJoin(customers, eq(quotations.customerId, customers.id))
        .orderBy(desc(quotations.createdAt));

      return allQuotations;
    } catch (error) {
      console.error('Error fetching all quotations:', error);
      throw new Error('Failed to fetch quotations');
    }
  }

  // Get admin dashboard statistics
  async getAdminDashboardStats() {
    try {
      // Get total customers
      const [customerCount] = await db
        .select({ count: count() })
        .from(customers);

      // Get active orders (not delivered/cancelled)
      const [activeOrdersCount] = await db
        .select({ count: count() })
        .from(orders)
        .where(sql`${orders.status} NOT IN ('delivered', 'cancelled')`);

      // Get pending quotations
      const [pendingQuotationsCount] = await db
        .select({ count: count() })
        .from(quotations)
        .where(eq(quotations.status, 'pending'));

      // Get total sales orders
      const [salesOrdersCount] = await db
        .select({ count: count() })
        .from(salesOrders);

      return {
        totalCustomers: customerCount.count,
        activeOrders: activeOrdersCount.count,
        pendingQuotations: pendingQuotationsCount.count,
        totalSalesOrders: salesOrdersCount.count,
        activeSessions: 1, // Placeholder - in production would track actual sessions
      };
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }

  // Update customer status
  async updateCustomerStatus(customerId: string, status: string) {
    try {
      const [updatedCustomer] = await db
        .update(customers)
        .set({ status })
        .where(eq(customers.id, customerId))
        .returning();

      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer status:', error);
      throw new Error('Failed to update customer status');
    }
  }

  // Get specific customer details for admin
  async getCustomerDetails(customerId: string) {
    try {
      const [customer] = await db
        .select()
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1);

      if (!customer) {
        return null;
      }

      // Get customer's orders
      const customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.customerId, customerId))
        .orderBy(desc(orders.createdAt))
        .limit(10);

      // Get customer's quotations
      const customerQuotations = await db
        .select()
        .from(quotations)
        .where(eq(quotations.customerId, customerId))
        .orderBy(desc(quotations.createdAt))
        .limit(10);

      return {
        customer,
        orders: customerOrders,
        quotations: customerQuotations,
      };
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw new Error('Failed to fetch customer details');
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const [updatedOrder] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, orderId))
        .returning();

      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  // Update quotation status
  async updateQuotationStatus(quotationId: string, status: string) {
    try {
      const [updatedQuotation] = await db
        .update(quotations)
        .set({ status })
        .where(eq(quotations.id, quotationId))
        .returning();

      return updatedQuotation;
    } catch (error) {
      console.error('Error updating quotation status:', error);
      throw new Error('Failed to update quotation status');
    }
  }

  // Search functionality
  async searchCustomers(query: string) {
    try {
      const results = await db
        .select()
        .from(customers)
        .where(
          sql`${customers.name} ILIKE ${'%' + query + '%'} OR 
              ${customers.email} ILIKE ${'%' + query + '%'} OR 
              ${customers.customerCode} ILIKE ${'%' + query + '%'}`
        )
        .limit(20);

      return results;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw new Error('Failed to search customers');
    }
  }

  async searchOrders(query: string) {
    try {
      const results = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          customerId: orders.customerId,
          customerName: customers.name,
          customerCode: customers.customerCode,
          status: orders.status,
          paymentStatus: orders.paymentStatus,
          total: orders.total,
          createdAt: orders.createdAt,
          trackingNumber: orders.trackingNumber,
        })
        .from(orders)
        .leftJoin(customers, eq(orders.customerId, customers.id))
        .where(
          sql`${orders.orderNumber} ILIKE ${'%' + query + '%'} OR 
              ${customers.name} ILIKE ${'%' + query + '%'} OR 
              ${customers.customerCode} ILIKE ${'%' + query + '%'}`
        )
        .limit(20);

      return results;
    } catch (error) {
      console.error('Error searching orders:', error);
      throw new Error('Failed to search orders');
    }
  }

  // Get system activity log (placeholder for future implementation)
  async getSystemActivityLog() {
    try {
      // Placeholder - in production would track actual system activities
      return [
        {
          id: '1',
          action: 'Customer Login',
          user: 'customer@example.com',
          timestamp: new Date().toISOString(),
          details: 'Customer portal access',
        },
        {
          id: '2',
          action: 'Order Status Update',
          user: 'admin@hibla.com',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Order #2025.08.001 marked as shipped',
        },
      ];
    } catch (error) {
      console.error('Error fetching activity log:', error);
      throw new Error('Failed to fetch activity log');
    }
  }
}

// Export singleton instance
export const adminPortalService = new AdminPortalService();