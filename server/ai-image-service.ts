import fs from 'fs/promises';
import path from 'path';

interface ImageGenerationRequest {
  productName: string;
  hairType: 'human' | 'synthetic';
  texture: 'straight' | 'curly' | 'wavy';
  color: string;
  length: number;
  style?: string;
}

interface OpenRouterImageResponse {
  data: Array<{
    url: string;
    b64_json?: string;
  }>;
}

class AIImageService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }
  }

  /**
   * Generate a professional product image for hair extensions
   */
  async generateProductImage(request: ImageGenerationRequest): Promise<string> {
    const prompt = this.buildPrompt(request);
    
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://hibla-salon.replit.app',
          'X-Title': 'Hibla Hair Extensions'
        },
        body: JSON.stringify({
          model: 'black-forest-labs/flux-1.1-pro', // Cost-effective, high-quality model
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural',
          response_format: 'url'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterImageResponse = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No image generated');
      }

      const imageUrl = data.data[0].url;
      
      // Download and save the image locally
      const savedPath = await this.downloadAndSaveImage(imageUrl, request);
      
      return savedPath;
    } catch (error) {
      console.error('AI Image Generation Error:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build an optimized prompt for hair extension product photography
   */
  private buildPrompt(request: ImageGenerationRequest): string {
    const { productName, hairType, texture, color, length } = request;
    
    const textureDescriptions = {
      straight: 'sleek, smooth, straight hair flowing naturally',
      curly: 'bouncy, defined curls with natural volume and movement',
      wavy: 'soft, flowing waves with natural texture and body'
    };

    const colorDescriptions = {
      'Natural Black': 'deep, rich natural black',
      'Dark Brown': 'warm, chocolate brown',
      'Medium Brown': 'medium chestnut brown',
      'Light Brown': 'light caramel brown',
      'Honey Blonde': 'warm honey blonde',
      'Platinum Blonde': 'cool platinum blonde',
      'Auburn': 'rich auburn red-brown',
      'Jet Black': 'glossy jet black',
      'Chestnut Brown': 'rich chestnut brown'
    };

    const hairTypeDesc = hairType === 'human' ? 'premium human hair' : 'high-quality synthetic hair';
    const textureDesc = textureDescriptions[texture] || texture;
    const colorDesc = colorDescriptions[color as keyof typeof colorDescriptions] || color.toLowerCase();

    return `Professional product photography of ${hairTypeDesc} extensions, ${textureDesc}, ${colorDesc} color, ${length} inches length. Studio lighting, white seamless background, hair arranged in elegant display showing texture and shine. Commercial photography style, high resolution, sharp focus, beauty product photography aesthetic. Hair should look healthy, lustrous, and premium quality. Clean, minimal composition perfect for e-commerce product catalog.`;
  }

  /**
   * Download image from URL and save locally
   */
  private async downloadAndSaveImage(imageUrl: string, request: ImageGenerationRequest): Promise<string> {
    try {
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to download generated image');
      }

      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      // Create filename based on product details
      const filename = this.generateFilename(request);
      const uploadDir = 'uploads/ai-generated';
      const fullPath = path.join(uploadDir, filename);

      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Save the image
      await fs.writeFile(fullPath, buffer);
      
      return `/uploads/ai-generated/${filename}`;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save generated image');
    }
  }

  /**
   * Generate a descriptive filename for the image
   */
  private generateFilename(request: ImageGenerationRequest): string {
    const { hairType, texture, color, length } = request;
    const timestamp = Date.now();
    const sanitizedColor = color.replace(/\s+/g, '-').toLowerCase();
    
    return `${hairType}-${texture}-${sanitizedColor}-${length}in-${timestamp}.png`;
  }

  /**
   * Generate multiple product variations
   */
  async generateProductVariations(baseRequest: ImageGenerationRequest, count: number = 3): Promise<string[]> {
    const variations = [];
    
    for (let i = 0; i < count; i++) {
      const variation = {
        ...baseRequest,
        style: i === 0 ? 'studio' : i === 1 ? 'lifestyle' : 'detail'
      };
      
      try {
        const imagePath = await this.generateProductImage(variation);
        variations.push(imagePath);
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error);
      }
    }
    
    return variations;
  }

  /**
   * Check if API key is valid
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const aiImageService = new AIImageService();
export type { ImageGenerationRequest };