import React from 'react';
import { QuotationForm } from '@/components/forms/QuotationForm';

export function VLOOKUPQuotationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">VLOOKUP Quotations</h1>
          <p className="text-muted-foreground">
            Create quotations with automatic price lookup from product database
          </p>
        </div>
      </div>

      <QuotationForm />
    </div>
  );
}