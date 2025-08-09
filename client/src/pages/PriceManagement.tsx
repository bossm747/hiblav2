import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PriceList {
  id: string;
  name: string;
  code: string;
  description: string;
  priceMultiplier: string;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PriceListForm {
  name: string;
  code: string;
  description: string;
  priceMultiplier: string;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
}

export default function PriceManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState<PriceList | null>(null);
  const [formData, setFormData] = useState<PriceListForm>({
    name: "",
    code: "",
    description: "",
    priceMultiplier: "1.0000",
    isDefault: false,
    isActive: true,
    displayOrder: 1
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch price lists
  const { data: priceLists = [], isLoading } = useQuery({
    queryKey: ["/api/price-lists"],
    queryFn: () => fetch("/api/price-lists").then(res => res.json())
  });

  // Create price list mutation
  const createMutation = useMutation({
    mutationFn: (data: PriceListForm) => apiRequest("/api/price-lists", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-lists"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Price list created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create price list",
        variant: "destructive"
      });
    }
  });

  // Update price list mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PriceListForm> }) => 
      apiRequest(`/api/price-lists/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-lists"] });
      setIsDialogOpen(false);
      setEditingPriceList(null);
      resetForm();
      toast({
        title: "Success",
        description: "Price list updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update price list",
        variant: "destructive"
      });
    }
  });

  // Delete price list mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/price-lists/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-lists"] });
      toast({
        title: "Success",
        description: "Price list deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete price list",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      priceMultiplier: "1.0000",
      isDefault: false,
      isActive: true,
      displayOrder: 1
    });
  };

  const handleCreate = () => {
    setEditingPriceList(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (priceList: PriceList) => {
    setEditingPriceList(priceList);
    setFormData({
      name: priceList.name,
      code: priceList.code,
      description: priceList.description,
      priceMultiplier: priceList.priceMultiplier,
      isDefault: priceList.isDefault,
      isActive: priceList.isActive,
      displayOrder: priceList.displayOrder
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPriceList) {
      updateMutation.mutate({
        id: editingPriceList.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatMultiplier = (multiplier: string) => {
    const value = parseFloat(multiplier);
    if (value > 1) {
      return `+${((value - 1) * 100).toFixed(1)}%`;
    } else if (value < 1) {
      return `-${((1 - value) * 100).toFixed(1)}%`;
    }
    return "0%";
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Price Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage pricing tiers and customer price categories
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Price List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Price Lists
            </CardTitle>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {priceLists.length}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Lists
            </CardTitle>
            <div className="text-2xl font-bold text-green-600">
              {priceLists.filter((pl: PriceList) => pl.isActive).length}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Default List
            </CardTitle>
            <div className="text-sm font-medium text-blue-600">
              {priceLists.find((pl: PriceList) => pl.isDefault)?.name || "None"}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Price Range
            </CardTitle>
            <div className="text-sm font-medium text-purple-600">
              {priceLists.length > 0 ? (
                `${formatMultiplier(Math.min(...priceLists.map((pl: PriceList) => parseFloat(pl.priceMultiplier))).toString())} to ${formatMultiplier(Math.max(...priceLists.map((pl: PriceList) => parseFloat(pl.priceMultiplier))).toString())}`
              ) : "N/A"}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Price Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Lists</CardTitle>
          <CardDescription>
            Manage all pricing tiers and their multipliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>Adjustment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceLists.map((priceList: PriceList) => (
                <TableRow key={priceList.id}>
                  <TableCell className="font-medium">{priceList.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                      {priceList.code}
                    </span>
                  </TableCell>
                  <TableCell>{priceList.priceMultiplier}x</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm ${
                      parseFloat(priceList.priceMultiplier) > 1 
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : parseFloat(priceList.priceMultiplier) < 1
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {formatMultiplier(priceList.priceMultiplier)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm ${
                      priceList.isActive 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {priceList.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {priceList.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-sm">
                        Default
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{priceList.displayOrder}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(priceList)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(priceList.id, priceList.name)}
                        disabled={priceList.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPriceList ? "Edit Price List" : "Create New Price List"}
            </DialogTitle>
            <DialogDescription>
              {editingPriceList 
                ? "Update the price list details and multiplier."
                : "Create a new pricing tier for customer categories."
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., VIP Customer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., VIP"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this pricing tier..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceMultiplier">Price Multiplier</Label>
                <Input
                  id="priceMultiplier"
                  type="number"
                  step="0.0001"
                  min="0.1"
                  max="10"
                  value={formData.priceMultiplier}
                  onChange={(e) => setFormData({ ...formData, priceMultiplier: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {parseFloat(formData.priceMultiplier) > 1 
                    ? `+${((parseFloat(formData.priceMultiplier) - 1) * 100).toFixed(1)}% markup`
                    : parseFloat(formData.priceMultiplier) < 1
                    ? `-${((1 - parseFloat(formData.priceMultiplier)) * 100).toFixed(1)}% discount`
                    : "Standard pricing"
                  }
                </p>
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Default</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingPriceList ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}