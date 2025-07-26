import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShoppingCart, Heart, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";
import { HairAnimation3D } from "@/components/hair-animation-3d";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    // For demo purposes, use a mock customer ID and post to cart API
    const cartData = {
      customerId: "demo-customer-1",
      productId: product.id,
      quantity: 1,
    };

    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData),
    })
      .then(() => {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to add item to cart.",
          variant: "destructive",
        });
      });
  };

  const handleAddToWishlist = (product: Product) => {
    // For demo purposes, use a mock customer ID and post to wishlist API
    const wishlistData = {
      customerId: "demo-customer-1", 
      productId: product.id,
    };

    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wishlistData),
    })
      .then(() => {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      })
      .catch(() => {
        toast({
          title: "Error", 
          description: "Failed to add item to wishlist.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Demo Notice Banner */}
      <div className="glass-dark border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              🎭 <span className="neon-text-cyan">Demo Platform</span> - Try our 
              <Link href="/login" className="ml-1 text-primary hover:neon-text-purple underline transition-all">
                demo login
              </Link>
              {" "}with instant access (Customer, Admin, Cashier modes available)
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden w-full">
        <div className="absolute inset-0 glass-dark" />
        <div className="relative w-full h-full px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center max-w-none">
            {/* Text Content */}
            <div className="bg-transparent p-8">
              <h1 className="text-5xl font-bold mb-4 neon-text-yellow">
                Premium Filipino Hair Extensions
              </h1>
              <p className="text-xl mb-8 text-foreground/80">
                Discover our collection of high-quality real human hair "piloka" extensions. 
                Transform your look with authentic Filipino beauty.
              </p>
              <div className="space-x-4">
                <Link href="/products">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-primary text-foreground hover:bg-primary/20 hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    View Catalog
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* 3D Animation with Logo Overlay */}
            <div className="bg-transparent p-4 h-full min-h-[400px] relative">
              <HairAnimation3D />
              {/* Logo Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                  <img 
                    src={logoPath} 
                    alt="Hibla Filipino Hair" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 neon-text-purple">Premium Collection</h2>
            <p className="text-lg text-muted-foreground">Discover our Instagram-featured hair extensions</p>
          </div>

          {/* Premium Featured Showcase */}
          <div className="mb-16">
            <Card className="glass-card border-white/20 neon-purple overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Content Side */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
                      PREMIUM COLLECTION
                    </Badge>
                    <h3 className="text-3xl font-bold text-foreground mb-4 neon-text-cyan">
                      Korean HD Lace Collection
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Experience the finest quality with our Korean HD Lace hair extensions. 
                      Invisible lace technology meets premium human hair for the most natural look possible.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-foreground">100% Human Hair</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-foreground">HD Invisible Lace Technology</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span className="text-foreground">Multiple Textures Available</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-foreground">Premium Grade Quality</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/products?category=korean-hd-lace">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all">
                        Shop Collection
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:neon-text-cyan transition-all">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="space-y-4">
                      <div className="glass-card p-4 neon-glow-light h-32 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400 mb-1">₱4,500</div>
                          <div className="text-sm text-muted-foreground">Straight 18"</div>
                        </div>
                      </div>
                      <div className="glass-card p-4 neon-glow-light h-32 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400 mb-1">₱5,200</div>
                          <div className="text-sm text-muted-foreground">Body Wave 20"</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="glass-card p-4 neon-glow-light h-32 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-400 mb-1">₱4,800</div>
                          <div className="text-sm text-muted-foreground">Curly 16"</div>
                        </div>
                      </div>
                      <div className="glass-card p-4 neon-glow-light h-32 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">₱5,800</div>
                          <div className="text-sm text-muted-foreground">Deep Wave 22"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-lg"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Special Offers Banner */}
          <div className="mb-12">
            <Card className="glass-card border-white/20 neon-cyan overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">!</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground neon-text-cyan">Limited Time Offer</h3>
                      <p className="text-muted-foreground">Get 15% off on orders above ₱8,000 + Free shipping nationwide</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">15% OFF</div>
                      <div className="text-sm text-muted-foreground">Use code: HIBLA15</div>
                    </div>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card animate-pulse">
                  <div className="h-64 bg-white/10" />
                  <div className="p-4">
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map((product) => (
                <div 
                  key={product.id} 
                  className="glass-card group hover:neon-cyan transition-all cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.featuredImage || product.images?.[0] || "https://via.placeholder.com/300x300?text=Hair+Extension"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground neon-pink">
                        -{Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)}%
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-foreground">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {product.soldCount && product.soldCount > 0 && (
                        <span className="text-sm text-muted-foreground">({product.soldCount} sold)</span>
                      )}
                      {product.length && (
                        <span className="text-sm text-muted-foreground">{product.length}"</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) ? (
                          <>
                            <span className="text-lg font-bold text-foreground">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-foreground">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 space-x-2 flex">
                    <Button 
                      className="flex-1 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-primary hover:bg-primary/20 hover:neon-text-pink transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product);
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!featuredProducts || featuredProducts.length === 0) && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground neon-text-pink">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Hair Care Category */}
            <Link href="/products?category=hair-care" className="group relative h-64 rounded-lg overflow-hidden block glass-card neon-purple hover:scale-105 transition-transform">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{
                  backgroundImage: 'url(/uploads/ai-generated/human-straight-natural-brown-20in-1753529970210.png)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-purple-600/60" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white neon-text-purple">Hair Care</h3>
                  <p className="text-white/90">Premium care products for your hair</p>
                </div>
              </div>
            </Link>

            {/* Human Hair Category */}
            <Link href="/products?category=human" className="group relative h-64 rounded-lg overflow-hidden block glass-card neon-cyan hover:scale-105 transition-transform">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{
                  backgroundImage: 'url(/uploads/ai-generated/human-wavy-jet-black-22in-1753529995220.png)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 to-cyan-600/60" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white neon-text-cyan">Human Hair</h3>
                  <p className="text-white/90">Premium quality, natural look</p>
                </div>
              </div>
            </Link>

            {/* Lace Closures Category */}
            <Link href="/products?category=lace-closures" className="group relative h-64 rounded-lg overflow-hidden block glass-card neon-pink hover:scale-105 transition-transform">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{
                  backgroundImage: 'url(/uploads/ai-generated/human-straight-natural-black-16in-1753530018679.png)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 to-pink-600/60" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white neon-text-pink">Lace Closures</h3>
                  <p className="text-white/90">HD Lace closures in various sizes</p>
                </div>
              </div>
            </Link>

            {/* Korean HD Lace Category */}
            <Link href="/products?category=korean-hd" className="group relative h-64 rounded-lg overflow-hidden block glass-card neon-yellow hover:scale-105 transition-transform">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{
                  backgroundImage: 'url(/uploads/ai-generated/human-body%20wave-chocolate-brown-18in-1753530039325.png)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/80 to-yellow-600/60" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white neon-text-yellow">Korean HD Lace</h3>
                  <p className="text-white/90">Premium invisible lace technology</p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-dark py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src={logoPath} alt="Hibla Filipino Hair" className="h-10 w-auto mb-4 brightness-200 invert" />
              <p className="text-muted-foreground">
                Your trusted source for premium Filipino hair extensions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground neon-text-purple">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all">All Products</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground neon-text-purple">Categories</h4>
              <ul className="space-y-2">
                <li><Link href="/products?category=hair-care" className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all">Hair Care</Link></li>
                <li><Link href="/products?category=human" className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all">Human Hair</Link></li>
                <li><Link href="/products?category=accessories" className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground neon-text-purple">Follow Us</h4>
              <p className="text-muted-foreground">@hibla.filipinohumanhair</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-muted-foreground">&copy; 2025 Hibla Filipino Hair. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </div>
  );
}