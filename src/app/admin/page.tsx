'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownRight, Users, Home, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface DashboardStats {
  currentStats: {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    totalReports: number;
    averagePrice: string;
    userGrowth: number;
    listingGrowth: number;
    userGrowthPercent: string;
    listingGrowthPercent: string;
  };
  recentActivity: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      createdAt: string;
    }>;
    listings: Array<{
      id: string;
      title: string;
      price: number;
      status: string;
      createdAt: string;
      userId: {
        name: string;
        email: string;
      };
    }>;
    reports: Array<{
      id: string;
      listingId: {
        id: string;
        title: string;
      };
      reportedBy: {
        name: string;
        email: string;
      };
      reason: string;
      createdAt: string;
    }>;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdminEmail,
          role: 'ADMIN',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add admin');
      }

      toast.success('Admin added successfully');
      setAddingAdmin(false);
      setNewAdminEmail('');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add admin');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your rental platform.
          </p>
        </div>

        <Dialog open={addingAdmin} onOpenChange={setAddingAdmin}>
          <DialogTrigger asChild>
            <Button>Add New Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleAddAdmin} className="w-full">
                Add Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStats.totalUsers}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {Number(stats?.currentStats.userGrowthPercent) > 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={Number(stats?.currentStats.userGrowthPercent) > 0 ? 'text-green-500' : 'text-red-500'}>
                {stats?.currentStats.userGrowthPercent}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStats.totalListings}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {Number(stats?.currentStats.listingGrowthPercent) > 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={Number(stats?.currentStats.listingGrowthPercent) > 0 ? 'text-green-500' : 'text-red-500'}>
                {stats?.currentStats.listingGrowthPercent}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStats.activeListings}</div>
            <p className="pt-1 text-xs text-muted-foreground">
              {((stats?.currentStats.activeListings || 0) / (stats?.currentStats.totalListings || 1) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.currentStats.averagePrice}</div>
            <p className="pt-1 text-xs text-muted-foreground">
              Per active listing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentActivity.users.map((user) => (
                <div key={user.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {user.name || user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentActivity.listings.map((listing) => (
                <div key={listing.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {listing.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${listing.price} - {listing.userId.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Flagged Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentActivity.reports.map((report) => (
                <div key={report.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {report.listingId.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reported by: {report.reportedBy.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}