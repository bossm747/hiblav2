import { apiRequest } from '@/lib/queryClient';

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  country: string;
  priceList: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerData {
  code: string;
  name: string;
  email: string;
  country: string;
  priceList: string;
  phone?: string;
  address?: string;
}

export const customersApi = {
  getAll: (): Promise<Customer[]> => 
    apiRequest('/api/customers'),
    
  getById: (id: string): Promise<Customer> => 
    apiRequest(`/api/customers/${id}`),
    
  create: (data: CreateCustomerData): Promise<Customer> => 
    apiRequest('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<CreateCustomerData>): Promise<Customer> => 
    apiRequest(`/api/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string): Promise<void> => 
    apiRequest(`/api/customers/${id}`, {
      method: 'DELETE',
    }),
};