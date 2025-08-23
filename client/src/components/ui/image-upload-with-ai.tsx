import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Sparkles, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  name: string;
  description?: string;
  hairType: string;
  texture: string;
  color: string;
  length: number;
  category: string;
}

interface ImageUploadWithAIProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  productData?: ProductData;
}

export function ImageUploadWithAI({
  value = [],
  onChange,
  maxImages = 5,
  productData
}: ImageUploadWithAIProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    if (value.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.url;
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        return null;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);
      
      if (validUrls.length > 0) {
        onChange([...value, ...validUrls]);
        toast({
          title: "Upload Successful",
          description: `Uploaded ${validUrls.length} image(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, maxImages, toast]);

  const handleAIGeneration = useCallback(async () => {
    if (!productData || value.length >= maxImages) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productData.name,
          hairType: productData.hairType,
          texture: productData.texture,
          color: productData.color,
          length: productData.length,
          description: productData.description
        }),
      });

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.imagePath) {
        onChange([...value, result.imagePath]);
        toast({
          title: "AI Image Generated",
          description: "Successfully generated product image",
        });
      } else {
        throw new Error(result.error || 'AI generation failed');
      }
    } catch (error: any) {
      console.error('AI Generation error:', error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate AI image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [productData, value, onChange, maxImages, toast]);

  const removeImage = useCallback((index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  }, [value, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400/50 transition-colors glass"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        <ImageIcon className="mx-auto h-12 w-12 text-white/60 mb-3" />
        <p className="text-white/80 font-medium">Drop images here or click to upload</p>
        <p className="text-white/60 text-sm mt-1">PNG, JPG, WebP up to 5MB each</p>
        
        <div className="flex gap-2 justify-center mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading || value.length >= maxImages}
            className="border-white/20 hover:border-purple-400/50"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Images"}
          </Button>
          
          {productData && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAIGeneration}
              disabled={isGenerating || value.length >= maxImages}
              className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20"
            >
              <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? "Generating..." : "Generate AI Image"}
            </Button>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageSrc, index) => (
            <Card key={index} className="relative group border-white/20 glass">
              <CardContent className="p-2">
                <div className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/200/200';
                    }}
                  />
                  
                  {/* AI Badge */}
                  {imageSrc.includes('ai-generated') && (
                    <div className="absolute top-1 left-1">
                      <Badge variant="default" className="bg-purple-500 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Count */}
      <div className="text-center text-white/60 text-sm">
        {value.length} / {maxImages} images
      </div>
    </div>
  );
}