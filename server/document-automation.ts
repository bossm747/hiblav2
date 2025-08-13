import { DatabaseStorage } from './storage';
import { generateSalesOrderHTML } from './pdf-templates/sales-order';
import { generateJobOrderHTML } from './pdf-templates/job-order';
import { generateInvoiceHTML } from './pdf-templates/invoice';

const storage = new DatabaseStorage();

export class DocumentAutomationService {
  
  /**
   * Automated Sales Order Creation from Quotation
   * Client Requirement: "Sales Order can be generated from quotation"
   * Format: YYYY.MM.### (System Generated)
   */
  async createSalesOrderFromQuotation(quotationId: string, additionalData: {
    revisionNumber?: string;
    dueDate: string;
    creatorInitials: string;
  }) {
    try {
      console.log('🔄 Automating Sales Order creation from quotation:', quotationId);
      
      // Get quotation with items
      const quotation = await storage.getQuotation(quotationId);
      if (!quotation) {
        throw new Error('Quotation not found');
      }
      
      const quotationItems = await storage.getQuotationItems(quotationId);
      const customer = await storage.getCustomer(quotation.customerId);
      
      // Auto-generate Sales Order Number in format YYYY.MM.###
      const salesOrderNumber = await this.generateSalesOrderNumber();
      
      // Create Sales Order with data from quotation
      const salesOrderData = {
        salesOrderNumber,
        revisionNumber: additionalData.revisionNumber || 'R0',
        customerId: quotation.customerId,
        customerCode: quotation.customerCode,
        customerName: quotation.customerName,
        country: quotation.country,
        priceListId: quotation.priceListId,
        subtotal: quotation.subtotal,
        shippingFee: quotation.shippingFee,
        bankCharge: quotation.bankCharge,
        discount: quotation.discount,
        others: quotation.others,
        totalAmount: quotation.totalAmount,
        paymentMethod: quotation.paymentMethod,
        shippingMethod: quotation.shippingMethod,
        customerInstructions: quotation.customerInstructions,
        dueDate: new Date(additionalData.dueDate),
        status: 'draft', // Starts as draft, needs confirmation
        creatorInitials: additionalData.creatorInitials,
        dateRevised: new Date(),
        quotationId: quotationId
      };
      
      const salesOrder = await storage.createSalesOrder(salesOrderData);
      console.log('✅ Sales Order created:', salesOrder.salesOrderNumber);
      
      // Create Sales Order Items from Quotation Items
      for (const item of quotationItems) {
        await storage.createSalesOrderItem({
          salesOrderId: salesOrder.id,
          productId: item.productId,
          productName: item.productName,
          specification: item.specification,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal
        });
      }
      
      return {
        salesOrder,
        message: 'Sales Order created successfully from quotation',
        nextSteps: [
          'Review and confirm the Sales Order',
          'Job Order will be auto-generated upon confirmation',
          'Invoice will be auto-generated upon confirmation'
        ]
      };
      
    } catch (error) {
      console.error('Error creating sales order from quotation:', error);
      throw new Error('Failed to create sales order: ' + error.message);
    }
  }
  
  /**
   * Automated Job Order Creation from Confirmed Sales Order
   * Client Requirement: "generate from confirmed Sales Order"
   * Same series number as Sales Order
   */
  async createJobOrderFromSalesOrder(salesOrderId: string) {
    try {
      console.log('🔄 Automating Job Order creation from sales order:', salesOrderId);
      
      const salesOrder = await storage.getSalesOrder(salesOrderId);
      if (!salesOrder) {
        throw new Error('Sales order not found');
      }
      
      if (salesOrder.status !== 'confirmed') {
        throw new Error('Sales order must be confirmed before creating job order');
      }
      
      const salesOrderItems = await storage.getSalesOrderItems(salesOrderId);
      
      // Use same series number as Sales Order
      const jobOrderData = {
        jobOrderNumber: salesOrder.salesOrderNumber, // Same series number
        salesOrderId: salesOrder.id,
        customerId: salesOrder.customerId,
        customerCode: salesOrder.customerCode,
        customerName: salesOrder.customerName,
        revisionNumber: salesOrder.revisionNumber,
        dueDate: salesOrder.dueDate,
        dateRevised: salesOrder.dateRevised,
        totalItems: salesOrderItems.length,
        status: 'pending',
        priority: 'normal',
        progress: 0
      };
      
      const jobOrder = await storage.createJobOrder(jobOrderData);
      console.log('✅ Job Order created:', jobOrder.jobOrderNumber);
      
      // Create Job Order Items from Sales Order Items
      for (const item of salesOrderItems) {
        await storage.createJobOrderItem({
          jobOrderId: jobOrder.id,
          productId: item.productId,
          productName: item.productName,
          specification: item.specification,
          quantity: item.quantity,
          orderBalance: item.quantity, // Initially, order balance = quantity
          toProduceQuantity: item.quantity // Initially, all needs to be produced
        });
      }
      
      // Auto-update inventory requirements
      await this.updateInventoryRequirements(salesOrderItems);
      
      return {
        jobOrder,
        message: 'Job Order created successfully from confirmed Sales Order',
        nextSteps: [
          'Production team can now track job order progress',
          'Update production status and receipts',
          'Monitor inventory movements'
        ]
      };
      
    } catch (error) {
      console.error('Error creating job order from sales order:', error);
      throw new Error('Failed to create job order: ' + error.message);
    }
  }
  
