import { apiRequest } from '@/lib/queryClient';

export interface JobOrder {
  id: string;
  jobOrderNumber: string;
  salesOrderId?: string;
  clientCode?: string;
  clientId?: string;
  status?: string;
  createdBy?: string;
  date?: string;
  dueDate?: string;
  productionDate?: string;
  nameSignature?: string;
  received?: string;
  orderInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobOrderItem {
  id: string;
  productName?: string;
  specification?: string;
  quantity?: string;
  shipment1?: string;
  shipment2?: string;
  shipment3?: string;
  shipment4?: string;
  shipment5?: string;
  shipment6?: string;
  shipment7?: string;
  shipment8?: string;
  shipped?: string;
  reserved?: string;
  ready?: string;
  toProduce?: string;
  orderBalance?: string;
}

export const jobOrdersApi = {
  // Fetch all job orders
  async fetchJobOrders(): Promise<JobOrder[]> {
    const response = await fetch('/api/job-orders');
    if (!response.ok) throw new Error('Failed to fetch job orders');
    return response.json();
  },

  // Fetch single job order
  async fetchJobOrder(id: string): Promise<JobOrder> {
    const response = await fetch(`/api/job-orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch job order');
    return response.json();
  },

  // Fetch job order items
  async fetchJobOrderItems(jobOrderId: string): Promise<JobOrderItem[]> {
    const response = await fetch(`/api/job-order-items/${jobOrderId}`);
    if (!response.ok) return [];
    return response.json();
  },

  // Create job order
  async createJobOrder(data: Partial<JobOrder>): Promise<JobOrder> {
    return apiRequest('/api/job-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update job order
  async updateJobOrder(id: string, data: Partial<JobOrder>): Promise<JobOrder> {
    return apiRequest(`/api/job-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete job order
  async deleteJobOrder(id: string): Promise<void> {
    return apiRequest(`/api/job-orders/${id}`, {
      method: 'DELETE',
    });
  },

  // Duplicate job order
  async duplicateJobOrder(id: string): Promise<JobOrder> {
    return apiRequest(`/api/job-orders/${id}/duplicate`, {
      method: 'POST',
    });
  },

  // Start production
  async startProduction(id: string): Promise<JobOrder> {
    return apiRequest(`/api/job-orders/${id}/start-production`, {
      method: 'POST',
    });
  },

  // Complete production
  async completeProduction(id: string): Promise<JobOrder> {
    return apiRequest(`/api/job-orders/${id}/complete-production`, {
      method: 'POST',
    });
  },

  // Pause production
  async pauseProduction(id: string): Promise<JobOrder> {
    return apiRequest(`/api/job-orders/${id}/pause-production`, {
      method: 'POST',
    });
  },

  // Export PDF
  async exportPDF(id: string): Promise<Blob> {
    const response = await fetch(`/api/job-orders/${id}/pdf`);
    if (!response.ok) throw new Error('Failed to export PDF');
    return response.blob();
  },

  // Send email
  async sendEmail(id: string, emailData?: { to?: string; subject?: string; body?: string }): Promise<void> {
    return apiRequest(`/api/job-orders/${id}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData || {}),
    });
  },
};