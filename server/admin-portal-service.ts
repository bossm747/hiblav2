export const adminPortalService = {
  async authenticateAdmin(email: string, password: string) {
    // This is now handled by the main auth system
    // Simply return null to indicate authentication should be handled by main auth
    return null;
  },

  async login(email: string, password: string) {
    // This is now handled by the main auth system
    // Returning null to indicate this service is deprecated
    return null;
  },

  async getDashboardMetrics() {
    // This is now handled by the main dashboard API
    return {
      quotations: 0,
      salesOrders: 0,
      jobOrders: 0,
      customers: 0
    };
  },

  async getQuotations() {
    return [];
  },

  async getSalesOrders() {
    return [];
  },

  async getJobOrders() {
    return [];
  },

  async getCustomers() {
    return [];
  }
};