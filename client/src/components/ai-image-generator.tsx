import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Image, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface AIImageGeneratorProps {
  onImageGenerated?: (imagePath: string) => void;
}

interface GenerationResult {
  productId: string;
  productName: string;
  imagePath?: string;
  status: 'success' | 'failed';
  error?: string;
}

export function AIImageGenerator({ onImageGenerated }: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai/test-image-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error("Connection test failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Successful",
        description: `AI image service is ready (${data.provider})`,
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to AI service",
        variant: "destructive",
      });
    }
  });

  const regenerateAllImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai/regenerate-all-product-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error("Failed to regenerate images");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.results || []);
      setProgress(100);
      
      toast({
        title: "Images Regenerated",
        description: `Successfully generated ${data.summary?.successful || 0} images`,
      });
      
      // Invalidate products cache to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      if (onImageGenerated && data.results?.[0]?.imagePath) {
        onImageGenerated(data.results[0].imagePath);
      }
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate images",
        variant: "destructive",
      });
    },
    onMutate: () => {
      setIsGenerating(true);
      setProgress(0);
      setResults([]);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 2000);
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  const handleRegenerateAll = () => {
    if (isGenerating) return;
    regenerateAllImagesMutation.mutate();
  };

  const handleTestConnection = () => {
    testConnectionMutation.mutate();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Processing</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 neon-text-purple">
            <Sparkles className="h-5 w-5" />
            AI Product Image Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate professional, consistent product images for all hair extensions using AI
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleTestConnection}
              disabled={testConnectionMutation.isPending}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
            >
              {testConnectionMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Image className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            
            <Button
              onClick={handleRegenerateAll}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Regenerate All Images"}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Generating images...</span>
                <span className="text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Uses OpenRouter's Flux model for high-quality, cost-effective generation</p>
            <p>• Creates consistent product photography with professional lighting</p>
            <p>• Generates images based on hair type, texture, color, and length</p>
            <p>• Replaces inconsistent placeholder images with authentic product photos</p>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="neon-text-cyan">Generation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium text-foreground">{result.productName}</p>
                      {result.error && (
                        <p className="text-sm text-red-400">{result.error}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}