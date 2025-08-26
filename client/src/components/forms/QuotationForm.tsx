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

interface Client {
  id: string;
  name: string;
  clientCode: string;
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
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  
  // Product search states
  const [productSearchTerms, setProductSearchTerms] = useState<string[]>([]);
  const [productOpenStates, setProductOpenStates] = useState<boolean[]>([]);
  
  // Client search states
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientOpen, setClientOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    clientCode: '',
    country: '',
    priceListId: '',
    revisionNumber: 'R0',
    paymentMethod: '',
    shippingMethod: '',
    clientServiceInstructions: '',
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

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Load data on component mount and when duplicate data changes
  useEffect(() => {
    loadFormData();
  }, []);

  // Populate form with duplicate data
  useEffect(() => {
    if (duplicateData) {
      setFormData({
        clientId: duplicateData.clientId || '',
        clientCode: duplicateData.clientCode || '',
        country: duplicateData.country || '',
        priceListId: duplicateData.priceListId || '',
        revisionNumber: duplicateData.revisionNumber || 'R0',
        paymentMethod: duplicateData.paymentMethod || '',
        shippingMethod: duplicateData.shippingMethod || '',
        clientServiceInstructions: duplicateData.clientServiceInstructions || '',
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
      
      // Set selected client if available
      if (duplicateData.clientId) {
        const client = clients.find(c => c.id === duplicateData.clientId);
        if (client) {
          setSelectedClient(client);
        }
      }
    }
  }, [duplicateData, clients]);

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
      const [clientsRes, productsRes, priceListsRes] = await Promise.all([
        fetch('/api/clients', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/price-lists', { headers })
      ]);

      console.log('📊 API Response Status:', {
        clients: clientsRes.status,
        products: productsRes.status,
        priceLists: priceListsRes.status
      });

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        console.log('✅ Clients loaded:', clientsData?.length || 0);
        setClients(clientsData || []);
      } else {
        console.error('❌ Failed to load clients:', clientsRes.statusText);
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

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setFormData(prev => ({
        ...prev,
        clientId,
        clientCode: client.clientCode,
        country: client.country,
        priceListId: client.priceListId
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
    if (!formData.clientId) {
      toast({
        title: "Error",
        description: "Please select a client",
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
          clientId: formData.clientId,
          clientCode: formData.clientCode,
          country: formData.country,
          priceListId: formData.priceListId,
          revisionNumber: formData.revisionNumber,
          paymentMethod: formData.paymentMethod,
          shippingMethod: formData.shippingMethod,
          clientServiceInstructions: formData.clientServiceInstructions,
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
          clientId: '',
          clientCode: '',
          country: '',
          priceListId: '',
          revisionNumber: 'R0',
          paymentMethod: '',
          shippingMethod: '',
          clientServiceInstructions: '',
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
        setSelectedClient(null);
        
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Modern Header */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-2xl font-semibold text-foreground">Create New Quotation</CardTitle>
          <p className="text-muted-foreground">Generate professional quotations with confidence</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="px-2 py-1 bg-background border border-input rounded">Auto-generated number</span>
            <span className="px-2 py-1 bg-background border border-input rounded">{new Date().toLocaleDateString()}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Main Form Container */}
      <Card className="border-border shadow-sm">
        <CardContent className="space-y-8 p-6">
          {/* Essential Information Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Essential Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Price Tier *
                </Label>
                <Select value={formData.priceListId} onValueChange={(value) => setFormData(prev => ({ ...prev, priceListId: value }))}>
                  <SelectTrigger className="bg-background border-input text-foreground">
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

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Client *
              </Label>
              <Popover open={clientOpen} onOpenChange={setClientOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientOpen}
                    className="w-full justify-between bg-background border-input text-foreground"
                    data-testid="select-client"
                  >
                    {selectedClient ? (
                      <span className="truncate">{selectedClient.name} ({selectedClient.clientCode})</span>
                    ) : (
                      <span className="text-muted-foreground">
                        {clients.length > 0 ? "Search clients..." : "Loading clients..."}
                      </span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search clients..." 
                      value={clientSearchTerm}
                      onValueChange={setClientSearchTerm}
                      className="h-12 text-base md:text-sm"
                    />
                    <CommandEmpty>
                      <div className="p-4 text-center space-y-3">
                        <p className="text-sm text-muted-foreground">No clients found.</p>
                        <Button
                          variant="outline"
                          className="w-full h-10"
                          onClick={() => {
                            // Navigate to create client page
                            window.location.href = '/clients/create';
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create New Client
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {clients
                        .filter(client => 
                          client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                          client.clientCode.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                          client.country.toLowerCase().includes(clientSearchTerm.toLowerCase())
                        )
                        .slice(0, 20)
                        .map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.name}
                            onSelect={() => {
                              handleClientChange(client.id);
                              setClientOpen(false);
                            }}
                            className="cursor-pointer py-3"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{client.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {client.clientCode} • {client.country}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    {clients.filter(client => 
                      client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                      client.clientCode.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                      client.country.toLowerCase().includes(clientSearchTerm.toLowerCase())
                    ).length > 20 && (
                      <div className="p-2 text-center text-sm text-muted-foreground border-t">
                        Showing first 20 results. Refine search for more.
                      </div>
                    )}
                    {clients.length > 0 && (
                      <div className="border-t p-2">
                        <Button
                          variant="ghost"
                          className="w-full h-10 justify-start text-foreground hover:bg-muted"
                          onClick={() => {
                            window.location.href = '/clients/create';
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create New Client
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Revision Number</Label>
              <Input
                value={formData.revisionNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, revisionNumber: e.target.value }))}
                data-testid="input-revision-number"
                className="bg-background border-input text-foreground"
              />
            </div>
            </div>
          </div>

          {/* Client Info Display */}
          {selectedClient && (
            <div className="bg-muted/30 p-6 rounded-lg border border-border">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Client Selected
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background p-4 rounded border border-input">
                  <Label className="text-sm text-muted-foreground">Client Code</Label>
                  <p className="font-mono text-lg mt-1 text-foreground">{formData.clientCode}</p>
                </div>
                <div className="bg-background p-4 rounded border border-input">
                  <Label className="text-sm text-muted-foreground">Country</Label>
                  <p className="text-lg mt-1 text-foreground">{formData.country}</p>
                </div>
                <div className="bg-background p-4 rounded border border-input">
                  <Label className="text-sm text-muted-foreground">Price List</Label>
                  <p className="text-lg mt-1 font-semibold text-foreground">
                    {priceLists.find(pl => pl.id === formData.priceListId)?.name || 'Default'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Items Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Order Items</h3>
                <span className="text-sm text-muted-foreground">
                  Max 300 items
                </span>
              </div>
              <Button 
                type="button" 
                onClick={addItem} 
                size="sm" 
                data-testid="button-add-item"
                className="h-9 px-4"
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
              <Card key={index} className="p-4 border-border shadow-sm">
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-6 md:gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-muted-foreground">Product * {!formData.priceListId && <span className="text-destructive">(Select price tier first)</span>}</Label>
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
                          className="w-full justify-between bg-background border-input text-foreground"
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
                    <Label className="text-muted-foreground">Specification</Label>
                    <Input
                      value={item.specification}
                      onChange={(e) => updateItem(index, 'specification', e.target.value)}
                      placeholder="Enter specification"
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Quantity * (1 decimal)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Unit Price * (VLOOKUP)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Line Total</Label>
                    <Input
                      type="number"
                      value={item.lineTotal.toFixed(2)}
                      readOnly
                      className="bg-muted/50 font-semibold text-foreground"
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
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Payment & Shipping</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Method of Payment</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger className="bg-background border-input text-foreground">
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
              <div className="space-y-2">
                <Label className="text-muted-foreground">Shipping Method</Label>
                <Select 
                  value={formData.shippingMethod} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, shippingMethod: value }))}
                >
                  <SelectTrigger className="bg-background border-input text-foreground">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DHL">DHL Express</SelectItem>
                    <SelectItem value="UPS">UPS International</SelectItem>
                    <SelectItem value="FedEx">FedEx Global</SelectItem>
                    <SelectItem value="Agent">Agent Pickup</SelectItem>
                    <SelectItem value="Pick Up">Client Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-b from-muted/30 to-background border border-border rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Sub Total</Label>
                  <Input
                    type="number"
                    value={formData.subtotal.toFixed(2)}
                    readOnly
                    className="bg-muted/50 font-semibold text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Shipping Fee</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.shippingFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Bank Charge</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.bankCharge}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankCharge: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Discount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    max="0"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border-input text-foreground"
                    placeholder="Enter negative value"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Other Charges</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.others}
                    onChange={(e) => setFormData(prev => ({ ...prev, others: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Total Amount</Label>
                  <Input
                    type="number"
                    value={formData.total.toFixed(2)}
                    readOnly
                    className="bg-primary/10 font-bold text-lg text-foreground border-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Service Instructions */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Client Service Instructions</Label>
            <Textarea
              value={formData.clientServiceInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, clientServiceInstructions: e.target.value }))}
              placeholder="Enter any special instructions..."
              rows={3}
              className="bg-background border-input text-foreground"
            />
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Valid Until (Optional)</Label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              className="bg-background border-input text-foreground"
              data-testid="input-valid-until"
            />
          </div>

          {/* Action Buttons Section */}
          <div className="flex justify-end pt-6 border-t border-border">
            <Button 
              onClick={submitQuotation} 
              disabled={isLoading || !formData.priceListId} 
              className="h-10 px-6 font-medium"
              data-testid="button-create-quotation"
            >
              {isLoading ? 'Creating...' : !formData.priceListId ? 'Select Price Tier First' : 'Create Quotation'}
            </Button>
          </div>

          {/* Status Display */}
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Items: {formData.items.length}/300</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Total: ${formData.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Creator: Auto-generated</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}