// Centralized API exports
export * from './blog-posts';
export * from './customers';
export * from './dashboard';
export * from './jobOrders';
export * from './products';
export * from './quotations';
export * from './sales-orders';

// Re-export the main API request function
export { apiRequest } from '@/lib/queryClient';