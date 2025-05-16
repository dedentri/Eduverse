
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { getUsers, deleteUser, toggleUserActiveStatus, addUser, updateUser } from '@/lib/data';
import { User, Role } from "@/types";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'student' as Role,
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  const handleToggleStatus = (userId: string) => {
    toggleUserActiveStatus(userId);
    fetchUsers();
    toast({
      title: "Status updated",
      description: "User status has been updated successfully."
    });
  };

  const handleDelete = (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      deleteUser(deleteUserId);
      setDeleteUserId(null);
      fetchUsers();
      toast({
        title: "User deleted",
        description: "User has been deleted successfully."
      });
    }
  };

  const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: Role) => {
    setNewUser(prev => ({ ...prev, role }));
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addUser(newUser);
    
    setNewUser({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'student',
      isActive: true
    });
    setIsAddUserDialogOpen(false);
    
    fetchUsers();
    
    toast({
      title: "User added",
      description: "New user has been added successfully."
    });
  };

  // Edit user handlers
  const handleEditUser = (user: User) => {
    setEditingUser({...user});
    setIsEditUserDialogOpen(true);
  };

  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleEditRoleChange = (role: Role) => {
    if (editingUser) {
      setEditingUser(prev => ({ ...prev!, role }));
    }
  };

  const saveUserChanges = () => {
    if (editingUser) {
      if (!editingUser.name) {
        toast({
          title: "Validation Error",
          description: "Name is required.",
          variant: "destructive"
        });
        return;
      }

      updateUser(editingUser.id, editingUser);
      setIsEditUserDialogOpen(false);
      fetchUsers();
      
      toast({
        title: "User updated",
        description: "User has been updated successfully."
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button 
            onClick={() => setIsAddUserDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => handleToggleStatus(user.id)}
                        className="
                          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          data-[state=checked]:bg-green-500
                          data-[state=unchecked]:bg-red-500
                        "
                      />
                      <span className="ml-2">{user.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. Set their role and initial password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleAddUserChange}
                  className="col-span-3"
                  placeholder="Full Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleAddUserChange}
                  className="col-span-3"
                  placeholder="username"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleAddUserChange}
                  className="col-span-3"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleAddUserChange}
                  className="col-span-3"
                  placeholder="Set initial password"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={newUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and credentials.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingUser.name}
                    onChange={handleEditUserChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="edit-username"
                    name="username"
                    value={editingUser.username}
                    onChange={handleEditUserChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={editingUser.email || ''}
                    onChange={handleEditUserChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    onChange={handleEditUserChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select value={editingUser.role} onValueChange={handleEditRoleChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveUserChanges}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
