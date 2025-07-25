import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import Clients from "@/pages/clients";
import Services from "@/pages/services";
import Staff from "@/pages/staff";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/clients" component={Clients} />
      <Route path="/services" component={Services} />
      <Route path="/staff" component={Staff} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50">
          {/* Mobile menu overlay */}
          {sidebarOpen && (
            <div 
              className="sidebar-overlay lg:hidden" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Main content */}
          <div className="lg:pl-64">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            {/* Page content */}
            <main className="flex-1">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
