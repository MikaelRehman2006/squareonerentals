'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, Grid3X3, List, Filter, SortAsc, Share2, Download, Trash2, Eye, Calendar, Star, MapPin, DollarSign, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { toast } from 'sonner';
import { FavoriteCard } from '@/components/FavoriteCard';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  createdAt?: string;
  featured?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavorites(data);
        setFilteredFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session, router]);

  // Filter and sort favorites
  useEffect(() => {
    let filtered = favorites.filter(favorite =>
      favorite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort favorites
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'oldest':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredFavorites(filtered);
  }, [favorites, searchQuery, sortBy]);

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      setFavorites(favorites.filter(favorite => favorite.id !== listingId));
      setSelectedItems(selectedItems.filter(id => id !== listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleBulkRemove = async () => {
    try {
      const promises = selectedItems.map(id => 
        fetch(`/api/favorites/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(promises);
      
      setFavorites(favorites.filter(favorite => !selectedItems.includes(favorite.id)));
      setSelectedItems([]);
      setShowBulkActions(false);
      toast.success(`Removed ${selectedItems.length} items from favorites`);
    } catch (error) {
      console.error('Error removing favorites:', error);
      toast.error('Failed to remove some favorites');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const totalValue = favorites.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = favorites.length > 0 ? totalValue / favorites.length : 0;

  if (!session) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Favorites</h1>
              </div>
              <p className="text-lg text-gray-600">Your saved properties and dream homes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="text-sm text-gray-600">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Avg Price</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${averagePrice.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Locations</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(favorites.map(f => f.location)).size}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Featured</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter(f => f.featured).length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Input
                      placeholder="Search favorites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SortAsc className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Toggle and Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedItems.length > 0 && (
                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedItems.length === filteredFavorites.length}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm text-gray-600">
                          {selectedItems.length} of {filteredFavorites.length} selected
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Selected
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove {selectedItems.length} item(s) from your favorites. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkRemove}>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                  <div className="h-6 bg-gray-200 rounded-full w-1/3" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded-full w-16" />
                    <div className="h-4 bg-gray-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredFavorites.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-sm max-w-2xl mx-auto border border-gray-100">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Heart className="absolute inset-0 w-full h-full text-rose-400 m-auto" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                {searchQuery ? 'No matching favorites' : 'No favorites yet'}
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all listings to find your perfect home.'
                  : 'Start exploring and save properties you love to see them here. Your dream home is waiting!'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-medium">
                  <Link href="/listings">
                    <Eye className="w-5 h-5 mr-2" />
                    Browse Listings
                  </Link>
                </Button>
                
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setSearchQuery('')}
                    className="font-medium"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                    <p className="text-sm text-gray-600">Total Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${averagePrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Avg Price</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(favorites.map(f => f.location)).size}
                    </p>
                    <p className="text-sm text-gray-600">Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            <AnimatePresence>
              {filteredFavorites.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={viewMode === 'list' ? 'col-span-1' : ''}
                >
                  <div className="relative">
                    {selectedItems.includes(listing.id) && (
                      <motion.div
                        className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-xl z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    
                    <div className="absolute top-4 left-4 z-20">
                      <Checkbox 
                        checked={selectedItems.includes(listing.id)}
                        onCheckedChange={() => handleSelectItem(listing.id)}
                        className="bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                    
                                         <FavoriteCard
                       listing={listing}
                       onRemove={handleRemoveFavorite}
                       index={index}
                       viewMode={viewMode}
                     />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Quick Actions Footer */}
        {favorites.length > 0 && (
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share All</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Export List</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Schedule Viewings</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Compare Properties</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}