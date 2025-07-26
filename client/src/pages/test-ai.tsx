import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, RefreshCw } from "lucide-react";

export default function TestAI() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateTestImage = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai/generate-product-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: "Premium Human Hair Extensions",
          description: "Beautiful premium human hair extensions with natural texture",
          hairType: "human",
          texture: "wavy",
          color: "Natural Black",
          length: 18,
          category: "hair-extensions"
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate image");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedImage(data.imagePath);
      toast({
        title: "AI Image Generated Successfully!",
        description: "Professional hair extension image created",
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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl neon-text-purple flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              AI Image Generation Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => generateTestImage.mutate()}
                disabled={generateTestImage.isPending}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {generateTestImage.isPending ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating AI Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Test AI Image Generation
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Click to test OpenAI DALL-E image generation for hair extensions
              </p>
            </div>

            {generateTestImage.isPending && (
              <div className="text-center">
                <div className="inline-block p-4 glass-dark border border-purple-500/50 rounded-lg">
                  <p className="text-purple-400">Generating professional hair extension image...</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take 10-30 seconds</p>
                </div>
              </div>
            )}

            {generatedImage && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold neon-text-cyan">Generated Image</h3>
                </div>
                <div className="flex justify-center">
                  <Card className="glass border-white/10 overflow-hidden max-w-md">
                    <CardContent className="p-0">
                      <img
                        src={generatedImage}
                        alt="AI Generated Hair Extension"
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/400';
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-400">✅ AI Image Generation Working!</p>
                  <p className="text-xs text-muted-foreground">Image saved at: {generatedImage}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
              <h4 className="font-semibold mb-2">Test Parameters:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Product: Premium Human Hair Extensions</li>
                <li>• Hair Type: Human</li>
                <li>• Texture: Wavy</li>
                <li>• Color: Natural Black</li>
                <li>• Length: 18 inches</li>
                <li>• AI Model: OpenAI DALL-E 3</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}