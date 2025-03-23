'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  status: string;
}

interface Error {
  error: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session) {
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
          } else {
            const errorData: Error = await response.json();
            throw new Error(errorData.error || 'Failed to fetch listings');
          }
        }
        const data: Listing[] = await response.json();
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

    fetchListings();
  }, [session, router]);

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
            throw new Error('Unauthorized');
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

  if (!session) {
    return null;
  }

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Listings</CardTitle>
          <CardDescription>
            Manage your property listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => router.push('/submit')}>
              Add New Listing
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-gray-500">
              {error.error}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No listings found. Create your first listing!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>{listing.title}</TableCell>
                    <TableCell>${listing.price.toLocaleString()}/month</TableCell>
                    <TableCell>{listing.location}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
          )}
        </CardContent>
      </Card>
    </main>
  );
}