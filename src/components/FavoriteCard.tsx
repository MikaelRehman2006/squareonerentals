'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Square, Star, Calendar, Eye, Share2, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FavoriteCardProps {
  listing: {
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
    propertyType?: string;
    listingType?: string;
  };
  onRemove: (id: string) => void;
  index: number;
  viewMode?: 'grid' | 'list';
}

export function FavoriteCard({ listing, onRemove, index, viewMode = 'grid' }: FavoriteCardProps) {
  const isList = viewMode === 'list';
  
  if (isList) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="h-full"
      >
        <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-white">
          <div className="flex">
            {/* Image Section */}
            <div className="relative w-48 h-32 overflow-hidden rounded-l-xl flex-shrink-0">
              <Image
                src={listing.image || '/images/placeholder.jpg'}
                alt={listing.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {listing.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onRemove(listing.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm 
                               hover:bg-white shadow-sm hover:shadow-md text-rose-500 transition-all
                               hover:scale-110 active:scale-95"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove from favorites</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link href={`/listings/${listing.id}`} className="block group">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {listing.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <p className="text-sm line-clamp-1">{listing.location}</p>
                  </div>

                  <div className="flex items-center gap-6 text-gray-600 text-sm mb-4">
                    {listing.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bed' : 'beds'}</span>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bath' : 'baths'}</span>
                      </div>
                    )}
                    {listing.squareFeet && (
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{listing.squareFeet.toLocaleString()} sqft</span>
                      </div>
                    )}
                    {listing.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-primary mb-2">
                    ${listing.price.toLocaleString()}/month
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/listings/${listing.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share listing</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              {/* Property Type Badges */}
              <div className="flex items-center gap-2">
                {listing.propertyType && (
                  <Badge variant="secondary" className="text-xs">
                    {listing.propertyType}
                  </Badge>
                )}
                {listing.listingType && (
                  <Badge variant="outline" className="text-xs">
                    {listing.listingType}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View (Original)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          <Image
            src={listing.image || '/images/placeholder.jpg'}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Featured Badge */}
          {listing.featured && (
            <Badge className="absolute top-4 left-4 bg-yellow-500 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}

          {/* Property Type Badge */}
          {listing.propertyType && (
            <Badge className="absolute top-4 left-4 bg-blue-500 text-white border-0" style={{ 
              top: listing.featured ? '4rem' : '1rem' 
            }}>
              {listing.propertyType}
            </Badge>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onRemove(listing.id)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm 
                           hover:bg-white shadow-sm hover:shadow-md text-rose-500 transition-all
                           hover:scale-110 active:scale-95"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove from favorites</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" asChild>
                <Link href={`/listings/${listing.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Link>
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="secondary">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share listing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <CardContent className="p-5 space-y-4">
          <Link href={`/listings/${listing.id}`} className="block group">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>
          </Link>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <p className="text-sm line-clamp-1">{listing.location}</p>
          </div>
          
          <p className="text-xl font-bold text-primary">
            ${listing.price.toLocaleString()}/month
          </p>
          
          {(listing.bedrooms || listing.bathrooms || listing.squareFeet) && (
            <div className="flex items-center gap-4 text-gray-600 text-sm pt-1">
              {listing.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bed' : 'beds'}</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bath' : 'baths'}</span>
                </div>
              )}
              {listing.squareFeet && (
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{listing.squareFeet.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {listing.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {listing.listingType && (
              <Badge variant="outline" className="text-xs">
                {listing.listingType}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
