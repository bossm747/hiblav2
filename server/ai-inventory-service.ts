import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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

class AIInventoryService {
  async generateInventoryPrediction(request: InventoryInsightRequest): Promise<InventoryPrediction> {
    try {
      const prompt = `
Analyze this Filipino hair manufacturing product inventory data and provide predictive insights:

Product: ${request.productName}
Current Stock: ${request.currentStock} units
Supplier Lead Time: ${request.supplierLeadTime} days
Minimum Stock Level: ${request.minimumStockLevel} units

Sales History (last 6 months):
${request.salesHistory.map(sale => 
  `Date: ${sale.date}, Quantity: ${sale.quantity}, Customer: ${sale.customerCode}`
).join('\n')}

Production History:
${request.productionHistory.map(prod => 
  `Date: ${prod.date}, Quantity: ${prod.quantity}, Lead Time: ${prod.leadTime} days`
).join('\n')}

${request.seasonalFactors ? `Seasonal Factors:
${request.seasonalFactors.map(factor => 
  `Month ${factor.month}: ${factor.demandMultiplier}x demand multiplier`
).join('\n')}` : ''}

Please provide comprehensive inventory predictions and recommendations in JSON format:
{
  "productName": "string",
  "currentStock": number,
  "predictedDemand": {
    "next30Days": number,
    "next60Days": number,
    "next90Days": number
  },
  "recommendations": {
    "action": "reorder|reduce|maintain|increase_production",
    "urgency": "low|medium|high|critical", 
    "suggestedOrderQuantity": number,
    "reasoning": "detailed explanation",
    "estimatedStockoutDate": "YYYY-MM-DD or null"
  },
  "insights": {
    "trendAnalysis": "analysis of sales trends",
    "seasonalFactors": "seasonal demand patterns",
    "riskAssessment": "potential risks and mitigation",
    "costOptimization": "cost optimization recommendations"
  },
  "confidence": number (0.0-1.0)
}

Consider:
- Filipino hair market seasonal demand (higher during holiday seasons)
- Production lead times for natural hair processing
- International shipping considerations
- Quality requirements affecting production capacity
- Customer loyalty patterns for premium hair products
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert inventory management analyst specializing in Filipino hair manufacturing and international distribution. Provide accurate, data-driven predictions with practical recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result as InventoryPrediction;

    } catch (error) {
      console.error("AI Inventory Prediction Error:", error);
      throw new Error(`Failed to generate inventory prediction: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async analyzeMarketDemand(productData: {
    products: Array<{
      name: string;
      salesHistory: Array<{ date: string; quantity: number; }>;
      category: string;
    }>;
    timeframe: string;
  }): Promise<MarketDemandAnalysis> {
    try {
      const prompt = `
Analyze the Filipino hair market demand patterns based on this sales data:

Timeframe: ${productData.timeframe}

Product Sales Data:
${productData.products.map(product => `
Product: ${product.name} (${product.category})
Sales History: ${product.salesHistory.map(sale => 
  `${sale.date}: ${sale.quantity} units`
).join(', ')}
`).join('\n')}

Provide market demand analysis in JSON format:
{
  "overallTrend": "increasing|decreasing|stable|volatile",
  "growthRate": number (percentage),
  "seasonalPatterns": [
    {
      "period": "season/month description",
      "demandIncrease": number (percentage),
      "description": "explanation"
    }
  ],
  "keyFactors": ["factor1", "factor2", "factor3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Consider:
- Filipino hair industry market trends
- International beauty market demands
- Seasonal fluctuations (holidays, wedding seasons)
- Economic factors affecting luxury hair product purchases
- Competition from synthetic alternatives
- Export market growth patterns
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are a market research expert specializing in the Filipino hair and beauty industry with deep knowledge of international trade patterns and consumer behavior."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result as MarketDemandAnalysis;

    } catch (error) {
      console.error("AI Market Demand Analysis Error:", error);
      throw new Error(`Failed to analyze market demand: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async generateOptimalRestockPlan(inventoryData: {
    products: Array<{
      name: string;
      currentStock: number;
      minimumLevel: number;
      maxCapacity: number;
      unitCost: number;
      storageRate: number;
      supplierLeadTime: number;
    }>;
    budget: number;
    warehouseCapacity: number;
  }): Promise<{
    restockPlan: Array<{
      productName: string;
      suggestedQuantity: number;
      priority: number;
      estimatedCost: number;
      reasoning: string;
    }>;
    totalCost: number;
    recommendations: string[];
    riskAssessment: string;
  }> {
    try {
      const prompt = `
Create an optimal restock plan for this Filipino hair manufacturing inventory:

Available Budget: $${inventoryData.budget}
Warehouse Capacity: ${inventoryData.warehouseCapacity} units

Products:
${inventoryData.products.map(product => `
- ${product.name}:
  Current Stock: ${product.currentStock}
  Minimum Level: ${product.minimumLevel}
  Max Capacity: ${product.maxCapacity}
  Unit Cost: $${product.unitCost}
  Storage Rate: $${product.storageRate}/unit/month
  Supplier Lead Time: ${product.supplierLeadTime} days
`).join('\n')}

Generate an optimal restock plan in JSON format:
{
  "restockPlan": [
    {
      "productName": "string",
      "suggestedQuantity": number,
      "priority": number (1-10),
      "estimatedCost": number,
      "reasoning": "explanation"
    }
  ],
  "totalCost": number,
  "recommendations": ["recommendation1", "recommendation2"],
  "riskAssessment": "overall risk analysis"
}

Optimize for:
- Cash flow management
- Minimizing stockout risk
- Storage cost efficiency
- Production continuity
- Quality preservation (hair products have specific storage requirements)
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an inventory optimization specialist with expertise in hair product manufacturing, storage requirements, and supply chain management."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1800
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;

    } catch (error) {
      console.error("AI Restock Plan Error:", error);
      throw new Error(`Failed to generate restock plan: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Test connection" }],
        max_tokens: 10
      });
      return response.choices.length > 0;
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    }
  }
}

export const aiInventoryService = new AIInventoryService();