import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface Customer {
  id: string;
  name: string;
  customerCode: string;
  country: string;
  priceListId: string;
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
  productName: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export function QuotationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  
  const [formData, setFormData] = useState({
    customerId: '',
    customerCode: '',
    country: '',
    priceListId: '',
    revisionNumber: 'R0',
    paymentMethod: '',
    shippingMethod: '',
    customerServiceInstructions: '',
    validUntil: '',
    subtotal: 0,
    shippingFee: 0,
    bankCharge: 0,
    discount: 0,
    others: 0,
    total: 0,
    items: [{ 
      productId: '', 
      productName: '', 
      specification: '', 
      quantity: 0.0, 
      unitPrice: 0, 
      lineTotal: 0 
    }] as QuotationItem[]
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
        setCustomers(customersData || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData || []);
      }

      if (priceListsRes.ok) {
        const priceListsData = await priceListsRes.json();
        setPriceLists(priceListsData || []);
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
    if (formData.items.length >= 300) {
      toast({
        title: "Item Limit Reached",
        description: "Maximum of 300 items allowed per quotation",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productId: '', 
        productName: '', 
        specification: '', 
        quantity: 0.0, 
        unitPrice: 0, 
        lineTotal: 0 
      }]
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
      
      // Handle product selection and auto-fill name
      if (field === 'productId' && typeof value === 'string') {
        const product = products.find(p => p.id === value);
        if (product) {
          newItems[index].productName = product.name;
          // Basic price lookup - would be enhanced with actual VLOOKUP
          newItems[index].unitPrice = 100; // Placeholder - real VLOOKUP would use price list
        }
      }
      
      // Recalculate line total (quantity with 1 decimal place)
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = parseFloat(newItems[index].quantity.toFixed(1));
        newItems[index].quantity = quantity;
        newItems[index].lineTotal = quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData(prev => ({
        ...prev,
        customerId,
        customerCode: customer.customerCode,
        country: customer.country,
        priceListId: customer.priceListId
      }));
    }
  };

  // Calculate totals
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal + formData.shippingFee + formData.bankCharge + formData.discount + formData.others;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  }, [formData.items, formData.shippingFee, formData.bankCharge, formData.discount, formData.others]);

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
          customerCode: formData.customerCode,
          country: formData.country,
          priceListId: formData.priceListId,
          revisionNumber: formData.revisionNumber,
          paymentMethod: formData.paymentMethod,
          shippingMethod: formData.shippingMethod,
          customerServiceInstructions: formData.customerServiceInstructions,
          validUntil: formData.validUntil || undefined,
          subtotal: formData.subtotal,
          shippingFee: formData.shippingFee,
          bankCharge: formData.bankCharge,
          discount: formData.discount,
          others: formData.others,
          total: formData.total,
          items: formData.items.filter(item => item.productId)
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Quotation created successfully`
        });
        
        // Reset form
        setFormData({
          customerId: '',
          customerCode: '',
          country: '',
          priceListId: '',
          revisionNumber: 'R0',
          paymentMethod: '',
          shippingMethod: '',
          customerServiceInstructions: '',
          validUntil: '',
          subtotal: 0,
          shippingFee: 0,
          bankCharge: 0,
          discount: 0,
          others: 0,
          total: 0,
          items: [{ 
            productId: '', 
            productName: '', 
            specification: '', 
            quantity: 0.0, 
            unitPrice: 0, 
            lineTotal: 0 
          }]
        });
        setSelectedCustomer(null);
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card data-testid="quotation-form">
        <CardHeader>
          <CardTitle>Create New Quotation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Auto-generated quotation number • Date: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.customerCode}) - {customer.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Revision Number</Label>
              <Input
                value={formData.revisionNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, revisionNumber: e.target.value }))}
                data-testid="input-revision-number"
              />
            </div>
          </div>

          {/* Customer Info Display */}
          {selectedCustomer && (
            <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
              <div>
                <Label>Customer Code</Label>
                <p className="font-mono">{formData.customerCode}</p>
              </div>
              <div>
                <Label>Country</Label>
                <p>{formData.country}</p>
              </div>
              <div>
                <Label>Price List</Label>
                <p>{priceLists.find(pl => pl.id === formData.priceListId)?.name || 'Default'}</p>
              </div>
            </div>
          )}

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Order Items (Max 300)</Label>
              <Button type="button" onClick={addItem} size="sm" data-testid="button-add-item">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-6 gap-4">
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
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Specification</Label>
                    <Input
                      value={item.specification}
                      onChange={(e) => updateItem(index, 'specification', e.target.value)}
                      placeholder="Enter specification"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity * (1 decimal)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit Price * (VLOOKUP)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Line Total</Label>
                    <Input
                      type="number"
                      value={item.lineTotal.toFixed(2)}
                      readOnly
                      className="bg-gray-50 font-semibold"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Payment & Shipping */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Method of Payment</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="money transfer">Money Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Shipping Method</Label>
              <Select 
                value={formData.shippingMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, shippingMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Pick Up">Pick Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-4">Financial Summary (A+B+C+D+E)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Sub Total (A)</Label>
                <Input
                  type="number"
                  value={formData.subtotal.toFixed(2)}
                  readOnly
                  className="bg-white font-semibold"
                />
              </div>
              <div>
                <Label>Shipping Fee (B)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.shippingFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Bank Charge (C)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.bankCharge}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankCharge: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Discount (D) - Must be negative</Label>
                <Input
                  type="number"
                  step="0.01"
                  max="0"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Others (E)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.others}
                  onChange={(e) => setFormData(prev => ({ ...prev, others: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label className="font-bold">Total (A+B+C+D+E)</Label>
                <Input
                  type="number"
                  value={formData.total.toFixed(2)}
                  readOnly
                  className="bg-yellow-100 font-bold text-lg"
                />
              </div>
            </div>
          </div>

          {/* Customer Service Instructions */}
          <div className="space-y-2">
            <Label>Customer Service Instructions</Label>
            <Textarea
              value={formData.customerServiceInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, customerServiceInstructions: e.target.value }))}
              placeholder="Enter any special instructions..."
              rows={3}
            />
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button 
              onClick={submitQuotation} 
              disabled={isLoading} 
              className="flex-1"
              data-testid="button-create-quotation"
            >
              {isLoading ? 'Creating...' : 'Create Quotation'}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Save as Draft
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Duplicate Quotation
            </Button>
          </div>

          {/* Status Display */}
          <div className="text-sm text-muted-foreground text-center pt-4 border-t">
            Items: {formData.items.length}/300 | Total Amount: ${formData.total.toFixed(2)} | Creator Initials: Auto-generated
          </div>
        </CardContent>
      </Card>
    </div>
  );
}