  /**
   * Automated Invoice Creation from Confirmed Sales Order
   * Client Requirement: "Sales Order and Invoice have the same format and series no."
   */
  async createInvoiceFromSalesOrder(salesOrderId: string) {
    try {
      console.log('🔄 Automating Invoice creation from sales order:', salesOrderId);
      
      const salesOrder = await storage.getSalesOrder(salesOrderId);
      if (!salesOrder) {
        throw new Error('Sales order not found');
      }
      
      if (salesOrder.status !== 'confirmed') {
        throw new Error('Sales order must be confirmed before creating invoice');
      }
      
      const salesOrderItems = await storage.getSalesOrderItems(salesOrderId);
      
      // Use same series number as Sales Order
      const invoiceData = {
        invoiceNumber: salesOrder.salesOrderNumber, // Same series number
        salesOrderId: salesOrder.id,
        customerId: salesOrder.customerId,
        customerCode: salesOrder.customerCode,
        country: salesOrder.country,
        subtotal: salesOrder.subtotal,
        shippingFee: salesOrder.shippingFee,
        bankCharge: salesOrder.bankCharge,
        discount: salesOrder.discount,
        others: salesOrder.others,
        total: salesOrder.totalAmount,
        paymentMethod: salesOrder.paymentMethod,
        paymentStatus: 'pending',
        dueDate: salesOrder.dueDate,
        paidAmount: '0'
      };
      
      const invoice = await storage.createInvoice(invoiceData);
      console.log('✅ Invoice created:', invoice.invoiceNumber);
      
      return {
        invoice,
        message: 'Invoice created successfully from confirmed Sales Order',
        nextSteps: [
          'Send invoice to customer',
          'Track payment status',
          'Update payment records when received'
        ]
      };
      
    } catch (error) {
      console.error('Error creating invoice from sales order:', error);
      throw new Error('Failed to create invoice: ' + error.message);
    }
  }
  
  /**
   * Confirm Sales Order and Auto-Generate Job Order & Invoice
   * Client Requirement: "From the CONFIRMED Sales Order, Invoice and Job Order can be generated"
   */
  async confirmSalesOrder(salesOrderId: string) {
    try {
      console.log('🔄 Confirming Sales Order and auto-generating documents:', salesOrderId);
      
      // Update Sales Order status to confirmed
      const updatedSalesOrder = await storage.updateSalesOrderStatus(salesOrderId, 'confirmed');
      if (!updatedSalesOrder) {
        throw new Error('Failed to confirm sales order');
      }
      
      // Auto-generate Job Order
      const jobOrderResult = await this.createJobOrderFromSalesOrder(salesOrderId);
      
      // Auto-generate Invoice
      const invoiceResult = await this.createInvoiceFromSalesOrder(salesOrderId);
      
      console.log('✅ Sales Order confirmed with auto-generated documents');
      
      return {
        salesOrder: updatedSalesOrder,
        jobOrder: jobOrderResult.jobOrder,
        invoice: invoiceResult.invoice,
        message: 'Sales Order confirmed successfully. Job Order and Invoice auto-generated.',
        automation: {
          documentsCreated: ['Job Order', 'Invoice'],
          inventoryUpdated: true,
          workflowTriggered: true
        }
      };
      
    } catch (error) {
      console.error('Error confirming sales order:', error);
      throw new Error('Failed to confirm sales order: ' + error.message);
    }
  }
  
  /**
   * Generate PDF Documents
   * Client Requirement: "Printable/downloadable files must be in excel and PDF"
   */
  async generateDocumentPDF(documentType: 'sales-order' | 'job-order' | 'invoice', documentId: string) {
    try {
      console.log(`🔄 Generating ${documentType} PDF for document:`, documentId);
      
      switch (documentType) {
        case 'sales-order':
          return await this.generateSalesOrderPDF(documentId);
        case 'job-order':
          return await this.generateJobOrderPDF(documentId);
        case 'invoice':
          return await this.generateInvoicePDF(documentId);
        default:
          throw new Error('Invalid document type');
      }
    } catch (error) {
      console.error(`Error generating ${documentType} PDF:`, error);
      throw new Error(`Failed to generate ${documentType} PDF: ` + error.message);
    }
  }
  
