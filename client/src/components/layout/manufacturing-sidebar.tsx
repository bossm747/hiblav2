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
  UserCheck,
  BookOpen,
  Shield
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

  // Manufacturing navigation items - compact menu without descriptions
  const manufacturingItems: MenuItem[] = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Quotations", href: "/quotations", icon: FileText },
    { name: "Sales Orders", href: "/sales-orders", icon: ShoppingCart },
    { name: "Job Orders", href: "/job-orders", icon: Briefcase },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Products", href: "/products", icon: Package },
    { name: "Warehouses", href: "/warehouses", icon: Warehouse },
    { name: "AI Insights", href: "/inventory-insights", icon: Zap },
    { name: "Reports", href: "/summary-reports", icon: FileBarChart },
    { name: "Pricing", href: "/price-management", icon: DollarSign },
    { name: "Customers", href: "/customer-management", icon: Users },
    { name: "Staff", href: "/staff-management", icon: UserCheck },
    { name: "Access", href: "/access-management", icon: Shield },
    { name: "Docs", href: "/docs", icon: BookOpen },
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
          "absolute left-0 top-0 h-full w-52 max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-out",
          "border-r border-border"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <Link href="/" onClick={onClose} className="flex items-center hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-md border border-primary/20 flex items-center justify-center">
              <img src={hiblaLogo} alt="Hibla" className="h-7 w-7 object-contain" />
            </div>
            <span className="ml-2 font-bold text-sm text-foreground">HIBLA</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/10 h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
            {manufacturingItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center w-full px-2 py-1 rounded-md text-left transition-all duration-200",
                  "hover:bg-muted hover:text-primary group active:scale-95",
                  "border border-transparent touch-manipulation",
                  location === item.href 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "text-foreground/80 hover:border-primary/10"
                )}
              >
                <item.icon className={cn(
                  "h-3.5 w-3.5 mr-2 transition-colors flex-shrink-0",
                  location === item.href ? "text-primary" : "text-foreground/60 group-hover:text-primary"
                )} />
                <span className="flex-1 text-xs font-medium truncate">{item.name}</span>
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