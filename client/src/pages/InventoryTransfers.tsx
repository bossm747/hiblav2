import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Package, AlertTriangle, Warehouse } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryLevel {
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  totalStock: number;
}

interface TransferHistory {
  id: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  type: string;
  referenceId: string;
  notes: string;
  createdAt: string;
  createdBy: string;
}

interface LowStockAlert {
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  totalStock: number;
}

export default function InventoryTransfers() {
  const { toast } = useToast();
  const [transferDialog, setTransferDialog] = useState(false);
  const [fromWarehouseId, setFromWarehouseId] = useState("");
  const [toWarehouseId, setToWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [stockThreshold, setStockThreshold] = useState(10);

  // Fetch inventory levels
  const { data: inventoryLevels = [], isLoading: levelsLoading } = useQuery<InventoryLevel[]>({
    queryKey: ["/api/inventory/levels"],
  });

  // Fetch transfer history
  const { data: transferHistory = [], isLoading: historyLoading } = useQuery<TransferHistory[]>({
    queryKey: ["/api/inventory/transfers"],
  });

  // Fetch low stock alerts
  const { data: lowStockAlerts = [] } = useQuery<LowStockAlert[]>({
    queryKey: ["/api/inventory/low-stock", stockThreshold],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/low-stock?threshold=${stockThreshold}`);
      if (!response.ok) throw new Error("Failed to fetch low stock alerts");
      return response.json();
    },
  });

  // Fetch warehouses
  const { data: warehouses = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/warehouses"],
  });

  // Fetch products
  const { data: products = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/products"],
  });

  const createTransferMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/inventory/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create transfer");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setTransferDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Inventory transfer completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete transfer",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFromWarehouseId("");
    setToWarehouseId("");
    setProductId("");
    setQuantity("");
    setReason("");
  };

  const handleTransfer = () => {
    if (!fromWarehouseId || !toWarehouseId || !productId || !quantity || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (fromWarehouseId === toWarehouseId) {
      toast({
        title: "Error",
        description: "Source and destination warehouses must be different",
        variant: "destructive",
      });
      return;
    }

    createTransferMutation.mutate({
      fromWarehouseId,
      toWarehouseId,
      productId,
      quantity: parseInt(quantity),
      reason,
      transferredBy: "system", // Should get from auth context
    });
  };

  const getTransferTypeBadge = (type: string) => {
    const isInbound = type.includes("in");
    return (
      <Badge variant={isInbound ? "default" : "secondary"}>
        {isInbound ? "IN" : "OUT"}
      </Badge>
    );
  };

  const groupInventoryByWarehouse = () => {
    const grouped: Record<string, InventoryLevel[]> = {};
    inventoryLevels.forEach((item) => {
      if (!grouped[item.warehouseName]) {
        grouped[item.warehouseName] = [];
      }
      grouped[item.warehouseName].push(item);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Inventory Transfers
          </h1>
          <p className="text-muted-foreground">Manage inventory movement between warehouses</p>
        </div>
        <Button onClick={() => setTransferDialog(true)}>
          <ArrowRight className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <strong>{lowStockAlerts.length} products</strong> are running low on stock (below {stockThreshold} units).
            Consider restocking these items.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="levels">
        <TabsList>
          <TabsTrigger value="levels">Current Stock Levels</TabsTrigger>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="levels">
          <div className="space-y-4">
            {Object.entries(groupInventoryByWarehouse()).map(([warehouseName, items]) => (
              <Card key={warehouseName} className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5" />
                    {warehouseName}
                  </CardTitle>
                  <CardDescription>Current inventory levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {levelsLoading ? (
                    <div className="text-center py-4">Loading inventory...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Stock Level</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={`${item.warehouseId}-${item.productId}`}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="text-right font-medium">{item.totalStock}</TableCell>
                            <TableCell>
                              {item.totalStock <= 0 ? (
                                <Badge variant="destructive">Out of Stock</Badge>
                              ) : item.totalStock <= stockThreshold ? (
                                <Badge variant="secondary">Low Stock</Badge>
                              ) : (
                                <Badge variant="default">In Stock</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>Recent inventory movements</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="text-center py-8">Loading transfer history...</div>
              ) : transferHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transfer history found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferHistory.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{transfer.productName}</TableCell>
                        <TableCell>{transfer.warehouseName}</TableCell>
                        <TableCell>{getTransferTypeBadge(transfer.type)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {transfer.type.includes("out") ? "-" : "+"}{Math.abs(transfer.quantity)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{transfer.notes}</TableCell>
                        <TableCell>{transfer.createdBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>
                Products with stock below {stockThreshold} units
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No low stock alerts. All products are adequately stocked.
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockAlerts.map((alert) => (
                    <div
                      key={`${alert.warehouseId}-${alert.productId}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{alert.productName}</div>
                        <div className="text-sm text-muted-foreground">{alert.warehouseName}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="destructive">{alert.totalStock} units</Badge>
                        <Button
                          size="sm"
                          onClick={() => {
                            setToWarehouseId(alert.warehouseId);
                            setProductId(alert.productId);
                            setTransferDialog(true);
                          }}
                        >
                          Transfer Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transfer Dialog */}
      <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Inventory Transfer</DialogTitle>
            <DialogDescription>
              Transfer products between warehouses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="from-warehouse">From Warehouse</Label>
              <Select value={fromWarehouseId} onValueChange={setFromWarehouseId}>
                <SelectTrigger id="from-warehouse">
                  <SelectValue placeholder="Select source warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="to-warehouse">To Warehouse</Label>
              <Select value={toWarehouseId} onValueChange={setToWarehouseId}>
                <SelectTrigger id="to-warehouse">
                  <SelectValue placeholder="Select destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses
                    .filter((w) => w.id !== fromWarehouseId)
                    .map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="product">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product to transfer" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity to transfer"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Transfer</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for this transfer..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={createTransferMutation.isPending}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Complete Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}