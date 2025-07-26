import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadWithAI } from "@/components/image-upload-with-ai";
import { Plus, Edit, Trash2, Eye, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  hairType: string;
  texture: string;
  color: string;
  length: number;
  weight?: number;
  stock: number;
  images: string[];
  featuredImage?: string;
  categoryId: string;
  sku?: string;
  barcode?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    hairType: "human",
    texture: "straight",
    color: "",
    length: 12,
    weight: 100,
    stock: 0,
    images: [],
    categoryId: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      // Ensure correct data types for schema  
      const cleanData = {
        ...productData,
        price: productData.price?.toString() || "0",
        weight: productData.weight?.toString() || "100",
        length: productData.length || 18,
        currentStock: productData.stock || 0
      };
      delete cleanData.stock; // Remove the old field name
      
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Created",
        description: "Product has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: Partial<Product> & { id: string }) => {
      // Ensure correct data types for schema
      const cleanData = {
        ...productData,
        price: productData.price?.toString(),
        weight: productData.weight?.toString(),
        length: productData.length,
        currentStock: productData.stock
      };
      delete cleanData.stock; // Remove the old field name
      
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      hairType: "human",
      texture: "straight",
      color: "",
      length: 12,
      weight: 100,
      stock: 0,
      images: [],
      categoryId: ""
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Product name and category are required",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...formData,
      featuredImage: formData.images?.[0] || undefined
    };

    if (isEditing && selectedProduct) {
      updateProductMutation.mutate({ ...productData, id: selectedProduct.id });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const getImageSrc = (imagePath: string) => {
    if (imagePath?.startsWith('/uploads/') || imagePath?.startsWith('/attached_assets/')) {
      return imagePath;
    }
    return `/attached_assets/${imagePath}`;
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="border-white/20 hover:border-purple-400/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold neon-text-purple mb-2">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage your hair extension catalog with AI-powered image generation
          </p>
        </div>

      {/* Product Form */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="neon-text-cyan">
            {isEditing ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Brazilian Straight Hair"
                    className="glass"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed product description..."
                    className="glass"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₱)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="glass"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId || ""}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories as Category[] || [])?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="hairType">Hair Type</Label>
                  <Select
                    value={formData.hairType || "human"}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, hairType: value }))}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human">Human Hair</SelectItem>
                      <SelectItem value="synthetic">Synthetic Hair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="texture">Texture</Label>
                  <Select
                    value={formData.texture || "straight"}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, texture: value }))}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="wavy">Wavy</SelectItem>
                      <SelectItem value="curly">Curly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="e.g., Natural Black"
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="length">Length (inches)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={formData.length || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, length: parseInt(e.target.value) || 12 }))}
                      className="glass"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 100 }))}
                    className="glass"
                  />
                </div>
              </div>
            </div>

            {/* AI-Powered Image Upload */}
            <div>
              <Label>Product Images</Label>
              <div className="mt-2">
                <ImageUploadWithAI
                  value={formData.images || []}
                  onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={5}
                  productData={{
                    name: formData.name || "Hair Extension Product",
                    description: formData.description,
                    hairType: formData.hairType || "human", 
                    texture: formData.texture || "straight",
                    color: formData.color || "Natural Black",
                    length: formData.length || 18,
                    category: formData.categoryId || "hair-extensions"
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isEditing ? "Update Product" : "Create Product"}
              </Button>
              
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-white/20"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="neon-text-cyan">Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products as Product[] || [])?.map((product) => (
              <Card key={product.id} className="glass border-white/10 hover:border-purple-400/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="aspect-square relative bg-white/5 rounded-lg overflow-hidden mb-3">
                    <img
                      src={getImageSrc(product.featuredImage || product.images?.[0] || "")}
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
                          AI
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
                    <p className="text-lg font-bold text-purple-400">₱{product.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      onClick={() => deleteProductMutation.mutate(product.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-400 text-red-400 hover:bg-red-400/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}