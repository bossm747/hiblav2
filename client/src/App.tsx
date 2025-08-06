import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Preloader } from "@/components/preloader";

// Manufacturing & Supply Management Pages
import InventoryPage from "@/pages/inventory";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import QuotationsPage from "@/pages/quotations";
import SalesOrdersPage from "@/pages/sales-orders";
import JobOrdersPage from "@/pages/job-orders";
import ManufacturingDashboardPage from "@/pages/manufacturing-dashboard";
import SummaryReportsPage from "@/pages/summary-reports";
import InventoryInsightsPage from "@/pages/inventory-insights";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Preloader />
        <div className="min-h-screen">
          <Switch>
            {/* Manufacturing & Supply Management Routes */}
            <Route path="/" component={ManufacturingDashboardPage} />
            <Route path="/manufacturing-dashboard" component={ManufacturingDashboardPage} />
            <Route path="/quotations" component={QuotationsPage} />
            <Route path="/sales-orders" component={SalesOrdersPage} />
            <Route path="/job-orders" component={JobOrdersPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/inventory-insights" component={InventoryInsightsPage} />
            <Route path="/summary-reports" component={SummaryReportsPage} />
            <Route path="/login" component={LoginPage} />

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;