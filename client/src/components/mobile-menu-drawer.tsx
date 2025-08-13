import { useState, useEffect } from "react";
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
  LogIn,
  ChevronRight,
  Search,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Briefcase,
  Users,
  BarChart3,
  Warehouse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  isStaff?: boolean;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Check if user is logged in and get role
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const isLoggedIn = !!user;
  const isStaff = user?.role === "admin" || user?.role === "manager" || user?.role === "staff";

  const manufacturingSections: MenuSection[] = [
    {
      title: "Manufacturing Operations",
      items: [
        { name: "Dashboard", href: "/", icon: LayoutDashboard, description: "Production overview & metrics" },
        { name: "Sales Operations", href: "/sales-operations", icon: ShoppingCart, description: "Quotations & sales orders" },
        { name: "Production", href: "/production-module", icon: Briefcase, description: "Job orders & manufacturing" },
        { name: "Inventory", href: "/inventory-warehouses", icon: Warehouse, description: "Stock & warehouse management" },
      ]
    },
    {
      title: "Management & Reports", 
      items: [
        { name: "Financial Operations", href: "/financial-operations", icon: CreditCard, description: "Payments & invoices" },
        { name: "Reports & Analytics", href: "/summary-reports", icon: BarChart3, description: "Manufacturing reports" },
        { name: "Customer Management", href: "/customer-management", icon: Users, description: "Customer relationships" },
        { name: "Administration", href: "/admin-portal", icon: Settings, description: "System configuration" },
      ]
    }
  ];

  const documentationSection: MenuSection[] = [
    {
      title: "Resources",
      items: [
        { name: "Documentation", href: "/docs", icon: HelpCircle, description: "User guides & workflows" },
        { name: "System Status", href: "/docs/project-status", icon: Info, description: "Current project state" },
      ]
    }
  ];

  const sections = isLoggedIn ? [...manufacturingSections, ...documentationSection] : documentationSection;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      // Handle search across manufacturing operations
      onClose();
    }
  };

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full bg-background border-l border-white/20 transform transition-transform duration-300 ease-out z-50 shadow-2xl",
        // Responsive widths for different screen sizes
        "w-full max-w-xs",        // Extra small screens: full width, max 320px
        "xs:max-w-sm",            // Small screens: max 384px  
        "sm:max-w-md",            // Medium screens: max 448px
        "md:hidden",              // Hidden on desktop
        "lg:hidden xl:hidden",    // Ensure hidden on larger screens
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 bg-background p-3 xs:p-4 sm:p-5 md:p-6">
          <div className="flex items-center space-x-2 xs:space-x-3 min-w-0 flex-1">
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-purple-400/50 flex-shrink-0">
              <img src={logoPath} alt="Hibla" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground neon-text-cyan truncate">Menu</h2>
              <p className="text-xs xs:text-xs sm:text-sm text-muted-foreground truncate">Hibla Filipino Hair</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1.5 xs:p-2 sm:p-3 hover:bg-white/10 rounded-full flex-shrink-0 touch-manipulation"
            aria-label="Close menu"
          >
            <X className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-background">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search manufacturing operations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 bg-background border-white/30 text-foreground text-sm sm:text-base"
              />
            </div>
          </form>
        </div>

        {/* User Status */}
        {isLoggedIn && (
          <div className="p-4 sm:p-6 border-b border-white/10 bg-background">
            <div className="flex items-center space-x-3 bg-background border border-white/20 p-3 sm:p-4 rounded-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              {isStaff && (
                <Badge variant="outline" className="text-xs sm:text-sm border-purple-400 text-purple-400">
                  {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'Staff'}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto bg-background">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className="py-4 sm:py-6">
              <div className="px-4 sm:px-6 mb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              
              <div className="space-y-2 px-3 sm:px-4">
                {section.items.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 sm:p-4 mx-1 sm:mx-2 rounded-xl transition-all duration-200 group touch-manipulation min-h-[3.5rem] sm:min-h-[4rem]",
                        isActive(item.href)
                          ? "bg-background border border-purple-400/50 shadow-lg"
                          : "hover:bg-muted hover:border hover:border-white/20"
                      )}
                      onClick={onClose}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className={cn(
                          "p-2 sm:p-3 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-white/10 text-muted-foreground group-hover:text-cyan-400 group-hover:bg-cyan-500/20"
                        )}>
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              "text-sm sm:text-base font-medium truncate",
                              isActive(item.href) ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                            )}>
                              {item.name}
                            </span>
                            {item.badge && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs sm:text-sm">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <ChevronRight className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 transition-colors flex-shrink-0",
                        isActive(item.href) ? "text-purple-400" : "text-muted-foreground group-hover:text-cyan-400"
                      )} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/20 space-y-3 sm:space-y-4 bg-background/80">
          {!isLoggedIn ? (
            <Link href="/login">
              <Button 
                className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={onClose}
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Login
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline"
              className="w-full h-10 sm:h-12 text-sm sm:text-base border-red-400/50 text-red-400 hover:bg-red-500/20"
              onClick={() => {
                localStorage.removeItem("user");
                onClose();
                window.location.href = "/";
              }}
            >
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Logout
            </Button>
          )}
          
          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 Hibla Filipino Hair
            </p>
          </div>
        </div>
      </div>
    </>
  );
}