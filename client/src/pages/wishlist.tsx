import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";
import type { Wishlist, Product } from "@shared/schema";

export default function WishlistPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery<(Wishlist & { product: Product })[]>({
    queryKey: ["/api/wishlist"],
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/wishlist/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (product: Product) => 
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          customerId: "guest",
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string) => {
    return `₱${parseFloat(price).toLocaleString()}`;
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlistMutation.mutate(id);
  };

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="h-64 bg-white/10" />
                <div className="p-4">
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 neon-text-pink">My Wishlist</h1>
          <p className="text-lg text-muted-foreground">
            {wishlistItems.length > 0 
              ? `${wishlistItems.length} items saved for later`
              : "No items in your wishlist yet"
            }
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Card className="glass-card border-white/20 max-w-md mx-auto">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start adding items to your wishlist by clicking the heart icon on products you love.
                </p>
                <Link href="/products">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all">
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="glass-card border-white/20 neon-pink group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.product.featuredImage || item.product.images?.[0] || "https://via.placeholder.com/300x300?text=Hair+Extension"}
                    alt={item.product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.product.compareAtPrice && parseFloat(item.product.compareAtPrice) > parseFloat(item.product.price) && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground neon-pink">
                      -{Math.round(((parseFloat(item.product.compareAtPrice) - parseFloat(item.product.price)) / parseFloat(item.product.compareAtPrice)) * 100)}%
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm hover:bg-red-500/80 text-white"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={removeFromWishlistMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-foreground">
                    {item.product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {item.product.soldCount && item.product.soldCount > 0 && (
                      <span className="text-sm text-muted-foreground">({item.product.soldCount} sold)</span>
                    )}
                    {item.product.length && (
                      <span className="text-sm text-muted-foreground">{item.product.length}"</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {item.product.compareAtPrice && parseFloat(item.product.compareAtPrice) > parseFloat(item.product.price) ? (
                        <>
                          <span className="text-lg font-bold text-foreground">
                            {formatPrice(item.product.price)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(item.product.compareAtPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all" 
                      onClick={() => handleAddToCart(item.product)}
                      disabled={addToCartMutation.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary hover:bg-primary/20 hover:neon-text-cyan transition-all"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={removeFromWishlistMutation.isPending}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Remove from Wishlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}