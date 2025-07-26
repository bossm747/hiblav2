import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart, Trash2, CreditCard, DollarSign, Receipt, Search, Package2, Barcode as BarcodeIcon, Eye } from "lucide-react";
import Barcode from 'react-barcode';
import { ProductDetailModal } from "@/components/product-detail-modal";
import type { Product } from "@shared/schema";

interface CartItem {
  productId: string;
  productName: string;
  productImage?: string | null;
  price: string;
  quantity: number;
}

export default function POSPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash" | "bank_transfer">("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<{ product: Product; value: string } | null>(null);

  // Fetch all products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const search = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.hairType?.toLowerCase().includes(search)
    );
  }, [products, searchTerm]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal + tax;

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: async (data: { items: CartItem[]; paymentMethod: string; amountPaid: number }) => {
      const response = await fetch("/api/pos/create-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create sale");
      return response.json();
    },
    onSuccess: (data: { order: any; change: number }) => {
      toast({
        title: "Sale Complete!",
        description: `Change: ₱${data.change.toFixed(2)}`
      });
      setCart([]);
      setAmountPaid("");
      setShowPaymentDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pos/daily-sales"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete sale",
        variant: "destructive"
      });
    }
  });

  // Add to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    
    if (existingItem) {
      // Check if adding would exceed stock
      if (existingItem.quantity >= (product.currentStock ?? 0)) {
        toast({
          title: "Out of Stock",
          description: `Only ${product.currentStock ?? 0} units available`,
          variant: "destructive"
        });
        return;
      }
      
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (!product.currentStock || product.currentStock === 0) {
        toast({
          title: "Out of Stock",
          description: "This product is currently out of stock",
          variant: "destructive"
        });
        return;
      }
      
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.featuredImage,
          price: product.price,
          quantity: 1
        }
      ]);
    }
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.productId !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Process payment
  const processPayment = () => {
    const paid = parseFloat(amountPaid);
    
    if (isNaN(paid) || paid < total) {
      toast({
        title: "Insufficient Payment",
        description: `Amount paid must be at least ₱${total.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    createSaleMutation.mutate({
      items: cart,
      paymentMethod,
      amountPaid: paid
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-screen">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4 overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 pb-4">
          <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products by name, SKU, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                product.currentStock === 0 ? "opacity-50" : ""
              }`}
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  {product.featuredImage ? (
                    <img 
                      src={product.featuredImage} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package2 className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.sku || "No SKU"}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">₱{product.price}</span>
                  <Badge variant={!product.currentStock || product.currentStock === 0 ? "destructive" : "secondary"}>
                    {product.currentStock ?? 0} left
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setShowProductModal(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      const barcodeValue = product.sku || `PRD${product.id.slice(0, 8).toUpperCase()}`;
                      setSelectedBarcode({ product, value: barcodeValue });
                      setShowBarcodeDialog(true);
                    }}
                  >
                    <BarcodeIcon className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </CardTitle>
            <CardDescription>
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">₱{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.productId, item.quantity - 1);
                          }}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            const product = products.find(p => p.id === item.productId);
                            if (product && item.quantity < (product.currentStock ?? 0)) {
                              updateQuantity(item.productId, item.quantity + 1);
                            } else {
                              toast({
                                title: "Stock Limit",
                                description: "Cannot add more items",
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.productId);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (12%)</span>
                    <span>₱{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={() => setShowPaymentDialog(true)}
                  disabled={cart.length === 0}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Barcode Dialog */}
      <Dialog open={showBarcodeDialog} onOpenChange={setShowBarcodeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBarcode?.product.name}</DialogTitle>
            <DialogDescription>
              Product Barcode
            </DialogDescription>
          </DialogHeader>
          {selectedBarcode && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="bg-white p-6 rounded-lg border">
                <Barcode 
                  value={selectedBarcode.value}
                  width={2}
                  height={80}
                  fontSize={16}
                  background="#ffffff"
                  lineColor="#000000"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">SKU: {selectedBarcode.product.sku || "N/A"}</p>
                <p className="font-semibold">₱{selectedBarcode.product.price}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Total Amount: ₱{total.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Amount Paid</Label>
              <Input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount paid"
              />
            </div>
            
            {amountPaid && parseFloat(amountPaid) >= total && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Change: ₱{(parseFloat(amountPaid) - total).toFixed(2)}
                </p>
              </div>
            )}
            
            <Button
              className="w-full"
              onClick={processPayment}
              disabled={createSaleMutation.isPending || !amountPaid || parseFloat(amountPaid) < total}
            >
              {createSaleMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  <Receipt className="mr-2 h-4 w-4" />
                  Complete Sale
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
        onAddToCart={addToCart}
      />
    </div>
  );
}