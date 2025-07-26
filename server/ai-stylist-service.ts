import OpenAI from "openai";
import type { CustomerPreferences, Stylist, StylistRecommendation } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface StylistMatchRequest {
  customerPreferences: CustomerPreferences;
  availableStylists: Stylist[];
  customerProfile?: {
    name?: string;
    previousOrders?: number;
    totalSpent?: string;
    location?: string;
  };
}

export interface StylistMatchResult {
  stylistId: string;
  matchScore: number;
  matchReason: string;
  strengths: string[];
  considerations: string[];
  recommendedServices: string[];
  estimatedPrice?: number;
}

export class AIStylistService {
  
  /**
   * Generate personalized stylist recommendations using AI
   */
  async generateStylistRecommendations(request: StylistMatchRequest): Promise<StylistMatchResult[]> {
    try {
      const { customerPreferences, availableStylists, customerProfile } = request;
      
      // Filter stylists by basic criteria first
      const eligibleStylists = this.filterEligibleStylists(customerPreferences, availableStylists);
      
      if (eligibleStylists.length === 0) {
        return [];
      }

      const prompt = this.buildMatchingPrompt(customerPreferences, eligibleStylists, customerProfile);
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert hair stylist consultant with deep knowledge of Filipino hair care, extensions, and styling. You understand cultural preferences, hair types common in the Philippines, and can match customers with the most suitable stylists based on their needs, preferences, and location. You provide detailed, culturally-sensitive recommendations that consider both technical expertise and personal compatibility.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      return this.parseAIResponse(aiResponse, eligibleStylists);
      
    } catch (error) {
      console.error('AI Stylist Recommendation Error:', error);
      // Fallback to rule-based matching
      return this.fallbackRuleBasedMatching(request);
    }
  }

  /**
   * Filter stylists by basic eligibility criteria
   */
  private filterEligibleStylists(preferences: CustomerPreferences, stylists: Stylist[]): Stylist[] {
    return stylists.filter(stylist => {
      // Must be active and verified
      if (!stylist.isActive || !stylist.isVerified) return false;
      
      // Location matching (if specified)
      if (preferences.preferredLocation && stylist.location) {
        const prefLocation = preferences.preferredLocation.toLowerCase();
        const stylistLocation = stylist.location.toLowerCase();
        if (!stylistLocation.includes(prefLocation) && !prefLocation.includes(stylistLocation)) {
          return false;
        }
      }
      
      // Budget range matching
      if (preferences.budgetRange && stylist.priceRange) {
        if (preferences.budgetRange !== stylist.priceRange) {
          // Allow mid-range stylists for budget customers (upsell opportunity)
          if (!(preferences.budgetRange === 'budget' && stylist.priceRange === 'mid-range')) {
            return false;
          }
        }
      }
      
      // Language compatibility
      if (preferences.preferredLanguage && stylist.languages) {
        const hasCommonLanguage = preferences.preferredLanguage.some(lang => 
          stylist.languages?.includes(lang)
        );
        if (!hasCommonLanguage) return false;
      }
      
      // Must have relevant specialties for hair goals
      if (preferences.hairGoals && stylist.specialties) {
        const relevantSpecialties = this.getRelevantSpecialties(preferences.hairGoals);
        const hasRelevantSkills = relevantSpecialties.some(specialty => 
          stylist.specialties?.includes(specialty)
        );
        if (!hasRelevantSkills) return false;
      }
      
      return true;
    });
  }

