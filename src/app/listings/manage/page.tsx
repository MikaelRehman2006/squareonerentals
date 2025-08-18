'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  status: string;
  featured?: boolean;
}

export default function ManageListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchListings = async () => {
      try {
        setIsLoading(true);
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch listings');
          }
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching listings:', error);
          setError(error.message);
        } else {
          console.error('Error fetching listings:', error);
          setError('Failed to fetch listings');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [router, status, session]);

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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Manage Your Listings</h1>
          </div>
          <Link href="/submit">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle>Your Listings</CardTitle>
              <CardDescription>
                Manage your properties and rental listings
              </CardDescription>
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
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <Table>
                    <TableHeader className="bg-gray-800">
                      <TableRow className="hover:bg-gray-800">
                        <TableHead className="font-medium text-white">Title</TableHead>
                        <TableHead className="font-medium text-white">Price</TableHead>
                        <TableHead className="font-medium text-white hidden md:table-cell">Location</TableHead>
                        <TableHead className="font-medium text-white hidden md:table-cell">Created</TableHead>
                        <TableHead className="font-medium text-white">Status</TableHead>
                        <TableHead className="text-right text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((listing) => (
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 