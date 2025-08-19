import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  country: string;
  priceList: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
}

interface PriceList {
  id: string;
  name: string;
  type: string;
}

interface QuotationItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function QuotationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  
  const [formData, setFormData] = useState({
    customerId: '',
    validUntil: '',
    notes: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0, total: 0 }] as QuotationItem[]
  });

  // Load data on component mount
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load all data in parallel
      const [customersRes, productsRes, priceListsRes] = await Promise.all([
        fetch('/api/customers', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/price-lists', { headers })
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.customers || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }

      if (priceListsRes.ok) {
        const priceListsData = await priceListsRes.json();
        setPriceLists(priceListsData.priceLists || []);
      }

    } catch (error) {
      console.error('Error loading form data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive"
      });
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Recalculate total
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const submitQuotation = async () => {
    if (!formData.customerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive"
      });
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].productId) {
      toast({
        title: "Error", 
        description: "Please add at least one item",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: formData.customerId,
          validUntil: formData.validUntil || undefined,
          notes: formData.notes || undefined,
          items: formData.items.filter(item => item.productId)
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Quotation ${result.quotation.number} created successfully`
        });
        
        // Reset form
        setFormData({
          customerId: '',
          validUntil: '',
          notes: '',
          items: [{ productId: '', quantity: 1, unitPrice: 0, total: 0 }]
        });
      } else {
        throw new Error('Failed to create quotation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quotation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto" data-testid="quotation-form">
      <CardHeader>
        <CardTitle>Create New Quotation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Selection */}
        <div className="space-y-2">
          <Label htmlFor="customer">Customer *</Label>
          <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
            <SelectTrigger data-testid="select-customer">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id} data-testid={`customer-${customer.id}`}>
                  {customer.name} ({customer.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valid Until */}
        <div className="space-y-2">
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
            data-testid="input-valid-until"
          />
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Quotation Items</Label>
            <Button type="button" onClick={addItem} size="sm" data-testid="button-add-item">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {formData.items.map((item, index) => (
            <Card key={index} className="p-4" data-testid={`quotation-item-${index}`}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Select 
                    value={item.productId} 
                    onValueChange={(value) => updateItem(index, 'productId', value)}
                  >
                    <SelectTrigger data-testid={`select-product-${index}`}>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} data-testid={`product-${product.id}-${index}`}>
                          {product.name} ({product.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    data-testid={`input-quantity-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    data-testid={`input-unit-price-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total ($)</Label>
                  <Input
                    value={item.total.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                    data-testid={`text-total-${index}`}
                  />
                </div>

                <div>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      data-testid={`button-remove-item-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            placeholder="Additional notes for the quotation"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            data-testid="textarea-notes"
          />
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Grand Total:</span>
            <span data-testid="text-grand-total">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={submitQuotation}
            disabled={isLoading}
            data-testid="button-submit-quotation"
          >
            {isLoading ? 'Creating...' : 'Create Quotation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}