  /**
   * Build the AI matching prompt
   */
  private buildMatchingPrompt(
    preferences: CustomerPreferences, 
    stylists: Stylist[], 
    customerProfile?: any
  ): string {
    const customerInfo = customerProfile ? `
Customer Profile:
- Name: ${customerProfile.name || 'Not provided'}
- Previous Orders: ${customerProfile.previousOrders || 0}
- Total Spent: ₱${customerProfile.totalSpent || '0'}
- Location: ${customerProfile.location || 'Not specified'}
` : '';

    return `
Analyze the following customer preferences and match them with the most suitable stylists from the available options. Consider cultural context, technical expertise, communication style, and personal compatibility.

${customerInfo}

Customer Hair & Style Preferences:
- Hair Type: ${preferences.hairType || 'Not specified'}
- Current Hair Length: ${preferences.hairLength || 'Not specified'}
- Hair Goals: ${preferences.hairGoals?.join(', ') || 'Not specified'}
- Preferred Styles: ${preferences.preferredStyle?.join(', ') || 'Not specified'}
- Budget Range: ${preferences.budgetRange || 'Not specified'}
- Preferred Location: ${preferences.preferredLocation || 'Not specified'}
- Languages: ${preferences.preferredLanguage?.join(', ') || 'English, Filipino'}
- Session Type: ${preferences.sessionType || 'Not specified'}
- Urgency: ${preferences.urgency || 'Flexible'}
- Experience Level: ${preferences.previousExperience || 'Not specified'}
- Special Needs: ${preferences.specialNeeds?.join(', ') || 'None'}
- Communication Style: ${preferences.communicationStyle || 'Not specified'}

Available Stylists:
${stylists.map((stylist, index) => `
${index + 1}. ${stylist.name}
   - ID: ${stylist.id}
   - Location: ${stylist.location || 'Not specified'}
   - Experience: ${stylist.experience} years
   - Specialties: ${stylist.specialties?.join(', ') || 'Not listed'}
   - Languages: ${stylist.languages?.join(', ') || 'Not listed'}
   - Price Range: ${stylist.priceRange || 'Not specified'}
   - Rating: ${stylist.rating}/5 (${stylist.totalReviews} reviews)
   - Bio: ${stylist.bio || 'No bio available'}
`).join('\n')}

Please provide your analysis in the following JSON format:
{
  "recommendations": [
    {
      "stylistId": "stylist-id",
      "matchScore": 85,
      "matchReason": "Detailed explanation of why this stylist is a great match, considering cultural context and technical expertise",
      "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
      "considerations": ["Any potential concerns or things to consider"],
      "recommendedServices": ["Service 1", "Service 2"],
      "estimatedPrice": 3500
    }
  ]
}

Rank the top 3-5 stylists by compatibility. Consider:
1. Technical expertise alignment with customer goals
2. Cultural and communication compatibility
3. Location and convenience factors
4. Budget and value proposition
5. Experience level appropriate for customer's needs
6. Language and communication preferences
7. Stylist's reputation and reviews

Provide specific, actionable insights in your reasoning. Focus on why each match would work well for this specific customer's needs and preferences.
`;
  }

  /**
   * Parse AI response into structured recommendations
   */
  private parseAIResponse(aiResponse: any, eligibleStylists: Stylist[]): StylistMatchResult[] {
    try {
      const recommendations = aiResponse.recommendations || [];
      
      return recommendations.map((rec: any) => ({
        stylistId: rec.stylistId,
        matchScore: Math.min(100, Math.max(0, rec.matchScore || 50)),
        matchReason: rec.matchReason || 'AI-generated match based on compatibility analysis',
        strengths: Array.isArray(rec.strengths) ? rec.strengths : [],
        considerations: Array.isArray(rec.considerations) ? rec.considerations : [],
        recommendedServices: Array.isArray(rec.recommendedServices) ? rec.recommendedServices : [],
        estimatedPrice: rec.estimatedPrice || undefined
      })).filter((rec: StylistMatchResult) => 
        eligibleStylists.some(stylist => stylist.id === rec.stylistId)
      );
      
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [];
    }
  }

  /**
   * Fallback rule-based matching when AI fails
   */
  private fallbackRuleBasedMatching(request: StylistMatchRequest): StylistMatchResult[] {
    const { customerPreferences, availableStylists } = request;
    const eligibleStylists = this.filterEligibleStylists(customerPreferences, availableStylists);
    
    return eligibleStylists.slice(0, 3).map((stylist, index) => {
      const matchScore = this.calculateRuleBasedScore(customerPreferences, stylist);
      
      return {
        stylistId: stylist.id,
        matchScore,
        matchReason: `Rule-based match considering location, specialties, and preferences. ${stylist.name} has ${stylist.experience} years of experience and specializes in ${stylist.specialties?.join(', ')}.`,
        strengths: this.generateRuleBasedStrengths(customerPreferences, stylist),
        considerations: ['Please verify availability for your preferred time'],
        recommendedServices: this.suggestServices(customerPreferences),
        estimatedPrice: this.estimatePrice(customerPreferences, stylist)
      };
    });
  }

