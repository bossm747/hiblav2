import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Store,
  Mail,
  Palette,
  Shield,
  Bell,
  CreditCard,
  Truck,
  Save,
  Upload
} from "lucide-react";

export default function SettingsAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    businessName: "Hibla Filipino Hair",
    tagline: "Premium Human Hair Extensions",
    description: "Authentic Filipino human hair extensions for natural beauty transformations.",
    address: "123 Beauty Street, Quezon City, Metro Manila",
    phone: "+63 912 345 6789",
    email: "info@hibla.com",
    website: "https://hibla.com",
    taxId: "123-456-789-000",
    currency: "PHP",
    timezone: "Asia/Manila"
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@hibla.com",
    smtpPassword: "",
    fromName: "Hibla Filipino Hair",
    fromEmail: "noreply@hibla.com"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockAlerts: true,
    customerSignups: true,
    paymentAlerts: true,
    emailFrequency: "immediate",
    smsNotifications: false
  });

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCod: true,
    acceptGcash: true,
    acceptMaya: true,
    acceptBankTransfer: true,
    gcashNumber: "+63 912 345 6789",
    mayaNumber: "+63 912 345 6789",
    bankAccount: "BPI - 1234567890",
    codFee: "50"
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "2000",
    standardShippingFee: "150",
    expressShippingFee: "300",
    maxShippingDays: "7",
    shippingAreas: "Metro Manila, Cebu, Davao"
  });

  const handleSaveSettings = (section: string) => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <RoleBasedSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="border-b border-white/20 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground neon-text-purple">Store Settings</h1>
                    <p className="text-sm text-muted-foreground">Configure your store and business settings</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 max-w-4xl">
            {/* Store Information */}
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground neon-text-cyan">
                  <Store className="h-5 w-5" />
                  <span>Store Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Business Name</label>
                    <Input
                      value={storeSettings.businessName}
                      onChange={(e) => setStoreSettings({...storeSettings, businessName: e.target.value})}
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
                    <Input
                      value={storeSettings.tagline}
                      onChange={(e) => setStoreSettings({...storeSettings, tagline: e.target.value})}
                      placeholder="Your business tagline"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <Textarea
                    value={storeSettings.description}
                    onChange={(e) => setStoreSettings({...storeSettings, description: e.target.value})}
                    placeholder="Brief description of your business"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <Input
                      value={storeSettings.phone}
                      onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                      placeholder="Contact phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      value={storeSettings.email}
                      onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                      placeholder="Contact email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <Textarea
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                    placeholder="Business address"
                    rows={2}
                  />
                </div>
                
                <Button onClick={() => handleSaveSettings("Store Information")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Store Settings
                </Button>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground neon-text-cyan">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Accepted Payment Methods</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={paymentSettings.acceptCod}
                          onChange={(e) => setPaymentSettings({...paymentSettings, acceptCod: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">Cash on Delivery (COD)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={paymentSettings.acceptGcash}
                          onChange={(e) => setPaymentSettings({...paymentSettings, acceptGcash: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">GCash</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={paymentSettings.acceptMaya}
                          onChange={(e) => setPaymentSettings({...paymentSettings, acceptMaya: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">Maya (PayMaya)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={paymentSettings.acceptBankTransfer}
                          onChange={(e) => setPaymentSettings({...paymentSettings, acceptBankTransfer: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">Bank Transfer</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Payment Details</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">GCash Number</label>
                        <Input
                          value={paymentSettings.gcashNumber}
                          onChange={(e) => setPaymentSettings({...paymentSettings, gcashNumber: e.target.value})}
                          placeholder="GCash mobile number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Bank Account</label>
                        <Input
                          value={paymentSettings.bankAccount}
                          onChange={(e) => setPaymentSettings({...paymentSettings, bankAccount: e.target.value})}
                          placeholder="Bank name and account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">COD Fee (₱)</label>
                        <Input
                          value={paymentSettings.codFee}
                          onChange={(e) => setPaymentSettings({...paymentSettings, codFee: e.target.value})}
                          placeholder="Cash on delivery fee"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => handleSaveSettings("Payment")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Settings */}
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground neon-text-cyan">
                  <Truck className="h-5 w-5" />
                  <span>Shipping & Delivery</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Free Shipping Threshold (₱)</label>
                    <Input
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: e.target.value})}
                      placeholder="Minimum order for free shipping"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Standard Shipping Fee (₱)</label>
                    <Input
                      value={shippingSettings.standardShippingFee}
                      onChange={(e) => setShippingSettings({...shippingSettings, standardShippingFee: e.target.value})}
                      placeholder="Standard shipping cost"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Express Shipping Fee (₱)</label>
                    <Input
                      value={shippingSettings.expressShippingFee}
                      onChange={(e) => setShippingSettings({...shippingSettings, expressShippingFee: e.target.value})}
                      placeholder="Express shipping cost"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Max Delivery Days</label>
                    <Input
                      value={shippingSettings.maxShippingDays}
                      onChange={(e) => setShippingSettings({...shippingSettings, maxShippingDays: e.target.value})}
                      placeholder="Maximum delivery time"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Shipping Areas</label>
                  <Textarea
                    value={shippingSettings.shippingAreas}
                    onChange={(e) => setShippingSettings({...shippingSettings, shippingAreas: e.target.value})}
                    placeholder="Areas where you deliver (comma separated)"
                    rows={2}
                  />
                </div>
                
                <Button onClick={() => handleSaveSettings("Shipping")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Shipping Settings
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground neon-text-cyan">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Email Notifications</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={notificationSettings.orderNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, orderNotifications: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">New Orders</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={notificationSettings.lowStockAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlerts: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">Low Stock Alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={notificationSettings.customerSignups}
                          onChange={(e) => setNotificationSettings({...notificationSettings, customerSignups: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">Customer Signups</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={notificationSettings.paymentAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, paymentAlerts: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-foreground">Payment Alerts</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Notification Frequency</h4>
                    <select
                      value={notificationSettings.emailFrequency}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailFrequency: e.target.value})}
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-background text-foreground"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={() => handleSaveSettings("Notifications")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}