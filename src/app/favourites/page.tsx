'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Filter, Grid, List, SlidersHorizontal, X, MapPin, Bath, BedDouble, Ruler, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';

// Sample data for favorite listings
const sampleFavorites = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in Downtown',
    price: 2100,
    location: 'Downtown Square One',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 950,
    parkingSpots: 1,
    imageUrl: '/images/listing1.jpg',
    dateAdded: '2 days ago',
    new: true,
    priceDropped: false
  },
  {
    id: '2',
    title: 'Luxury Studio with City Views',
    price: 1650,
    location: 'City Centre',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600,
    parkingSpots: 1,
    imageUrl: '/images/listing2.jpg',
    dateAdded: '1 week ago',
    new: false,
    priceDropped: true
  },
  {
    id: '3',
    title: 'Spacious 3BR Family Home',
    price: 2800,
    location: 'Cooksville',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    parkingSpots: 2,
    imageUrl: '/images/listing3.jpg',
    dateAdded: '2 weeks ago',
    new: false,
    priceDropped: false
  },
  {
    id: '4',
    title: 'Renovated 1BR near Transit',
    price: 1750,
    location: 'Port Credit',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 700,
    parkingSpots: 1,
    imageUrl: '/images/listing4.jpg',
    dateAdded: '3 weeks ago',
    new: false,
    priceDropped: true
  },
  {
    id: '5',
    title: 'Penthouse with Stunning Lake View',
    price: 3500,
    location: 'Lakeshore',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    parkingSpots: 2,
    imageUrl: '/images/listing5.jpg',
    dateAdded: '1 month ago',
    new: false,
    priceDropped: false
  }
];

