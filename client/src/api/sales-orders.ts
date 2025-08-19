import { apiRequest } from '@/lib/queryClient';

export interface SalesOrder {
  id: string;
  salesOrderNumber: string;
  quotationId?: string;
  customerCode: string;
  customerId: string;
  country: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discountUsd?: number;
  total: number;
  pleasePayThisAmountUsd: number;
  createdBy: string;
  dueDate: Date;
  isConfirmed: boolean;
  confirmedAt?: Date;
  confirmedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSalesOrderData {
  quotationId?: string;
  customerCode: string;
  customerId: string;
  country: string;
  subtotal: number;
  discountUsd?: number;
  pleasePayThisAmountUsd: number;
  createdBy: string;
  dueDate: Date;
}

export const salesOrdersApi = {
  getAll: (): Promise<SalesOrder[]> => 
    apiRequest('/api/sales-orders'),
    
  getById: (id: string): Promise<SalesOrder> => 
    apiRequest(`/api/sales-orders/${id}`),
    
  create: (data: CreateSalesOrderData): Promise<SalesOrder> => 
    apiRequest('/api/sales-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<SalesOrder>): Promise<SalesOrder> => 
    apiRequest(`/api/sales-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string): Promise<void> => 
    apiRequest(`/api/sales-orders/${id}`, {
      method: 'DELETE',
    }),
    
  getReadyForInvoice: (): Promise<SalesOrder[]> => 
    apiRequest('/api/sales-orders/ready-for-invoice'),
};