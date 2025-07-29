import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Preloader } from "@/components/preloader";
import { AuthGuard } from "@/components/auth-guard";

// Pages
import HomePage from "@/pages/home";
import ProductsPage from "@/pages/products";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import PaymentPage from "@/pages/payment";
import AccountPage from "@/pages/account";
import InventoryPage from "@/pages/inventory";
import POSPage from "@/pages/pos";
import LoginPage from "@/pages/login";
import AdminPage from "@/pages/admin";
import CashierPage from "@/pages/cashier";
import AboutPage from "@/pages/about";
import WishlistPage from "@/pages/wishlist";
import DocsPage from "@/pages/docs";
import StaffPage from "@/pages/staff";
import ServicesPage from "@/pages/services";
import ClientsPage from "@/pages/clients";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import AppointmentsPage from "@/pages/appointments";
import AppointmentBookingPage from "@/pages/appointment-booking";
import StaffDashboardPage from "@/pages/staff-dashboard";
import ClientPortalPage from "@/pages/client-portal";
import TimesheetPage from "@/pages/timesheet";
import MarketingPage from "@/pages/marketing";
import DashboardPage from "@/pages/dashboard";
import DocumentationPage from "@/pages/documentation";
import AIImageManagementPage from "@/pages/ai-image-management";
import ProductManagementPage from "@/pages/product-management";
import AnalyticsPage from "@/pages/analytics";
import ProductsAdminPage from "@/pages/products-admin";
import OrdersAdminPage from "@/pages/orders-admin";
import CustomersAdminPage from "@/pages/customers-admin";
import StaffAdminPage from "@/pages/staff-admin";
import SettingsAdminPage from "@/pages/settings-admin";
import NotFound from "@/pages/not-found";
import TestAIPage from "@/pages/test-ai";
import StylistRecommendationsPage from "@/pages/stylist-recommendations";
import CategoriesPage from "@/pages/categories";
import ContactPage from "@/pages/contact";
import OrderConfirmationPage from "@/pages/order-confirmation";
import AdminOrdersPage from "@/pages/admin/orders";
import PaymentProcessingPage from "@/pages/payment-processing";
import PaymentSuccessPage from "@/pages/payment-success";
import AdminPaymentMethodsPage from "@/pages/admin/payment-methods";
import AdminPaymentApprovalsPage from "@/pages/admin/payment-approvals";
import LoyaltyPage from "@/pages/loyalty";
import OrdersPage from "@/pages/orders";

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
            <Route path="/payment/:orderId" component={PaymentPage} />
            <Route path="/payment-success/:orderId" component={PaymentSuccessPage} />
            <Route path="/order-confirmation/:orderId" component={OrderConfirmationPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/categories" component={CategoriesPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/wishlist" component={WishlistPage} />
            <Route path="/loyalty" component={LoyaltyPage} />
            <Route path="/docs" component={DocsPage} />
            <Route path="/documentation">
              <DocumentationPage onBack={() => window.history.back()} />
            </Route>
            <Route path="/test-ai" component={TestAIPage} />
            <Route path="/stylist-recommendations" component={StylistRecommendationsPage} />
            <Route path="/login" component={LoginPage} />

            {/* Protected Customer Routes */}
            <Route path="/account">
              <AuthGuard>
                <AccountPage />
              </AuthGuard>
            </Route>

            <Route path="/orders">
              <AuthGuard>
                <OrdersPage />
              </AuthGuard>
            </Route>

            {/* Protected Staff Routes */}
            <Route path="/admin">
              <AuthGuard requiredRole="admin">
                <AdminPage />
              </AuthGuard>
            </Route>

            <Route path="/cashier">
              <AuthGuard requiredRole="cashier">
                <CashierPage />
              </AuthGuard>
            </Route>

            <Route path="/inventory">
              <AuthGuard requiredRole="admin">
                <InventoryPage />
              </AuthGuard>
            </Route>

            <Route path="/admin/orders">
              <AuthGuard requiredRole="admin">
                <AdminOrdersPage />
              </AuthGuard>
            </Route>

            <Route path="/admin/payment-methods">
              <AuthGuard requiredRole="admin">
                <AdminPaymentMethodsPage />
              </AuthGuard>
            </Route>

            <Route path="/admin/payment-approvals">
              <AuthGuard requiredRole="admin">
                <AdminPaymentApprovalsPage />
              </AuthGuard>
            </Route>

            <Route path="/ai-images">
              <AuthGuard requiredRole="admin">
                <AIImageManagementPage />
              </AuthGuard>
            </Route>

            <Route path="/product-management">
              <AuthGuard requiredRole="admin">
                <ProductManagementPage />
              </AuthGuard>
            </Route>

            <Route path="/analytics">
              <AuthGuard requiredRole="admin">
                <AnalyticsPage />
              </AuthGuard>
            </Route>

            <Route path="/products-admin">
              <AuthGuard requiredRole="admin">
                <ProductsAdminPage />
              </AuthGuard>
            </Route>

            <Route path="/orders-admin">
              <AuthGuard requiredRole="admin">
                <OrdersAdminPage />
              </AuthGuard>
            </Route>

            <Route path="/customers-admin">
              <AuthGuard requiredRole="admin">
                <CustomersAdminPage />
              </AuthGuard>
            </Route>

            <Route path="/staff-admin">
              <AuthGuard requiredRole="admin">
                <StaffAdminPage />
              </AuthGuard>
            </Route>

            <Route path="/settings-admin">
              <AuthGuard requiredRole="admin">
                <SettingsAdminPage />
              </AuthGuard>
            </Route>

            <Route path="/pos">
              <AuthGuard requiredRole="cashier">
                <POSPage />
              </AuthGuard>
            </Route>

            <Route path="/staff">
              <AuthGuard requiredRole="admin">
                <StaffPage />
              </AuthGuard>
            </Route>

            <Route path="/services">
              <AuthGuard requiredRole="admin">
                <ServicesPage />
              </AuthGuard>
            </Route>

            <Route path="/clients">
              <AuthGuard requiredRole="admin">
                <ClientsPage />
              </AuthGuard>
            </Route>

            <Route path="/reports">
              <AuthGuard requiredRole="admin">
                <ReportsPage />
              </AuthGuard>
            </Route>

            <Route path="/settings">
              <AuthGuard requiredRole="admin">
                <SettingsPage />
              </AuthGuard>
            </Route>

            <Route path="/appointments">
              <AuthGuard requiredRole="admin">
                <AppointmentsPage />
              </AuthGuard>
            </Route>

            <Route path="/book-appointment">
              <AuthGuard requiredRole="admin">
                <AppointmentBookingPage />
              </AuthGuard>
            </Route>

            <Route path="/staff-dashboard">
              <AuthGuard requiredRole="admin">
                <StaffDashboardPage />
              </AuthGuard>
            </Route>

            <Route path="/client-portal">
              <AuthGuard>
                <ClientPortalPage />
              </AuthGuard>
            </Route>

            <Route path="/timesheet">
              <AuthGuard requiredRole="admin">
                <TimesheetPage />
              </AuthGuard>
            </Route>

            <Route path="/marketing">
              <AuthGuard requiredRole="admin">
                <MarketingPage />
              </AuthGuard>
            </Route>

            <Route path="/dashboard">
              <AuthGuard requiredRole="admin">
                <DashboardPage />
              </AuthGuard>
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;