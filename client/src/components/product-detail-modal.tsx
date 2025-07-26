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
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
              {product.featuredImage ? (
                <img 
                  src={product.featuredImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
              {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                <Badge className="absolute top-4 right-4 bg-black text-white">
                  -{Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)}% OFF
                </Badge>
              )}
            </div>
            
            {/* Barcode */}
            <div className="bg-white p-4 rounded-lg border text-center">
              <Barcode 
                value={barcodeValue}
                width={2}
                height={60}
                fontSize={14}
                background="#ffffff"
                lineColor="#000000"
              />
              <p className="text-xs text-gray-600 mt-2">SKU: {product.sku || "N/A"}</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {product.soldCount && product.soldCount > 0 && (
                  <span>{product.soldCount} sold</span>
                )}
                <span>•</span>
                <Badge variant={product.currentStock === 0 ? "destructive" : "secondary"}>
                  {product.currentStock || 0} in stock
                </Badge>
              </div>
            </div>

            {/* Product Details */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{product.description || "Premium quality hair extensions designed for Filipino beauty."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{product.hairType || "Hair Extensions"}</p>
                  </div>
                  {product.weight && (
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <p className="font-medium">{product.weight}g</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="space-y-4">
                <div className="grid gap-3">
                  {product.texture && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Texture</span>
                      <span className="font-medium">{product.texture}</span>
                    </div>
                  )}
                  {product.length && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Length</span>
                      <span className="font-medium">{product.length} inches</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Color</span>
                      <span className="font-medium">{product.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{product.hairType || "Hair Extension"}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-black hover:bg-gray-800 text-white"
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
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gray-600 text-gray-600" />
                ))}
              </div>
              <span className="text-sm text-gray-600">5.0 (0 reviews)</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}