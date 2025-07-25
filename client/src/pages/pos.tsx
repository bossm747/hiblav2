import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Smartphone,
  QrCode,
  Banknote,
  Receipt,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const checkoutSchema = z.object({
  clientId: z.string().optional(),
  staffId: z.string().min(1, "Staff member is required"),
  paymentMethod: z.enum(["cash", "gcash", "maya", "qrph", "card"]),
  paymentReference: z.string().optional(),
  discount: z.string().default("0"),
  notes: z.string().optional(),
  amountPaid: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
});

const quickCustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),
});

interface CartItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  price: string;
  quantity: number;
  total: string;
}

export default function POS() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showQuickCustomer, setShowQuickCustomer] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
  });

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      clientId: "walk-in",
      staffId: "",
      paymentMethod: "cash",
      paymentReference: "",
      discount: "0",
      notes: "",
      amountPaid: "",
      customerName: "",
      customerPhone: "",
    },
  });

  const customerForm = useForm<z.infer<typeof quickCustomerSchema>>({
    resolver: zodResolver(quickCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });

  const processTransactionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof checkoutSchema>) => {
      const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);
      const discount = parseFloat(data.discount);
      const tax = 0; // No tax for now
      const total = subtotal - discount + tax;

      const transactionData = {
        ...data,
        items: cart,
        subtotal: subtotal.toString(),
        discount: discount.toString(),
        tax: tax.toString(),
        total: total.toString(),
        paymentStatus: "completed",
      };

      const response = await apiRequest("POST", "/api/transactions", transactionData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Transaction Complete",
        description: `Transaction ${data.transactionNumber} processed successfully`,
      });
      setLastTransaction(data);
      setShowReceipt(true);
      setCart([]);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error: any) => {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to process transaction",
        variant: "destructive",
      });
    },
  });

  const addToCart = (item: any, type: 'service' | 'product') => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === type);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id && cartItem.type === type
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              total: (parseFloat(cartItem.price) * (cartItem.quantity + 1)).toString()
            }
          : cartItem
      ));
    } else {
      const newItem: CartItem = {
        id: item.id,
        type,
        name: item.name,
        price: type === 'service' ? item.price : item.retailPrice,
        quantity: 1,
        total: type === 'service' ? item.price : item.retailPrice,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (id: string, type: 'service' | 'product', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    setCart(cart.map(item => 
      item.id === id && item.type === type
        ? {
            ...item,
            quantity,
            total: (parseFloat(item.price) * quantity).toString()
          }
        : item
    ));
  };

  const removeFromCart = (id: string, type: 'service' | 'product') => {
    setCart(cart.filter(item => !(item.id === id && item.type === type)));
  };

  const createQuickCustomerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof quickCustomerSchema>) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      form.setValue("clientId", newClient.id);
      setShowQuickCustomer(false);
      customerForm.reset();
      toast({
        title: "Customer Added",
        description: `${newClient.firstName} ${newClient.lastName} added successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add customer",
        variant: "destructive",
      });
    },
  });

  const serviceCategories = [
    { value: "all", label: "All Services" },
    { value: "facial", label: "Facial" },
    { value: "massage", label: "Massage" },
    { value: "hair", label: "Hair" },
    { value: "nails", label: "Nails" },
    { value: "body", label: "Body Treatment" },
  ];

  const filteredServices = selectedCategory === "all" 
    ? (services as any[])
    : (services as any[]).filter((service: any) => 
        service.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const discount = parseFloat(form.watch('discount') || "0");
  const tax = 0; // No tax for now
  const total = subtotal - discount + tax;
  const amountPaid = parseFloat(form.watch("amountPaid") || "0");
  const changeAmount = Math.max(0, amountPaid - total);

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    processTransactionMutation.mutate(data);
    setIsProcessing(false);
  };

  const paymentMethods = [
    { value: "cash", label: "Cash", icon: <Banknote className="h-4 w-4" /> },
    { value: "gcash", label: "GCash", icon: <Smartphone className="h-4 w-4" /> },
    { value: "maya", label: "Maya (PayMaya)", icon: <Smartphone className="h-4 w-4" /> },
    { value: "qrph", label: "QR PH", icon: <QrCode className="h-4 w-4" /> },
    { value: "card", label: "Credit/Debit Card", icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-responsive-lg font-bold text-slate-900">Point of Sale</h2>
        <p className="mt-2 text-responsive-base text-slate-600">
          Process transactions for services and products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products and Services */}
        <div className="space-y-6">
          {/* Service Categories */}
          <Card className="spa-card-shadow">
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {serviceCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="text-xs"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="spa-card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Services ({filteredServices.length})
              </CardTitle>
              <CardDescription>
                Available spa and salon services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices.map((service: any) => (
                  <div
                    key={service.id}
                    className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => addToCart(service, 'service')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{service.name}</h3>
                      <Badge variant="outline">₱{service.price}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {service.duration} mins • {service.category}
                    </p>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="spa-card-shadow">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Available retail products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(products as any[]).filter((product: any) => product.currentStock > 0).map((product: any) => (
                  <div
                    key={product.id}
                    className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => addToCart(product, 'product')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <Badge variant="outline">₱{product.retailPrice}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {product.brand} • Stock: {product.currentStock}
                    </p>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart and Checkout */}
        <div className="space-y-6">
          {/* Cart */}
          <Card className="spa-card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Add services or products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.type}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.type} • ₱{item.price} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id, item.type)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-medium">₱{item.total}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-₱{discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>₱{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="spa-card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          Customer (Optional)
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQuickCustomer(true)}
                            className="text-xs"
                          >
                            + Add New
                          </Button>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Walk-in customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="walk-in">Walk-in customer</SelectItem>
                            {(clients as any[]).map((client: any) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.firstName} {client.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="staffId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff Member *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(staff as any[]).map((member: any) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.firstName} {member.lastName}
                              </SelectItem>
                            ))}
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
                        <FormLabel>Payment Method *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                <div className="flex items-center gap-2">
                                  {method.icon}
                                  {method.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('paymentMethod') !== 'cash' && (
                    <FormField
                      control={form.control}
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter reference number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount (₱)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("paymentMethod") === "cash" && (
                      <FormField
                        control={form.control}
                        name="amountPaid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount Paid (₱)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={total.toFixed(2)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            {changeAmount > 0 && (
                              <p className="text-sm text-green-600 font-medium">
                                Change: ₱{changeAmount.toFixed(2)}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="Additional notes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={cart.length === 0 || isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Process Payment ₱${total.toFixed(2)}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Customer Registration Modal */}
      <Dialog open={showQuickCustomer} onOpenChange={setShowQuickCustomer}>
        <DialogContent className="spa-modal-shadow">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Customer
            </DialogTitle>
            <DialogDescription>
              Quickly register a new customer for this transaction
            </DialogDescription>
          </DialogHeader>
          
          <Form {...customerForm}>
            <form onSubmit={customerForm.handleSubmit((data) => createQuickCustomerMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={customerForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={customerForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Dela Cruz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={customerForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="09171234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={customerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="juan@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuickCustomer(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createQuickCustomerMutation.isPending}
                >
                  {createQuickCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="spa-modal-shadow max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction Receipt
            </DialogTitle>
          </DialogHeader>
          
          {lastTransaction && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg">Serenity Spa & Salon</h3>
                <p className="text-sm text-muted-foreground">
                  Transaction #{lastTransaction.transactionNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Items:</h4>
                {lastTransaction.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₱{item.total}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{lastTransaction.subtotal}</span>
                </div>
                {parseFloat(lastTransaction.discount) > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₱{lastTransaction.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₱{lastTransaction.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{lastTransaction.paymentMethod}</span>
                </div>
                {lastTransaction.paymentMethod === 'cash' && changeAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>₱{changeAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Thank you for visiting!
                </p>
                <p className="text-xs text-muted-foreground">
                  Visit us again soon
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex-1"
            >
              Print Receipt
            </Button>
            <Button
              onClick={() => setShowReceipt(false)}
              className="flex-1"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}