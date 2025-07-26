import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileMenuDrawer } from "@/components/mobile-menu-drawer";
import logoPath from "@assets/Hiblalogo_1753513948082.png";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock cart count - replace with actual cart state
  const cartCount = 3;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop Now", href: "/products" },
    { name: "Catalog", href: "/products" },
    { name: "Human Hair", href: "/products?category=human" },
    { name: "Synthetic Hair", href: "/products?category=synthetic" },
    { name: "About", href: "/about" },
    { name: "Help", href: "/docs" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
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
            <span className="ml-3 text-xl font-bold text-foreground neon-text-cyan hidden md:block">
              Hibla Filipino Hair
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-foreground/80 hover:text-foreground hover:neon-text-cyan transition-all ${
                  location === item.href ? "text-foreground neon-text-cyan" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
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
          <div className="flex items-center space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
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
              <div className="border-l border-white/20 ml-3 pl-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-primary hover:bg-primary/20 hover:neon-text-cyan transition-all">
                    Login
                  </Button>
                </Link>
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

        {/* Mobile Menu Drawer */}
        <MobileMenuDrawer 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      </div>
    </header>
  );
}