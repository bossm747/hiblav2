import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Package, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import type { Product } from "@shared/schema";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  href: string;
}

const categories: Category[] = [
  {
    id: "human-hair",
    name: "Human Hair Extensions",
    description: "Premium quality human hair extensions in various textures and lengths",
    image: "https://via.placeholder.com/400x300?text=Human+Hair",
    productCount: 45,
    featured: true,
    href: "/products?category=human"
  },
  {
    id: "synthetic-hair",
    name: "Synthetic Hair",
    description: "High-quality synthetic hair options for budget-conscious customers",
    image: "https://via.placeholder.com/400x300?text=Synthetic+Hair",
    productCount: 28,
    featured: false,
    href: "/products?category=synthetic"
  },
  {
    id: "straight-hair",
    name: "Straight Hair",
    description: "Sleek and smooth straight hair extensions",
    image: "https://via.placeholder.com/400x300?text=Straight+Hair",
    productCount: 32,
    featured: true,
    href: "/products?texture=straight"
  },
  {
    id: "wavy-hair",
    name: "Wavy Hair",
    description: "Natural waves and body wave textures",
    image: "https://via.placeholder.com/400x300?text=Wavy+Hair",
    productCount: 25,
    featured: true,
    href: "/products?texture=wavy"
  },
  {
    id: "curly-hair",
    name: "Curly Hair",
    description: "Beautiful curls and deep wave patterns",
    image: "https://via.placeholder.com/400x300?text=Curly+Hair",
    productCount: 18,
    featured: false,
    href: "/products?texture=curly"
  },
  {
    id: "closures-frontals",
    name: "Closures & Frontals",
    description: "Complete your look with matching closures and frontals",
    image: "https://via.placeholder.com/400x300?text=Closures",
    productCount: 15,
    featured: true,
    href: "/products?type=closure"
  }
];

export default function CategoriesPage() {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const filteredCategories = filter === 'featured' 
    ? categories.filter(cat => cat.featured)
    : categories;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="py-16 glass-dark border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 neon-text-purple">
              Hair Categories
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our extensive collection of premium Filipino hair extensions, 
              organized by type, texture, and style preferences.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'neon-purple' : 'hover:neon-purple'}
              >
                <Package className="h-4 w-4 mr-2" />
                All Categories
              </Button>
              <Button
                variant={filter === 'featured' ? 'default' : 'outline'}
                onClick={() => setFilter('featured')}
                className={filter === 'featured' ? 'neon-cyan' : 'hover:neon-cyan'}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Featured
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="glass-card group hover:neon-cyan transition-all cursor-pointer overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {category.featured && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground neon-pink">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 neon-text-cyan">
                      {category.name}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <Package className="h-4 w-4 mr-1" />
                      {category.productCount} products
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <Link href={category.href}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white group">
                      Browse Collection
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Preview */}
      <section className="py-16 glass-dark border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 neon-text-yellow">
              Popular This Week
            </h2>
            <p className="text-muted-foreground">
              Trending products across all categories
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card animate-pulse">
                  <div className="h-48 bg-white/10 rounded-t-lg" />
                  <div className="p-4">
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <Card key={product.id} className="glass-card group hover:neon-purple transition-all">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.featuredImage || product.images?.[0] || "https://via.placeholder.com/300x300?text=Hair+Extension"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        ₱{parseFloat(product.price).toLocaleString()}
                      </div>
                      {product.length && (
                        <Badge variant="outline" className="text-xs">
                          {product.length}"
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-primary hover:bg-primary/20 hover:neon-text-cyan transition-all">
                View All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}