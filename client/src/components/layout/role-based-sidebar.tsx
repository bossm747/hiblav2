import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  X, 
  BarChart3,
  FileText,
  ShoppingCart,
  Briefcase,
  Package,
  Zap,
  FileBarChart,
  LogOut
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
  description?: string;
}

export function RoleBasedSidebar({ isOpen, onClose, className }: RoleBasedSidebarProps) {
  const [location, setLocation] = useLocation();
  
  // Check user authentication
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
    onClose();
  };

  // Manufacturing navigation items
  const manufacturingItems: MenuItem[] = [
    { name: "Manufacturing Dashboard", href: "/manufacturing-dashboard", icon: BarChart3, description: "Production overview & metrics" },
    { name: "Quotations", href: "/quotations", icon: FileText, description: "Customer quotation management" },
    { name: "Sales Orders", href: "/sales-orders", icon: ShoppingCart, description: "Sales order processing" },
    { name: "Job Orders", href: "/job-orders", icon: Briefcase, description: "Production job management" },
    { name: "Inventory", href: "/inventory", icon: Package, description: "Stock management" },
    { name: "AI Insights", href: "/inventory-insights", icon: Zap, description: "Predictive inventory analytics" },
    { name: "Reports", href: "/summary-reports", icon: FileBarChart, description: "Manufacturing reports" },
  ];
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

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
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
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-background">
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
        <div className="flex-1 overflow-y-auto py-4 bg-background">
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
        <div className="p-4 border-t border-white/20 bg-background">
          {user && (
            <div className="mb-3 p-3 bg-secondary/50 rounded-lg border border-white/10">
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