import { storage } from "./storage";

export interface PricingResult {
  productId: string;
  productName: string;
  priceList: string;
  priceListName: string;
  basePrice: string;
  priceMultiplier: string;
  price: string;
  currency: string;
}

export class TieredPricingService {
  /**
   * Calculate price for a product using tiered pricing system
   */
  async calculatePrice(params: {
    productId: string;
    customerCode?: string;
    priceListId?: string;
  }): Promise<PricingResult> {
    const { productId, customerCode, priceListId } = params;

    // Get product
    const product = await storage.getProduct(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Default to base price if no basePrice is set
    let basePrice = parseFloat(product.basePrice || (product as any).priceListB || "0.00");
    let price = basePrice;
    let priceListName = "Regular Customer";
    let priceMultiplier = 1.0;
    let finalPriceListId = "REGULAR";

    // Determine pricing based on parameters
    if (customerCode) {
      // Get customer's price category
      const customer = await storage.getCustomerByCode(customerCode);
      if (customer && customer.priceListId) {
        const priceList = await storage.getPriceList(customer.priceListId);
        if (priceList) {
          priceMultiplier = parseFloat(priceList.priceMultiplier || "1.0000");
          price = basePrice * priceMultiplier;
          priceListName = priceList.name;
          finalPriceListId = priceList.code || "REGULAR";
        }
      }
    } else if (priceListId) {
      // Legacy support for A, B, C, D or new price list codes
      if (priceListId === 'A' || priceListId === 'B' || priceListId === 'C' || priceListId === 'D') {
        // Legacy VLOOKUP support
        switch (priceListId) {
          case 'A':
            price = parseFloat((product as any).priceListA || "0.00");
            priceListName = "Price List A (Legacy)";
            finalPriceListId = 'A';
            break;
          case 'B':
            price = parseFloat((product as any).priceListB || "0.00");
            priceListName = "Price List B (Legacy)";
            finalPriceListId = 'B';
            break;
          case 'C':
            price = parseFloat((product as any).priceListC || "0.00");
            priceListName = "Price List C (Legacy)";
            finalPriceListId = 'C';
            break;
          case 'D':
            price = parseFloat((product as any).priceListD || "0.00");
            priceListName = "Price List D (Legacy)";
            finalPriceListId = 'D';
            break;
        }
        // For legacy pricing, calculate multiplier from base price
        priceMultiplier = basePrice > 0 ? price / basePrice : 1.0;
      } else {
        // New tiered pricing by code (NEW, REGULAR, PREMIER, CUSTOM)
        const priceList = await storage.getPriceListByCode(priceListId);
        if (priceList) {
          priceMultiplier = parseFloat(priceList.priceMultiplier || "1.0000");
          price = basePrice * priceMultiplier;
          priceListName = priceList.name;
          finalPriceListId = priceList.code || "REGULAR";
        } else {
          // Fallback to REGULAR if price list not found
          console.warn(`Price list '${priceListId}' not found, using REGULAR pricing`);
          const regularPriceList = await storage.getPriceListByCode("REGULAR");
          if (regularPriceList) {
            priceMultiplier = parseFloat(regularPriceList.priceMultiplier || "1.0000");
            price = basePrice * priceMultiplier;
            priceListName = regularPriceList.name;
            finalPriceListId = "REGULAR";
          } else {
            // Ultimate fallback
            priceMultiplier = 1.0;
            price = basePrice;
            priceListName = "Base Price";
            finalPriceListId = "BASE";
          }
        }
      }
    }

    return {
      productId: product.id,
      productName: product.name,
      priceList: finalPriceListId,
      priceListName: priceListName,
      basePrice: basePrice.toFixed(2),
      priceMultiplier: priceMultiplier.toFixed(4),
      price: price.toFixed(2),
      currency: "USD"
    };
  }

  /**
   * Get pricing for a customer's price category
   */
  async getCustomerPricing(customerCode: string): Promise<{ priceCategory: string; priceListName: string; multiplier: number } | null> {
    try {
      const customer = await storage.getCustomerByCode(customerCode);
      if (!customer || !customer.priceListId) {
        return null;
      }

      const priceList = await storage.getPriceList(customer.priceListId);
      if (!priceList) {
        return null;
      }

      return {
        priceCategory: customer.priceCategory || "REGULAR",
        priceListName: priceList.name,
        multiplier: parseFloat(priceList.priceMultiplier || "1.0000")
      };
    } catch (error) {
      console.error('Error getting customer pricing:', error);
      return null;
    }
  }

  /**
   * Get all available price tiers
   */
  async getPriceTiers(): Promise<Array<{ code: string; name: string; multiplier: number; description: string }>> {
    try {
      const priceLists = await storage.getPriceLists();
      return priceLists.map(pl => ({
        code: pl.code || "REGULAR",
        name: pl.name,
        multiplier: parseFloat(pl.priceMultiplier || "1.0000"),
        description: pl.description || ""
      }));
    } catch (error) {
      console.error('Error getting price tiers:', error);
      return [];
    }
  }
}

export const tieredPricingService = new TieredPricingService();