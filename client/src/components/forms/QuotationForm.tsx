import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Search, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

interface QuotationFormProps {
  duplicateData?: any;
}

export function QuotationForm({ duplicateData }: QuotationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  
  // Product search states
  const [productSearchTerms, setProductSearchTerms] = useState<string[]>([]);
  const [productOpenStates, setProductOpenStates] = useState<boolean[]>([]);
  
  // Customer search states
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  
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

  // Load data on component mount and when duplicate data changes
  useEffect(() => {
    loadFormData();
  }, []);

  // Populate form with duplicate data
  useEffect(() => {
    if (duplicateData) {
      setFormData({
        customerId: duplicateData.customerId || '',
        customerCode: duplicateData.customerCode || '',
        country: duplicateData.country || '',
        priceListId: duplicateData.priceListId || '',
        revisionNumber: duplicateData.revisionNumber || 'R0',
        paymentMethod: duplicateData.paymentMethod || '',
        shippingMethod: duplicateData.shippingMethod || '',
        customerServiceInstructions: duplicateData.customerServiceInstructions || '',
        validUntil: duplicateData.validUntil || '',
        subtotal: duplicateData.subtotal || 0,
        shippingFee: duplicateData.shippingFee || 0,
        bankCharge: duplicateData.bankCharge || 0,
        discount: duplicateData.discount || 0,
        others: duplicateData.others || 0,
        total: duplicateData.total || 0,
        items: duplicateData.items || [{ 
          productId: '', 
          productName: '', 
          specification: '', 
          quantity: 0.0, 
          unitPrice: 0, 
          lineTotal: 0 
        }]
      });
      
      // Set selected customer if available
      if (duplicateData.customerId) {
        const customer = customers.find(c => c.id === duplicateData.customerId);
        if (customer) {
          setSelectedCustomer(customer);
        }
      }
    }
  }, [duplicateData, customers]);

  const loadFormData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('🔄 Loading quotation form data...');

      // Load all data in parallel
      const [customersRes, productsRes, priceListsRes] = await Promise.all([
        fetch('/api/customers', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/price-lists', { headers })
      ]);

      console.log('📊 API Response Status:', {
        customers: customersRes.status,
        products: productsRes.status,
        priceLists: priceListsRes.status
      });

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        console.log('✅ Customers loaded:', customersData?.length || 0);
        setCustomers(customersData || []);
      } else {
        console.error('❌ Failed to load customers:', customersRes.statusText);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        console.log('✅ Products loaded:', productsData?.length || 0);
        setProducts(productsData || []);
      } else {
        console.error('❌ Failed to load products:', productsRes.statusText);
      }

      if (priceListsRes.ok) {
        const priceListsData = await priceListsRes.json();
        console.log('✅ Price lists loaded:', priceListsData?.length || 0);
        setPriceLists(priceListsData || []);
      } else {
        console.error('❌ Failed to load price lists:', priceListsRes.statusText);
      }

    } catch (error) {
      console.error('Error loading form data:', error);
      toast({
        title: "Error",
        description: "Failed to load dropdown data. Please check your connection.",
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

    // Initialize search states for the new item
    setProductSearchTerms(prev => [...prev, '']);
    setProductOpenStates(prev => [...prev, false]);
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));

    // Remove corresponding search states
    setProductSearchTerms(prev => prev.filter((_, i) => i !== index));
    setProductOpenStates(prev => prev.filter((_, i) => i !== index));
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
          subtotal: String(formData.subtotal),
          shippingFee: String(formData.shippingFee),
          bankCharge: String(formData.bankCharge),
          discount: String(formData.discount),
          others: String(formData.others),
          total: String(formData.total),
          items: formData.items.filter(item => item.productId)
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Quotation created successfully`
        });
        
        // Reset form and refresh quotations list
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
        
        // Trigger parent component to refresh quotations list
        window.dispatchEvent(new CustomEvent('quotationCreated'));
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Canva-Style Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center text-white">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Create New Quotation</h1>
          <p className="text-xl text-indigo-100 opacity-90 font-medium">Generate professional quotations with confidence</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
            <div className="px-3 py-1 bg-white/20 rounded-full">Auto-generated number</div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="px-3 py-1 bg-white/20 rounded-full">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
      </div>

      {/* Main Form Container with Canva-Style Design */}
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardContent className="space-y-10 p-10">
          {/* Essential Information Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-800">Essential Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Price Tier *
                </Label>
                <Select value={formData.priceListId} onValueChange={(value) => setFormData(prev => ({ ...prev, priceListId: value }))}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-200 rounded-xl hover:border-purple-400 transition-all duration-200 shadow-sm">
                    <SelectValue placeholder="Choose price tier to unlock pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceLists.map((priceList) => (
                      <SelectItem key={priceList.id} value={priceList.id}>
                        {priceList.name} - {priceList.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Customer *
              </Label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="h-14 w-full justify-between text-lg border-2 border-gray-200 rounded-xl hover:border-purple-400 transition-all duration-200 shadow-sm"
                    data-testid="select-customer"
                  >
                    {selectedCustomer ? (
                      <span className="truncate">{selectedCustomer.name} ({selectedCustomer.customerCode})</span>
                    ) : (
                      <span className="text-muted-foreground">
                        {customers.length > 0 ? "Search customers..." : "Loading customers..."}
                      </span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search customers..." 
                      value={customerSearchTerm}
                      onValueChange={setCustomerSearchTerm}
                      className="h-12 text-base md:text-sm"
                    />
                    <CommandEmpty>
                      <div className="p-4 text-center space-y-3">
                        <p className="text-sm text-muted-foreground">No customers found.</p>
                        <Button
                          variant="outline"
                          className="w-full h-10"
                          onClick={() => {
                            // Navigate to create customer page
                            window.location.href = '/customers/create';
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create New Customer
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {customers
                        .filter(customer => 
                          customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                          customer.customerCode.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                          customer.country.toLowerCase().includes(customerSearchTerm.toLowerCase())
                        )
                        .slice(0, 20)
                        .map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={() => {
                              handleCustomerChange(customer.id);
                              setCustomerOpen(false);
                            }}
                            className="cursor-pointer py-3"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{customer.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {customer.customerCode} • {customer.country}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    {customers.filter(customer => 
                      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                      customer.customerCode.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                      customer.country.toLowerCase().includes(customerSearchTerm.toLowerCase())
                    ).length > 20 && (
                      <div className="p-2 text-center text-sm text-muted-foreground border-t">
                        Showing first 20 results. Refine search for more.
                      </div>
                    )}
                    {customers.length > 0 && (
                      <div className="border-t p-2">
                        <Button
                          variant="ghost"
                          className="w-full h-10 justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          onClick={() => {
                            window.location.href = '/customers/create';
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create New Customer
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700">Revision Number</Label>
              <Input
                value={formData.revisionNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, revisionNumber: e.target.value }))}
                data-testid="input-revision-number"
                className="h-14 text-lg border-2 border-gray-200 rounded-xl hover:border-purple-400 transition-all duration-200 shadow-sm"
              />
            </div>
            </div>
          </div>

          {/* Customer Info Display */}
          {selectedCustomer && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                Customer Selected
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Customer Code</Label>
                  <p className="font-mono text-xl mt-2 text-gray-800">{formData.customerCode}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Country</Label>
                  <p className="text-xl mt-2 text-gray-800">{formData.country}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Price List</Label>
                  <p className="text-xl mt-2 font-bold text-purple-700">
                    {priceLists.find(pl => pl.id === formData.priceListId)?.name || 'Default'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Items Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-4"></div>
                <h3 className="text-2xl font-bold text-gray-800">Order Items</h3>
                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Max 300 items
                </span>
              </div>
              <Button 
                type="button" 
                onClick={addItem} 
                size="sm" 
                data-testid="button-add-item"
                className="h-12 md:h-10 text-base md:text-sm bg-purple-600 hover:bg-purple-700"
                disabled={!formData.priceListId}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => {
              // Ensure arrays are properly initialized
              while (productSearchTerms.length <= index) {
                productSearchTerms.push('');
              }
              while (productOpenStates.length <= index) {
                productOpenStates.push(false);
              }

              // Filter products based on search term
              const filteredProducts = useMemo(() => {
                const searchTerm = productSearchTerms[index] || '';
                if (!searchTerm) return products.slice(0, 10); // Show first 10 products by default
                
                return products.filter(product => 
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.category.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 20); // Lazy loading - show max 20 matches
              }, [productSearchTerms[index], products]);

              const selectedProduct = products.find(p => p.id === item.productId);

              return (
              <Card key={index} className="p-4">
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-6 md:gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Product * {!formData.priceListId && <span className="text-red-500">(Select price tier first)</span>}</Label>
                    <Popover 
                      open={productOpenStates[index]} 
                      onOpenChange={(open) => {
                        const newStates = [...productOpenStates];
                        newStates[index] = open;
                        setProductOpenStates(newStates);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={productOpenStates[index]}
                          className="h-12 w-full justify-between text-base md:text-sm"
                          disabled={!formData.priceListId}
                          data-testid={`select-product-${index}`}
                        >
                          {selectedProduct ? (
                            <span className="truncate">{selectedProduct.name}</span>
                          ) : (
                            <span className="text-muted-foreground">
                              {formData.priceListId ? "Search products..." : "Choose price tier first"}
                            </span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search products..." 
                            value={productSearchTerms[index] || ''}
                            onValueChange={(value) => {
                              const newTerms = [...productSearchTerms];
                              newTerms[index] = value;
                              setProductSearchTerms(newTerms);
                            }}
                            className="h-12 text-base md:text-sm"
                          />
                          <CommandEmpty>No products found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-y-auto">
                            {filteredProducts.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.name}
                                onSelect={() => {
                                  updateItem(index, 'productId', product.id);
                                  updateItem(index, 'productName', product.name);
                                  const newStates = [...productOpenStates];
                                  newStates[index] = false;
                                  setProductOpenStates(newStates);
                                }}
                                className="cursor-pointer py-3"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{product.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {product.category} • {product.unit}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          {filteredProducts.length === 20 && (
                            <div className="p-2 text-center text-sm text-muted-foreground border-t">
                              Showing first 20 results. Refine search for more.
                            </div>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
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
            )})}
          </div>

          <Separator />

          {/* Payment & Shipping Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-800">Payment & Shipping</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700">Method of Payment</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-200 rounded-xl hover:border-orange-400 transition-all duration-200 shadow-sm">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="agent">Agent Payment</SelectItem>
                    <SelectItem value="money transfer">Money Transfer</SelectItem>
                    <SelectItem value="cash">Cash Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700">Shipping Method</Label>
                <Select 
                  value={formData.shippingMethod} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, shippingMethod: value }))}
                >
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-200 rounded-xl hover:border-orange-400 transition-all duration-200 shadow-sm">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DHL">DHL Express</SelectItem>
                    <SelectItem value="UPS">UPS International</SelectItem>
                    <SelectItem value="FedEx">FedEx Global</SelectItem>
                    <SelectItem value="Agent">Agent Pickup</SelectItem>
                    <SelectItem value="Pick Up">Customer Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial Summary - Professional Canva Style */}
          <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-600 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-800">Financial Summary</h3>
              <div className="ml-4 px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                Professional Calculation
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Sub Total</Label>
                <Input
                  type="number"
                  value={formData.subtotal.toFixed(2)}
                  readOnly
                  className="bg-gray-50 font-bold text-xl h-14 border-2 border-gray-200 rounded-xl"
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Shipping Fee</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.shippingFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                  className="h-14 text-xl border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-200"
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Bank Charge</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.bankCharge}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankCharge: parseFloat(e.target.value) || 0 }))}
                  className="h-14 text-xl border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-200"
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Discount</Label>
                <Input
                  type="number"
                  step="0.01"
                  max="0"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  className="h-14 text-xl border-2 border-gray-200 rounded-xl hover:border-red-400 transition-all duration-200"
                  placeholder="Enter negative value"
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Other Charges</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.others}
                  onChange={(e) => setFormData(prev => ({ ...prev, others: parseFloat(e.target.value) || 0 }))}
                  className="h-14 text-xl border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-200"
                />
              </div>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl shadow-lg border-2 border-yellow-300">
                <Label className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-3 block flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Total Amount
                </Label>
                <Input
                  type="number"
                  value={formData.total.toFixed(2)}
                  readOnly
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 font-bold text-2xl h-16 border-2 border-yellow-400 rounded-xl"
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
              className="text-base md:text-sm"
            />
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <Label>Valid Until (Optional)</Label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              className="h-12 text-base md:text-sm"
              data-testid="input-valid-until"
            />
          </div>

          {/* Action Buttons Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-xl font-bold text-gray-800 mb-2">Ready to Submit?</h4>
                <p className="text-gray-600">Review all details before creating your quotation</p>
              </div>
              <Button 
                onClick={submitQuotation} 
                disabled={isLoading || !formData.priceListId} 
                className="w-full lg:w-auto min-w-[250px] h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-xl transition-all duration-200 transform hover:scale-105"
                data-testid="button-create-quotation"
              >
                {isLoading ? 'Creating...' : !formData.priceListId ? 'Select Price Tier First' : 'Create Professional Quotation'}
              </Button>
            </div>
          </div>

          {/* Professional Status Display */}
          <div className="bg-gradient-to-r from-slate-100 to-gray-100 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Items: {formData.items.length}/300</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Total: ${formData.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Creator: Auto-generated</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}