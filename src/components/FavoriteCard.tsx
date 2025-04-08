'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

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
  };
  onRemove: (id: string) => void;
  index: number;
}

export function FavoriteCard({ listing, onRemove, index }: FavoriteCardProps) {
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
