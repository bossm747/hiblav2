import React from 'react';
import { Switch, Route, Router } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppFlow } from '@/components/AppFlow';

// Import pages
import { AppLayout } from '@/components/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { QuotationsPage } from '@/pages/QuotationsPage';
import { VLOOKUPQuotationsPage } from '@/pages/VLOOKUPQuotationsPage';
import { SalesOrdersPage } from '@/pages/SalesOrdersPage';
import { JobOrdersPage } from '@/pages/JobOrdersPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { CustomerManagementPage } from '@/pages/CustomerManagementPage';
import { StaffManagementPage } from '@/pages/StaffManagementPage';
import { ReportsPage } from '@/pages/ReportsPage';
import ReadyItemsSummaryPage from '@/pages/ReadyItemsSummaryPage';
import PriceManagementPage from '@/pages/PriceManagementPage';
import { ProductsManagementPage } from '@/pages/ProductsManagementPage';
import WarehouseManagementPage from '@/pages/WarehouseManagementPage';
import { InventoryInsightsPage } from '@/pages/InventoryInsightsPage';
import Documentation from '@/pages/Documentation';
import PaymentRecording from '@/pages/PaymentRecording';
import EmailSettings from '@/pages/EmailSettings';
import AdminPortal from '@/pages/AdminPortal';
import AccessManagement from '@/pages/AccessManagement';
import DocsRouter from '@/components/DocsRouter';
import Invoices from '@/pages/Invoices';
import Production from '@/pages/Production';
import InventoryTransfers from '@/pages/InventoryTransfers';
import { EnhancedSystemPage } from '@/pages/EnhancedSystemPage';

// Consolidated module imports
import SalesOperations from '@/pages/SalesOperations';
import InventoryWarehouses from '@/pages/InventoryWarehouses';
import ProductionModule from '@/pages/ProductionModule';
import FinancialOperations from '@/pages/FinancialOperations';

// New Consolidated Dashboard imports
import { SalesOperationsDashboard } from '@/pages/SalesOperationsDashboard';
import { ProductionManagementDashboard } from '@/pages/ProductionManagementDashboard';
import { InventoryWarehouseDashboard } from '@/pages/InventoryWarehouseDashboard';
import { FinancialOperationsDashboard } from '@/pages/FinancialOperationsDashboard';
import { ReportsAnalyticsDashboard } from '@/pages/ReportsAnalyticsDashboard';
import { AdministrationDashboard } from '@/pages/AdministrationDashboard';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="hibla-ui-theme">
        <AuthProvider>
          <AppFlow>
            <Router>
              <Switch>
                {/* Documentation Routes - Independent with its own sidebar */}
                <Route path="/docs/:rest*">
                  {(params) => <DocsRouter />}
                </Route>
                <Route path="/documentation" component={Documentation} />
                
                {/* Main App Routes - Inside AppLayout */}
                <Route>
                  <AppLayout>
                    <Switch>
                      <Route path="/" component={Dashboard} />
                      
                      {/* New Consolidated Dashboard Routes */}
                      <Route path="/sales-operations-dashboard" component={SalesOperationsDashboard} />
                      <Route path="/production-management-dashboard" component={ProductionManagementDashboard} />
                      <Route path="/inventory-warehouse-dashboard" component={InventoryWarehouseDashboard} />
                      <Route path="/financial-operations-dashboard" component={FinancialOperationsDashboard} />
                      <Route path="/reports-analytics-dashboard" component={ReportsAnalyticsDashboard} />
                      <Route path="/administration-dashboard" component={AdministrationDashboard} />
                      
                      {/* Consolidated Module Routes (Legacy) */}
                      <Route path="/sales-operations" component={SalesOperations} />
                      <Route path="/production-module" component={ProductionModule} />
                      <Route path="/inventory-warehouses" component={InventoryWarehouses} />
                      <Route path="/financial-operations" component={FinancialOperations} />
                      <Route path="/enhanced-system" component={EnhancedSystemPage} />
                      
                      {/* Individual page routes (legacy support) */}
                      <Route path="/quotations" component={QuotationsPage} />
                      <Route path="/quotations-vlookup" component={VLOOKUPQuotationsPage} />
                      <Route path="/sales-orders" component={SalesOrdersPage} />
                      <Route path="/job-orders" component={JobOrdersPage} />
                      <Route path="/inventory" component={InventoryPage} />
                      <Route path="/products" component={ProductsManagementPage} />
                      <Route path="/warehouses" component={WarehouseManagementPage} />
                      <Route path="/inventory-insights" component={InventoryInsightsPage} />
                      <Route path="/customer-management" component={CustomerManagementPage} />
                      <Route path="/staff-management" component={StaffManagementPage} />
                      <Route path="/price-management" component={PriceManagementPage} />
                      <Route path="/payment-recording" component={PaymentRecording} />
                      <Route path="/email-settings" component={EmailSettings} />
                      <Route path="/summary-reports" component={ReportsPage} />
                      <Route path="/ready-items-summary" component={ReadyItemsSummaryPage} />
                      <Route path="/admin-portal" component={AdminPortal} />
                      <Route path="/access-management" component={AccessManagement} />
                      <Route path="/invoices" component={Invoices} />
                      <Route path="/production" component={Production} />
                      <Route path="/inventory-transfers" component={InventoryTransfers} />
                    </Switch>
                  </AppLayout>
                </Route>
              </Switch>
            </Router>
          </AppFlow>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;