  /**
   * Calculate compatibility score using rules
   */
  private calculateRuleBasedScore(preferences: CustomerPreferences, stylist: Stylist): number {
    let score = 50; // Base score
    
    // Experience bonus
    if (stylist.experience && stylist.experience > 5) score += 15;
    else if (stylist.experience && stylist.experience > 2) score += 10;
    
    // Rating bonus
    if (stylist.rating && parseFloat(stylist.rating) >= 4.5) score += 15;
    else if (stylist.rating && parseFloat(stylist.rating) >= 4.0) score += 10;
    
    // Location match
    if (preferences.preferredLocation && stylist.location) {
      if (stylist.location.toLowerCase().includes(preferences.preferredLocation.toLowerCase())) {
        score += 10;
      }
    }
    
    // Budget compatibility
    if (preferences.budgetRange === stylist.priceRange) score += 10;
    
    // Specialty alignment
    if (preferences.hairGoals && stylist.specialties) {
      const relevantSpecialties = this.getRelevantSpecialties(preferences.hairGoals);
      const matches = relevantSpecialties.filter(spec => stylist.specialties?.includes(spec));
      score += matches.length * 5;
    }
    
    return Math.min(100, score);
  }

  /**
   * Generate rule-based strengths
   */
  private generateRuleBasedStrengths(preferences: CustomerPreferences, stylist: Stylist): string[] {
    const strengths: string[] = [];
    
    if (stylist.experience && stylist.experience > 5) {
      strengths.push(`${stylist.experience} years of professional experience`);
    }
    
    if (stylist.rating && parseFloat(stylist.rating) >= 4.5) {
      strengths.push(`Excellent rating of ${stylist.rating}/5 from ${stylist.totalReviews} reviews`);
    }
    
    if (preferences.preferredLocation && stylist.location?.toLowerCase().includes(preferences.preferredLocation.toLowerCase())) {
      strengths.push(`Conveniently located in ${stylist.location}`);
    }
    
    if (stylist.specialties && stylist.specialties.includes('hair-extensions')) {
      strengths.push('Specializes in hair extensions');
    }
    
    if (stylist.isVerified) {
      strengths.push('Verified professional stylist');
    }
    
    return strengths;
  }

  /**
   * Map hair goals to relevant specialties
   */
  private getRelevantSpecialties(hairGoals: string[]): string[] {
    const specialtyMap: Record<string, string[]> = {
      'length': ['hair-extensions', 'styling'],
      'volume': ['hair-extensions', 'styling'],
      'color-change': ['coloring', 'highlighting'],
      'maintenance': ['cutting', 'styling', 'hair-extensions'],
      'styling': ['styling', 'braiding', 'updos'],
      'repair': ['treatments', 'deep-conditioning'],
      'texture': ['perming', 'straightening', 'treatments']
    };
    
    const relevantSpecialties = new Set<string>();
    hairGoals.forEach(goal => {
      const specialties = specialtyMap[goal] || ['styling'];
      specialties.forEach(spec => relevantSpecialties.add(spec));
    });
    
    return Array.from(relevantSpecialties);
  }

  /**
   * Suggest services based on preferences
   */
  private suggestServices(preferences: CustomerPreferences): string[] {
    const services: string[] = [];
    
    if (preferences.sessionType === 'consultation') {
      services.push('Hair consultation');
    }
    
    if (preferences.hairGoals?.includes('length') || preferences.hairGoals?.includes('volume')) {
      services.push('Hair extension consultation', 'Hair extension installation');
    }
    
    if (preferences.hairGoals?.includes('color-change')) {
      services.push('Color consultation', 'Hair coloring');
    }
    
    if (preferences.sessionType === 'styling') {
      services.push('Hair styling', 'Special event styling');
    }
    
    if (services.length === 0) {
      services.push('Hair consultation', 'Basic styling');
    }
    
    return services;
  }

  /**
   * Estimate service price based on preferences and stylist
   */
  private estimatePrice(preferences: CustomerPreferences, stylist: Stylist): number {
    let basePrice = 1500; // Base consultation price
    
    // Adjust for stylist price range
    if (stylist.priceRange === 'premium') basePrice *= 2;
    else if (stylist.priceRange === 'mid-range') basePrice *= 1.5;
    
    // Adjust for service complexity
    if (preferences.hairGoals?.includes('length') || preferences.hairGoals?.includes('volume')) {
      basePrice += 2000; // Extension installation
    }
    
    if (preferences.hairGoals?.includes('color-change')) {
      basePrice += 1500; // Color service
    }
    
    if (preferences.sessionType === 'installation') {
      basePrice += 1000; // Installation complexity
    }
    
    return Math.round(basePrice);
  }
}

export const aiStylistService = new AIStylistService();