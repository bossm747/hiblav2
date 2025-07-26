import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  X, 
  Home, 
  ShoppingBag, 
  Heart, 
  User, 
  Info, 
  HelpCircle,
  CreditCard,
  Package,
  Sparkles,
  Settings,
  LogOut,
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

interface RoleBasedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export function RoleBasedSidebar({ isOpen, onClose, className }: RoleBasedSidebarProps) {
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check user role
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const userRole = user?.role || "guest";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
    onClose();
  };

  // Customer navigation sections
  const customerSections: MenuSection[] = [
    {
      title: "Shop",
      items: [
        { name: "Home", href: "/", icon: Home, description: "Welcome & featured products" },
        { name: "All Products", href: "/products", icon: ShoppingBag, description: "Browse complete catalog" },
        { name: "Human Hair", href: "/products?category=human", icon: Sparkles, description: "Premium human hair extensions" },
      ]
    },
    {
      title: "Account",
      items: [
        { name: "Wishlist", href: "/wishlist", icon: Heart, badge: "3", description: "Saved favorites" },
        { name: "My Account", href: "/account", icon: User, description: "Orders & profile" },
        { name: "About Us", href: "/about", icon: Info, description: "Our story & mission" },
        { name: "Help & Guides", href: "/docs", icon: HelpCircle, description: "Care guides & tutorials" },
      ]
    }
  ];

  // Admin navigation sections
  const adminSections: MenuSection[] = [
    {
      title: "Dashboard",
      items: [
        { name: "Admin Dashboard", href: "/admin", icon: BarChart3, description: "Overview & analytics" },
        { name: "Reports", href: "/reports", icon: TrendingUp, description: "Sales & performance" },
      ]
    },
    {
      title: "Inventory & Sales",
      items: [
        { name: "Inventory Management", href: "/inventory", icon: Package, description: "Stock management" },
        { name: "Point of Sale", href: "/pos", icon: CreditCard, description: "Process sales" },
        { name: "Products", href: "/product-management", icon: ShoppingBag, description: "Product catalog" },
      ]
    },
    {
      title: "Management",
      items: [
        { name: "Staff Management", href: "/staff", icon: Users, description: "Employee management" },
        { name: "Customer Management", href: "/clients", icon: User, description: "Customer database" },
        { name: "AI Image Generator", href: "/ai-images", icon: Sparkles, description: "Generate product photos" },
        { name: "Settings", href: "/settings", icon: Settings, description: "System configuration" },
      ]
    },
    {
      title: "Store",
      items: [
        { name: "Storefront", href: "/", icon: Home, description: "View store" },
        { name: "All Products", href: "/products", icon: ShoppingBag, description: "Browse catalog" },
      ]
    }
  ];

  // Cashier navigation sections
  const cashierSections: MenuSection[] = [
    {
      title: "Daily Operations",
      items: [
        { name: "Cashier Dashboard", href: "/cashier", icon: BarChart3, description: "Today's overview" },
        { name: "Point of Sale", href: "/pos", icon: CreditCard, description: "Process sales" },
        { name: "Inventory Check", href: "/inventory", icon: Package, description: "Check stock levels" },
      ]
    },
    {
      title: "Customer Service",
      items: [
        { name: "Customer Lookup", href: "/clients", icon: User, description: "Find customer info" },
        { name: "Product Catalog", href: "/products", icon: ShoppingBag, description: "Browse products" },
      ]
    },
    {
      title: "Store",
      items: [
        { name: "Storefront", href: "/", icon: Home, description: "View store" },
        { name: "Help & Guides", href: "/docs", icon: HelpCircle, description: "Care guides" },
      ]
    }
  ];

  // Get sections based on role
  const getSectionsForRole = () => {
    switch (userRole) {
      case "admin":
        return adminSections;
      case "cashier":
        return cashierSections;
      case "customer":
        return customerSections;
      default:
        return customerSections;
    }
  };

  const sections = getSectionsForRole();

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-screen bg-background border-r border-white/20 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-400/50">
                <img src={logoPath} alt="Hibla" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground neon-text-cyan">
                  {userRole === "admin" ? "Admin Panel" : userRole === "cashier" ? "Cashier Panel" : "Menu"}
                </h2>
                <p className="text-xs text-muted-foreground">Hibla Filipino Hair</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-primary/20"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!collapsed && (
                <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1 px-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start hover:bg-primary/20 hover:neon-text-cyan transition-all",
                          isActive(item.href) && "bg-primary/20 neon-text-cyan border-r-2 border-primary",
                          collapsed ? "px-2" : "px-3"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="ml-3 truncate">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/20">
          {!collapsed && user && (
            <div className="mb-3 p-2 glass-card rounded-lg">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            onClick={handleLogout}
            className={cn(
              "border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all",
              collapsed ? "w-full px-2" : "w-full"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-background border-r border-white/20 transform transition-transform duration-300 ease-out z-50 shadow-2xl lg:hidden",
        "w-80",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-400/50">
              <img src={logoPath} alt="Hibla" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground neon-text-cyan">
                {userRole === "admin" ? "Admin Panel" : userRole === "cashier" ? "Cashier Panel" : "Menu"}
              </h2>
              <p className="text-xs text-muted-foreground">Hibla Filipino Hair</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <nav className="space-y-1 px-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href} onClick={onClose}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start hover:bg-primary/20 hover:neon-text-cyan transition-all px-3",
                          isActive(item.href) && "bg-primary/20 neon-text-cyan border-r-2 border-primary"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-3 truncate">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Mobile User Info & Logout */}
        <div className="p-4 border-t border-white/20">
          {user && (
            <div className="mb-3 p-3 glass-card rounded-lg">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
          <div className="flex items-center space-x-2 mb-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">Theme</span>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}