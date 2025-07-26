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
import { Package, AlertTriangle, TrendingUp, TrendingDown, History } from "lucide-react";
import type { Product, InventoryTransaction } from "@shared/schema";

export default function InventoryPage() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"purchase" | "sale" | "adjustment" | "return">("purchase");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

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
    return <div className="flex items-center justify-center h-full">Loading inventory...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor stock levels and manage inventory</p>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="mb-6 border-gray-300 bg-gray-100">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-gray-700">
              {lowStockProducts.length} products are running low on stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                  </div>
                  <Badge variant="destructive">
                    {product.currentStock} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Click on a product to view details and adjust stock</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Low Stock Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku || "N/A"}</TableCell>
                  <TableCell>{product.hairType}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>{product.lowStockThreshold}</TableCell>
                  <TableCell>
                    {product.currentStock === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : product.currentStock <= product.lowStockThreshold ? (
                      <Badge variant="secondary">Low Stock</Badge>
                    ) : (
                      <Badge variant="default">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Adjust Inventory: {product.name}</DialogTitle>
                          <DialogDescription>
                            Current Stock: {product.currentStock} units
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="type">Transaction Type</Label>
                              <Select value={adjustmentType} onValueChange={(value: any) => setAdjustmentType(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="purchase">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4 text-black" />
                                      Purchase (Add Stock)
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="sale">
                                    <div className="flex items-center gap-2">
                                      <TrendingDown className="h-4 w-4 text-gray-600" />
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
                              <Label htmlFor="quantity">Quantity</Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={adjustmentQuantity}
                                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                                placeholder="Enter quantity"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="reason">Reason</Label>
                            <Input
                              id="reason"
                              value={adjustmentReason}
                              onChange={(e) => setAdjustmentReason(e.target.value)}
                              placeholder="Enter reason for adjustment"
                            />
                          </div>
                          
                          <Button 
                            onClick={handleAdjustInventory}
                            disabled={adjustInventoryMutation.isPending}
                          >
                            {adjustInventoryMutation.isPending ? "Processing..." : "Adjust Inventory"}
                          </Button>
                          
                          {/* Transaction History */}
                          {transactions.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Recent Transactions
                              </h4>
                              <div className="border rounded-lg max-h-48 overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead>Reason</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {transactions.slice(0, 5).map((transaction) => (
                                      <TableRow key={transaction.id}>
                                        <TableCell>
                                          {new Date(transaction.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant={
                                            transaction.type === "purchase" || transaction.type === "return" 
                                              ? "default" 
                                              : "secondary"
                                          }>
                                            {transaction.type}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {transaction.type === "purchase" || transaction.type === "return" ? "+" : "-"}
                                          {transaction.quantity}
                                        </TableCell>
                                        <TableCell>{transaction.reason}</TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}