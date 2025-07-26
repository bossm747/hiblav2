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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoPath from "@assets/Hiblalogo_1753513948082.png";

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
  const isStaff = user?.role === "admin" || user?.role === "cashier";

  const customerSections: MenuSection[] = [
    {
      title: "Shop",
      items: [
        { name: "Home", href: "/", icon: Home, description: "Welcome & featured products" },
        { name: "All Products", href: "/products", icon: ShoppingBag, description: "Browse complete catalog" },
        { name: "Human Hair", href: "/products?category=human", icon: Sparkles, description: "Premium human hair extensions" },
        { name: "Synthetic Hair", href: "/products?category=synthetic", icon: Package, description: "High-quality synthetic options" },
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

  const staffSections: MenuSection[] = [
    {
      title: "Business Tools",
      items: [
        { name: "Point of Sale", href: "/pos", icon: CreditCard, description: "Process sales", isStaff: true },
        { name: "Inventory", href: "/inventory", icon: Package, description: "Stock management", isStaff: true },
        { name: "AI Images", href: "/ai-images", icon: Sparkles, description: "Generate product photos", isStaff: true },
        { name: "Admin Panel", href: "/admin", icon: Settings, description: "Full admin access", isStaff: true },
      ]
    }
  ];

  const sections = isStaff ? [...customerSections, ...staffSections] : customerSections;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-sm glass-dark border-l border-white/20 transform transition-transform duration-300 ease-out z-50 md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={logoPath} alt="Hibla" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground neon-text-cyan">Menu</h2>
              <p className="text-xs text-muted-foreground">Hibla Filipino Hair</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search hair extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-white/20 bg-white/5"
              />
            </div>
          </form>
        </div>

        {/* User Status */}
        {isLoggedIn && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 glass p-3 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              {isStaff && (
                <Badge variant="outline" className="text-xs border-purple-400 text-purple-400">
                  Staff
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              
              <div className="space-y-1 px-2">
                {section.items.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 mx-2 rounded-xl transition-all duration-200 group touch-manipulation",
                        isActive(item.href)
                          ? "glass neon-glow-light border border-purple-400/50 bg-white/10"
                          : "hover:glass hover:bg-white/5"
                      )}
                      onClick={onClose}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-white/5 text-muted-foreground group-hover:text-cyan-400 group-hover:bg-cyan-500/20"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              "text-sm font-medium truncate",
                              isActive(item.href) ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                            )}>
                              {item.name}
                            </span>
                            {item.badge && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <ChevronRight className={cn(
                        "h-4 w-4 transition-colors flex-shrink-0",
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
        <div className="p-4 border-t border-white/20 space-y-3">
          {!isLoggedIn ? (
            <Link href="/login">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={onClose}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Staff Login
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline"
              className="w-full border-red-400/50 text-red-400 hover:bg-red-500/20"
              onClick={() => {
                localStorage.removeItem("user");
                onClose();
                window.location.href = "/";
              }}
            >
              Sign Out
            </Button>
          )}
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © 2025 Hibla Filipino Hair
            </p>
          </div>
        </div>
      </div>
    </>
  );
}