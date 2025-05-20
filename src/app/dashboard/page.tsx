'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { connectDB } from '@/lib/mongodb';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Home,
  Flag,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { GrowthChart } from '@/components/GrowthChart';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  status: string;
}

interface MonthlyStatsItem {
  _id: {
    year: number;
    month: number;
    status?: string;
  };
  count: number;
}

interface Analytics {
  currentStats: {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    totalReports: number;
    averagePrice: number;
    userGrowth: number;
    listingGrowth: number;
    userGrowthPercent: string;
    listingGrowthPercent: string;
  },
  recentActivity?: {
    users: any[];
    listings: any[];
    reports: any[];
  },
  monthlyStats?: {
    users: MonthlyStatsItem[];
    listings: MonthlyStatsItem[];
  }
}

interface Error {
  error: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings/me', {
          credentials: 'include'
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No listings found');
          } else if (response.status === 401) {
            router.push('/auth/signin');
            return;
          } else {
            const errorData: Error = await response.json();
            throw new Error(errorData.error || 'Failed to fetch listings');
          }
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching listings:', error);
          setError({ error: error.message });
        } else {
          console.error('Error fetching listings:', error);
          setError({ error: 'Failed to fetch listings' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          // Silently fail for non-admin users
          console.log('Analytics data unavailable - requires admin access');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchListings();
    fetchAnalytics();
  }, [router, status]);

  const handleEditListing = (id: string) => {
    router.push(`/listings/${id}/edit`);
  };

  const handleDeleteListing = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await fetch(`/api/listings/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Listing not found');
          } else if (response.status === 401) {
            router.push('/auth/signin');
            return;
          } else {
            const errorData: Error = await response.json();
            throw new Error(errorData.error || 'Failed to delete listing');
          }
        }

        setListings(listings.filter(listing => listing.id !== id));
        toast.success('Listing deleted successfully');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting listing:', error);
          toast.error(error.message);
        } else {
          console.error('Error deleting listing:', error);
          toast.error('Failed to delete listing');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading your listings...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
            <CardDescription className="text-red-600">{error.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="mt-4"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Analytics Section - Only shown if user has admin access */}
      {analytics && session?.user?.role === 'admin' && (
        <div className="mb-10">
          <div className="mb-4">
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              Platform performance and growth metrics.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.currentStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.currentStats.userGrowthPercent}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.currentStats.totalListings}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.currentStats.activeListings} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Number(analytics.currentStats.averagePrice).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{analytics.currentStats.listingGrowthPercent}%
                </div>
                <p className="text-xs text-muted-foreground">
                  New listings this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Growth Chart */}
          {analytics.monthlyStats && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Growth Trends</CardTitle>
                <CardDescription>User and listing growth over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <GrowthChart 
                  usersData={analytics.monthlyStats.users} 
                  listingsData={analytics.monthlyStats.listings} 
                />
              </CardContent>
            </Card>
          )}
          
          {/* Recent Activity Section */}
          {analytics.recentActivity && (
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              {/* Recent Listings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Recent Listings</CardTitle>
                  <CardDescription>Latest properties added to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.recentActivity.listings.length > 0 ? (
                      analytics.recentActivity.listings.map((listing: any) => (
                        <div key={listing.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium truncate max-w-[200px]">{listing.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">${listing.price}</span>
                            <Link 
                              href={`/listings/${listing.id}`}
                              className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No recent listings</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">New Users</CardTitle>
                  <CardDescription>Recently joined members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.recentActivity.users.length > 0 ? (
                      analytics.recentActivity.users.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">{user.name || 'Anonymous User'}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {user.email}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No recent users</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* My Listings Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-gray-600 mt-2">Manage your rental listings</p>
        </div>
        <Button
          onClick={() => router.push('/submit')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
            <Button
              onClick={() => router.push('/submit')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>${listing.price.toLocaleString()}</TableCell>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${listing.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {listing.status === 'ACTIVE' ? 'Active' : 'Archived'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditListing(listing.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}