import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ROLES, ROLE_DESCRIPTIONS, ENHANCED_ROLE_PERMISSIONS, PERMISSION_GROUPS } from '@shared/permissions';
import { 
  Users, 
  Shield, 
  Settings, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
  Building,
  Phone,
  Mail
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AccessManagement() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staff data
  const { data: staffData, isLoading } = useQuery({
    queryKey: ['/api/staff'],
    retry: false,
  });

  const staff: Staff[] = staffData || [];

  // Filter staff based on role and department
  const filteredStaff = staff.filter(member => {
    const roleMatch = filterRole === 'all' || member.role === filterRole;
    const deptMatch = filterDepartment === 'all' || member.department === filterDepartment;
    return roleMatch && deptMatch;
  });

  // Get unique departments
  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: async (data: Partial<Staff>) => {
      return apiRequest('/api/staff', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create staff member',
        variant: 'destructive',
      });
    },
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Staff> }) => {
      return apiRequest(`/api/staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedStaff(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
    },
  });

  // Toggle staff status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest(`/api/staff/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({
        title: 'Success',
        description: 'Staff status updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update staff status',
        variant: 'destructive',
      });
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'production_manager':
      case 'sales_manager': 
      case 'inventory_manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'supervisor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sales_staff':
      case 'production_staff':
      case 'inventory_staff':
      case 'customer_service':
      case 'accountant': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Access Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Access Management</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <StaffForm 
              onSubmit={(data) => createStaffMutation.mutate(data)}
              isLoading={createStaffMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-green-600">
                  {staff.filter(s => s.isActive).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-red-600">
                  {staff.filter(s => s.role === 'admin').length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.values(ROLES).map(role => (
                    <SelectItem key={role} value={role}>
                      {formatRoleName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-48">
              <Label htmlFor="dept-filter">Filter by Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Staff Members ({filteredStaff.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{member.name}</h3>
                        {member.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.department && (
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{member.department}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {formatRoleName(member.role)}
                    </Badge>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStaff(member)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate({
                          id: member.id,
                          isActive: !member.isActive
                        })}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {member.isActive ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  {member.permissions.length} permissions granted
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Details Dialog */}
      {selectedStaff && !isEditDialogOpen && (
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Staff Details - {selectedStaff.name}</DialogTitle>
            </DialogHeader>
            <StaffDetails staff={selectedStaff} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Staff Dialog */}
      {selectedStaff && isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedStaff(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Staff Member - {selectedStaff.name}</DialogTitle>
            </DialogHeader>
            <StaffForm 
              staff={selectedStaff}
              onSubmit={(data) => updateStaffMutation.mutate({ 
                id: selectedStaff.id, 
                data 
              })}
              isLoading={updateStaffMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Staff Form Component
function StaffForm({ 
  staff, 
  onSubmit, 
  isLoading 
}: { 
  staff?: Staff; 
  onSubmit: (data: Partial<Staff>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    role: staff?.role || '',
    department: staff?.department || '',
    isActive: staff?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissions = ENHANCED_ROLE_PERMISSIONS[formData.role as keyof typeof ENHANCED_ROLE_PERMISSIONS] || [];
    onSubmit({
      ...formData,
      permissions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_DESCRIPTIONS).map(([role, description]) => (
              <SelectItem key={role} value={role}>
                <div>
                  <div className="font-medium">{role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <Label htmlFor="isActive">Active User</Label>
        </div>
        
        <Button type="submit" disabled={isLoading || !formData.name || !formData.email || !formData.role}>
          {isLoading ? 'Saving...' : staff ? 'Update Staff' : 'Create Staff'}
        </Button>
      </div>
    </form>
  );
}

// Staff Details Component
function StaffDetails({ staff }: { staff: Staff }) {
  const permissions = staff.permissions;
  const rolePermissions = ENHANCED_ROLE_PERMISSIONS[staff.role as keyof typeof ENHANCED_ROLE_PERMISSIONS] || [];
  
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm">{staff.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm">{staff.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <p className="text-sm">{staff.phone || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Department</Label>
              <p className="text-sm">{staff.department || 'Not assigned'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center space-x-2">
                {staff.isActive ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <Badge className="block w-fit mt-1">
                {staff.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-gray-600">
                {ROLE_DESCRIPTIONS[staff.role as keyof typeof ROLE_DESCRIPTIONS] || 'No description available'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Total Permissions</Label>
              <p className="text-sm">{permissions.length} permissions granted</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permissions Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(PERMISSION_GROUPS).map(([groupName, groupPermissions]) => {
              const userGroupPermissions = groupPermissions.filter(p => permissions.includes(p));
              const hasAnyPermission = userGroupPermissions.length > 0;
              
              return (
                <div key={groupName} className={`p-3 rounded-lg border ${hasAnyPermission ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{groupName}</h4>
                    <Badge variant={hasAnyPermission ? 'default' : 'secondary'}>
                      {userGroupPermissions.length}/{groupPermissions.length}
                    </Badge>
                  </div>
                  {hasAnyPermission && (
                    <div className="text-xs text-gray-600 space-y-1">
                      {userGroupPermissions.map(permission => (
                        <div key={permission} className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{permission.replace(/_/g, ' ').toLowerCase()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}