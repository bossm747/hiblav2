import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Preloader } from "@/components/preloader";

// Pages
import HomePage from "@/pages/home";
import ProductsPage from "@/pages/products";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import AccountPage from "@/pages/account";
import InventoryPage from "@/pages/inventory";
import POSPage from "@/pages/pos";
import LoginPage from "@/pages/login";
import AdminPage from "@/pages/admin";
import CashierPage from "@/pages/cashier";
import AboutPage from "@/pages/about";
import WishlistPage from "@/pages/wishlist";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Preloader />
        <div className="min-h-screen">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/account" component={AccountPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/cashier" component={CashierPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/pos" component={POSPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/wishlist" component={WishlistPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;