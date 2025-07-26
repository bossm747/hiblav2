import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, AlertTriangle, TrendingUp, TrendingDown, History, Barcode as BarcodeIcon, Eye } from "lucide-react";
import Barcode from 'react-barcode';
import { ProductDetailModal } from "@/components/product-detail-modal";
import type { Product, InventoryTransaction } from "@shared/schema";

export default function InventoryPage() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"purchase" | "sale" | "adjustment" | "return">("purchase");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedViewProduct, setSelectedViewProduct] = useState<Product | null>(null);
  const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<{ product: Product; value: string } | null>(null);

  // Fetch all products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  // Fetch low stock products
  const { data: lowStockProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/inventory/low-stock"]
  });

  // Fetch inventory transactions for selected product
  const { data: transactions = [] } = useQuery<InventoryTransaction[]>({
    queryKey: ["/api/inventory/transactions", selectedProduct?.id],
    enabled: !!selectedProduct?.id
  });

  // Inventory adjustment mutation
  const adjustInventoryMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number; type: string; reason: string }) =>
      apiRequest("/api/inventory/adjust", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory adjusted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/transactions"] });
      setAdjustmentQuantity("");
      setAdjustmentReason("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to adjust inventory",
        variant: "destructive"
      });
    }
  });

  const handleAdjustInventory = () => {
    if (!selectedProduct || !adjustmentQuantity || !adjustmentReason) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    adjustInventoryMutation.mutate({
      productId: selectedProduct.id,
      quantity: parseInt(adjustmentQuantity),
      type: adjustmentType,
      reason: adjustmentReason
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full bg-background text-foreground">Loading inventory...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 glass-card p-6 neon-purple">
        <h1 className="text-3xl font-bold mb-2 text-foreground neon-text-purple">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor stock levels and manage inventory</p>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6 glass-card neon-pink">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground neon-text-pink mb-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </h2>
            <p className="text-muted-foreground mb-4">
              {lowStockProducts.length} products are running low on stock
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 glass-dark rounded-lg border border-white/10">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                  </div>
                  <Badge variant="destructive" className="neon-pink">
                    {product.currentStock} left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="glass-card neon-cyan">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-foreground neon-text-cyan">Current Inventory</h2>
          <p className="text-sm text-muted-foreground mb-4">Click on a product to view details and adjust stock</p>
        </div>
        <div className="p-6 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground">Product</TableHead>
                <TableHead className="text-foreground">SKU</TableHead>
                <TableHead className="text-foreground">Category</TableHead>
                <TableHead className="text-foreground">Current Stock</TableHead>
                <TableHead className="text-foreground">Low Stock Threshold</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-white/10">
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{product.hairType}</TableCell>
                  <TableCell className="text-foreground">{product.currentStock}</TableCell>
                  <TableCell className="text-muted-foreground">{product.lowStockThreshold}</TableCell>
                  <TableCell>
                    {product.currentStock === 0 ? (
                      <Badge variant="destructive" className="neon-pink">Out of Stock</Badge>
                    ) : product.currentStock <= product.lowStockThreshold ? (
                      <Badge variant="secondary">Low Stock</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 hover:bg-primary/20 hover:neon-text-purple"
                        onClick={() => {
                          setSelectedViewProduct(product);
                          setShowProductModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 hover:bg-primary/20 hover:neon-text-cyan"
                        onClick={() => {
                          const barcodeValue = product.sku || `PRD${product.id.slice(0, 8).toUpperCase()}`;
                          setSelectedBarcode({ product, value: barcodeValue });
                          setShowBarcodeDialog(true);
                        }}
                      >
                        <BarcodeIcon className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 hover:bg-primary/20 hover:neon-text-pink"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-2xl glass-card border-white/20 neon-purple bg-background">
                        <DialogHeader>
                          <DialogTitle className="text-foreground neon-text-purple">Adjust Inventory: {product.name}</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Current Stock: <span className="text-foreground font-semibold">{product.currentStock}</span> units
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="type" className="text-foreground">Transaction Type</Label>
                              <Select value={adjustmentType} onValueChange={(value: any) => setAdjustmentType(value)}>
                                <SelectTrigger className="glass border-white/20 text-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass-card border-white/20">
                                  <SelectItem value="purchase">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4 text-green-500" />
                                      Purchase (Add Stock)
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="sale">
                                    <div className="flex items-center gap-2">
                                      <TrendingDown className="h-4 w-4 text-red-500" />
                                      Sale (Remove Stock)
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="adjustment">
                                    Adjustment
                                  </SelectItem>
                                  <SelectItem value="return">
                                    Return (Add Stock)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={adjustmentQuantity}
                                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                className="glass border-white/20 text-foreground placeholder:text-muted-foreground"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="reason" className="text-foreground">Reason</Label>
                            <Input
                              id="reason"
                              value={adjustmentReason}
                              onChange={(e) => setAdjustmentReason(e.target.value)}
                              placeholder="Enter reason for adjustment"
                              className="glass border-white/20 text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                          
                          <Button 
                            onClick={handleAdjustInventory}
                            disabled={adjustInventoryMutation.isPending}
                            className="bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                          >
                            {adjustInventoryMutation.isPending ? "Processing..." : "Adjust Inventory"}
                          </Button>
                          
                          {/* Transaction History */}
                          {transactions.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                                <History className="h-4 w-4" />
                                Recent Transactions
                              </h4>
                              <div className="glass-dark border border-white/10 rounded-lg max-h-48 overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-white/10">
                                      <TableHead className="text-foreground">Date</TableHead>
                                      <TableHead className="text-foreground">Type</TableHead>
                                      <TableHead className="text-foreground">Quantity</TableHead>
                                      <TableHead className="text-foreground">Reason</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {transactions.slice(0, 5).map((transaction) => (
                                      <TableRow key={transaction.id} className="border-white/10">
                                        <TableCell className="text-muted-foreground">
                                          {new Date(transaction.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant={
                                            transaction.type === "purchase" || transaction.type === "return" 
                                              ? "default" 
                                              : "secondary"
                                          } className={transaction.type === "purchase" || transaction.type === "return" ? "bg-green-500 text-white" : ""}>
                                            {transaction.type}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className={transaction.type === "purchase" || transaction.type === "return" ? "text-green-500" : "text-red-500"}>
                                          {transaction.type === "purchase" || transaction.type === "return" ? "+" : "-"}
                                          {transaction.quantity}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{transaction.reason}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Barcode Dialog */}
      <Dialog open={showBarcodeDialog} onOpenChange={setShowBarcodeDialog}>
        <DialogContent className="max-w-md glass-card border-white/20 neon-cyan bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground neon-text-cyan">{selectedBarcode?.product.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Product Barcode
            </DialogDescription>
          </DialogHeader>
          {selectedBarcode && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="bg-white p-6 rounded-lg">
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
                <p className="text-sm text-muted-foreground">SKU: {selectedBarcode.product.sku || "N/A"}</p>
                <p className="font-semibold text-foreground neon-text-cyan">₱{selectedBarcode.product.price}</p>
                <p className="text-sm text-muted-foreground">Stock: <span className="text-foreground font-semibold">{selectedBarcode.product.currentStock}</span></p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedViewProduct}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setSelectedViewProduct(null);
        }}
        onAddToCart={() => {
          toast({
            title: "Navigate to POS",
            description: "Please use the Point of Sale system to add items to cart."
          });
        }}
      />
    </div>
  );
}