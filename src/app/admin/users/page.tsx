'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { isOwner } from '@/lib/admin';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatPrice';

interface User {
  _id: string;
  id?: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  status: string;
  listingCount: number;
  banExpiresAt: string | null;
  restrictedUntil: string | null;
  createdAt: string;
}

interface BanDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (duration: string) => void;
}

function BanDialog({ open, onClose, onConfirm }: BanDialogProps) {
  const [duration, setDuration] = useState('24h');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Select the duration for which the user will be banned.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Ban Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => onConfirm(duration)} className="w-full">
            Confirm Ban
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        role: roleFilter,
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/users?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        const formattedUsers = (data.users || []).map((user: any) => ({
          ...user,
          _id: user._id || user.id,
          id: user.id || user._id
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!userId) {
      toast.error('Invalid user ID');
      console.error('Attempted to update role with undefined userId');
      return;
    }
    
    // Log the userId for debugging
    console.log(`Updating role for user ID: ${userId} to ${newRole}`);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }

      fetchUsers();
      toast.success(
        `User role updated to ${newRole}. User must sign out and sign back in for changes to take effect.`,
        { duration: 6000 }
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user role');
    }
  };

  const handleBanUser = async (duration: string) => {
    if (!selectedUserId) {
      toast.error('No user selected for banning');
      setShowBanDialog(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${selectedUserId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ban user');
      }

      fetchUsers();
      toast.success('User banned successfully');
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to ban user');
    } finally {
      setShowBanDialog(false);
      setSelectedUserId(null);
    }
  };

  const handleRestrictUser = async (userId: string, type: 'listing' | 'messaging') => {
    if (!userId) {
      toast.error('Invalid user ID');
      console.error('Attempted to restrict user with undefined userId');
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/restrict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to restrict user ${type}`);
      }

      fetchUsers();
      toast.success(`User ${type} restriction applied`);
    } catch (error) {
      console.error('Error restricting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to restrict user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId) {
      toast.error('Invalid user ID');
      console.error('Attempted to delete user with undefined userId');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers(users.filter(user => (user._id || user.id) !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Users</h2>
        <p className="text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            />
          </div>
        </form>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white border border-gray-700">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id || user.id} className="even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <TableCell className="px-4 py-2 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback>{user.name?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground truncate max-w-xs" title={user.name || user.email || ''}>{user.name || user.email}</span>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <span className="truncate max-w-xs" title={user.email || ''}>{user.email}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {!isOwner(user.email || '') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            updateUserRole(
                              user._id || user.id || '',
                              user.role === 'ADMIN' ? 'USER' : 'ADMIN'
                            )
                          }
                        >
                          {user.role === 'ADMIN'
                            ? 'Remove Admin Role'
                            : 'Make Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserId(user._id || user.id || '');
                            setShowBanDialog(true);
                          }}
                        >
                          Ban User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRestrictUser(user._id || user.id || '', 'listing')}
                        >
                          Restrict Listings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRestrictUser(user._id || user.id || '', 'messaging')}
                        >
                          Restrict Messaging
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user._id || user.id || '')}
                          className="text-red-600"
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <BanDialog
        open={showBanDialog}
        onClose={() => {
          setShowBanDialog(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleBanUser}
      />
    </div>
  );
}