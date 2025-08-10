import { db } from "./db";
import { quotations, quotationItems, salesOrders, salesOrderItems, jobOrders, jobOrderItems, customers, products } from "@shared/schema";
import { eq, and, gte, lte, like } from "drizzle-orm";
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class ExportService {
  /**
   * Export quotation to Excel format
   */
  async exportQuotationToExcel(quotationId: string): Promise<Buffer> {
    try {
      // Get quotation data
      const [quotation] = await db.select().from(quotations).where(eq(quotations.id, quotationId));
      if (!quotation) throw new Error("Quotation not found");

      const items = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
      const [customer] = await db.select().from(customers).where(eq(customers.id, quotation.customerId));

      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Create quotation header data
      const headerData = [
        ['QUOTATION'],
        [''],
        ['Date:', new Date(quotation.orderDate).toLocaleDateString()],
        ['Quotation Number:', quotation.quotationNumber],
        ['Revision No:', quotation.revisionNumber || 'R1'],
        ['Customer Code:', quotation.customerCode],
        ['Country:', quotation.country],
        ['Price List:', quotation.priceList || ''],
        [''],
        ['Items:']
      ];

      // Create items data
      const itemsData = [
        ['Product', 'Specification', 'Quantity', 'Unit Price', 'Line Total']
      ];

      items.forEach(item => {
        itemsData.push([
          item.productName,
          item.specification || '',
          item.quantity,
          item.unitPrice,
          item.lineTotal
        ]);
      });

      // Add totals
      itemsData.push([]);
      itemsData.push(['', '', '', 'Subtotal:', quotation.subtotal]);
      itemsData.push(['', '', '', 'Shipping Fee:', quotation.shippingFee || '0']);
      itemsData.push(['', '', '', 'Bank Charge:', quotation.bankCharge || '0']);
      itemsData.push(['', '', '', 'Discount:', quotation.discount || '0']);
      itemsData.push(['', '', '', 'Others:', quotation.others || '0']);
      itemsData.push(['', '', '', 'TOTAL:', quotation.total]);

      // Add payment info
      itemsData.push([]);
      itemsData.push(['Payment Method:', quotation.paymentMethod || '']);
      itemsData.push(['Shipping Method:', quotation.shippingMethod || '']);
      itemsData.push(['Customer Service Instructions:', quotation.customerServiceInstructions || '']);

      // Combine all data
      const wsData = [...headerData, ...itemsData];
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Quotation');
      
      // Generate buffer
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      return buffer;
    } catch (error) {
      console.error('Error exporting quotation to Excel:', error);
      throw error;
    }
  }

  /**
   * Export sales order to Excel format
   */
  async exportSalesOrderToExcel(salesOrderId: string): Promise<Buffer> {
    try {
      const [salesOrder] = await db.select().from(salesOrders).where(eq(salesOrders.id, salesOrderId));
      if (!salesOrder) throw new Error("Sales order not found");

      const items = await db.select().from(salesOrderItems).where(eq(salesOrderItems.salesOrderId, salesOrderId));
      const [customer] = await db.select().from(customers).where(eq(customers.id, salesOrder.customerId));

      const wb = XLSX.utils.book_new();
      
      const headerData = [
        ['SALES ORDER'],
        [''],
        ['Sales Order No:', salesOrder.salesOrderNumber],
        ['Revision No:', salesOrder.revisionNumber || 'R1'],
        ['Date:', new Date(salesOrder.createdAt).toLocaleDateString()],
        ['Due Date:', new Date(salesOrder.dueDate).toLocaleDateString()],
        ['Customer Code:', salesOrder.customerCode],
        ['Customer Name:', customer?.name || ''],
        ['Country:', salesOrder.country],
        ['Status:', salesOrder.status || 'draft'],
        [''],
        ['Order Items:']
      ];

      const itemsData = [
        ['Product', 'Specification', 'Quantity', 'Unit Price', 'Line Total']
      ];

      items.forEach(item => {
        itemsData.push([
          item.productName,
          item.specification || '',
          item.quantity,
          item.unitPrice,
          item.lineTotal
        ]);
      });

      itemsData.push([]);
      itemsData.push(['', '', '', 'Subtotal:', salesOrder.subtotal]);
      itemsData.push(['', '', '', 'Shipping Charge (USD):', salesOrder.shippingChargeUsd || '0']);
      itemsData.push(['', '', '', 'Bank Charge (USD):', salesOrder.bankChargeUsd || '0']);
      itemsData.push(['', '', '', 'Discount (USD):', salesOrder.discountUsd || '0']);
      itemsData.push(['', '', '', 'Others:', salesOrder.others || '0']);
      itemsData.push(['', '', '', 'TOTAL (USD):', salesOrder.pleasePayThisAmountUsd]);

      const wsData = [...headerData, ...itemsData];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Order');
      
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      return buffer;
    } catch (error) {
      console.error('Error exporting sales order to Excel:', error);
      throw error;
    }
  }

  /**
   * Export summary report to Excel
   */
  async exportSummaryReport(filters: {
    dateFrom?: string;
    dateTo?: string;
    customerCode?: string;
    orderItem?: string;
    reportType: 'quotations' | 'sales-orders' | 'job-orders';
  }): Promise<Buffer> {
    try {
      let data: any[] = [];
      
      if (filters.reportType === 'quotations') {
        data = await this.getQuotationsSummary(filters);
      } else if (filters.reportType === 'sales-orders') {
        data = await this.getSalesOrdersSummary(filters);
      } else if (filters.reportType === 'job-orders') {
        data = await this.getJobOrdersSummary(filters);
      }

      const wb = XLSX.utils.book_new();
      
      // Create summary header
      const headerData = [
        [`${filters.reportType.toUpperCase()} SUMMARY REPORT`],
        [''],
        ['Filters:'],
        ['Date From:', filters.dateFrom || 'All'],
        ['Date To:', filters.dateTo || 'All'],
        ['Customer Code:', filters.customerCode || 'All'],
        ['Order Item:', filters.orderItem || 'All'],
        [''],
        ['Report Data:']
      ];

      // Create data headers based on report type
      let dataHeaders: string[] = [];
      if (filters.reportType === 'quotations') {
        dataHeaders = ['Date', 'Quotation No.', 'Customer Code', 'Country', 'Total', 'Status'];
      } else if (filters.reportType === 'sales-orders') {
        dataHeaders = ['Date', 'Sales Order No.', 'Customer Code', 'Country', 'Total', 'Status', 'Confirmed'];
      } else if (filters.reportType === 'job-orders') {
        dataHeaders = ['Date', 'Job Order No.', 'Customer Code', 'Due Date', 'Status'];
      }

      const tableData = [dataHeaders];
      
      // Add data rows
      data.forEach(row => {
        if (filters.reportType === 'quotations') {
          tableData.push([
            new Date(row.orderDate).toLocaleDateString(),
            row.quotationNumber,
            row.customerCode,
            row.country,
            row.total,
            row.status
          ]);
        } else if (filters.reportType === 'sales-orders') {
          tableData.push([
            new Date(row.createdAt).toLocaleDateString(),
            row.salesOrderNumber,
            row.customerCode,
            row.country,
            row.pleasePayThisAmountUsd,
            row.status,
            row.isConfirmed ? 'Yes' : 'No'
          ]);
        } else if (filters.reportType === 'job-orders') {
          tableData.push([
            new Date(row.date).toLocaleDateString(),
            row.jobOrderNumber,
            row.customerCode,
            new Date(row.dueDate).toLocaleDateString(),
            'In Progress'
          ]);
        }
      });

      // Add summary statistics
      tableData.push([]);
      tableData.push(['Summary:']);
      tableData.push(['Total Records:', data.length]);
      
      if (filters.reportType !== 'job-orders') {
        const totalValue = data.reduce((sum, row) => {
          const value = filters.reportType === 'quotations' ? row.total : row.pleasePayThisAmountUsd;
          return sum + parseFloat(value || '0');
        }, 0);
        tableData.push(['Total Value:', totalValue.toFixed(2)]);
      }

      const wsData = [...headerData, ...tableData];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Summary Report');
      
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      return buffer;
    } catch (error) {
      console.error('Error exporting summary report:', error);
      throw error;
    }
  }

  private async getQuotationsSummary(filters: any) {
    let query = db.select().from(quotations);
    
    if (filters.customerCode) {
      query = query.where(eq(quotations.customerCode, filters.customerCode));
    }
    
    const results = await query;
    
    return results.filter(q => {
      if (filters.dateFrom && new Date(q.orderDate) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(q.orderDate) > new Date(filters.dateTo)) return false;
      return true;
    });
  }

  private async getSalesOrdersSummary(filters: any) {
    let query = db.select().from(salesOrders);
    
    if (filters.customerCode) {
      query = query.where(eq(salesOrders.customerCode, filters.customerCode));
    }
    
    const results = await query;
    
    return results.filter(so => {
      if (filters.dateFrom && new Date(so.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(so.createdAt) > new Date(filters.dateTo)) return false;
      return true;
    });
  }

  private async getJobOrdersSummary(filters: any) {
    let query = db.select().from(jobOrders);
    
    if (filters.customerCode) {
      query = query.where(eq(jobOrders.customerCode, filters.customerCode));
    }
    
    const results = await query;
    
    return results.filter(jo => {
      if (filters.dateFrom && new Date(jo.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(jo.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  }
}

export const exportService = new ExportService();