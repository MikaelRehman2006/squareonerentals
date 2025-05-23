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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { MoreHorizontal, Search, CalendarIcon, Filter } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';

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

  // Make sure we fetch listings on initial load
  useEffect(() => {
    fetchListings();
  }, []);
  
  // Update listings whenever any filter changes
  useEffect(() => {
    fetchListings();
  }, [statusFilter, dateFilter, userFilter, searchQuery, priceRange]);

  // Handle immediate search (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchListings();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        dateRange: dateFilter,
        userId: userFilter,
        search: searchQuery,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      });

      console.log('Fetching admin listings with query:', queryParams.toString());

      const response = await fetch(`/api/admin/listings?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        console.log(`Admin listings fetched successfully: ${data.listings?.length || 0} listings found`);
        setListings(data.listings || []);
      } else {
        console.error('Error fetching admin listings:', data.error);
        toast.error(`Failed to fetch listings: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching admin listings:', error);
      toast.error(`Failed to fetch listings: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Listings</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage property listings across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="text-gray-800 dark:text-white font-semibold text-sm md:hidden mb-2">Filters</div>
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </form>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-gray-400
                  ${statusFilter === 'active' ? 'bg-green-500' : ''}
                  ${statusFilter === 'archived' ? 'bg-gray-500' : ''}
                  ${statusFilter === 'flagged' ? 'bg-red-500' : ''}
                "></div>
                <SelectValue placeholder="Filter by status" className="text-gray-800 dark:text-gray-100" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
              <SelectItem value="all">All Listings</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <SelectValue placeholder="Filter by date" className="text-gray-800 dark:text-gray-100" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-5 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          <Label className="text-gray-800 dark:text-white font-medium text-sm">Price Range</Label>
          <div className="pt-3">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceRangeChange}
              className="my-5"
            />
            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow className="border-b border-gray-200 dark:border-gray-600">
              <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Title</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">User</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Status</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Price</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Posted</TableHead>
              <TableHead className="py-3 px-4 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings && listings.length > 0 ? (
              listings.map((listing, index) => (
                <TableRow 
                  key={listing.id} 
                  className={`
                    border-b border-gray-200 dark:border-gray-700 
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors 
                    ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                  `}
                >
                  <TableCell className="py-4 px-4 text-sm font-medium">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline"
                    >
                      <span className="truncate max-w-xs" title={listing.title}>{listing.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                    <Link
                      href={`/admin/users?search=${listing.user.email}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline"
                    >
                      <span className="truncate max-w-xs" title={listing.user.name || listing.user.email}>{listing.user.name || listing.user.email}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm">
                    <Badge
                      className={`
                        rounded-full px-2.5 py-1 text-xs font-medium 
                        ${listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}
                        ${listing.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                        ${listing.status === 'FLAGGED' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ''}
                      `}
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">{formatPrice(listing.price)}</TableCell>
                  <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                        <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">Actions</DropdownMenuLabel>
                        {listing.status !== 'ACTIVE' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(listing.id, 'ACTIVE')}
                            className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Activate
                          </DropdownMenuItem>
                        )}
                        {listing.status !== 'ARCHIVED' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(listing.id, 'ARCHIVED')}
                            className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer"
                          >
                            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                            Archive
                          </DropdownMenuItem>
                        )}
                        {listing.status !== 'FLAGGED' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(listing.id, 'FLAGGED')}
                            className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer"
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Flag as Suspicious
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
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