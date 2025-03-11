'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/types/listing';
import { ListingCard } from '@/components/ListingCard';
import { ListingFilters } from '@/components/ListingFilters';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterState {
  priceRange: { min: number; max: number };
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string | null;
  amenities: string[];
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollFeatured = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-listings');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        // Use window.location.origin to get the base URL
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/listings`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        // Sort listings to put featured ones first
        const sortedListings = [...data].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        
        setListings(sortedListings);
        setFilteredListings(sortedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    const filtered = listings.filter(listing => {
      // Filter by price
      if (listing.price < filters.priceRange.min || listing.price > filters.priceRange.max) {
        return false;
      }

      // Filter by bedrooms
      if (filters.bedrooms !== null && listing.bedrooms !== filters.bedrooms) {
        return false;
      }

      // Filter by bathrooms
      if (filters.bathrooms !== null && listing.bathrooms !== filters.bathrooms) {
        return false;
      }

      // Filter by property type
      if (filters.propertyType !== null && listing.propertyType !== filters.propertyType) {
        return false;
      }

      // Filter by amenities
      if (filters.amenities.length > 0) {
        const listingAmenities = Array.isArray(listing.amenities) 
          ? listing.amenities 
          : typeof listing.amenities === 'string' 
            ? JSON.parse(listing.amenities || '[]') 
            : [];
        
        // Check if any selected amenities match the listing
        const hasAmenities = filters.amenities.some(amenity => 
          listingAmenities.some((a: string) => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        
        if (!hasAmenities) {
          return false;
        }
      }

      return true;
    });

    // Sort filtered listings to keep featured ones first
    const sortedFiltered = [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setFilteredListings(sortedFiltered);
  };

  const featuredListings = listings.filter(listing => listing.featured);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Featured Listings Section */}
      {featuredListings.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Listings</h2>
          <div className="relative">
            <div
              id="featured-listings"
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {featuredListings.map((listing) => (
                <div key={listing.id} className="flex-none w-[300px]">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-lg"
                onClick={() => scrollFeatured('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-lg"
                onClick={() => scrollFeatured('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Listings</h1>
        <p className="text-gray-600">Browse through our collection of verified rental properties in Mississauga.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <ListingFilters onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-pulse">Loading listings...</div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings match your filters</h3>
              <p className="text-gray-600">Try adjusting your filter criteria to see more results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}