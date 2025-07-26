import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Sparkles, RefreshCw, X, Eye } from "lucide-react";

interface ImageUploadWithAIProps {
  value?: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  productData?: {
    name: string;
    description?: string;
    hairType: string;
    texture: string;
    color: string;
    length: number;
    category?: string;
  };
}

export function ImageUploadWithAI({ 
  value = [], 
  onChange, 
  maxImages = 5,
  productData 
}: ImageUploadWithAIProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      if (!productData) {
        throw new Error("Product data is required for AI generation");
      }

      const response = await fetch("/api/ai/generate-product-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productData.name,
          description: productData.description,
          hairType: productData.hairType,
          texture: productData.texture,
          color: productData.color,
          length: productData.length,
          category: productData.category || "hair-extensions"
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const newImages = [...value, data.imagePath];
      onChange(newImages);
      toast({
        title: "AI Image Generated",
        description: "Professional product image created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).slice(0, maxImages - value.length).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        return data.url;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...value, ...uploadedUrls];
      onChange(newImages);
      
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} image(s)`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const getImageSrc = (imagePath: string) => {
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('/attached_assets/')) {
      return imagePath;
    }
    return `/attached_assets/${imagePath}`;
  };

  const canAddMore = value.length < maxImages;
  const hasProductData = productData && productData.name && productData.hairType;

  return (
    <div className="space-y-4">
      {/* Upload/Generate Area */}
      {canAddMore && (
        <Card className="border-2 border-dashed border-white/20 hover:border-white/40 transition-colors">
          <CardContent className="p-6">
            <div
              className={`relative rounded-lg border-2 border-dashed transition-colors ${
                dragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/20'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="p-8 text-center">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  {/* Upload Button */}
                  <div className="flex flex-col items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                    >
                      {uploading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Images
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG up to 10MB
                    </p>
                  </div>

                  <div className="text-muted-foreground">or</div>

                  {/* AI Generate Button */}
                  <div className="flex flex-col items-center">
                    <Button
                      type="button"
                      onClick={() => generateImageMutation.mutate()}
                      disabled={generateImageMutation.isPending || !hasProductData}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {generateImageMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      AI Generate
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      {hasProductData ? "Professional AI images" : "Fill product details first"}
                    </p>
                  </div>
                </div>

                {!hasProductData && (
                  <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                    <p className="text-sm text-amber-200">
                      💡 Fill in product name, hair type, texture, color, and length to enable AI generation
                    </p>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imagePath, index) => (
            <Card key={index} className="glass border-white/10 overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="aspect-square relative group">
                  <img
                    src={getImageSrc(imagePath)}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/200/200';
                    }}
                  />
                  
                  {/* AI Generated Badge */}
                  {imagePath.includes('ai-generated') && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="bg-purple-500 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setPreviewImage(getImageSrc(imagePath))}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <Button
              onClick={() => setPreviewImage(null)}
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Usage Stats */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {value.length} of {maxImages} images uploaded
        </p>
      </div>
    </div>
  );
}