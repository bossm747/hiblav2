import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { ThemeToggle } from "@/components/theme-toggle";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Check if user is logged in
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const isLoggedIn = !!user;



  // Manufacturing-focused navigation
  const navigation = [
    { name: "Manufacturing", href: "/manufacturing-dashboard" },
    { name: "Quotations", href: "/quotations" },
    { name: "Sales Orders", href: "/sales-orders" },
    { name: "Job Orders", href: "/job-orders" },
    { name: "Inventory", href: "/inventory" },
    { name: "Warehouses", href: "/warehouses" },
    { name: "AI Insights", href: "/inventory-insights" },
    { name: "Reports", href: "/summary-reports" },
    { name: "Docs", href: "/documentation" },
  ];



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
              Hibla Manufacturing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {/* Manufacturing Navigation */}
            {navigation.map((item) => {

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


          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
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


      </div>
    </header>
  );
}