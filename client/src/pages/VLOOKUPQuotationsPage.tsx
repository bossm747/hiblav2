import React from 'react';
import { VLOOKUPQuotationTest } from '@/components/VLOOKUPQuotationTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Quotation Builder with VLOOKUP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VLOOKUPQuotationTest />
        </CardContent>
      </Card>
    </div>
  );
}