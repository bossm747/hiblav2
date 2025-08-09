import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Warehouse as WarehouseIcon,
  Building,
} from 'lucide-react';
import type { Warehouse, InsertWarehouse } from '@shared/schema';

export default function WarehouseManagementPage() {
  const { toast } = useToast();
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newWarehouse, setNewWarehouse] = useState<InsertWarehouse>({
    name: '',
    code: '',
    description: '',
    managerId: '',
    isActive: true,
  });

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  const filteredWarehouses = warehouses.filter((warehouse: Warehouse) =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createWarehouseMutation = useMutation({
    mutationFn: (data: InsertWarehouse) =>
      apiRequest('/api/warehouses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouses'] });
      toast({
        title: 'Warehouse Created',
        description: 'New warehouse has been successfully added.',
      });
      setIsWarehouseModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create warehouse. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateWarehouseMutation = useMutation({
    mutationFn: (data: Warehouse) =>
      apiRequest(`/api/warehouses/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouses'] });
      toast({
        title: 'Warehouse Updated',
        description: 'Warehouse has been successfully updated.',
      });
      setIsWarehouseModalOpen(false);
      setEditingWarehouse(null);
      resetForm();
    },
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/warehouses/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/warehouses'] });
      toast({
        title: 'Warehouse Deleted',
        description: 'Warehouse has been successfully removed.',
      });
    },
  });

  const resetForm = () => {
    setNewWarehouse({
      name: '',
      code: '',
      description: '',
      managerId: '',
      isActive: true,
    });
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    resetForm();
    setIsWarehouseModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setNewWarehouse({
      name: warehouse.name,
      code: warehouse.code,
      description: warehouse.description || '',
      managerId: warehouse.managerId || '',
      isActive: warehouse.isActive || true,
    });
    setIsWarehouseModalOpen(true);
  };

  const handleSaveWarehouse = () => {
    if (editingWarehouse) {
      updateWarehouseMutation.mutate({ ...newWarehouse, id: editingWarehouse.id, createdAt: editingWarehouse.createdAt });
    } else {
      createWarehouseMutation.mutate(newWarehouse);
    }
  };

  const stats = {
    totalWarehouses: warehouses.length,
    activeWarehouses: warehouses.filter((w: Warehouse) => w.isActive).length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations and storage facilities
          </p>
        </div>
        <Button onClick={handleAddWarehouse} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      {/* Warehouse Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Warehouses</p>
                <p className="text-2xl font-bold">{stats.totalWarehouses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <WarehouseIcon className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Warehouses</p>
                <p className="text-2xl font-bold">{stats.activeWarehouses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse List */}
      <Card className="elevated-container">
        <CardHeader>
          <CardTitle>Warehouses</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search warehouses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading warehouses...</div>
          ) : filteredWarehouses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <WarehouseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No warehouses found.</p>
              <Button onClick={handleAddWarehouse} className="mt-4">
                Add First Warehouse
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Manager ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse: Warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono text-sm">{warehouse.code}</TableCell>
                      <TableCell>
                        <div className="font-medium">{warehouse.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {warehouse.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {warehouse.managerId || 'Unassigned'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWarehouse(warehouse)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteWarehouseMutation.mutate(warehouse.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warehouse Modal */}
      <Dialog open={isWarehouseModalOpen} onOpenChange={setIsWarehouseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
            </DialogTitle>
            <DialogDescription>
              {editingWarehouse 
                ? 'Update warehouse information below.' 
                : 'Fill in the details to create a new warehouse.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warehouseCode">Warehouse Code *</Label>
                <Input
                  id="warehouseCode"
                  placeholder="e.g., NG, PH, WIP"
                  value={newWarehouse.code}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouseName">Warehouse Name *</Label>
                <Input
                  id="warehouseName"
                  placeholder="Enter warehouse name"
                  value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter warehouse description..."
                value={newWarehouse.description}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerId">Manager ID</Label>
              <Input
                id="managerId"
                placeholder="Enter manager staff ID"
                value={newWarehouse.managerId}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, managerId: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newWarehouse.isActive}
                onCheckedChange={(checked) => setNewWarehouse({ ...newWarehouse, isActive: checked })}
              />
              <Label htmlFor="isActive">Active Warehouse</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsWarehouseModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveWarehouse}
              disabled={!newWarehouse.name || !newWarehouse.code}
            >
              {editingWarehouse ? 'Update' : 'Create'} Warehouse
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}