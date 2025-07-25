import { randomBytes } from 'crypto';

interface AIProductData {
  name: string;
  description: string;
  brand: string;
  costPrice: string;
  retailPrice: string;
  marketPrice: string;
  competitors: string[];
  tags: string[];
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
}

interface AIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }
  }

  async generateProductData(category: string, productType?: string, existingData?: any): Promise<AIProductData> {
    const prompt = this.buildPrompt(category, productType, existingData);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://serenity-spa.replit.app',
          'X-Title': 'Serenity Spa Management System'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI');
      }

      return this.parseAIResponse(content, category);
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to default data based on category
      return this.getFallbackData(category, productType);
    }
  }

  private buildPrompt(category: string, productType?: string, existingData?: any): string {
    const categoryInfo = this.getCategoryInfo(category);
    
    let basePrompt = `You are a spa/salon inventory management expert specializing in the Philippine market. `;
    
    if (existingData && Object.keys(existingData).some(key => existingData[key] && existingData[key] !== "")) {
      // Enhancement mode - build upon existing user input
      basePrompt += `The user has already started filling out product information. ENHANCE and complete their input based on Philippine market research, keeping their existing data where provided.

USER'S EXISTING INPUT:
${JSON.stringify(existingData, null, 2)}

INSTRUCTIONS:
- Keep ALL user-provided data exactly as they entered it
- Only fill in missing fields or enhance empty fields
- If user provided a name, keep it exactly as-is
- If user provided a description, enhance it but keep their core message
- If user provided prices, use them as reference points for market research
- Research Philippine market data to complete missing information`;
    } else {
      // Generation mode - create new product
      basePrompt += `Generate realistic product data for a ${productType || categoryInfo.defaultProduct} in the ${categoryInfo.name} category.`;
    }

    return `${basePrompt}

IMPORTANT: Respond ONLY with a valid JSON object in this exact format:

{
  "name": "Product name appropriate for Philippine spa/salon market",
  "description": "Detailed product description (50-100 words)",
  "brand": "Real or realistic brand name available in Philippines",
  "costPrice": "Wholesale cost in PHP (numeric string, no currency symbol)",
  "retailPrice": "Retail price in PHP (numeric string, no currency symbol)",
  "marketPrice": "Current market price in Philippines (numeric string, no currency symbol)",
  "competitors": ["competitor1", "competitor2", "competitor3"],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "minStockLevel": recommended_minimum_stock_number,
  "maxStockLevel": recommended_maximum_stock_number,
  "unit": "${categoryInfo.unit}"
}

Context:
- Market: Philippines
- Business: Spa/Salon
- Category: ${categoryInfo.name}
- Target customers: Middle to upper-middle class Filipinos
- Currency: Philippine Peso (PHP)
- Price range: ${categoryInfo.priceRange}

Focus on:
- Products actually available in Philippine market
- Realistic Philippine peso pricing
- Local brand preferences and availability
- Appropriate stock levels for spa/salon business
- Professional spa/salon quality products`;
  }

  private getCategoryInfo(category: string) {
    const categoryMap: Record<string, any> = {
      'hair-care': {
        name: 'Hair Care',
        defaultProduct: 'professional shampoo',
        unit: 'ml',
        priceRange: '₱200-₱2000 per bottle'
      },
      'skin-care': {
        name: 'Skin Care',
        defaultProduct: 'facial cleanser',
        unit: 'ml',
        priceRange: '₱300-₱3000 per bottle'
      },
      'tools': {
        name: 'Tools',
        defaultProduct: 'professional hair cutting scissors',
        unit: 'pcs',
        priceRange: '₱500-₱5000 per piece'
      },
      'equipment': {
        name: 'Equipment',
        defaultProduct: 'hair dryer',
        unit: 'pcs',
        priceRange: '₱2000-₱15000 per unit'
      },
      'retail': {
        name: 'Retail Products',
        defaultProduct: 'hair serum',
        unit: 'ml',
        priceRange: '₱400-₱2500 per bottle'
      }
    };

    return categoryMap[category] || categoryMap['retail'];
  }

  private parseAIResponse(content: string, category: string): AIProductData {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const required = ['name', 'description', 'brand', 'costPrice', 'retailPrice'];
      for (const field of required) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return {
        name: parsed.name,
        description: parsed.description,
        brand: parsed.brand,
        costPrice: parsed.costPrice,
        retailPrice: parsed.retailPrice,
        marketPrice: parsed.marketPrice || parsed.retailPrice,
        competitors: parsed.competitors || [],
        tags: parsed.tags || [],
        minStockLevel: parsed.minStockLevel || 10,
        maxStockLevel: parsed.maxStockLevel || 100,
        unit: parsed.unit || 'pcs'
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackData(category);
    }
  }

  private getFallbackData(category: string, productType?: string): AIProductData {
    const fallbackData: Record<string, AIProductData> = {
      'hair-care': {
        name: 'Professional Keratin Shampoo',
        description: 'Professional-grade keratin-infused shampoo designed for damaged and chemically-treated hair. Helps restore hair strength and shine while providing deep cleansing.',
        brand: 'Matrix Biolage',
        costPrice: '350',
        retailPrice: '650',
        marketPrice: '680',
        competitors: ['Loreal Professional', 'Wella Professionals', 'Schwarzkopf'],
        tags: ['keratin', 'professional', 'damaged-hair', 'salon-quality'],
        minStockLevel: 15,
        maxStockLevel: 60,
        unit: 'ml'
      },
      'skin-care': {
        name: 'Hydrating Facial Cleanser',
        description: 'Gentle yet effective facial cleanser suitable for all skin types. Removes makeup and impurities while maintaining skin moisture balance.',
        brand: 'Cetaphil',
        costPrice: '280',
        retailPrice: '450',
        marketPrice: '480',
        competitors: ['Neutrogena', 'The Ordinary', 'CeraVe'],
        tags: ['gentle', 'hydrating', 'all-skin-types', 'daily-use'],
        minStockLevel: 20,
        maxStockLevel: 80,
        unit: 'ml'
      },
      'tools': {
        name: 'Professional Hair Cutting Scissors',
        description: 'High-quality stainless steel professional scissors with ergonomic design. Perfect for precision cutting and styling in professional salon environments.',
        brand: 'Jaguar',
        costPrice: '1200',
        retailPrice: '2500',
        marketPrice: '2800',
        competitors: ['Kasho', 'Matsuzaki', 'Hikari'],
        tags: ['professional', 'stainless-steel', 'precision', 'ergonomic'],
        minStockLevel: 5,
        maxStockLevel: 20,
        unit: 'pcs'
      },
      'equipment': {
        name: 'Professional Hair Dryer',
        description: 'Ionic professional hair dryer with multiple heat and speed settings. Reduces drying time while minimizing heat damage to hair.',
        brand: 'Babyliss Pro',
        costPrice: '3500',
        retailPrice: '6500',
        marketPrice: '7200',
        competitors: ['Dyson', 'GHD', 'Parlux'],
        tags: ['ionic', 'professional', 'multiple-settings', 'fast-drying'],
        minStockLevel: 2,
        maxStockLevel: 8,
        unit: 'pcs'
      },
      'retail': {
        name: 'Argan Oil Hair Serum',
        description: 'Nourishing argan oil-based hair serum that adds shine and reduces frizz. Suitable for daily use on dry or damaged hair.',
        brand: 'Moroccanoil',
        costPrice: '450',
        retailPrice: '850',
        marketPrice: '920',
        competitors: ['Olaplex', 'Kerastase', 'Schwarzkopf Oil Ultime'],
        tags: ['argan-oil', 'anti-frizz', 'shine', 'daily-use'],
        minStockLevel: 12,
        maxStockLevel: 48,
        unit: 'ml'
      }
    };

    return fallbackData[category] || fallbackData['retail'];
  }

  generateSKU(category: string, brand: string, name: string): string {
    const categoryCode = category.split('-').map(word => word.charAt(0).toUpperCase()).join('');
    const brandCode = brand.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const nameCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${categoryCode}${brandCode}${nameCode}${randomSuffix}`;
  }

  generateBarcode(): string {
    // Generate EAN-13 barcode (Philippines uses EAN system)
    const countryCode = '480'; // Philippines EAN country code
    const manufacturerCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const productCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    const baseCode = countryCode + manufacturerCode + productCode;
    
    // Calculate check digit using EAN-13 algorithm
    let sum = 0;
    for (let i = 0; i < baseCode.length; i++) {
      const digit = parseInt(baseCode[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return baseCode + checkDigit;
  }
}

export const aiService = new AIService();