export default function FavouritesPage() {
  const [favorites, setFavorites] = useState(sampleFavorites);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'priceLow', 'priceHigh'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under1500', '1500to2000', '2000to2500', 'over2500'
  const [bedroomFilter, setBedroomFilter] = useState('all'); // 'all', '1', '2', '3plus'

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const applyFilters = () => {
    let filtered = [...sampleFavorites];
    
    // Apply price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (priceFilter === 'under1500') return item.price < 1500;
        if (priceFilter === '1500to2000') return item.price >= 1500 && item.price <= 2000;
        if (priceFilter === '2000to2500') return item.price > 2000 && item.price <= 2500;
        if (priceFilter === 'over2500') return item.price > 2500;
        return true;
      });
    }
    
    // Apply bedroom filter
    if (bedroomFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (bedroomFilter === '1') return item.bedrooms === 1;
        if (bedroomFilter === '2') return item.bedrooms === 2;
        if (bedroomFilter === '3plus') return item.bedrooms >= 3;
        return true;
      });
    }
    
    // Apply sorting
    if (sortBy === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // Sort by date (most recent first) - in a real app, use actual date objects
      filtered.sort((a, b) => {
        // This is simplified - in a real app, compare actual dates
        if (a.new && !b.new) return -1;
        if (!a.new && b.new) return 1;
        return 0;
      });
    }
    
    return filtered;
  };

  const filteredFavorites = applyFilters();
  
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/dashboard" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
        </div>

        {/* Filters and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPriceFilter('all')} className={priceFilter === 'all' ? 'bg-blue-50' : ''}>
                    All Prices
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('under1500')} className={priceFilter === 'under1500' ? 'bg-blue-50' : ''}>
                    Under $1,500
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('1500to2000')} className={priceFilter === '1500to2000' ? 'bg-blue-50' : ''}>
                    $1,500 - $2,000
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('2000to2500')} className={priceFilter === '2000to2500' ? 'bg-blue-50' : ''}>
                    $2,000 - $2,500
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('over2500')} className={priceFilter === 'over2500' ? 'bg-blue-50' : ''}>
                    Over $2,500
                  </DropdownMenuItem>
                  
                  <DropdownMenuLabel className="mt-2">Bedrooms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setBedroomFilter('all')} className={bedroomFilter === 'all' ? 'bg-blue-50' : ''}>
                    Any
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBedroomFilter('1')} className={bedroomFilter === '1' ? 'bg-blue-50' : ''}>
                    1 Bedroom
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBedroomFilter('2')} className={bedroomFilter === '2' ? 'bg-blue-50' : ''}>
                    2 Bedrooms
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBedroomFilter('3plus')} className={bedroomFilter === '3plus' ? 'bg-blue-50' : ''}>
                    3+ Bedrooms
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort: {getSortByLabel(sortBy)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setSortBy('dateAdded')} className={sortBy === 'dateAdded' ? 'bg-blue-50' : ''}>
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('priceLow')} className={sortBy === 'priceLow' ? 'bg-blue-50' : ''}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('priceHigh')} className={sortBy === 'priceHigh' ? 'bg-blue-50' : ''}>
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <Toggle 
                pressed={viewMode === 'grid'} 
                onPressedChange={() => setViewMode('grid')}
                className="rounded-none border-none data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600"
              >
                <Grid className="h-4 w-4" />
              </Toggle>
              <Toggle 
                pressed={viewMode === 'list'} 
                onPressedChange={() => setViewMode('list')}
                className="rounded-none border-none data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600"
              >
                <List className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
          
          {/* Applied filters */}
          {(priceFilter !== 'all' || bedroomFilter !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {priceFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 flex items-center gap-1">
                  {getPriceFilterLabel(priceFilter)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceFilter('all')} />
                </Badge>
              )}
              {bedroomFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 flex items-center gap-1">
                  {getBedroomFilterLabel(bedroomFilter)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setBedroomFilter('all')} />
                </Badge>
              )}
              
              {(priceFilter !== 'all' || bedroomFilter !== 'all') && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-blue-600 h-auto p-0"
                  onClick={() => {
                    setPriceFilter('all');
                    setBedroomFilter('all');
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Favorites Listings */}
        {filteredFavorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredFavorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {viewMode === 'grid' ? (
                  <GridViewItem favorite={favorite} onRemove={removeFavorite} />
                ) : (
                  <ListViewItem favorite={favorite} onRemove={removeFavorite} />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              You haven't saved any properties yet. Browse listings and click the heart icon to save properties you're interested in.
            </p>
            <Link href="/listings">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Listings
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper function to format prices
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

// Helper functions for label display
function getSortByLabel(sortBy: string) {
  switch (sortBy) {
    case 'dateAdded': return 'Most Recent';
    case 'priceLow': return 'Price: Low to High';
    case 'priceHigh': return 'Price: High to Low';
    default: return 'Most Recent';
  }
}

function getPriceFilterLabel(filter: string) {
  switch (filter) {
    case 'under1500': return 'Under $1,500';
    case '1500to2000': return '$1,500 - $2,000';
    case '2000to2500': return '$2,000 - $2,500';
    case 'over2500': return 'Over $2,500';
    default: return 'All Prices';
  }
}

function getBedroomFilterLabel(filter: string) {
  switch (filter) {
    case '1': return '1 Bedroom';
    case '2': return '2 Bedrooms';
    case '3plus': return '3+ Bedrooms';
    default: return 'Any Bedrooms';
  }
}

// Components for different view modes
interface FavoriteItemProps {
  favorite: {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    parkingSpots: number;
    imageUrl: string;
    dateAdded: string;
    new: boolean;
    priceDropped: boolean;
  };
  onRemove: (id: string) => void;
}

function GridViewItem({ favorite, onRemove }: FavoriteItemProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="relative h-48 bg-gray-200">
        {/* Placeholder for listing image */}
        <div className="absolute top-2 right-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white hover:bg-red-50 border border-gray-200 shadow-sm"
            onClick={() => onRemove(favorite.id)}
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </Button>
        </div>
        {favorite.new && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-blue-500">New</Badge>
          </div>
        )}
        {favorite.priceDropped && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-green-500">Price Drop</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium truncate">{favorite.title}</h3>
        </div>
        <p className="text-lg font-bold text-blue-600 mb-2">
          {formatPrice(favorite.price)}/month
        </p>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="truncate">{favorite.location}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <BedDouble className="h-3.5 w-3.5 mr-1" />
            <span>{favorite.bedrooms} BD</span>
          </div>
          <div className="flex items-center ml-2">
            <Bath className="h-3.5 w-3.5 mr-1" />
            <span>{favorite.bathrooms} BA</span>
          </div>
          <div className="flex items-center ml-2">
            <Ruler className="h-3.5 w-3.5 mr-1" />
            <span>{favorite.squareFeet} sqft</span>
          </div>
          {favorite.parkingSpots > 0 && (
            <div className="flex items-center ml-2">
              <Car className="h-3.5 w-3.5 mr-1" />
              <span>{favorite.parkingSpots}</span>
            </div>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-500">Saved {favorite.dateAdded}</div>
      </CardContent>
    </Card>
  );
}

function ListViewItem({ favorite, onRemove }: FavoriteItemProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 sm:h-auto sm:w-40 bg-gray-200">
          {/* Placeholder for listing image */}
          {favorite.new && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-blue-500">New</Badge>
            </div>
          )}
          {favorite.priceDropped && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-green-500">Price Drop</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{favorite.title}</h3>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {formatPrice(favorite.price)}/month
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-red-50"
              onClick={() => onRemove(favorite.id)}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </Button>
          </div>
          <div className="flex items-center text-gray-600 text-sm mt-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{favorite.location}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-2">
            <div className="flex items-center">
              <BedDouble className="h-3.5 w-3.5 mr-1" />
              <span>{favorite.bedrooms} BD</span>
            </div>
            <div className="flex items-center ml-2">
              <Bath className="h-3.5 w-3.5 mr-1" />
              <span>{favorite.bathrooms} BA</span>
            </div>
            <div className="flex items-center ml-2">
              <Ruler className="h-3.5 w-3.5 mr-1" />
              <span>{favorite.squareFeet} sqft</span>
            </div>
            {favorite.parkingSpots > 0 && (
              <div className="flex items-center ml-2">
                <Car className="h-3.5 w-3.5 mr-1" />
                <span>{favorite.parkingSpots}</span>
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">Saved {favorite.dateAdded}</div>
        </CardContent>
      </div>
    </Card>
  );
} 