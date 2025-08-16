import { apiRequest } from '@/lib/queryClient';

export interface Quotation {
  id: string;
  quotationNumber: string;
  revisionNumber?: string;
  customerCode?: string;
  country?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  subtotal?: string;
  shippingFee?: string;
  bankCharge?: string;
  discount?: string;
  others?: string;
  total?: string;
  customerServiceInstructions?: string;
}

export interface QuotationItem {
  id: string;
  productName?: string;
  productSku?: string;
  specification?: string;
  quantity?: string;
  unitPrice?: string;
}

export const quotationsApi = {
  // Fetch all quotations
  async fetchQuotations(): Promise<Quotation[]> {
    const response = await fetch('/api/quotations');
    if (!response.ok) throw new Error('Failed to fetch quotations');
    return response.json();
  },

  // Fetch single quotation
  async fetchQuotation(id: string): Promise<Quotation> {
    const response = await fetch(`/api/quotations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch quotation');
    return response.json();
  },

  // Fetch quotation items
  async fetchQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    const response = await fetch(`/api/quotation-items/${quotationId}`);
    if (!response.ok) return [];
    return response.json();
  },

  // Create quotation
  async createQuotation(data: Partial<Quotation>): Promise<Quotation> {
    return apiRequest('/api/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update quotation
  async updateQuotation(id: string, data: Partial<Quotation>): Promise<Quotation> {
    return apiRequest(`/api/quotations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete quotation
  async deleteQuotation(id: string): Promise<void> {
    return apiRequest(`/api/quotations/${id}`, {
      method: 'DELETE',
    });
  },

  // Duplicate quotation
  async duplicateQuotation(id: string): Promise<Quotation> {
    return apiRequest(`/api/quotations/${id}/duplicate`, {
      method: 'POST',
    });
  },

  // Approve quotation
  async approveQuotation(id: string): Promise<Quotation> {
    return apiRequest(`/api/quotations/${id}/approve`, {
      method: 'POST',
    });
  },

  // Reject quotation
  async rejectQuotation(id: string): Promise<Quotation> {
    return apiRequest(`/api/quotations/${id}/reject`, {
      method: 'POST',
    });
  },

  // Convert to sales order
  async convertToSalesOrder(id: string): Promise<{ salesOrderId: string }> {
    return apiRequest(`/api/quotations/${id}/convert-to-sales-order`, {
      method: 'POST',
    });
  },

  // Export PDF
  async exportPDF(id: string): Promise<Blob> {
    const response = await fetch(`/api/quotations/${id}/pdf`);
    if (!response.ok) throw new Error('Failed to export PDF');
    return response.blob();
  },

  // Send email
  async sendEmail(id: string, emailData?: { to?: string; subject?: string; body?: string }): Promise<void> {
    return apiRequest(`/api/quotations/${id}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData || {}),
    });
  },
};