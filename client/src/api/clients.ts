import { apiRequest } from '@/lib/queryClient';

export interface Client {
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

export interface CreateClientData {
  code: string;
  name: string;
  email: string;
  country: string;
  priceList: string;
  phone?: string;
  address?: string;
}

const API_BASE = '/api/clients';

export const clientsApi = {
  getAll: (): Promise<Client[]> => 
    apiRequest(API_BASE),
    
  getById: (id: string): Promise<Client> => 
    apiRequest(`${API_BASE}/${id}`),
    
  create: (data: CreateClientData): Promise<Client> => 
    apiRequest(API_BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<CreateClientData>): Promise<Client> => 
    apiRequest(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string): Promise<void> => 
    apiRequest(`${API_BASE}/${id}`, {
      method: 'DELETE',
    }),
};