'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Home,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Building,
  Heart,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  status: string;
  featured?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch listings
        const listingsResponse = await fetch('/api/listings/me', {
          credentials: 'include'
        });
        
        if (!listingsResponse.ok) {
          if (listingsResponse.status === 404) {
            // If no listings, just set empty array
            setListings([]);
          } else if (listingsResponse.status === 401) {
            router.push('/auth/signin');
            return;
          } else {
            const errorData = await listingsResponse.json();
            throw new Error(errorData.error || 'Failed to fetch listings');
          }
        } else {
          const listingsData = await listingsResponse.json();
          setListings(listingsData);
        }

        // Fetch membership details
        try {
          const membershipResponse = await fetch('/api/user/membership');
          if (membershipResponse.ok) {
            const membershipData = await membershipResponse.json();
            setMembership(membershipData.membership);
          }
        } catch (membershipError) {
          console.error('Error fetching membership:', membershipError);
          // Don't throw error, continue with null membership
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching data:', error);
          setError(error.message);
        } else {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, status]);

  const handleEditListing = (id: string) => {
    router.push(`/listings/${id}/edit`);
  };

  const handleViewListing = (id: string) => {
    router.push(`/listings/${id}`);
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
            const errorData = await response.json();
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      case 'FEATURED':
        return 'bg-purple-100 text-purple-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading your listings...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your property listings, subscription, saved properties, and update your preferences. Use your dashboard to:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 text-sm">
            <li>Manage and create property listings</li>
            <li>View and manage your subscription</li>
            <li>Access and edit your saved properties</li>
            <li>Edit your onboarding survey and preferences</li>
          </ul>
        </div>

        {/* Quick Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Current plan</p>
                  <p className="font-medium">
                    {membership?.type ? 
                      `${membership.type.charAt(0) + membership.type.slice(1).toLowerCase()} Plan` : 
                      'No active plan'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/dashboard/subscription')}
              >
                Manage Subscription
              </Button>
            </CardFooter>
          </Card>

          {/* Listings Stats */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Listings</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-indigo-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Active listings</p>
                  <p className="font-medium">{listings.filter(l => l.status === 'ACTIVE').length} listings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/listings/manage')}
              >
                Manage Listings
              </Button>
            </CardFooter>
          </Card>

          {/* Favorites */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Favorites</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Saved properties</p>
                  <p className="font-medium">View your saved listings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/favorites')}
              >
                View Favorites
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content - Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border border-gray-200 mb-8">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Listings</CardTitle>
                  <CardDescription>
                    Manage your properties and rental listings
                  </CardDescription>
                </div>
                <Link href="/submit">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Link href="/submit">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Your First Listing
                    </Button>
                  </Link>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Home className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-600 max-w-sm mx-auto mb-6">
                    You haven't created any property listings yet. Create your first listing to get started.
                  </p>
                  <Link href="/submit">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Your First Listing
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-gray-50">
                          <TableHead className="font-medium">Title</TableHead>
                          <TableHead className="font-medium">Price</TableHead>
                          <TableHead className="font-medium hidden md:table-cell">Location</TableHead>
                          <TableHead className="font-medium hidden md:table-cell">Created</TableHead>
                          <TableHead className="font-medium">Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings.slice(0, 5).map((listing) => (
                          <TableRow key={listing.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {listing.title}
                                {listing.featured && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-md">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>${listing.price.toLocaleString()}</TableCell>
                            <TableCell className="hidden md:table-cell">{listing.location}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(listing.createdAt)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                                {listing.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewListing(listing.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditListing(listing.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteListing(listing.id)}
                                    className="text-red-600 hover:text-red-700 focus:text-red-700"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {listings.length > 5 && (
                    <div className="flex justify-center mt-4">
                      <Link href="/listings/manage">
                        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          View All Listings
                          <Eye className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="pt-0 border-t flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Building className="h-4 w-4 mr-1" />
                {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
              </div>
              <Link href="/listings/manage">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Go to Listing Management
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Create New Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Add a new property to your portfolio and start receiving inquiries.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/submit" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Manage Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  View and manage all your property listings in one place.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/listings/manage" className="w-full">
                  <Button variant="outline" className="w-full">
                    Go to Management
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Edit Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Update your onboarding survey and preferences at any time.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.dispatchEvent(new CustomEvent('openSurvey'))}>
                  Edit Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}