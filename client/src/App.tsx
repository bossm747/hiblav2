import { Router, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { useState, useEffect } from 'react';

// Import components
import { Preloader } from "@/components/Preloader";
import { LandingPage } from "@/components/LandingPage";

import Login from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { SalesOperationsDashboard } from "@/pages/SalesOperationsDashboard";
import { SalesPage } from "@/pages/SalesPage";
import { ProductionManagementDashboard } from "@/pages/ProductionManagementDashboard";
import { InventoryWarehouseDashboard } from "@/pages/InventoryWarehouseDashboard";
import { FinancialOperationsDashboard } from "@/pages/FinancialOperationsDashboard";
import { ReportsAnalyticsDashboard } from "@/pages/ReportsAnalyticsDashboard";
import { AdministrationDashboard } from "@/pages/AdministrationDashboard";
import { EnhancedSystemPage } from "@/pages/EnhancedSystemPage";
import { AssetsManagementPage } from "@/pages/AssetsManagementPage";
import { CategoriesManagementPage } from "@/pages/CategoriesManagementPage";
import { DataImportExport } from "@/pages/DataImportExport";
import { WarehouseTransferPage } from "@/pages/WarehouseTransferPage";
import { VendorOnboarding } from "@/pages/VendorOnboarding";
import { EnhancedReporting } from "@/pages/EnhancedReporting";
import { TestConnection } from "@/pages/TestConnection";
import { CreateCustomer } from "@/pages/CreateCustomer";


// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type AppState = 'preloader' | 'landing' | 'login' | 'authenticated';

// Main app routes component
function AppRoutes() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [appState, setAppState] = useState<AppState>('preloader');

  // Initialize application state on mount/reload
  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      // User is already logged in, skip preloader
      setAppState('authenticated');
    } else {
      // No authentication, start from preloader
      setAppState('preloader');
    }
  }, []);

  // Handle state changes based on authentication
  useEffect(() => {
    if (user && appState !== 'authenticated') {
      setAppState('authenticated');
    }
  }, [user, appState]);

  const handlePreloaderComplete = () => {
    setAppState('landing');
  };

  const handleLoginClick = () => {
    setAppState('login');
  };

  const handleLoginSuccess = () => {
    setAppState('authenticated');
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setAppState('landing');
  };

  // Show preloader first
  if (appState === 'preloader') {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  // Show landing page
  if (appState === 'landing') {
    return <LandingPage onLogin={handleLoginClick} />;
  }

  // Show login page
  if (appState === 'login' || (!user && location === '/login')) {
    return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setAppState('landing')} />;
  }

  // Protected routes - need authentication
  if (!user || appState !== 'authenticated') {
    return <LandingPage onLogin={handleLoginClick} />;
  }

  // All protected routes are wrapped in AppLayout
  let content = null;

  switch(location) {
    case '/':
      content = <Dashboard />;
      break;
    case '/sales':
      content = <SalesPage />;
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
    case '/assets':
      content = <AssetsManagementPage />;
      break;
    case '/categories':
      content = <CategoriesManagementPage />;
      break;
    case '/data-import-export':
      content = <DataImportExport />;
      break;
    case '/warehouse-transfers':
      content = <WarehouseTransferPage />;
      break;
    case '/vendor-onboarding':
      content = <VendorOnboarding />;
      break;
    case '/enhanced-reports':
      content = <EnhancedReporting />;
      break;
    case '/test-connection':
      content = <TestConnection />;
      break;
    case '/customers/create':
      content = <CreateCustomer />;
      break;
    default:
      content = <Dashboard />; // Default to dashboard if route not found
  }

  return (
    <AppLayout onLogout={handleLogout}>
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