import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// Primary AI service using Google Gemini 2.5 Pro with OpenAI fallback for cost efficiency
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InventoryInsightRequest {
  productName: string;
  currentStock: number;
  salesHistory: Array<{
    date: string;
    quantity: number;
    customerCode: string;
  }>;
  productionHistory: Array<{
    date: string;
    quantity: number;
    leadTime: number;
  }>;
  seasonalFactors?: {
    month: number;
    demandMultiplier: number;
  }[];
  supplierLeadTime: number;
  minimumStockLevel: number;
}

export interface InventoryPrediction {
  productName: string;
  currentStock: number;
  predictedDemand: {
    next30Days: number;
    next60Days: number;
    next90Days: number;
  };
  recommendations: {
    action: 'reorder' | 'reduce' | 'maintain' | 'increase_production';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    suggestedOrderQuantity?: number;
    reasoning: string;
    estimatedStockoutDate?: string;
  };
  insights: {
    trendAnalysis: string;
    seasonalFactors: string;
    riskAssessment: string;
    costOptimization: string;
  };
  confidence: number;
}

export interface MarketDemandAnalysis {
  overallTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  growthRate: number;
  seasonalPatterns: Array<{
    period: string;
    demandIncrease: number;
    description: string;
  }>;
  keyFactors: string[];
  recommendations: string[];
}

