import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Package, Info, Star } from "lucide-react";
import Barcode from 'react-barcode';
import type { Product } from "@shared/schema";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onAddToWishlist }: ProductDetailModalProps) {
  if (!product) return null;

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const barcodeValue = product.sku || `PRD${product.id.slice(0, 8).toUpperCase()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-white/20 neon-purple bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground neon-text-purple">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden glass-card rounded-lg">
              {product.featuredImage ? (
                <img 
                  src={product.featuredImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground neon-pink">
                  -{Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)}% OFF
                </Badge>
              )}
            </div>
            
            {/* Barcode */}
            <div className="glass-card p-4 rounded-lg text-center neon-cyan">
              <div className="bg-white p-2 rounded">
                <Barcode 
                  value={barcodeValue}
                  width={2}
                  height={60}
                  fontSize={14}
                  background="#ffffff"
                  lineColor="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">SKU: {product.sku || "N/A"}</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-foreground neon-text-cyan">{formatPrice(product.price)}</span>
                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {product.soldCount && product.soldCount > 0 && (
                  <span>{product.soldCount} sold</span>
                )}
                <span>•</span>
                <Badge variant={product.currentStock === 0 ? "destructive" : "secondary"} className={product.currentStock === 0 ? "neon-pink" : ""}>
                  {product.currentStock || 0} in stock
                </Badge>
              </div>
            </div>

            {/* Product Details */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-dark border-white/20">
                <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Details</TabsTrigger>
                <TabsTrigger value="specifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Description</h4>
                  <p className="text-muted-foreground">{product.description || "Premium quality hair extensions designed for Filipino beauty."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium text-foreground">{product.hairType || "Hair Extensions"}</p>
                  </div>
                  {product.weight && (
                    <div>
                      <span className="text-muted-foreground">Weight:</span>
                      <p className="font-medium text-foreground">{product.weight}g</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="space-y-4">
                <div className="grid gap-3">
                  {product.texture && (
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span className="text-muted-foreground">Texture</span>
                      <span className="font-medium text-foreground">{product.texture}</span>
                    </div>
                  )}
                  {product.length && (
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span className="text-muted-foreground">Length</span>
                      <span className="font-medium text-foreground">{product.length} inches</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span className="text-muted-foreground">Color</span>
                      <span className="font-medium text-foreground">{product.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground">{product.hairType || "Hair Extension"}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                size="lg"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={!product.currentStock || product.currentStock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.currentStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              {onAddToWishlist && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary hover:bg-primary/20 hover:neon-text-pink transition-all"
                  onClick={() => {
                    onAddToWishlist(product);
                    onClose();
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/20">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">5.0 (0 reviews)</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}