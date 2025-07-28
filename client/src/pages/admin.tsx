import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Settings, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  LogOut,
  BarChart3,
  CreditCard,
  Sparkles,
  Menu,
  X,
  CheckCircle
} from "lucide-react";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  email: string;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        setLocation("/login");
        return;
      }
      setUser(parsedUser);
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  const adminMenuItems = [
    {
      title: "Inventory Management",
      description: "Manage product stock, suppliers, and inventory tracking",
      icon: Package,
      href: "/inventory",
      color: "neon-purple",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Point of Sale (POS)",
      description: "Process in-store sales and manage transactions",
      icon: CreditCard,
      href: "/pos",
      color: "neon-cyan",
      bgColor: "bg-cyan-500/20",
    },
    {
      title: "AI Image Generator",
      description: "Generate professional product images using AI analysis",
      icon: Sparkles,
      href: "/ai-images",
      color: "neon-purple",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Product Management",
      description: "Add, edit, and organize product catalog with AI images",
      icon: Package,
      href: "/products-admin",
      color: "neon-pink",
      bgColor: "bg-pink-500/20",
    },
    {
      title: "Order Management",
      description: "View and process customer orders",
      icon: ShoppingCart,
      href: "/orders-admin",
      color: "neon-green",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Customer Management",
      description: "Manage customer accounts and data",
      icon: Users,
      href: "/customers-admin",
      color: "neon-blue",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Analytics & Reports",
      description: "Sales reports, analytics, and business insights",
      icon: BarChart3,
      href: "/analytics",
      color: "neon-orange",
      bgColor: "bg-orange-500/20",
    },
    {
      title: "Staff Management",
      description: "Manage staff accounts and permissions",
      icon: Users,
      href: "/staff-admin",
      color: "neon-red",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Payment Methods",
      description: "Configure GCash numbers and payment options",
      icon: CreditCard,
      href: "/admin/payment-methods",
      color: "neon-blue",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Payment Approvals",
      description: "Review and approve customer payment proofs",
      icon: CheckCircle,
      href: "/admin/payment-approvals",
      color: "neon-green",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Store Settings",
      description: "Configure store information and preferences",
      icon: Settings,
      href: "/settings-admin",
      color: "neon-yellow",
      bgColor: "bg-yellow-500/20",
    },
  ];

  // Mock statistics - replace with real data
  const stats = [
    { label: "Total Products", value: "25", icon: Package, color: "text-purple-400" },
    { label: "Low Stock Items", value: "3", icon: AlertTriangle, color: "text-red-400" },
    { label: "Pending Orders", value: "8", icon: ShoppingCart, color: "text-blue-400" },
    { label: "Today's Sales", value: "₱12,450", icon: DollarSign, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Role-Based Sidebar */}
      <RoleBasedSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <img src={logoPath} alt="Hibla" className="h-8 w-8 rounded-full" />
                <h1 className="text-lg font-bold text-foreground neon-text-cyan">Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <header className="hidden lg:block glass-dark shadow-xl border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center">
                  <img src={logoPath} alt="Hibla Filipino Hair" className="h-8 w-8 object-contain" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-foreground neon-text-cyan">Admin Panel</h1>
                  <p className="text-sm text-muted-foreground">Hibla Filipino Hair</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card border-white/20 neon-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminMenuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className={`glass-card border-white/20 hover:scale-105 transition-all cursor-pointer ${item.color} group`}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 neon-text-purple">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/products-admin/new">
              <Button className="w-full h-16 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                <Package className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/pos">
              <Button className="w-full h-16 bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                <CreditCard className="h-5 w-5 mr-2" />
                Process Sale
              </Button>
            </Link>
            <Link href="/inventory">
              <Button className="w-full h-16 bg-accent text-accent-foreground hover:shadow-lg hover:shadow-pink-500/50 transition-all">
                <Package className="h-5 w-5 mr-2" />
                Stock Adjustment
              </Button>
            </Link>
            <Link href="/analytics">
              <Button className="w-full h-16 bg-muted text-muted-foreground hover:shadow-lg hover:shadow-green-500/50 transition-all">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 neon-text-cyan">Recent Activity</h2>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-foreground">New order #1234 received</p>
                  </div>
                  <p className="text-sm text-muted-foreground">5 min ago</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <p className="text-foreground">Low stock alert: Korean HD Lace</p>
                  </div>
                  <p className="text-sm text-muted-foreground">15 min ago</p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-foreground">Product updated: Synthetic Curly Hair</p>
                  </div>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}