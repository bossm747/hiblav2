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
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  Monitor,
  Wrench,
  Package2,
  ShoppingBag,
  Folder
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CategoryForm } from '@/components/forms/CategoryForm';

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  product: Package,
  equipment: Monitor,
  asset: Package2,
  tool: Wrench,
  supply: ShoppingBag,
};

const typeColors: Record<string, string> = {
  product: 'bg-blue-100 text-blue-800',
  equipment: 'bg-purple-100 text-purple-800',
  asset: 'bg-green-100 text-green-800',
  tool: 'bg-orange-100 text-orange-800',
  supply: 'bg-pink-100 text-pink-800',
};

export function CategoriesManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => 
      apiRequest(`/api/categories/${categoryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete category. It may have associated items.',
        variant: 'destructive',
      });
    },
  });

  // Type-safe data
  const safeCategories = categories as Category[];

  // Filter categories
  const filteredCategories = safeCategories.filter(category => {
    const matchesSearch = 
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || category.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Group categories by type
  const categoriesByType = safeCategories.reduce((acc, category) => {
    if (!acc[category.type]) {
      acc[category.type] = [];
    }
    acc[category.type].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  // Calculate statistics
  const stats = {
    totalCategories: safeCategories.length,
    productCategories: categoriesByType.product?.length || 0,
    equipmentCategories: categoriesByType.equipment?.length || 0,
    assetCategories: categoriesByType.asset?.length || 0,
    toolCategories: categoriesByType.tool?.length || 0,
    supplyCategories: categoriesByType.supply?.length || 0,
    activeCategories: safeCategories.filter(c => c.isActive).length,
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowEditDialog(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteMutation.mutate(categoryId);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-muted-foreground">
            Manage categories for products, equipment, assets, tools, and supplies
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCategories}</div>
            <p className="text-xs text-muted-foreground">Hair products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <Monitor className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipmentCategories}</div>
            <p className="text-xs text-muted-foreground">Machinery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
            <Package2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assetCategories}</div>
            <p className="text-xs text-muted-foreground">Company assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.toolCategories}</div>
            <p className="text-xs text-muted-foreground">Work tools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplies</CardTitle>
            <ShoppingBag className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supplyCategories}</div>
            <p className="text-xs text-muted-foreground">Office supplies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCategories}</div>
            <p className="text-xs text-muted-foreground">In use</p>
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
                  placeholder="Search categories by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="asset">Assets</SelectItem>
                <SelectItem value="tool">Tools</SelectItem>
                <SelectItem value="supply">Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found matching your criteria
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => {
                  const Icon = typeIcons[category.type] || Folder;
                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[category.type] || 'bg-gray-100 text-gray-800'}>
                          {category.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.slug}
                      </TableCell>
                      <TableCell>
                        {category.description ? (
                          <span className="text-sm line-clamp-2">{category.description}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.displayOrder}</Badge>
                      </TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
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
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(category.id)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSuccess={() => {
              setShowCreateDialog(false);
              queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
              toast({
                title: 'Success',
                description: 'Category created successfully',
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSuccess={() => {
                setShowEditDialog(false);
                setEditingCategory(null);
                queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
                toast({
                  title: 'Success',
                  description: 'Category updated successfully',
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}