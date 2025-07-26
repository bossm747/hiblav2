import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AIImageGenerator } from "@/components/ai-image-generator";
import { Sparkles, Image, Eye, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  hairType: string;
  texture: string;
  color: string;
  length: number;
  price: number;
  images: string[];
  featuredImage?: string;
}

export default function AIImageManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const generateSingleImageMutation = useMutation({
    mutationFn: async (product: Product) => {
      const response = await fetch("/api/ai/generate-product-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          description: product.description,
          hairType: product.hairType,
          texture: product.texture,
          color: product.color,
          length: product.length,
          category: "hair-extensions"
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
      
      return response.json();
    },
    onSuccess: (data, product) => {
      toast({
        title: "Image Generated",
        description: `New image created for ${product.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error, product) => {
      toast({
        title: "Generation Failed",
        description: `Failed to generate image for ${product.name}`,
        variant: "destructive",
      });
    }
  });

  const handleGenerateSingle = (product: Product) => {
    generateSingleImageMutation.mutate(product);
  };

  const handleImageGenerated = (imagePath: string) => {
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  };

  const getProductImageSrc = (product: Product) => {
    if (product.featuredImage?.startsWith('/uploads/ai-generated/')) {
      return product.featuredImage;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0].startsWith('/attached_assets/') 
        ? product.images[0] 
        : `/attached_assets/${product.images[0]}`;
    }
    return '/api/placeholder/300/300';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold neon-text-purple mb-2">
          AI Product Image Management
        </h1>
        <p className="text-muted-foreground">
          Generate professional, consistent product images using AI analysis of product titles and descriptions
        </p>
      </div>

      {/* AI Image Generator Component */}
      <AIImageGenerator onImageGenerated={handleImageGenerated} />

      {/* Product Grid */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="neon-text-cyan">Product Image Gallery</CardTitle>
          <p className="text-muted-foreground">
            Individual product image generation and preview
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products as Product[])?.map((product: Product) => (
              <Card key={product.id} className="glass border-white/10 hover:border-purple-400/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="aspect-square relative bg-white/5 rounded-lg overflow-hidden mb-3">
                    <img
                      src={getProductImageSrc(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/300';
                      }}
                    />
                    {product.featuredImage?.includes('ai-generated') && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-purple-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {product.hairType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.texture}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.length}"
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description || "No description available"}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGenerateSingle(product)}
                      disabled={generateSingleImageMutation.isPending}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {generateSingleImageMutation.isPending ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      Generate AI Image
                    </Button>
                    
                    <Button
                      onClick={() => setSelectedProduct(product)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="glass-card border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="neon-text-purple">{selectedProduct.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">Product Details & AI Analysis</p>
                </div>
                <Button
                  onClick={() => setSelectedProduct(null)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                <img
                  src={getProductImageSrc(selectedProduct)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/400/400';
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Hair Type:</label>
                  <p className="font-medium text-foreground">{selectedProduct.hairType}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Texture:</label>
                  <p className="font-medium text-foreground">{selectedProduct.texture}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Color:</label>
                  <p className="font-medium text-foreground">{selectedProduct.color}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Length:</label>
                  <p className="font-medium text-foreground">{selectedProduct.length} inches</p>
                </div>
              </div>
              
              <div>
                <label className="text-muted-foreground">Description:</label>
                <p className="text-foreground mt-1">
                  {selectedProduct.description || "No description available"}
                </p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">AI Analysis Factors:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product name keywords analyzed for quality level and style</li>
                  <li>• Description analyzed for texture and presentation cues</li>
                  <li>• Hair type determines lighting and material approach</li>
                  <li>• Texture guides arrangement and styling direction</li>
                  <li>• Color influences lighting temperature and background choice</li>
                  <li>• Length affects composition and framing decisions</li>
                </ul>
              </div>
              
              <Button
                onClick={() => {
                  handleGenerateSingle(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={generateSingleImageMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {generateSingleImageMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate AI Image for This Product
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}