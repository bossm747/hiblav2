import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Eye, Edit3, Copy, Send, Search, Download, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField as FormFieldComponent, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";
import { FormField } from "@/components/ui/form-field";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Quotation form schema
const quotationSchema = z.object({
  quotationNumber: z.string().min(1, "Quotation number is required"),
  revisionNumber: z.string().default("R0"),
  customerCode: z.string().min(1, "Customer code is required"),
  country: z.string().min(1, "Country is required"),
  priceListId: z.string().min(1, "Price list is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  shippingMethod: z.string().min(1, "Shipping method is required"),
  shippingFee: z.string().default("0"),
  bankCharge: z.string().default("0"),
  discount: z.string().default("0"),
  others: z.string().default("0"),
  customerServiceInstructions: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string().min(1, "Product name is required"),
    specification: z.string().optional(),
    quantity: z.string().min(1, "Quantity is required"),
    unitPrice: z.string().min(1, "Unit price is required"),
    lineTotal: z.string()
  })).min(1, "At least one item is required")
});

export default function QuotationsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  // Fetch quotations with filters
  const { data: quotations, isLoading } = useQuery({
    queryKey: ["/api/quotations", { search: searchTerm, status: statusFilter, customer: customerFilter }],
    queryFn: ({ queryKey }) => {
      const [_, filters] = queryKey as [string, any];
      let url = "/api/quotations";
      const params = new URLSearchParams();
      
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.customer && filters.customer !== "all") {
        params.append("customer", filters.customer);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return apiRequest(url);
    },
  });

  // Fetch customers for filter dropdown
  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Fetch price lists
  const { data: priceLists } = useQuery({
    queryKey: ["/api/price-lists"],
  });

  // Fetch products for item selection
  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  // Create quotation mutation
  const createQuotationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/quotations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      setShowCreateModal(false);
    },
  });

  // Generate sales order mutation
  const generateSalesOrderMutation = useMutation({
    mutationFn: (quotationId: string) => apiRequest(`/api/quotations/${quotationId}/generate-sales-order`, {
      method: "POST",
      body: JSON.stringify({ dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
    },
  });

  // Duplicate quotation mutation
  const duplicateQuotationMutation = useMutation({
    mutationFn: (quotationId: string) => apiRequest(`/api/quotations/${quotationId}/duplicate`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
    },
  });

  // Form management
  const form = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      quotationNumber: "",
      revisionNumber: "R0",
      customerCode: "",
      country: "",
      priceListId: "",
      paymentMethod: "",
      shippingMethod: "",
      shippingFee: "0",
      bankCharge: "0",
      discount: "0",
      others: "0",
      customerServiceInstructions: "",
      items: [
        {
          productId: "",
          productName: "",
          specification: "",
          quantity: "",
          unitPrice: "",
          lineTotal: "0"
        }
      ]
    }
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Calculate totals
  const calculateTotals = (items: any[], shippingFee = "0", bankCharge = "0", discount = "0", others = "0") => {
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.lineTotal || "0"), 0);
    const shipping = parseFloat(shippingFee);
    const bank = parseFloat(bankCharge);
    const disc = parseFloat(discount);
    const oth = parseFloat(others);
    const total = subtotal + shipping + bank - disc + oth;
    
    return { subtotal, total };
  };

  // Handle product selection and price lookup
  const handleProductSelect = async (index: number, productId: string) => {
    const product = products?.find((p: any) => p.id === productId);
    if (!product) return;

    const priceListId = form.getValues(`priceListId`);
    if (priceListId) {
      try {
        const priceResponse = await apiRequest(`/api/products/price-lookup?productId=${productId}&priceListId=${priceListId}`);
        const unitPrice = priceResponse.price || "0";
        
        form.setValue(`items.${index}.productId`, productId);
        form.setValue(`items.${index}.productName`, product.name);
        form.setValue(`items.${index}.unitPrice`, unitPrice);
        
        // Auto-calculate line total when quantity changes
        const quantity = form.getValues(`items.${index}.quantity`);
        if (quantity) {
          const lineTotal = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
          form.setValue(`items.${index}.lineTotal`, lineTotal);
        }
      } catch (error) {
        console.error("Price lookup failed:", error);
      }
    }
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, quantity: string) => {
    const unitPrice = form.getValues(`items.${index}.unitPrice`);
    if (unitPrice && quantity) {
      const lineTotal = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
      form.setValue(`items.${index}.lineTotal`, lineTotal);
    }
  };

  // Submit form
  const onSubmit = (data: any) => {
    const { subtotal, total } = calculateTotals(
      data.items,
      data.shippingFee,
      data.bankCharge,
      data.discount,
      data.others
    );

    const quotationData = {
      quotation: {
        ...data,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
        status: "draft"
      },
      items: data.items.map((item: any) => ({
        ...item,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        lineTotal: parseFloat(item.lineTotal)
      }))
    };

    createQuotationMutation.mutate(quotationData);
  };

  // Filter quotations
  const filteredQuotations = quotations?.filter((quotation: any) => {
    const matchesSearch = searchTerm === "" || 
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quotations</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage customer quotations and pricing</p>
              </div>
            </div>
            <div className="text-center">Loading quotations...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quotations</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage customer quotations and pricing with VLOOKUP functionality</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Quotation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quotation</DialogTitle>
                    <DialogDescription>
                      Create a new quotation with automatic pricing lookup and manual numbering
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          label="Quotation Number"
                          required
                        >
                          <FormFieldComponent
                            control={form.control}
                            name="quotationNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Q0001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField label="Revision">
                          <FormFieldComponent
                            control={form.control}
                            name="revisionNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="R0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Customer Code"
                          required
                        >
                          <FormFieldComponent
                            control={form.control}
                            name="customerCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="CUST001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Country"
                          required
                        >
                          <FormFieldComponent
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Philippines" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Price List"
                          required
                        >
                          <FormFieldComponent
                            control={form.control}
                            name="priceListId"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select price list" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {priceLists?.map((priceList: any) => (
                                        <SelectItem key={priceList.id} value={priceList.id}>
                                          {priceList.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>
                      </div>

                      {/* Items Section */}
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Quotation Items</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => appendItem({
                              productId: "",
                              productName: "",
                              specification: "",
                              quantity: "",
                              unitPrice: "",
                              lineTotal: "0"
                            })}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Item
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {itemFields.map((field, index) => (
                            <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <FormField label="Product">
                                  <FormFieldComponent
                                    control={form.control}
                                    name={`items.${index}.productId`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Select onValueChange={(value) => handleProductSelect(index, value)}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {products?.map((product: any) => (
                                                <SelectItem key={product.id} value={product.id}>
                                                  {product.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </FormField>

                                <FormField label="Specification">
                                  <FormFieldComponent
                                    control={form.control}
                                    name={`items.${index}.specification`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="Specification" {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </FormField>

                                <FormField label="Quantity" required>
                                  <FormFieldComponent
                                    control={form.control}
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) => {
                                              field.onChange(e);
                                              handleQuantityChange(index, e.target.value);
                                            }}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </FormField>

                                <FormField label="Unit Price" required>
                                  <FormFieldComponent
                                    control={form.control}
                                    name={`items.${index}.unitPrice`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            readOnly
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </FormField>

                                <div className="flex items-center gap-2">
                                  <FormField label="Line Total">
                                    <FormFieldComponent
                                      control={form.control}
                                      name={`items.${index}.lineTotal`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.01"
                                              placeholder="0.00"
                                              {...field}
                                              readOnly
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </FormField>
                                  {itemFields.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeItem(index)}
                                      className="mt-8"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Totals Section */}
                      <Separator />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField label="Shipping Fee">
                          <FormFieldComponent
                            control={form.control}
                            name="shippingFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField label="Bank Charge">
                          <FormFieldComponent
                            control={form.control}
                            name="bankCharge"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField label="Discount">
                          <FormFieldComponent
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField label="Others">
                          <FormFieldComponent
                            control={form.control}
                            name="others"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </FormField>
                      </div>

                      {/* Payment and Shipping */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Payment Method" required>
                          <FormFieldComponent
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                                      <SelectItem value="letter_of_credit">Letter of Credit</SelectItem>
                                      <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>

                        <FormField label="Shipping Method" required>
                          <FormFieldComponent
                            control={form.control}
                            name="shippingMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select shipping method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="air_freight">Air Freight</SelectItem>
                                      <SelectItem value="sea_freight">Sea Freight</SelectItem>
                                      <SelectItem value="courier">Courier</SelectItem>
                                      <SelectItem value="pickup">Pickup</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormField>
                      </div>

                      {/* Instructions */}
                      <FormField label="Customer Service Instructions">
                        <FormFieldComponent
                          control={form.control}
                          name="customerServiceInstructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  placeholder="Special instructions or notes..." 
                                  {...field} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </FormField>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreateModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createQuotationMutation.isPending}
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          {createQuotationMutation.isPending ? "Creating..." : "Create Quotation"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search quotations..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers?.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.code || customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quotations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quotations ({filteredQuotations.length})</CardTitle>
              <CardDescription>
                Manage and track customer quotations with automatic pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation: any) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">
                        {quotation.quotationNumber}
                        <div className="text-xs text-gray-500">{quotation.revisionNumber}</div>
                      </TableCell>
                      <TableCell>{quotation.customerCode}</TableCell>
                      <TableCell>{quotation.country}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            quotation.status === "accepted" ? "default" : 
                            quotation.status === "approved" ? "default" :
                            quotation.status === "pending" ? "secondary" : 
                            quotation.status === "rejected" ? "destructive" :
                            "outline"
                          }
                          className="capitalize"
                        >
                          {quotation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(quotation.total || "0").toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(quotation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedQuotation(quotation.id)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => duplicateQuotationMutation.mutate(quotation.id)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          {quotation.status === "approved" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generateSalesOrderMutation.mutate(quotation.id)}
                              disabled={generateSalesOrderMutation.isPending}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}