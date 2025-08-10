import { db } from "./db";
import { quotations } from "@shared/schema";
import { eq } from "drizzle-orm";

export class QuotationLockService {
  /**
   * Check if a quotation can be revised
   * Business rule: Quotation cannot be revised on the next day
   */
  canReviseQuotation(quotation: any): boolean {
    if (!quotation.createdAt) {
      return true; // Allow revision if no creation date
    }

    const createdDate = new Date(quotation.createdAt);
    const today = new Date();
    
    // Set hours to 0 for date comparison
    createdDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // Check if quotation was created today
    return createdDate.getTime() === today.getTime();
  }

  /**
   * Validate quotation revision attempt
   */
  async validateRevision(quotationId: string): Promise<{ canRevise: boolean; message?: string }> {
    try {
      const [quotation] = await db
        .select()
        .from(quotations)
        .where(eq(quotations.id, quotationId));

      if (!quotation) {
        return { canRevise: false, message: "Quotation not found" };
      }

      if (quotation.status === "approved") {
        return { canRevise: false, message: "Cannot revise approved quotation" };
      }

      if (quotation.status === "converted") {
        return { canRevise: false, message: "Cannot revise quotation that has been converted to sales order" };
      }

      if (!this.canReviseQuotation(quotation)) {
        return { 
          canRevise: false, 
          message: "Quotation cannot be revised after the creation date. Please create a duplicate instead." 
        };
      }

      return { canRevise: true };
    } catch (error) {
      console.error("Error validating quotation revision:", error);
      return { canRevise: false, message: "Error validating revision" };
    }
  }

  /**
   * Duplicate a quotation (for when revision is not allowed)
   */
  async duplicateQuotation(quotationId: string, createdBy: string) {
    try {
      const [originalQuotation] = await db
        .select()
        .from(quotations)
        .where(eq(quotations.id, quotationId));

      if (!originalQuotation) {
        throw new Error("Original quotation not found");
      }

      // Generate new quotation number
      const now = new Date();
      const yearMonth = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Get the latest quotation for the month
      const latestQuotations = await db
        .select()
        .from(quotations)
        .where(eq(quotations.quotationNumber.substring(0, 7), yearMonth))
        .orderBy(quotations.quotationNumber);

      const nextSequence = latestQuotations.length > 0
        ? parseInt(latestQuotations[latestQuotations.length - 1].quotationNumber.split('.')[2]) + 1
        : 1;

      const newQuotationNumber = `${yearMonth}.${nextSequence.toString().padStart(3, '0')}`;

      // Create duplicate with new number and reset status
      const duplicatedQuotation = {
        ...originalQuotation,
        id: undefined, // Let database generate new ID
        quotationNumber: newQuotationNumber,
        revisionNumber: "R1",
        status: "pending",
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Remove undefined id field
      delete duplicatedQuotation.id;

      const [newQuotation] = await db
        .insert(quotations)
        .values(duplicatedQuotation)
        .returning();

      return newQuotation;
    } catch (error) {
      console.error("Error duplicating quotation:", error);
      throw error;
    }
  }

  /**
   * Get quotations that can still be revised (created today)
   */
  async getRevisableQuotations() {
    const allQuotations = await db.select().from(quotations);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allQuotations.filter(quotation => {
      if (quotation.status === "approved" || quotation.status === "converted") {
        return false;
      }
      
      const createdDate = new Date(quotation.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      
      return createdDate.getTime() === today.getTime();
    });
  }
}

export const quotationLockService = new QuotationLockService();