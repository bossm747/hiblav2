import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleBasedSidebar } from "@/components/layout/role-based-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { useToast } from "@/hooks/use-toast";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  AlertTriangle,
  Star,
  TrendingUp
} from "lucide-react";

export default function ProductsAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.hairType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.texture?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-500" };
    if (quantity <= 5) return { label: "Low Stock", color: "bg-yellow-500" };
    return { label: "In Stock", color: "bg-green-500" };
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="flex min-h-screen bg-background">
          <RoleBasedSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 lg:ml-64 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <RoleBasedSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="border-b border-white/20 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <Package className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground neon-text-purple">Product Management</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredProducts.length} products • {filteredProducts.filter(p => p.stock <= 5).length} need attention
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold text-foreground">{products?.length || 0}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock</p>
                      <p className="text-2xl font-bold text-foreground">
                        {products?.filter(p => p.currentStock <= 5 && p.currentStock > 0).length || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Out of Stock</p>
                      <p className="text-2xl font-bold text-foreground">
                        {products?.filter(p => p.currentStock === 0).length || 0}
                      </p>
                    </div>
                    <Trash2 className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Featured</p>
                      <p className="text-2xl font-bold text-foreground">
                        {products?.filter(p => p.isFeatured).length || 0}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.currentStock);
                
                return (
                  <Card key={product.id} className="glass-card border-white/20 hover:scale-105 transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                        {product.featuredImage ? (
                          <img 
                            src={product.featuredImage} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-foreground text-sm leading-tight">
                            {product.name}
                          </h3>
                          <Badge variant="outline" className={`${stockStatus.color} text-white border-0 text-xs`}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Type: {product.hairType}</p>
                          <p>Length: {product.length}"</p>
                          <p>Stock: {product.currentStock} units</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                          {product.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewProduct(product)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start by adding your first product"}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
            onAddToCart={() => {}}
          />
        )}
      </div>
    </AuthGuard>
  );
}