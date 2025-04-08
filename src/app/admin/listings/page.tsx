'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { MoreHorizontal, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [dateFilter, setDateFilter] = useState('all');
  const [userFilter, setUserFilter] = useState(searchParams.get('userId') || '');

  useEffect(() => {
    fetchListings();
  }, [statusFilter, dateFilter, userFilter]);

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        dateRange: dateFilter,
        userId: userFilter,
        search: searchQuery,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      });

      const response = await fetch(`/api/admin/listings?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchListings();
        toast.success(`Listing ${newStatus.toLowerCase()} successfully`);
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setListings(listings.filter(listing => listing.id !== listingId));
        toast.success('Listing deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Listings</h2>
        <p className="text-muted-foreground">
          Manage property listings across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </form>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-4">
          <Label>Price Range</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceRangeChange}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings && listings.length > 0 ? (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-primary hover:underline"
                    >
                      {listing.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users?search=${listing.user.email}`}
                      className="text-foreground hover:underline"
                    >
                      {listing.user.name || listing.user.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === 'ACTIVE'
                          ? 'outline'
                          : listing.status === 'FLAGGED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${listing.price}</TableCell>
                  <TableCell>
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {listing.status !== 'ACTIVE' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(listing.id, 'ACTIVE')}
                          >
                            Activate
                          </DropdownMenuItem>
                        )}
                        {listing.status !== 'ARCHIVED' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(listing.id, 'ARCHIVED')}
                          >
                            Archive
                          </DropdownMenuItem>
                        )}
                        {listing.status !== 'FLAGGED' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(listing.id, 'FLAGGED')}
                          >
                            Flag as Suspicious
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-foreground">
                  No listings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}