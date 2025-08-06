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
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { Quotation } from "@shared/schema";
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

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">
              Manage customer quotations and price estimates
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Quotation
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotations?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Quotations</CardTitle>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations?.filter((q: Quotation) => q.status === "draft").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent Quotations</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations?.filter((q: Quotation) => q.status === "sent").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations?.filter((q: Quotation) => q.status === "accepted").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
            <CardDescription>
              All quotations from newest to oldest
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : quotations?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quotations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first quotation to get started
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quotation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotations?.map((quotation: Quotation) => (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{quotation.quotationNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {quotation.customerCode} • {quotation.country}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${parseFloat(quotation.total || "0").toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quotation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(quotation.status || "draft")}>
                        {quotation.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}