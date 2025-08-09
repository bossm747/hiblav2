import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Bot, Sparkles, Image, FileText, Wand2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AIProductEnhancerProps {
  productData: {
    name: string;
    category?: string;
    hairType?: string;
    length?: number;
    texture?: string;
    color?: string;
    description?: string;
  };
  onEnhancedData: (data: any) => void;
  onImageGenerated: (imageData: { imageUrl: string; altText: string }) => void;
}

export function AIProductEnhancer({ productData, onEnhancedData, onImageGenerated }: AIProductEnhancerProps) {
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const { toast } = useToast();

  const generateMissingDetails = async () => {
    setIsGeneratingDetails(true);
    try {
      const response = await apiRequest('/api/products/ai/generate-details', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      onEnhancedData(response);
      toast({
        title: 'AI Enhancement Complete',
        description: 'Successfully generated missing product details using Google Gemini 2.5 Pro',
      });
    } catch (error) {
      toast({
        title: 'AI Enhancement Failed',
        description: 'Failed to generate product details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingDetails(false);
    }
  };

  const generateProductImage = async () => {
    setIsGeneratingImage(true);
    try {
      const response = await apiRequest('/api/products/ai/generate-image', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      onImageGenerated(response);
      toast({
        title: 'AI Image Generated',
        description: 'Successfully created product image using Google Gemini 2.0 Flash',
      });
    } catch (error) {
      toast({
        title: 'Image Generation Failed',
        description: 'Failed to generate product image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const enhanceDescription = async () => {
    setIsEnhancingDescription(true);
    try {
      const response = await apiRequest('/api/products/ai/enhance-description', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      onEnhancedData({
        description: response.description,
        marketingCopy: response.marketingCopy,
        technicalSpecs: response.technicalSpecs,
        keywords: response.keywords,
      });
      toast({
        title: 'Description Enhanced',
        description: 'AI-powered description enhancement completed successfully',
      });
    } catch (error) {
      toast({
        title: 'Enhancement Failed',
        description: 'Failed to enhance product description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEnhancingDescription(false);
    }
  };

  const getMissingFields = () => {
    const missing = [];
    if (!productData.description || productData.description.trim() === '') missing.push('Description');
    if (!productData.hairType) missing.push('Hair Type');
    if (!productData.texture) missing.push('Texture');
    if (!productData.color) missing.push('Color');
    if (!productData.length) missing.push('Length');
    return missing;
  };

  const missingFields = getMissingFields();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-500" />
          AI Product Enhancement
          <Badge variant="secondary" className="ml-2">
            Google Gemini 2.5 Pro
          </Badge>
        </CardTitle>
        <CardDescription>
          Use AI to automatically generate missing product details, create professional images, 
          and enhance descriptions for Filipino hair products.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Missing Fields Alert */}
        {missingFields.length > 0 && (
          <div className="flex items-start gap-3 p-4 border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Missing Fields Detected
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                The following fields are missing: {missingFields.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* AI Enhancement Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Generate Missing Details */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium">Auto-Complete Details</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Generate missing specifications, pricing, and metadata based on product name and category.
              </p>
              <Button 
                onClick={generateMissingDetails}
                disabled={isGeneratingDetails}
                className="w-full"
                size="sm"
              >
                {isGeneratingDetails ? (
                  <>
                    <Bot className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Details
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generate Product Image */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Image className="h-4 w-4 text-green-500" />
                <h4 className="font-medium">Create Product Image</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Generate professional product photography showcasing Filipino hair quality and texture.
              </p>
              <Button 
                onClick={generateProductImage}
                disabled={isGeneratingImage || !productData.hairType}
                className="w-full"
                size="sm"
              >
                {isGeneratingImage ? (
                  <>
                    <Bot className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              {!productData.hairType && (
                <p className="text-xs text-muted-foreground mt-2">
                  Hair type required for image generation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Enhance Description */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-purple-500" />
                <h4 className="font-medium">Enhance Description</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create compelling marketing copy and technical specifications optimized for Filipino hair products.
              </p>
              <Button 
                onClick={enhanceDescription}
                disabled={isEnhancingDescription}
                className="w-full"
                size="sm"
              >
                {isEnhancingDescription ? (
                  <>
                    <Bot className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Enhance Copy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Current Product Data Summary */}
        <div>
          <h4 className="font-medium mb-3">Current Product Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="font-medium">Name:</span>
              <p className="text-muted-foreground">{productData.name || 'Not set'}</p>
            </div>
            <div>
              <span className="font-medium">Category:</span>
              <p className="text-muted-foreground">{productData.category || 'Not set'}</p>
            </div>
            <div>
              <span className="font-medium">Hair Type:</span>
              <p className="text-muted-foreground">{productData.hairType || 'Not set'}</p>
            </div>
            <div>
              <span className="font-medium">Length:</span>
              <p className="text-muted-foreground">{productData.length ? `${productData.length}"` : 'Not set'}</p>
            </div>
            <div>
              <span className="font-medium">Texture:</span>
              <p className="text-muted-foreground">{productData.texture || 'Not set'}</p>
            </div>
            <div>
              <span className="font-medium">Color:</span>
              <p className="text-muted-foreground">{productData.color || 'Not set'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}