  private async generateSalesOrderPDF(salesOrderId: string) {
    const salesOrder = await storage.getSalesOrder(salesOrderId);
    if (!salesOrder) throw new Error('Sales order not found');
    
    const items = await storage.getSalesOrderItems(salesOrderId);
    const customer = await storage.getCustomer(salesOrder.customerId);
    
    const pdfData = {
      salesOrderNumber: salesOrder.salesOrderNumber,
      date: new Date(salesOrder.createdAt).toLocaleDateString(),
      dueDate: new Date(salesOrder.dueDate).toLocaleDateString(),
      revisionNumber: salesOrder.revisionNumber,
      customerCode: salesOrder.customerCode,
      customerName: customer?.name || salesOrder.customerName,
      country: salesOrder.country,
      items: items.map(item => ({
        productName: item.productName,
        specification: item.specification,
        quantity: parseFloat(item.quantity),
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })),
      subtotal: salesOrder.subtotal,
      shippingFee: salesOrder.shippingFee,
      bankCharge: salesOrder.bankCharge,
      discount: salesOrder.discount,
      others: salesOrder.others,
      total: salesOrder.totalAmount,
      paymentMethod: salesOrder.paymentMethod,
      shippingMethod: salesOrder.shippingMethod,
      customerInstructions: salesOrder.customerInstructions,
      creatorInitials: salesOrder.creatorInitials,
      status: salesOrder.status
    };
    
    return {
      html: generateSalesOrderHTML(pdfData),
      filename: `Sales_Order_${salesOrder.salesOrderNumber}.pdf`,
      data: pdfData
    };
  }
  
  private async generateJobOrderPDF(jobOrderId: string) {
    const jobOrder = await storage.getJobOrder(jobOrderId);
    if (!jobOrder) throw new Error('Job order not found');
    
    const items = await storage.getJobOrderItems(jobOrderId);
    const customer = await storage.getCustomer(jobOrder.customerId);
    
    const pdfData = {
      jobOrderNumber: jobOrder.jobOrderNumber,
      dateCreated: new Date(jobOrder.createdAt).toLocaleDateString(),
      dateRevised: jobOrder.dateRevised ? new Date(jobOrder.dateRevised).toLocaleDateString() : '',
      dueDate: new Date(jobOrder.dueDate).toLocaleDateString(),
      revisionNumber: jobOrder.revisionNumber,
      customerCode: jobOrder.customerCode,
      customerName: customer?.name || jobOrder.customerName,
      status: jobOrder.status,
      priority: jobOrder.priority,
      progress: jobOrder.progress,
      items: items.map(item => ({
        productName: item.productName,
        specification: item.specification,
        quantity: parseFloat(item.quantity),
        orderBalance: item.orderBalance,
        toProduceQuantity: item.toProduceQuantity
      }))
    };
    
    return {
      html: generateJobOrderHTML(pdfData),
      filename: `Job_Order_${jobOrder.jobOrderNumber}.pdf`,
      data: pdfData
    };
  }
  
  private async generateInvoicePDF(invoiceId: string) {
    const invoice = await storage.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    
    const salesOrder = await storage.getSalesOrder(invoice.salesOrderId);
    const items = await storage.getSalesOrderItems(invoice.salesOrderId);
    const customer = await storage.getCustomer(invoice.customerId);
    
    const pdfData = {
      invoiceNumber: invoice.invoiceNumber,
      date: new Date(invoice.createdAt).toLocaleDateString(),
      dueDate: new Date(invoice.dueDate).toLocaleDateString(),
      customerCode: invoice.customerCode,
      customerName: customer?.name || invoice.customerCode,
      country: invoice.country,
      items: items.map(item => ({
        productName: item.productName,
        specification: item.specification,
        quantity: parseFloat(item.quantity),
        unitPrice: item.unitPrice,
        totalPrice: item.lineTotal
      })),
      subtotal: invoice.subtotal,
      shippingFee: invoice.shippingFee,
      bankCharge: invoice.bankCharge,
      discount: invoice.discount,
      others: invoice.others,
      total: invoice.total,
      paymentMethod: invoice.paymentMethod,
      paymentStatus: invoice.paymentStatus,
      paidAmount: invoice.paidAmount
    };
    
    return {
      html: generateInvoiceHTML(pdfData),
      filename: `Invoice_${invoice.invoiceNumber}.pdf`,
      data: pdfData
    };
  }
  
  /**
   * Auto-generate Sales Order Number in format YYYY.MM.###
   */
  private async generateSalesOrderNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Get count of sales orders this month
    const monthStart = new Date(year, now.getMonth(), 1);
    const monthEnd = new Date(year, now.getMonth() + 1, 0);
    
    const thisMonthOrders = await storage.getSalesOrdersByDateRange(monthStart, monthEnd);
    const nextNumber = (thisMonthOrders.length + 1).toString().padStart(3, '0');
    
    return `${year}.${month}.${nextNumber}`;
  }
  
  /**
   * Update inventory requirements when sales order is confirmed
   * Client Requirement: "Order quantity adds to order requirement per product"
   */
  private async updateInventoryRequirements(salesOrderItems: any[]) {
    console.log('🔄 Updating inventory requirements...');
    
    for (const item of salesOrderItems) {
      try {
        // Add to Reserved Warehouse (order requirements)
        await storage.updateProductInventory(item.productId, 'reservedWarehouse', item.quantity, 'add');
        console.log(`✅ Added ${item.quantity} ${item.productName} to Reserved Warehouse`);
      } catch (error) {
        console.error('Error updating inventory for product:', item.productName, error);
      }
    }
  }
}

export const documentAutomation = new DocumentAutomationService();