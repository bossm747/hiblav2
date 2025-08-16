import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Monitor,
  Printer,
  Laptop,
  Wrench,
  Package2,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Calendar,
  Tag,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AssetForm } from '@/components/forms/AssetForm';

interface Asset {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: { name: string; type: string };
  assetType: string;
  assetTag?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: string;
  purchasePrice?: string;
  currentValue?: string;
  condition: string;
  ngWarehouse: number;
  phWarehouse: number;
  reservedWarehouse: number;
  redWarehouse: number;
  adminWarehouse: number;
  wipWarehouse: number;
  assignedTo?: string;
  assignedToStaff?: { name: string };
  assignedDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  warrantyExpiry?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const assetTypeIcons: Record<string, React.ElementType> = {
  equipment: Monitor,
  tool: Wrench,
  furniture: Package2,
  vehicle: Package2,
  computer: Laptop,
  printer: Printer,
};

const conditionColors: Record<string, string> = {
  new: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-orange-100 text-orange-800',
  broken: 'bg-red-100 text-red-800',
};

export function AssetsManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const { toast } = useToast();

  // Fetch assets
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['/api/assets'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['/api/staff'],
  });

  const { data: warehouses = [] } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (assetId: string) => 
      apiRequest(`/api/assets/${assetId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive',
      });
    },
  });

  // Type-safe data
  const safeAssets = assets as Asset[];
  const assetCategories = categories.filter((cat: any) => 
    ['equipment', 'asset', 'tool', 'supply'].includes(cat.type)
  );

  // Filter assets
  const filteredAssets = safeAssets.filter(asset => {
    const matchesSearch = 
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || asset.assetType === filterType;
    const matchesCondition = filterCondition === 'all' || asset.condition === filterCondition;
    
    return matchesSearch && matchesType && matchesCondition;
  });

  // Calculate statistics
  const stats = {
    totalAssets: safeAssets.length,
    activeAssets: safeAssets.filter(a => a.isActive).length,
    assignedAssets: safeAssets.filter(a => a.assignedTo).length,
    maintenanceDue: safeAssets.filter(a => {
      if (!a.nextMaintenanceDate) return false;
      return new Date(a.nextMaintenanceDate) <= new Date();
    }).length,
    totalValue: safeAssets.reduce((sum, a) => 
      sum + parseFloat(a.currentValue || '0'), 0
    ),
  };

  // Get total quantity across all warehouses
  const getTotalQuantity = (asset: Asset) => {
    return (asset.ngWarehouse || 0) + 
           (asset.phWarehouse || 0) + 
           (asset.reservedWarehouse || 0) + 
           (asset.redWarehouse || 0) + 
           (asset.adminWarehouse || 0) + 
           (asset.wipWarehouse || 0);
  };

  // Get primary location
  const getPrimaryLocation = (asset: Asset) => {
    const locations = [
      { name: 'NG', count: asset.ngWarehouse || 0 },
      { name: 'PH', count: asset.phWarehouse || 0 },
      { name: 'Reserved', count: asset.reservedWarehouse || 0 },
      { name: 'Red', count: asset.redWarehouse || 0 },
      { name: 'Admin', count: asset.adminWarehouse || 0 },
      { name: 'WIP', count: asset.wipWarehouse || 0 },
    ];
    
    const primary = locations.reduce((max, loc) => 
      loc.count > max.count ? loc : max, locations[0]
    );
    
    return primary.count > 0 ? primary.name : 'Unassigned';
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowEditDialog(true);
  };

  const handleDelete = async (assetId: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteMutation.mutate(assetId);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets Management</h1>
          <p className="text-muted-foreground">
            Track and manage company equipment, tools, and assets
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await fetch('/api/export/assets?format=xlsx', {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                  }
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `assets_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                toast({
                  title: 'Export successful',
                  description: 'Assets data has been exported'
                });
              } catch (error) {
                toast({
                  title: 'Export failed',
                  description: 'Failed to export assets',
                  variant: 'destructive'
                });
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              All tracked items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAssets}</div>
            <p className="text-xs text-muted-foreground">
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedAssets}</div>
            <p className="text-xs text-muted-foreground">
              Assigned to staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.maintenanceDue}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Current valuation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, tag, serial number, or manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="tool">Tools</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="vehicle">Vehicles</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="broken">Broken</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading assets...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assets found matching your criteria
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Tag</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => {
                  const Icon = assetTypeIcons[asset.assetType] || Package2;
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {asset.assetTag || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            {asset.manufacturer && (
                              <div className="text-xs text-muted-foreground">
                                {asset.manufacturer} {asset.model}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {asset.assetType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={conditionColors[asset.condition]}>
                          {asset.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {getPrimaryLocation(asset)}
                          {getTotalQuantity(asset) > 1 && (
                            <Badge variant="secondary">
                              {getTotalQuantity(asset)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {asset.assignedToStaff ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {asset.assignedToStaff.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        ${parseFloat(asset.currentValue || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {asset.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                        {asset.nextMaintenanceDate && new Date(asset.nextMaintenanceDate) <= new Date() && (
                          <Badge className="bg-orange-100 text-orange-800 ml-2">
                            <Clock className="h-3 w-3 mr-1" />
                            Maintenance
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(asset)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(asset.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <AssetForm
            categories={assetCategories}
            staff={staff}
            warehouses={warehouses}
            onSuccess={() => {
              setShowCreateDialog(false);
              queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
              toast({
                title: 'Success',
                description: 'Asset created successfully',
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <AssetForm
              asset={editingAsset}
              categories={assetCategories}
              staff={staff}
              warehouses={warehouses}
              onSuccess={() => {
                setShowEditDialog(false);
                setEditingAsset(null);
                queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
                toast({
                  title: 'Success',
                  description: 'Asset updated successfully',
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}