import { apiRequest } from '@/lib/queryClient';

export interface DashboardAnalytics {
  overview: {
    totalClients: number;
    totalProducts: number;
    activeQuotations: number;
    activeSalesOrders: number;
    activeJobOrders: number;
  };
}

export const dashboardApi = {
  getAnalytics: (): Promise<DashboardAnalytics> => 
    apiRequest('/api/dashboard/analytics'),
    
  getStats: () => 
    apiRequest('/api/reports/analytics'),
};