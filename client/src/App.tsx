
import { Router, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AdminPortal from "@/pages/AdminPortal";
import { Dashboard } from "@/pages/Dashboard";
import { SalesOperationsDashboard } from "@/pages/SalesOperationsDashboard";
import { ProductionManagementDashboard } from "@/pages/ProductionManagementDashboard";
import { InventoryWarehouseDashboard } from "@/pages/InventoryWarehouseDashboard";
import { FinancialOperationsDashboard } from "@/pages/FinancialOperationsDashboard";
import { ReportsAnalyticsDashboard } from "@/pages/ReportsAnalyticsDashboard";
import { AdministrationDashboard } from "@/pages/AdministrationDashboard";
import { EnhancedSystemPage } from "@/pages/EnhancedSystemPage";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main app routes component
function AppRoutes() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  
  // If not logged in and not on login page, redirect to admin portal
  if (!user && location !== '/admin-portal') {
    setLocation('/admin-portal');
    return null;
  }
  
  // Public route - Admin Portal (Login)
  if (location === '/admin-portal') {
    return <AdminPortal />;
  }
  
  // Protected routes - need authentication
  if (!user) {
    return null;
  }
  
  // All protected routes are wrapped in AppLayout
  let content = null;
  
  switch(location) {
    case '/':
      content = <Dashboard />;
      break;
    case '/sales-operations-dashboard':
      content = <SalesOperationsDashboard />;
      break;
    case '/production-management-dashboard':
      content = <ProductionManagementDashboard />;
      break;
    case '/inventory-warehouse-dashboard':
      content = <InventoryWarehouseDashboard />;
      break;
    case '/financial-operations-dashboard':
      content = <FinancialOperationsDashboard />;
      break;
    case '/reports-analytics-dashboard':
      content = <ReportsAnalyticsDashboard />;
      break;
    case '/administration-dashboard':
      content = <AdministrationDashboard />;
      break;
    case '/enhanced-system':
      content = <EnhancedSystemPage />;
      break;
    default:
      content = <Dashboard />; // Default to dashboard if route not found
  }
  
  return (
    <AppLayout>
      {content}
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="hibla-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <AppRoutes />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
