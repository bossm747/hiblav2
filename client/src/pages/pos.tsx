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
} from "lucide-react";

const checkoutSchema = z.object({
  clientId: z.string().optional(),
  staffId: z.string().min(1, "Staff member is required"),
  paymentMethod: z.enum(["cash", "gcash", "maya", "qrph", "card"]),
  paymentReference: z.string().optional(),
  discount: z.string().default("0"),
  notes: z.string().optional(),
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
      clientId: "",
      staffId: "",
      paymentMethod: "cash",
      paymentReference: "",
      discount: "0",
      notes: "",
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
      setCart([]);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
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

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const discount = parseFloat(form.watch('discount') || "0");
  const tax = 0; // No tax for now
  const total = subtotal - discount + tax;

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
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Point of Sale</h2>
          <p className="text-muted-foreground">
            Process transactions for services and products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products and Services */}
        <div className="space-y-6">
          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Services
              </CardTitle>
              <CardDescription>
                Available spa and salon services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service: any) => (
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
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Available retail products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.filter((product: any) => product.currentStock > 0).map((product: any) => (
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
          <Card>
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
          <Card>
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
                        <FormLabel>Customer (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Walk-in customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Walk-in customer</SelectItem>
                            {clients.map((client: any) => (
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
                            {staff.map((member: any) => (
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
    </div>
  );
}