import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PERMISSION_GROUPS, PERMISSIONS, type Permission } from '@shared/permissions';
import { Settings, UserPlus, Edit3, Shield, Users, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
  isActive: boolean;
  lastLogin: string | null;
}

export default function AccessManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  // New staff form
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    permissions: [] as Permission[]
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to load staff members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffPermissions = async (staffId: string, permissions: Permission[]) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions }),
      });

      if (response.ok) {
        await loadStaff(); // Reload staff list
        toast({
          title: 'Success',
          description: 'Staff permissions updated successfully',
        });
        setIsEditDialogOpen(false);
      } else {
        throw new Error('Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff permissions',
        variant: 'destructive',
      });
    }
  };

  const createStaff = async () => {
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });

      if (response.ok) {
        await loadStaff(); // Reload staff list
        toast({
          title: 'Success',
          description: 'Staff member created successfully',
        });
        setIsAddDialogOpen(false);
        setNewStaff({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'staff',
          permissions: []
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create staff member',
        variant: 'destructive',
      });
    }
  };

  const togglePermission = (permission: Permission, current: Permission[], onChange: (permissions: Permission[]) => void) => {
    const updated = current.includes(permission)
      ? current.filter(p => p !== permission)
      : [...current, permission];
    onChange(updated);
  };

  const togglePermissionGroup = (groupPermissions: Permission[], current: Permission[], onChange: (permissions: Permission[]) => void) => {
    const hasAll = groupPermissions.every(p => current.includes(p));
    const updated = hasAll
      ? current.filter(p => !groupPermissions.includes(p))
      : [...new Set([...current, ...groupPermissions])];
    onChange(updated);
  };

  const PermissionSelector = ({ 
    currentPermissions, 
    onChange 
  }: { 
    currentPermissions: Permission[]; 
    onChange: (permissions: Permission[]) => void;
  }) => (
    <div className="space-y-6">
      {Object.entries(PERMISSION_GROUPS).map(([groupName, groupPermissions]) => {
        const hasAll = groupPermissions.every(p => currentPermissions.includes(p));
        const hasSome = groupPermissions.some(p => currentPermissions.includes(p));

        return (
          <Card key={groupName} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{groupName}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={hasAll}
                    ref={(el) => {
                      if (el) el.indeterminate = hasSome && !hasAll;
                    }}
                    onCheckedChange={() => togglePermissionGroup(groupPermissions, currentPermissions, onChange)}
                  />
                  <Label className="text-sm font-normal">Select All</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupPermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      checked={currentPermissions.includes(permission)}
                      onCheckedChange={() => togglePermission(permission, currentPermissions, onChange)}
                    />
                    <Label className="text-sm font-normal flex-1">
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (!hasPermission(PERMISSIONS.STAFF_PERMISSIONS)) {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage staff access. Contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Access Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage staff permissions and access control
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Permissions</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select the features this staff member can access
                </p>
                <PermissionSelector
                  currentPermissions={newStaff.permissions}
                  onChange={(permissions) => setNewStaff({ ...newStaff, permissions })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createStaff}>
                  Create Staff Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading staff members...</div>
          ) : staff.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No staff members found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                      </div>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        {member.permissions.length} permissions • Last login: {member.lastLogin || 'Never'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStaff(member);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Permissions
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Permissions - {selectedStaff?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">{selectedStaff.role}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStaff.permissions.length} permissions assigned
                </span>
              </div>

              <Separator />

              <PermissionSelector
                currentPermissions={selectedStaff.permissions}
                onChange={(permissions) => 
                  setSelectedStaff({ ...selectedStaff, permissions })
                }
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateStaffPermissions(selectedStaff.id, selectedStaff.permissions)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}