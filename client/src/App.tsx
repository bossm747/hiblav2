import React, { Suspense } from 'react';
import { Switch, Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';

// Import components for testing
import { VLOOKUPQuotationTest } from '@/components/VLOOKUPQuotationTest';

// Simple dashboard component
const ManufacturingDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hibla Manufacturing Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Quotations</h3>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Sales Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Job Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Products</h3>
          <p className="text-2xl font-bold">4</p>
        </div>
      </div>
    </div>
  );
};

const QuotationsVLOOKUP = () => <VLOOKUPQuotationTest />;
const SimplePage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-4">This page is ready for implementation.</p>
  </div>
);

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
      <div className="min-h-screen bg-background">
        <Router>
          <Layout>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            }>
              <Switch>
                <Route path="/" component={ManufacturingDashboard} />
                <Route path="/quotations" component={() => <SimplePage title="Quotations" />} />
                <Route path="/quotations-vlookup" component={QuotationsVLOOKUP} />
                <Route path="/sales-orders" component={() => <SimplePage title="Sales Orders" />} />
                <Route path="/job-orders" component={() => <SimplePage title="Job Orders" />} />
                <Route path="/inventory" component={() => <SimplePage title="Inventory" />} />
                <Route path="/ai-insights" component={() => <SimplePage title="AI Insights" />} />
                <Route path="/reports" component={() => <SimplePage title="Reports" />} />
                <Route path="/documentation" component={() => <SimplePage title="Documentation" />} />
              </Switch>
            </Suspense>
          </Layout>
        </Router>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;