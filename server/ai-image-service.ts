import fs from 'fs/promises';
import path from 'path';

interface ImageGenerationRequest {
  productName: string;
  description?: string;
  hairType: 'human' | 'synthetic';
  texture: 'straight' | 'curly' | 'wavy';
  color: string;
  length: number;
  style?: string;
  category?: string;
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
   * Build an expert-level optimized prompt for hair extension product photography
   */
  private buildPrompt(request: ImageGenerationRequest): string {
    const { productName, description, hairType, texture, color, length, category } = request;
    
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

    // Analyze product name and description for expert context
    const analysisContext = this.analyzeProductContext(productName, description, category);
    
    const hairTypeDesc = hairType === 'human' ? 'premium human hair' : 'high-quality synthetic hair';
    const textureDesc = textureDescriptions[texture] || texture;
    const colorDesc = colorDescriptions[color as keyof typeof colorDescriptions] || color.toLowerCase();

    // Build expert photography prompt with context-aware details
    const basePrompt = `Professional high-end product photography of ${hairTypeDesc} extensions, ${textureDesc}, ${colorDesc} color, ${length} inches length.`;
    
    const technicalSpecs = `Studio lighting setup: key light with softbox, fill light for shadow detail, rim light for hair separation. White seamless paper background. Hair arranged in elegant flowing display showcasing natural movement and texture.`;
    
    const qualityRequirements = `Commercial beauty photography aesthetic, shot with 85mm lens, f/8 aperture for optimal depth of field. Hair should appear healthy, lustrous, with natural shine and volume. ${analysisContext.qualityFeatures}`;
    
    const compositionDetails = `Clean, minimal composition perfect for e-commerce. Hair positioned to show: texture detail, color accuracy, length proportion, natural flow. ${analysisContext.styleNotes}`;
    
    const expertFinishing = `Professional color grading, optimal contrast, sharp focus throughout. Image suitable for luxury beauty brand catalog, highlighting premium quality and craftsmanship.`;

    return `${basePrompt} ${technicalSpecs} ${qualityRequirements} ${compositionDetails} ${expertFinishing}`;
  }

  /**
   * Analyze product context from name and description for expert photography guidance
   */
  private analyzeProductContext(productName: string, description?: string, category?: string) {
    const name = productName.toLowerCase();
    const desc = description?.toLowerCase() || '';
    const cat = category?.toLowerCase() || '';

    // Expert analysis based on product characteristics
    const features = {
      qualityFeatures: '',
      styleNotes: '',
      specialHandling: ''
    };

    // Analyze quality level from name/description
    if (name.includes('premium') || name.includes('luxury') || desc.includes('premium')) {
      features.qualityFeatures = 'Emphasize luxury presentation with subtle golden undertones and premium packaging elements visible at edges.';
    } else if (name.includes('remy') || desc.includes('remy')) {
      features.qualityFeatures = 'Highlight cuticle alignment and natural hair direction with careful lighting to show authentic texture.';
    } else if (name.includes('hd lace') || desc.includes('hd lace')) {
      features.qualityFeatures = 'Focus on lace transparency and natural hairline simulation with detailed macro photography approach.';
    }

    // Analyze texture and styling from context
    if (name.includes('body wave') || desc.includes('body wave')) {
      features.styleNotes = 'Arrange to show gentle S-curve pattern with natural volume and movement.';
    } else if (name.includes('deep wave') || desc.includes('deep wave')) {
      features.styleNotes = 'Display pronounced wave pattern with dramatic curves and dimension.';
    } else if (name.includes('kinky') || name.includes('afro')) {
      features.styleNotes = 'Showcase natural kinky texture with proper volume and authentic curl definition.';
    } else if (name.includes('straight')) {
      features.styleNotes = 'Emphasize sleek, smooth texture with natural shine and flow.';
    }

    // Analyze origin and specialty features
    if (name.includes('brazilian') || name.includes('peruvian') || name.includes('malaysian') || name.includes('indian')) {
      features.specialHandling = 'Highlight regional hair characteristics and authentic natural patterns.';
    } else if (name.includes('european')) {
      features.specialHandling = 'Emphasize fine texture and blonde-friendly processing capabilities.';
    } else if (name.includes('closure') || name.includes('frontal')) {
      features.specialHandling = 'Focus on lace base construction and natural scalp simulation.';
    }

    return features;
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