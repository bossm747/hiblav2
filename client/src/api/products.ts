import { apiRequest } from '@/lib/queryClient';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  basePrice: number;
  currency: string;
  unit: string;
  stockQuantity: number;
  minimumStock: number;
  isActive: boolean;
  specifications?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  basePrice: number;
  currency: string;
  unit: string;
  stockQuantity: number;
  minimumStock: number;
  isActive?: boolean;
  specifications?: string[];
  tags?: string[];
}

export const productsApi = {
  getAll: (): Promise<Product[]> => 
    apiRequest('/api/products'),
    
  getById: (id: string): Promise<Product> => 
    apiRequest(`/api/products/${id}`),
    
  create: (data: CreateProductData): Promise<Product> => 
    apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<CreateProductData>): Promise<Product> => 
    apiRequest(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string): Promise<void> => 
    apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),
};