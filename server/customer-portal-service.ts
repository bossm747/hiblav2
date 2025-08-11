import bcrypt from 'bcrypt';
import { db } from './db';
import { customers, orders, orderItems, quotations, quotationItems, salesOrders, salesOrderItems } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

export class CustomerPortalService {
  
  // Authenticate customer login
  async authenticateCustomer(email: string, password: string) {
    try {
      const [customer] = await db
        .select()
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);

      if (!customer) {
        return null;
      }

      // For now, compare plain text passwords (in production, should use bcrypt)
      // const isValidPassword = await bcrypt.compare(password, customer.password);
      const isValidPassword = customer.password === password;

      if (!isValidPassword) {
        return null;
      }

      // Return customer data without password
      const { password: _, ...customerData } = customer;
      return customerData;
    } catch (error) {
      console.error('Error authenticating customer:', error);
      return null;
    }
  }

  // Get customer orders with items
  async getCustomerOrders(customerId: string) {
    try {
      const customerOrders = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          paymentStatus: orders.paymentStatus,
          total: orders.total,
          createdAt: orders.createdAt,
          trackingNumber: orders.trackingNumber,
        })
        .from(orders)
        .where(eq(orders.customerId, customerId))
        .orderBy(desc(orders.createdAt));

      // Get items for each order
      const ordersWithItems = await Promise.all(
        customerOrders.map(async (order) => {
          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

          return {
            ...order,
            items,
          };
        })
      );

      return ordersWithItems;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  // Get customer quotations with items
  async getCustomerQuotations(customerId: string) {
    try {
      const customerQuotations = await db
        .select({
          id: quotations.id,
          quotationNumber: quotations.quotationNumber,
          status: quotations.status,
          totalAmount: quotations.totalAmount,
          validUntil: quotations.validUntil,
          createdAt: quotations.createdAt,
        })
        .from(quotations)
        .where(eq(quotations.customerId, customerId))
        .orderBy(desc(quotations.createdAt));

      // Get items for each quotation
      const quotationsWithItems = await Promise.all(
        customerQuotations.map(async (quotation) => {
          const items = await db
            .select()
            .from(quotationItems)
            .where(eq(quotationItems.quotationId, quotation.id));

          return {
            ...quotation,
            items,
          };
        })
      );

      return quotationsWithItems;
    } catch (error) {
      console.error('Error fetching customer quotations:', error);
      throw new Error('Failed to fetch quotations');
    }
  }

  // Get customer sales orders (which can serve as invoices)
  async getCustomerInvoices(customerId: string) {
    try {
      const customerSalesOrders = await db
        .select({
          id: salesOrders.id,
          invoiceNumber: salesOrders.salesOrderNumber,
          status: salesOrders.status,
          totalAmount: salesOrders.totalAmount,
          dueDate: salesOrders.createdAt, // Using created date as placeholder for due date
          createdAt: salesOrders.createdAt,
        })
        .from(salesOrders)
        .where(eq(salesOrders.customerId, customerId))
        .orderBy(desc(salesOrders.createdAt));

      // Get items for each sales order
      const invoicesWithItems = await Promise.all(
        customerSalesOrders.map(async (invoice) => {
          const items = await db
            .select()
            .from(salesOrderItems)
            .where(eq(salesOrderItems.salesOrderId, invoice.id));

          return {
            ...invoice,
            items,
          };
        })
      );

      return invoicesWithItems;
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }

  // Get specific order details
  async getOrderDetails(customerId: string, orderId: string) {
    try {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!order || order.customerId !== customerId) {
        return null;
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      return {
        ...order,
        items,
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error('Failed to fetch order details');
    }
  }

  // Get specific quotation details
  async getQuotationDetails(customerId: string, quotationId: string) {
    try {
      const [quotation] = await db
        .select()
        .from(quotations)
        .where(eq(quotations.id, quotationId))
        .limit(1);

      if (!quotation || quotation.customerId !== customerId) {
        return null;
      }

      const items = await db
        .select()
        .from(quotationItems)
        .where(eq(quotationItems.quotationId, quotationId));

      return {
        ...quotation,
        items,
      };
    } catch (error) {
      console.error('Error fetching quotation details:', error);
      throw new Error('Failed to fetch quotation details');
    }
  }

  // Update customer profile
  async updateCustomerProfile(customerId: string, updates: any) {
    try {
      const [updatedCustomer] = await db
        .update(customers)
        .set({
          name: updates.name,
          phone: updates.phone,
          country: updates.country,
          shippingAddress: updates.shippingAddress,
          billingAddress: updates.billingAddress,
          city: updates.city,
          province: updates.province,
          postalCode: updates.postalCode,
        })
        .where(eq(customers.id, customerId))
        .returning();

      const { password: _, ...customerData } = updatedCustomer;
      return customerData;
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Change customer password
  async changeCustomerPassword(customerId: string, currentPassword: string, newPassword: string) {
    try {
      const [customer] = await db
        .select()
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1);

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Verify current password
      const isValidPassword = customer.password === currentPassword; // Plain text for now
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await db
        .update(customers)
        .set({ password: newPassword }) // Should hash in production
        .where(eq(customers.id, customerId));

      return true;
    } catch (error) {
      console.error('Error changing customer password:', error);
      throw error;
    }
  }

  // Get customer dashboard stats
  async getCustomerDashboardStats(customerId: string) {
    try {
      const [customer] = await db
        .select({
          totalOrders: customers.totalOrders,
          totalSpent: customers.totalSpent,
          lastOrder: customers.lastOrder,
          status: customers.status,
        })
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1);

      // Get recent orders count
      const recentOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.customerId, customerId))
        .limit(5);

      // Get pending quotations count
      const pendingQuotations = await db
        .select()
        .from(quotations)
        .where(eq(quotations.customerId, customerId))
        .limit(10);

      return {
        ...customer,
        recentOrdersCount: recentOrders.length,
        pendingQuotationsCount: pendingQuotations.filter(q => q.status === 'pending').length,
      };
    } catch (error) {
      console.error('Error fetching customer dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }
}

// Export singleton instance
export const customerPortalService = new CustomerPortalService();