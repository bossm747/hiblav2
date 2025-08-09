import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export function VLOOKUPQuotationTest() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customerCode: 'TEST_CLIENT',
    country: 'Philippines',
    priceListId: 'A',
    paymentMethod: 'bank',
    shippingMethod: 'DHL',
    productId: '1',
    quantity: '2',
    unitPrice: '50.00'
  });

  // Fetch products for dropdown
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      return response.json();
    }
  });

  // VLOOKUP price lookup
  const { data: priceData, refetch: fetchPrice } = useQuery({
    queryKey: ['/api/products/price-lookup', formData.productId, formData.priceListId],
    queryFn: async () => {
      const response = await fetch(`/api/products/price-lookup?productId=${formData.productId}&priceListId=${formData.priceListId}`);
      if (!response.ok) throw new Error('Price lookup failed');
      return response.json();
    },
    enabled: false
  });

  // Create quotation mutation
  const createQuotationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create quotation');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Quotation created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handlePriceLookup = () => {
    fetchPrice();
  };

  const handleCreateQuotation = () => {
    const total = (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2);
    
    const quotationData = {
      quotation: {
        customerCode: formData.customerCode,
        country: formData.country,
        priceListId: formData.priceListId,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        subtotal: total,
        total: total
      },
      items: [{
        productId: formData.productId,
        productName: products?.find(p => p.id === formData.productId)?.name || 'Unknown Product',
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        lineTotal: total
      }]
    };

    createQuotationMutation.mutate(quotationData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VLOOKUP Quotation Testing Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerCode">Customer Code</Label>
              <Input
                id="customerCode"
                value={formData.customerCode}
                onChange={(e) => setFormData({...formData, customerCode: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>
          </div>

          {/* Price List Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price List</Label>
              <Select value={formData.priceListId} onValueChange={(value) => setFormData({...formData, priceListId: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Price List A</SelectItem>
                  <SelectItem value="B">Price List B</SelectItem>
                  <SelectItem value="C">Price List C</SelectItem>
                  <SelectItem value="D">Price List D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="money_transfer">Money Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product</Label>
              <Select value={formData.productId} onValueChange={(value) => setFormData({...formData, productId: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product: any) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (SKU: {product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Shipping Method</Label>
              <Select value={formData.shippingMethod} onValueChange={(value) => setFormData({...formData, shippingMethod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="FedEx">Fed Ex</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Pick Up">Pick Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price ($)</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
              />
            </div>
            <div>
              <Label>Total</Label>
              <Input
                readOnly
                value={`$${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}`}
              />
            </div>
          </div>

          {/* VLOOKUP Price Result */}
          {priceData && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-medium text-green-800 mb-2">VLOOKUP Price Result:</h4>
              <p><strong>Product:</strong> {priceData.productName}</p>
              <p><strong>Price List {priceData.priceList}:</strong> ${priceData.price}</p>
              <p><strong>Unit:</strong> {priceData.unit}</p>
              <p><strong>SKU:</strong> {priceData.sku}</p>
              <Button 
                className="mt-2" 
                size="sm" 
                onClick={() => setFormData({...formData, unitPrice: priceData.price})}
              >
                Use This Price
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handlePriceLookup} variant="outline">
              VLOOKUP Price
            </Button>
            <Button 
              onClick={handleCreateQuotation} 
              disabled={createQuotationMutation.isPending}
            >
              {createQuotationMutation.isPending ? 'Creating...' : 'Create Quotation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}