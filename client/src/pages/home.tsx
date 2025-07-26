import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShoppingCart, Heart, Search, Menu, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import logoPath from "@assets/Untitled design_1753503650014.png";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true }],
    queryFn: async () => {
      const response = await fetch("/api/products?featured=true");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center">
                <img src={logoPath} alt="Hibla Filipino Hair" className="h-12 w-auto" />
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-pink-600 transition-colors">
                All Products
              </Link>
              <Link href="/products?category=synthetic" className="text-gray-700 hover:text-pink-600 transition-colors">
                Synthetic Hair
              </Link>
              <Link href="/products?category=human" className="text-gray-700 hover:text-pink-600 transition-colors">
                Human Hair
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
                About Us
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search for hair extensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-600 text-white rounded-full text-xs flex items-center justify-center">
                  0
                </span>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-600 text-white rounded-full text-xs flex items-center justify-center">
                  0
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-4">
              <Input
                type="search"
                placeholder="Search for hair extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <nav className="flex flex-col space-y-2">
                <Link href="/products" className="text-gray-700 hover:text-pink-600 py-2">
                  All Products
                </Link>
                <Link href="/products?category=synthetic" className="text-gray-700 hover:text-pink-600 py-2">
                  Synthetic Hair
                </Link>
                <Link href="/products?category=human" className="text-gray-700 hover:text-pink-600 py-2">
                  Human Hair
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-pink-600 py-2">
                  About Us
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-pink-400 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">
              Premium Filipino Hair Extensions
            </h1>
            <p className="text-xl mb-8">
              Discover our collection of high-quality synthetic and real human hair "piloka" extensions. 
              Transform your look with authentic Filipino beauty.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                View Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.featuredImage || product.images?.[0] || "https://via.placeholder.com/300x300?text=Hair+Extension"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        -{Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)}%
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {product.soldCount && product.soldCount > 0 && (
                        <span className="text-sm text-gray-500">({product.soldCount} sold)</span>
                      )}
                      {product.length && (
                        <span className="text-sm text-gray-600">{product.length}"</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) ? (
                          <>
                            <span className="text-lg font-bold text-pink-600">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-pink-600">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 space-x-2">
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {(!featuredProducts || featuredProducts.length === 0) && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products?category=synthetic">
              <a className="group relative h-64 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="relative h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Synthetic Hair</h3>
                    <p>Affordable and versatile options</p>
                  </div>
                </div>
              </a>
            </Link>
            <Link href="/products?category=human">
              <a className="group relative h-64 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="relative h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Human Hair</h3>
                    <p>Premium quality, natural look</p>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src={logoPath} alt="Hibla Filipino Hair" className="h-10 w-auto mb-4 brightness-0 invert" />
              <p className="text-gray-400">
                Your trusted source for premium Filipino hair extensions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products">All Products</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products?category=synthetic">Synthetic Hair</Link></li>
                <li><Link href="/products?category=human">Human Hair</Link></li>
                <li><Link href="/products?category=accessories">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p className="text-gray-400">@hibla.filipinohumanhair</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Hibla Filipino Hair. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}