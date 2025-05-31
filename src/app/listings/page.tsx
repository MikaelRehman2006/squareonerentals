'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/types/listing';
import { ListingCard } from '@/components/ListingCard';
import { ListingFilters } from '@/components/ListingFilters';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { BackgroundPattern } from '@/components/BackgroundPattern';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface FilterState {
  priceRange: {
    min: number | '';
    max: number | '';
  };
  bedrooms: number | '';
  bathrooms: number | '';
  propertyType: string | '';
  amenities: string[];
  features: string[];
  utilities: string[];
  sortBy: 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc';
}

const PROPERTY_TYPES = ['APARTMENT', 'CONDO', 'HOUSE', 'TOWNHOUSE'];
const AMENITIES = [
  'Parking',
  'Pet-friendly',
  'WiFi Available',
  'On-site Laundry',
  'Furnished',
  'Air Conditioning',
  'Gym',
  'Pool',
  'Security',
  'Balcony',
  'Elevator'
];

const FEATURES = [
  'WiFi Included',
  'Air Conditioning',
  'In-unit Laundry',
  'Heating',
  'Furnished',
  'Smart Home Features',
  'Walk-in Closet'
];

const UTILITIES = [
  'Electricity',
  'Gas',
  'Water',
  'Internet',
  'Trash Collection'
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch listings
  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/listings?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Extract listings array from the response
        const listingsArray = data.listings || [];
        
        // Sort to put featured listings first
        const sortedListings = [...listingsArray].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });

        setListings(sortedListings);
        setFilteredListings(sortedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load listings');
        setListings([]);
        setFilteredListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  // Apply sorting
  const handleSortChange = (value: string) => {
    setSortBy(value as 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc');
    let sortedListings = [...filteredListings];

    switch (value) {
      case 'price-asc':
        sortedListings.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedListings.sort((a, b) => b.price - a.price);
        break;
      case 'date-desc':
        sortedListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-asc':
        sortedListings.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        // Keep featured listings first by default
        sortedListings.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    setFilteredListings(sortedListings);
  };

  const handleFilterChange = (filters: FilterState) => {
    if (!Array.isArray(listings)) {
      console.error('listings is not an array:', listings);
      return;
    }

    let filtered = [...listings];

    // Apply filters
    if (filters.priceRange.min !== '') {
      filtered = filtered.filter(listing => listing.price >= Number(filters.priceRange.min));
    }
    if (filters.priceRange.max !== '') {
      filtered = filtered.filter(listing => listing.price <= Number(filters.priceRange.max));
    }
    if (filters.bedrooms !== '') {
      filtered = filtered.filter(listing => listing.bedrooms >= Number(filters.bedrooms));
    }
    if (filters.bathrooms !== '') {
      filtered = filtered.filter(listing => listing.bathrooms >= Number(filters.bathrooms));
    }
    if (filters.propertyType !== '') {
      filtered = filtered.filter(listing => listing.propertyType === filters.propertyType);
    }

    // Update applied filters list
    const newAppliedFilters: string[] = [];
    if (filters.priceRange.min !== '') newAppliedFilters.push(`Min $${filters.priceRange.min.toLocaleString()}`);
    if (filters.priceRange.max !== '') newAppliedFilters.push(`Max $${filters.priceRange.max.toLocaleString()}`);
    if (filters.bedrooms !== '') newAppliedFilters.push(`${filters.bedrooms}+ beds`);
    if (filters.bathrooms !== '') newAppliedFilters.push(`${filters.bathrooms}+ baths`);
    if (filters.propertyType !== '') newAppliedFilters.push(filters.propertyType);
    filters.amenities.forEach(amenity => newAppliedFilters.push(amenity));
    filters.features.forEach(feature => newAppliedFilters.push(feature));
    filters.utilities.forEach(utility => newAppliedFilters.push(utility));

    setAppliedFilters(newAppliedFilters);
    
    // Apply current sort to filtered results
    let sortedFiltered = [...filtered];
    switch (filters.sortBy) {
      case 'price-asc':
        sortedFiltered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedFiltered.sort((a, b) => b.price - a.price);
        break;
      case 'date-desc':
        sortedFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-asc':
        sortedFiltered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        sortedFiltered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
    
    setFilteredListings(sortedFiltered);
  };

  const removeFilter = (filter: string) => {
    const newFilters = appliedFilters.filter(f => f !== filter);
    setAppliedFilters(newFilters);
    
    // Create updated filter state based on remaining filters
    const updatedFilterState: FilterState = {
      priceRange: { min: '', max: '' },
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      amenities: [],
      features: [],
      utilities: [],
      sortBy: sortBy as 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc'
    };
    
    // Reconstruct filter state from remaining filters
    newFilters.forEach(f => {
      // Handle price filters
      if (f.startsWith('Min $')) {
        const min = parseInt(f.replace('Min $', '').replace(/,/g, ''));
        updatedFilterState.priceRange.min = min;
      } 
      else if (f.startsWith('Max $')) {
        const max = parseInt(f.replace('Max $', '').replace(/,/g, ''));
        updatedFilterState.priceRange.max = max;
      }
      // Handle bedroom/bathroom filters
      else if (f.includes('+ beds')) {
        updatedFilterState.bedrooms = parseInt(f.replace('+ beds', ''));
      }
      else if (f.includes('+ baths')) {
        updatedFilterState.bathrooms = parseInt(f.replace('+ baths', ''));
      }
      // Handle property type
      else if (PROPERTY_TYPES.includes(f)) {
        updatedFilterState.propertyType = f;
      }
      // Handle amenities, features, utilities
      else if (AMENITIES.includes(f)) {
        updatedFilterState.amenities.push(f);
      }
      else if (FEATURES.includes(f)) {
        updatedFilterState.features.push(f);
      }
      else if (UTILITIES.includes(f)) {
        updatedFilterState.utilities.push(f);
      }
    });
    
    // Apply the reconstructed filters
    handleFilterChange(updatedFilterState);
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
      <BackgroundPattern />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Available Listings</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Select
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Date: Oldest First</SelectItem>
                  <SelectItem value="date-desc">Date: Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mobile filter button - using Sheet component */}
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="sm:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters {appliedFilters.length > 0 && `(${appliedFilters.length})`}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 sm:max-w-none overflow-y-auto">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsMobileFilterOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <ListingFilters onFilterChange={handleFilterChange} />
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Desktop filter toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          {/* Applied filters */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-2 hover:text-primary/70"
                  >
                    ×
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAppliedFilters([]);
                  handleFilterChange({
                    priceRange: { min: '', max: '' },
                    bedrooms: '',
                    bathrooms: '',
                    propertyType: '',
                    amenities: [],
                    features: [],
                    utilities: [],
                    sortBy: 'date-desc',
                  });
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Filters sidebar - desktop only */}
            <div className={`md:w-64 flex-shrink-0 hidden md:block ${showFilters ? 'md:block' : 'md:hidden'}`}>
              <div className="sticky top-4">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <ListingFilters onFilterChange={handleFilterChange} />
                </ScrollArea>
              </div>
            </div>

            {/* Listings grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-[350px] bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No listings found matching your criteria.</p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    : "flex flex-col space-y-4 sm:space-y-6"
                }>
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing._id}
                      listing={listing}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}