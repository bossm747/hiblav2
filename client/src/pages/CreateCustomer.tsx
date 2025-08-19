import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreateCustomer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    customerCode: '',
    country: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    priceListId: ''
  });

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 
    'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria',
    'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea',
    'Singapore', 'Hong Kong', 'Taiwan', 'Philippines', 'Malaysia', 'Thailand',
    'Indonesia', 'Vietnam', 'India', 'China', 'Brazil', 'Mexico', 'Argentina'
  ];

  const priceListOptions = [
    { id: '1', name: 'New Customer', type: 'Standard' },
    { id: '2', name: 'Regular', type: 'Discount' },
    { id: '3', name: 'Premier', type: 'Premium' },
    { id: '4', name: 'Custom', type: 'Special' }
  ];

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.customerCode || !formData.country || !formData.priceListId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Customer Code, Country, Price List)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Customer created successfully!",
        });
        
        // Navigate back to quotation form
        setTimeout(() => {
          window.history.back();
        }, 1000);
      } else {
        throw new Error('Failed to create customer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCustomerCode = () => {
    const code = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    setFormData(prev => ({ ...prev, customerCode: code }));
  };

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Customer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new customer to the system
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter customer name"
                className="h-12 text-base md:text-sm"
                data-testid="input-customer-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Code *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.customerCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerCode: e.target.value }))}
                  placeholder="Enter customer code"
                  className="h-12 text-base md:text-sm"
                  data-testid="input-customer-code"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCustomerCode}
                  className="h-12 px-4"
                  disabled={!formData.name}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country *</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger className="h-12 text-base md:text-sm" data-testid="select-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price List *</Label>
              <Select value={formData.priceListId} onValueChange={(value) => setFormData(prev => ({ ...prev, priceListId: value }))}>
                <SelectTrigger className="h-12 text-base md:text-sm" data-testid="select-price-list">
                  <SelectValue placeholder="Select price list" />
                </SelectTrigger>
                <SelectContent>
                  {priceListOptions.map((priceList) => (
                    <SelectItem key={priceList.id} value={priceList.id}>
                      {priceList.name} - {priceList.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter customer address"
              className="h-12 text-base md:text-sm"
              data-testid="input-address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Contact person name"
                className="h-12 text-base md:text-sm"
                data-testid="input-contact-person"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="customer@email.com"
                className="h-12 text-base md:text-sm"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
                className="h-12 text-base md:text-sm"
                data-testid="input-phone"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="h-12 min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-12 min-w-[120px] bg-purple-600 hover:bg-purple-700"
              data-testid="button-create-customer"
            >
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Customer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}