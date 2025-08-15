import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  FileText,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function CustomerManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/api/customers'],
  });

  const filteredCustomers = (customers as any[]).filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutation for deleting customer
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/customers/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer",
        variant: "destructive",
      });
    },
  });

  // Mutation for toggling customer status
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest(`/api/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: "Success",
        description: "Customer status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update customer status",
        variant: "destructive",
      });
    },
  });

  // Action handlers
  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    toast({
      title: "Customer Details",
      description: `Viewing ${customer.name}`,
    });
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setShowEditDialog(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    toggleStatusMutation.mutate({ id, isActive });
  };

  const handleViewOrders = (customerId: string) => {
    // Navigate to orders filtered by customer
    window.location.href = `/sales-orders?customer=${customerId}`;
  };

  const getCustomerTypeBadge = (type: string) => {
    const colors = {
      premium: 'bg-purple-100 text-purple-800 border-purple-300',
      standard: 'bg-blue-100 text-blue-800 border-blue-300',
      bulk: 'bg-green-100 text-green-800 border-green-300',
      wholesale: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Standard'}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customer Management</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer relationships and track business partnerships
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
            onInteractOutside={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
            onPointerDownOutside={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onFocusOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm 
              onSuccess={() => setShowCreateDialog(false)} 
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(customers as any[]).length}</div>
            <div className="text-xs text-green-600">Active partnerships</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Premium Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(customers as any[]).filter((c: any) => c.customerType === 'premium').length}
            </div>
            <div className="text-xs text-purple-600">High-value accounts</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              International
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(customers as any[]).filter((c: any) => c.country !== 'Philippines').length}
            </div>
            <div className="text-xs text-blue-600">Global reach</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-green-600">Current business</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search customers..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            All Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Users className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'No customers match your search' : 'No customers found'}
                      </p>
                      <Button className="mt-2" onClick={() => setShowCreateDialog(true)}>
                        Add your first customer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.customerCode}</p>
                        <p className="text-sm text-muted-foreground">{customer.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {customer.email}
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {customer.country}
                        {customer.city && `, ${customer.city}`}
                      </div>
                    </TableCell>
                    <TableCell>{getCustomerTypeBadge(customer.customerType)}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${customer.creditLimit ? parseFloat(customer.creditLimit).toLocaleString() : '0'}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.isActive)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                          title="Edit Customer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewOrders(customer.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(customer.id, !customer.isActive)}
                            >
                              {customer.isActive ? (
                                <>
                                  <Users className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}