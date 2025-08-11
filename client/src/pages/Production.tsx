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
import { Factory, Package, AlertCircle, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductionReceipt {
  id: string;
  receiptNumber: string;
  jobOrderId: string;
  productId: string;
  productName?: string;
  quantity: number;
  warehouseId: string;
  warehouseName?: string;
  quality: string;
  notes?: string;
  producedBy: string;
  status: string;
  productionDate: string;
}

interface ProductionMetrics {
  totalProduced: number;
  todayProduced: number;
  totalQuantity: number;
  todayQuantity: number;
  qualityBreakdown: Array<{ quality: string; count: number }>;
}

interface JobOrderItem {
  id: string;
  jobOrderId: string;
  productId: string;
  productName: string;
  quantity: number;
  producedQuantity?: number;
  status: string;
}

export default function Production() {
  const { toast } = useToast();
  const [productionDialog, setProductionDialog] = useState(false);
  const [selectedJobOrderItem, setSelectedJobOrderItem] = useState<JobOrderItem | null>(null);
  const [productionQuantity, setProductionQuantity] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quality, setQuality] = useState("standard");
  const [notes, setNotes] = useState("");

  // Fetch production metrics
  const { data: metrics } = useQuery<ProductionMetrics>({
    queryKey: ["/api/production/metrics"],
  });

  // Fetch production receipts
  const { data: receipts = [], isLoading } = useQuery<ProductionReceipt[]>({
    queryKey: ["/api/production/receipts"],
  });

  // Fetch warehouses for dropdown
  const { data: warehouses = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/warehouses"],
  });

  // Fetch active job orders
  const { data: jobOrders = [] } = useQuery<any[]>({
    queryKey: ["/api/job-orders", { status: "in-progress" }],
    queryFn: async () => {
      const response = await fetch("/api/job-orders?status=in-progress");
      if (!response.ok) throw new Error("Failed to fetch job orders");
      return response.json();
    },
  });

  const createProductionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/production/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create production receipt");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
      setProductionDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Production receipt created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create production receipt",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedJobOrderItem(null);
    setProductionQuantity("");
    setWarehouseId("");
    setQuality("standard");
    setNotes("");
  };

  const handleProduction = () => {
    if (!selectedJobOrderItem || !productionQuantity || !warehouseId) return;

    createProductionMutation.mutate({
      jobOrderId: selectedJobOrderItem.jobOrderId,
      productId: selectedJobOrderItem.productId,
      quantity: parseInt(productionQuantity),
      warehouseId,
      quality,
      notes,
      producedBy: "system", // Should get from auth context
    });
  };

  const getQualityBadge = (quality: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      premium: "default",
      standard: "secondary",
      defective: "destructive",
    };
    return <Badge variant={variants[quality] || "secondary"}>{quality}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Production Management
          </h1>
          <p className="text-muted-foreground">Track and manage manufacturing production</p>
        </div>
        <Button onClick={() => setProductionDialog(true)}>
          <Factory className="h-4 w-4 mr-2" />
          Record Production
        </Button>
      </div>

      {/* Production Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produced</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalProduced || 0}</div>
            <p className="text-xs text-muted-foreground">All time production receipts</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.todayProduced || 0}</div>
            <p className="text-xs text-muted-foreground">Receipts created today</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalQuantity || 0}</div>
            <p className="text-xs text-muted-foreground">Total units produced</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Quantity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.todayQuantity || 0}</div>
            <p className="text-xs text-muted-foreground">Units produced today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receipts">
        <TabsList>
          <TabsTrigger value="receipts">Production Receipts</TabsTrigger>
          <TabsTrigger value="joborders">Active Job Orders</TabsTrigger>
          <TabsTrigger value="quality">Quality Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Production Receipts</CardTitle>
              <CardDescription>All completed production records</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading production receipts...</div>
              ) : receipts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No production receipts found. Start recording production.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Produced By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-mono">{receipt.receiptNumber}</TableCell>
                        <TableCell>{receipt.productName || "Unknown"}</TableCell>
                        <TableCell className="font-medium">{receipt.quantity}</TableCell>
                        <TableCell>{receipt.warehouseName || "Unknown"}</TableCell>
                        <TableCell>{getQualityBadge(receipt.quality)}</TableCell>
                        <TableCell>{new Date(receipt.productionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{receipt.producedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="joborders">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Active Job Orders</CardTitle>
              <CardDescription>Job orders currently in production</CardDescription>
            </CardHeader>
            <CardContent>
              {jobOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active job orders found.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{order.jobOrderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.customerCode}
                          </p>
                        </div>
                        <Badge>{order.productionStatus}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Quality Analysis</CardTitle>
              <CardDescription>Production quality breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.qualityBreakdown && metrics.qualityBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {metrics.qualityBreakdown.map((item) => (
                    <div key={item.quality} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getQualityBadge(item.quality)}
                        <span className="capitalize">{item.quality}</span>
                      </div>
                      <div className="text-2xl font-bold">{item.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No quality data available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Production Dialog */}
      <Dialog open={productionDialog} onOpenChange={setProductionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Production</DialogTitle>
            <DialogDescription>
              Record completed production for a job order item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantity Produced</Label>
              <Input
                id="quantity"
                type="number"
                value={productionQuantity}
                onChange={(e) => setProductionQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={warehouseId} onValueChange={setWarehouseId}>
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Select warehouse" />
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
              <Label htmlFor="quality">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger id="quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="defective">Defective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional production notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleProduction} disabled={createProductionMutation.isPending}>
              Record Production
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}