import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

// Form validation schema
const quotationFormSchema = z.object({
  customerCode: z.string().min(1, "Customer code is required"),
  country: z.string().min(1, "Country is required"),
  priceListId: z.string().min(1, "Price list is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  shippingMethod: z.string().min(1, "Shipping method is required"),
  items: z.array(z.object({
    productId: z.string().min(1, "Product ID is required"),
    productName: z.string().min(1, "Product name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    unitPrice: z.string().min(1, "Unit price is required"),
    lineTotal: z.string().min(1, "Line total is required"),
  })).min(1, "At least one item is required")
});

type QuotationFormData = z.infer<typeof quotationFormSchema>;

interface VLOOKUPQuotationFormProps {
  onSuccess?: () => void;
}

export function VLOOKUPQuotationForm({ onSuccess }: VLOOKUPQuotationFormProps) {
  const [items, setItems] = useState([{ productId: "", productName: "", quantity: "1", unitPrice: "0", lineTotal: "0" }]);

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      customerCode: "",
      country: "Philippines",
      priceListId: "",
      paymentMethod: "",
      shippingMethod: "",
      items: items
    }
  });

  // VLOOKUP Price Functionality - CLIENT CRITICAL FEATURE
  const handleProductSelect = async (index: number, productId: string) => {
    const priceListId = form.getValues("priceListId");
    
    if (!productId || !priceListId) {
      return;
    }

    try {
      const response = await apiRequest(`/api/products/price-lookup?productId=${productId}&priceListId=${priceListId}`);
      
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        productId,
        productName: response.productName || "",
        unitPrice: response.price || "0"
      };
      
      // Calculate line total
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(response.price || "0");
      newItems[index].lineTotal = (quantity * unitPrice).toFixed(2);
      
      setItems(newItems);
      form.setValue("items", newItems);
      
      toast({
        title: "Price Updated",
        description: `Price loaded from Price List ${priceListId}: $${response.price}`
      });
    } catch (error) {
      toast({
        title: "Price Lookup Failed",
        description: "Could not retrieve price for selected product",
        variant: "destructive"
      });
    }
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    
    const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
    const qty = parseFloat(quantity) || 0;
    newItems[index].lineTotal = (qty * unitPrice).toFixed(2);
    
    setItems(newItems);
    form.setValue("items", newItems);
  };

  const handlePriceListChange = (priceListId: string) => {
    form.setValue("priceListId", priceListId);
    
    // Re-lookup prices for all items when price list changes
    items.forEach((item, index) => {
      if (item.productId) {
        handleProductSelect(index, item.productId);
      }
    });
  };

  const addItem = () => {
    const newItem = { productId: "", productName: "", quantity: "1", unitPrice: "0", lineTotal: "0" };
    const newItems = [...items, newItem];
    setItems(newItems);
    form.setValue("items", newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    form.setValue("items", newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.lineTotal) || 0), 0).toFixed(2);
  };

  const onSubmit = async (data: QuotationFormData) => {
    try {
      const subtotal = calculateSubtotal();
      
      const quotationData = {
        quotation: {
          ...data,
          subtotal,
          total: subtotal, // For now, total = subtotal (no taxes/discounts)
          items: undefined // Remove items from quotation object
        },
        items: data.items
      };
      
      await apiRequest("/api/quotations", {
        method: "POST",
        body: JSON.stringify(quotationData)
      });
      
      toast({
        title: "Quotation Created",
        description: "Quotation has been created successfully"
      });
      
      form.reset();
      setItems([{ productId: "", productName: "", quantity: "1", unitPrice: "0", lineTotal: "0" }]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quotation",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Create New Quotation with VLOOKUP Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceListId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price List</FormLabel>
                    <Select onValueChange={handlePriceListChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select price list" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Price List A</SelectItem>
                        <SelectItem value="B">Price List B</SelectItem>
                        <SelectItem value="C">Price List C</SelectItem>
                        <SelectItem value="D">Price List D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="wire">Wire Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="UPS">UPS</SelectItem>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Pick Up">Pick Up</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Items Section with VLOOKUP */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Items</h3>
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-6 gap-4 items-end">
                    <div>
                      <label className="text-sm font-medium">Product ID</label>
                      <Input
                        placeholder="Product ID"
                        value={item.productId}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].productId = e.target.value;
                          setItems(newItems);
                        }}
                        onBlur={(e) => handleProductSelect(index, e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Product Name</label>
                      <Input
                        placeholder="Product Name"
                        value={item.productName}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].productName = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Unit Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].unitPrice = e.target.value;
                          const quantity = parseFloat(newItems[index].quantity) || 0;
                          const unitPrice = parseFloat(e.target.value) || 0;
                          newItems[index].lineTotal = (quantity * unitPrice).toFixed(2);
                          setItems(newItems);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Line Total</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Line Total"
                        value={item.lineTotal}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-right space-y-2">
                  <div className="text-lg font-semibold">
                    Subtotal: ${calculateSubtotal()}
                  </div>
                  <div className="text-lg font-bold">
                    Total: ${calculateSubtotal()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit">
                Create Quotation
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}