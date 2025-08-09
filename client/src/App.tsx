import React from 'react';
import { Switch, Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import PriceManagement from '@/pages/PriceManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
              <Route path="/customers" component={CustomerManagementPage} />
              <Route path="/staff" component={StaffManagementPage} />
              <Route path="/price-management" component={PriceManagement} />
              <Route path="/reports" component={ReportsPage} />
            </Switch>
          </AppLayout>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;