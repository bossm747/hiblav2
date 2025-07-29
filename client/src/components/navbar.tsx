import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is logged in
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const isLoggedIn = !!user;

  // Mock cart count - replace with actual cart state
  const cartCount = 3;

  // Optimized navigation without duplicates
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Orders", href: "/orders", requiresAuth: true },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Staff-only navigation for admin/cashier users
  const staffNavigation = [
    { name: "Dashboard", href: user?.role === "admin" ? "/admin" : "/cashier", icon: "dashboard" },
    { name: "Inventory", href: "/inventory", icon: "inventory" },
    { name: "Analytics", href: "/analytics", icon: "analytics", adminOnly: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return (
    <header className="sticky top-0 z-50 glass-dark shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center">
              <img src={logoPath} alt="Hibla Filipino Hair" className="h-10 w-10 object-contain" />
            </div>
            <span className="ml-3 text-lg xl:text-xl font-bold text-foreground neon-text-cyan hidden md:block">
              Hibla Filipino Hair
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {/* Regular Navigation */}
            {navigation.map((item) => {
              // Skip auth-required items if user is not logged in
              if (item.requiresAuth && !isLoggedIn) return null;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm xl:text-base text-foreground/80 hover:text-foreground hover:neon-text-cyan transition-all ${
                    location === item.href ? "text-foreground neon-text-cyan" : ""
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Staff Navigation - Only for admin/cashier */}
            {isLoggedIn && (user?.role === "admin" || user?.role === "cashier") && (
              <>
                <div className="w-px h-6 bg-white/20 mx-2" />
                {staffNavigation.map((item) => {
                  // Skip admin-only items for non-admin users
                  if (item.adminOnly && user?.role !== "admin") return null;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm xl:text-base text-foreground/80 hover:text-foreground hover:neon-text-purple transition-all font-medium ${
                        location === item.href ? "text-foreground neon-text-purple" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-sm lg:max-w-md mx-4 xl:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search hair extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <Link href="/account">
                <Button variant="ghost" size="sm" className="hover:neon-purple">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="hover:neon-pink">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative hover:neon-cyan">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="border-l border-white/20 pl-3">
                  {isLoggedIn ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-foreground hidden md:inline">
                        {user.name}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                      >
                        <LogOut className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="border-primary hover:bg-primary/20 hover:neon-text-cyan transition-all">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile-Only Navigation Sidebar */}
        <div className="lg:hidden">
          <RoleBasedSidebar 
            isOpen={mobileMenuOpen} 
            onClose={() => setMobileMenuOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
}