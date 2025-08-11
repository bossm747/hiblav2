import React from 'react';
import { Switch, Route, Router } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

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
import PriceManagementPage from '@/pages/PriceManagementPage';
import { ProductsManagementPage } from '@/pages/ProductsManagementPage';
import WarehouseManagementPage from '@/pages/WarehouseManagementPage';
import { InventoryInsightsPage } from '@/pages/InventoryInsightsPage';
import Documentation from '@/pages/Documentation';
import PaymentRecording from '@/pages/PaymentRecording';
import EmailSettings from '@/pages/EmailSettings';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="hibla-ui-theme">
        <Router>
          <AppLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
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
              <Route path="/documentation" component={Documentation} />
            </Switch>
          </AppLayout>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;