class AIServiceGemini {
  private async useGemini<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.warn('Gemini API failed, falling back to OpenAI:', error);
      throw error; // Let fallback handle this
    }
  }

  private async useOpenAIFallback<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('Both Gemini and OpenAI failed:', error);
      throw new Error('AI services unavailable. Please check API keys and try again.');
    }
  }

  async generateInventoryPrediction(request: InventoryInsightRequest): Promise<InventoryPrediction> {
    const prompt = `
Analyze this Filipino hair manufacturing product inventory data and provide predictive insights:

Product: ${request.productName}
Current Stock: ${request.currentStock} units
Supplier Lead Time: ${request.supplierLeadTime} days
Minimum Stock Level: ${request.minimumStockLevel} units

Sales History (last 6 months):
${request.salesHistory.map(sale => 
  `${sale.date}: ${sale.quantity} units sold to ${sale.customerCode}`
).join('\n')}

Production History:
${request.productionHistory.map(prod => 
  `${prod.date}: Produced ${prod.quantity} units (Lead time: ${prod.leadTime} days)`
).join('\n')}

${request.seasonalFactors ? `
Seasonal Factors:
${request.seasonalFactors.map(factor => 
  `Month ${factor.month}: ${factor.demandMultiplier}x demand multiplier`
).join('\n')}` : ''}

Please provide a comprehensive analysis in the following JSON format:
{
  "productName": "${request.productName}",
  "currentStock": ${request.currentStock},
  "predictedDemand": {
    "next30Days": number,
    "next60Days": number, 
    "next90Days": number
  },
  "recommendations": {
    "action": "reorder|reduce|maintain|increase_production",
    "urgency": "low|medium|high|critical",
    "suggestedOrderQuantity": number,
    "reasoning": "string",
    "estimatedStockoutDate": "YYYY-MM-DD or null"
  },
  "insights": {
    "trendAnalysis": "string",
    "seasonalFactors": "string", 
    "riskAssessment": "string",
    "costOptimization": "string"
  },
  "confidence": number (0-1)
}

Focus on Filipino hair manufacturing industry specifics, consider global beauty trends, seasonal demand patterns, and supply chain optimization for premium hair products.`;

    try {
      // Try Gemini first
      return await this.useGemini(async () => {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-pro",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                productName: { type: "string" },
                currentStock: { type: "number" },
                predictedDemand: {
                  type: "object",
                  properties: {
                    next30Days: { type: "number" },
                    next60Days: { type: "number" },
                    next90Days: { type: "number" }
                  }
                },
                recommendations: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    urgency: { type: "string" },
                    suggestedOrderQuantity: { type: "number" },
                    reasoning: { type: "string" },
                    estimatedStockoutDate: { type: "string" }
                  }
                },
                insights: {
                  type: "object",
                  properties: {
                    trendAnalysis: { type: "string" },
                    seasonalFactors: { type: "string" },
                    riskAssessment: { type: "string" },
                    costOptimization: { type: "string" }
                  }
                },
                confidence: { type: "number" }
              }
            }
          },
          contents: prompt,
        });

        const result = JSON.parse(response.text);
        return result as InventoryPrediction;
      });
    } catch (geminiError) {
      // Fallback to OpenAI
      return await this.useOpenAIFallback(async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3
        });

        const result = JSON.parse(response.choices[0].message.content!);
        return result as InventoryPrediction;
      });
    }
  }

  async analyzeMarketDemand(
    productCategories: string[], 
    historicalData: Array<{ month: string; totalSales: number; avgPrice: number }>
  ): Promise<MarketDemandAnalysis> {
    const prompt = `
Analyze the Filipino hair manufacturing market demand based on the following data:

Product Categories: ${productCategories.join(', ')}

Historical Sales Data (last 12 months):
${historicalData.map(data => 
  `${data.month}: ${data.totalSales} units sold, Average Price: $${data.avgPrice}`
).join('\n')}

Please provide a comprehensive market analysis in JSON format:
{
  "overallTrend": "increasing|decreasing|stable|volatile",
  "growthRate": number (percentage),
  "seasonalPatterns": [
    {
      "period": "string (e.g., 'Q1', 'Summer', etc.)",
      "demandIncrease": number (percentage),
      "description": "string"
    }
  ],
  "keyFactors": ["string array of market influencing factors"],
  "recommendations": ["string array of strategic recommendations"]
}

Focus on beauty industry trends, global hair fashion patterns, economic factors affecting premium hair product demand, and seasonal variations in hair styling preferences.`;

    try {
      // Try Gemini first
      return await this.useGemini(async () => {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-pro",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                overallTrend: { type: "string" },
                growthRate: { type: "number" },
                seasonalPatterns: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      period: { type: "string" },
                      demandIncrease: { type: "number" },
                      description: { type: "string" }
                    }
                  }
                },
                keyFactors: {
                  type: "array",
                  items: { type: "string" }
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          },
          contents: prompt,
        });

        return JSON.parse(response.text) as MarketDemandAnalysis;
      });
    } catch (geminiError) {
      // Fallback to OpenAI
      return await this.useOpenAIFallback(async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3
        });

        return JSON.parse(response.choices[0].message.content!) as MarketDemandAnalysis;
      });
    }
  }

  async generateProductDescription(productData: {
    name: string;
    category: string;
    specifications?: any;
    targetMarket?: string;
  }): Promise<{
    description: string;
    marketingCopy: string;
    technicalSpecs: string;
    keywords: string[];
  }> {
    const prompt = `
Create compelling product content for this Filipino hair product:

Product Name: ${productData.name}
Category: ${productData.category}
Specifications: ${JSON.stringify(productData.specifications || {})}
Target Market: ${productData.targetMarket || 'Global beauty market'}

Generate professional product content in JSON format:
{
  "description": "detailed product description highlighting quality and authenticity",
  "marketingCopy": "compelling sales copy emphasizing Filipino hair premium quality",
  "technicalSpecs": "technical specifications and care instructions",
  "keywords": ["array of SEO keywords for product discovery"]
}

Emphasize the authenticity, premium quality, and ethical sourcing of Filipino hair products. Include care instructions and styling versatility.`;

    try {
      // Try Gemini first
      return await this.useGemini(async () => {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-pro",
          config: {
            responseMimeType: "application/json",
          },
          contents: prompt,
        });

        return JSON.parse(response.text);
      });
    } catch (geminiError) {
      // Fallback to OpenAI
      return await this.useOpenAIFallback(async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7
        });

        return JSON.parse(response.choices[0].message.content!);
      });
    }
  }

  async generateMissingProductDetails(productData: {
    name: string;
    category?: string;
    hairType?: string;
    length?: number;
    texture?: string;
    color?: string;
    description?: string;
  }): Promise<{
    description: string;
    hairType: string;
    texture: string;
    color: string;
    weight: number;
    unit: string;
    lowStockThreshold: number;
    tags: string[];
    careInstructions: string[];
    suggestedPrice: number;
    marketingDescription: string;
  }> {
    const prompt = `
Generate missing product details for this Filipino hair product based on the provided information:

Product Name: ${productData.name}
Category: ${productData.category || 'Not specified'}
Hair Type: ${productData.hairType || 'Not specified'}
Length: ${productData.length ? `${productData.length} inches` : 'Not specified'}
Texture: ${productData.texture || 'Not specified'}
Color: ${productData.color || 'Not specified'}
Description: ${productData.description || 'Not specified'}

Fill in missing details with realistic, authentic specifications for Filipino hair products. Use your knowledge of hair manufacturing and beauty industry standards.

Generate comprehensive product details in JSON format:
{
  "description": "professional product description if missing",
  "hairType": "body_wave|deep_wave|straight|curly|water_wave|loose_wave",
  "texture": "silky|coarse|medium|fine",
  "color": "natural_black|dark_brown|medium_brown|light_brown|blonde",
  "weight": "typical weight in grams for this length and type",
  "unit": "grams|ounces|pieces",
  "lowStockThreshold": "recommended minimum stock level",
  "tags": ["relevant product tags for search and categorization"],
  "careInstructions": ["step-by-step care instructions"],
  "suggestedPrice": "market-appropriate price in USD",
  "marketingDescription": "compelling marketing copy highlighting Filipino hair quality"
}

Base suggestions on authentic Filipino hair characteristics: naturally strong, silky texture, excellent color retention, minimal processing needed, ethically sourced from Filipino donors.`;

    try {
      return await this.useGemini(async () => {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-pro",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                description: { type: "string" },
                hairType: { type: "string" },
                texture: { type: "string" },
                color: { type: "string" },
                weight: { type: "number" },
                unit: { type: "string" },
                lowStockThreshold: { type: "number" },
                tags: {
                  type: "array",
                  items: { type: "string" }
                },
                careInstructions: {
                  type: "array",
                  items: { type: "string" }
                },
                suggestedPrice: { type: "number" },
                marketingDescription: { type: "string" }
              }
            }
          },
          contents: prompt,
        });

        return JSON.parse(response.text);
      });
    } catch (geminiError) {
      // Fallback to OpenAI
      return await this.useOpenAIFallback(async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7
        });

        return JSON.parse(response.choices[0].message.content!);
      });
    }
  }

  async generateProductImage(productData: {
    name: string;
    category: string;
    hairType: string;
    length?: number;
    texture?: string;
    color?: string;
  }): Promise<{ imageUrl: string; altText: string }> {
    const prompt = `Create a professional product photography image of Filipino hair with these specifications:

Product: ${productData.name}
Category: ${productData.category}
Hair Type: ${productData.hairType}
Length: ${productData.length ? `${productData.length} inches` : 'Standard length'}
Texture: ${productData.texture || 'Natural texture'}
Color: ${productData.color || 'Natural black'}

Style: Professional product photography, clean white background, high-quality studio lighting, hair displayed elegantly showing texture and length, premium packaging visible if applicable. The hair should look lustrous, healthy, and authentic Filipino hair quality. Emphasize the natural shine and movement of the hair.`;

    try {
      return await this.useGemini(async () => {
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-preview-image-generation",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
          throw new Error("No image generated");
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
          throw new Error("No content in response");
        }

        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Save image to uploads directory
            const imageBuffer = Buffer.from(part.inlineData.data, "base64");
            const filename = `product-${productData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
            const imagePath = `uploads/${filename}`;
            
            // Ensure uploads directory exists
            const fs = require('fs');
            if (!fs.existsSync('uploads')) {
              fs.mkdirSync('uploads', { recursive: true });
            }
            
            fs.writeFileSync(imagePath, imageBuffer);
            
            return {
              imageUrl: `/api/uploads/${filename}`,
              altText: `Professional image of ${productData.name} - ${productData.hairType} Filipino hair, ${productData.length ? productData.length + ' inches' : 'premium length'}, ${productData.color || 'natural color'}`
            };
          }
        }

        throw new Error("No image data in response");
      });
    } catch (geminiError) {
      console.error('Gemini image generation failed:', geminiError);
      // Return placeholder for now since OpenAI image generation requires different setup
      return {
        imageUrl: `/api/placeholder-product-image?product=${encodeURIComponent(productData.name)}`,
        altText: `${productData.name} - ${productData.hairType} Filipino hair product`
      };
    }
  }
}

export const aiServiceGemini = new AIServiceGemini();