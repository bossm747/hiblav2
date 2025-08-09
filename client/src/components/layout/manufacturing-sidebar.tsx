import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  X, 
  BarChart3,
  FileText,
  ShoppingCart,
  Briefcase,
  Package,
  Warehouse,
  Zap,
  FileBarChart,
  LogOut,
  DollarSign,
  Users,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import hiblaLogo from "@assets/Hiblalogo_1753513948082.png";

interface ManufacturingSidebarProps {
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

export function ManufacturingSidebar({ isOpen, onClose, className }: ManufacturingSidebarProps) {
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
    { name: "Dashboard", href: "/", icon: BarChart3, description: "Production overview & metrics" },
    { name: "Quotations", href: "/quotations", icon: FileText, description: "Customer quotation management" },
    { name: "Sales Orders", href: "/sales-orders", icon: ShoppingCart, description: "Sales order processing" },
    { name: "Job Orders", href: "/job-orders", icon: Briefcase, description: "Production job management" },
    { name: "Inventory", href: "/inventory", icon: Package, description: "Stock management" },
    { name: "Products", href: "/products", icon: Package, description: "Product catalog management" },
    { name: "Warehouses", href: "/warehouses", icon: Warehouse, description: "Warehouse location management" },
    { name: "AI Insights", href: "/inventory-insights", icon: Zap, description: "Predictive inventory analytics" },
    { name: "Reports", href: "/summary-reports", icon: FileBarChart, description: "Manufacturing reports" },
    { name: "Price Management", href: "/price-management", icon: DollarSign, description: "Pricing & cost control" },
    { name: "Customer Management", href: "/customer-management", icon: Users, description: "Customer relationship management" },
    { name: "Staff Management", href: "/staff-management", icon: UserCheck, description: "Team & role management" },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        className
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={cn(
          "absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-out",
          "border-r border-border"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-cyan-500/5">
          <Link href="/" onClick={onClose} className="flex items-center hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg border-2 border-primary/20 flex items-center justify-center">
              <img src={hiblaLogo} alt="Hibla Manufacturing" className="h-10 w-10 object-contain" />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">
                HIBLA
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide">
                MANUFACTURING
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {manufacturingItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center w-full p-4 rounded-xl text-left transition-all duration-200",
                  "hover:bg-muted hover:text-primary group active:scale-95",
                  "border border-transparent min-h-[3.5rem] touch-manipulation",
                  location === item.href 
                    ? "bg-primary/10 text-primary border-primary/20 shadow-lg" 
                    : "text-foreground/80 hover:border-primary/10"
                )}
              >
                <item.icon className={cn(
                  "h-6 w-6 mr-4 transition-colors flex-shrink-0",
                  location === item.href ? "text-primary" : "text-foreground/60 group-hover:text-primary"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <ThemeToggle />
          {isLoggedIn && (
            <div className="space-y-2">
              <div className="text-sm text-foreground/60">
                Logged in as: <span className="text-foreground font-medium">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}