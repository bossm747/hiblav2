import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Preloader } from "@/components/preloader";

// Pages
import HomePage from "@/pages/home";
import InventoryPage from "@/pages/inventory";
import POSPage from "@/pages/pos";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Preloader />
        <div className="min-h-screen">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/pos" component={POSPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;