import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Navbar } from "@/components/navbar";
import { ShoppingCart, Heart, Filter, Grid, List, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, Category } from "@shared/schema";

export default function ProductsPage() {
  const searchParams = new URLSearchParams(useSearch());
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedHairType, setSelectedHairType] = useState<string[]>([]);
  const [selectedTexture, setSelectedTexture] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { 
      search: searchQuery, 
      category: selectedCategory, 
      hairType: selectedHairType,
      texture: selectedTexture,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy 
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      selectedHairType.forEach(type => params.append("hairType", type));
      selectedTexture.forEach(texture => params.append("texture", texture));
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
      params.append("sortBy", sortBy);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
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

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (product: Product) => {
      const response = await apiRequest("POST", "/api/cart", {
        customerId: "demo-customer-1", // For demo purposes
        productId: product.id,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    },
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (product: Product) => {
      const response = await apiRequest("POST", "/api/wishlist", {
        customerId: "demo-customer-1", // For demo purposes
        productId: product.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to Wishlist",
        description: "Product has been added to your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to wishlist.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (product: Product) => {
    if (!product.currentStock || product.currentStock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate(product);
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlistMutation.mutate(product);
  };



  const hairTypes = ["Human", "Synthetic", "Blend"];
  const textures = ["Straight", "Wavy", "Curly", "Kinky"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="glass-dark border-b border-white/10 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search hair extensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-foreground">Categories</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-foreground">Hair Type</h3>
                <div className="space-y-2">
                  {hairTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedHairType.includes(type.toLowerCase())}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedHairType([...selectedHairType, type.toLowerCase()]);
                          } else {
                            setSelectedHairType(selectedHairType.filter(t => t !== type.toLowerCase()));
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm text-foreground">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-foreground">Texture</h3>
                <div className="space-y-2">
                  {textures.map((texture) => (
                    <div key={texture} className="flex items-center space-x-2">
                      <Checkbox
                        id={texture}
                        checked={selectedTexture.includes(texture.toLowerCase())}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTexture([...selectedTexture, texture.toLowerCase()]);
                          } else {
                            setSelectedTexture(selectedTexture.filter(t => t !== texture.toLowerCase()));
                          }
                        }}
                      />
                      <label htmlFor={texture} className="text-sm text-foreground">{texture}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedHairType([]);
                  setSelectedTexture([]);
                  setPriceRange([0, 10000]);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground neon-text-cyan">
                Hair Extensions
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {products?.length || 0} products
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {productsLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {[...Array(6)].map((_, i) => (
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
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {products?.map((product) => (
                  <div 
                    key={product.id} 
                    className={`glass-card group hover:neon-cyan transition-all cursor-pointer ${viewMode === "list" ? "flex items-center p-4" : ""}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "w-32 h-32 flex-shrink-0 mr-4" : ""}`}>
                      <img
                        src={product.featuredImage || product.images?.[0] || "https://via.placeholder.com/300x300?text=Hair+Extension"}
                        alt={product.name}
                        className={`object-cover transition-transform group-hover:scale-105 ${viewMode === "list" ? "w-full h-full rounded" : "w-full h-64"}`}
                        onClick={() => handleProductClick(product)}
                      />
                      {product.compareAtPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          {Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)}% OFF
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <h3 
                        className="font-semibold text-foreground mb-2 group-hover:neon-text-cyan transition-all cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{product.hairType}</Badge>
                        {product.texture && <Badge variant="outline">{product.texture}</Badge>}
                        {product.length && <Badge variant="outline">{product.length}"</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">(0)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          className="bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={!product.currentStock || product.currentStock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!productsLoading && products?.length === 0 && (
              <div className="text-center py-12">
                <div className="glass-card p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSelectedCategory("");
                    setSelectedHairType([]);
                    setSelectedTexture([]);
                    setPriceRange([0, 10000]);
                    setSearchQuery("");
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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