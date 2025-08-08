'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/types/listing';
import FavoriteButton from './FavoriteButton';
import ReportButton from './ReportButton';
import { Button } from './ui/button';
import { Eye, MapPin, Bed, Bath, Square, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ListingCardProps {
  listing: Listing;
  isFavorited?: boolean;
}

// Helper function to check if a field is empty or has a default value
function isEmptyOrDefault(value: any, defaultValue: any = 0): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' && value === defaultValue) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

// Helper function to format field value
function formatFieldValue(value: any, defaultValue: any = 0): string {
  if (isEmptyOrDefault(value, defaultValue)) {
    return 'Unknown';
  }
  return String(value);
}

export function ListingCard({ listing, isFavorited = false }: ListingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [validImages, setValidImages] = useState<string[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  
  // Default image if none is provided or if the first image is invalid
  const defaultImage = 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image+Available';

  // Detect touch devices
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Safely parse string fields that should be arrays
  const parseStringToArray = (value: string | string[] | null | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return typeof value === 'string' 
        ? value.split(',').filter(Boolean).map(item => item.trim())
        : [];
    }
  };

  // Process images when the component mounts or listing changes
  useEffect(() => {
    // Parse arrays and validate images
    const parsedImages = parseStringToArray(listing.images);
    
    // Filter valid images (either remote or local)
    const filtered = parsedImages.filter(img => 
      img && (img.startsWith('http') || img.startsWith('/uploads/'))
    );
    
    setValidImages(filtered.length > 0 ? filtered : [defaultImage]);
    setCurrentImageIndex(0); // Reset to first image when listing changes
  }, [listing, defaultImage]);
  
  // Parse other arrays
  const amenities = parseStringToArray(listing.amenities);
  const features = parseStringToArray(listing.features);
  const utilities = parseStringToArray(listing.utilities);
  
  // Get the current image URL
  const imageUrl = validImages[currentImageIndex] || defaultImage;
  
  // Navigation functions
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (validImages.length > 1) {
      setDirection(1); // Moving right
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    }
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (validImages.length > 1) {
      setDirection(-1); // Moving left
      setCurrentImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    }
  };

  // Format price with commas
  const formattedPrice = listing.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {validImages.map((url, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentImageIndex 
                ? 'translate-x-0 z-10' 
                : index < currentImageIndex || (currentImageIndex === 0 && index === validImages.length - 1)
                  ? (direction === 1 ? '-translate-x-full' : 'translate-x-full') 
                  : (direction === 1 ? 'translate-x-full' : '-translate-x-full')
            }`}
          >
            <Image
              src={url}
              alt={`${listing.title} - Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={url.startsWith('/uploads/')}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
        
        {/* Image navigation arrows - always show on mobile, hover on desktop */}
        {validImages.length > 1 && (
          <div className={`absolute inset-0 flex items-center justify-between px-2 ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-30`}>
            <button 
              onClick={prevImage}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white shadow-md transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white shadow-md transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Image counter - always show on mobile, hover on desktop */}
        {validImages.length > 1 && (
          <div className={`absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-30`}>
            {currentImageIndex + 1} / {validImages.length}
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2 z-30">
          <FavoriteButton 
            listingId={listing._id}
            isFavorited={isFavorited}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          />
          <ReportButton
            type="LISTING"
            targetId={listing._id}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          />
        </div>
        
        {/* View Details button - always visible on mobile */}
        <div className={`absolute bottom-4 left-4 right-4 ${isTouchDevice ? 'translate-y-0 opacity-100' : 'transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'} transition-all duration-300 z-30`}>
          <Link href={`/listings/${listing._id}`}>
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-semibold line-clamp-1 text-black">{listing.title}</h3>
          <p className="text-lg font-bold text-primary whitespace-nowrap">{formattedPrice}</p>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 min-w-4 mr-1" />
          <p className="text-sm line-clamp-1">{listing.location}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3 text-xs sm:text-sm">
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 min-w-4 mr-1" />
            <span>{formatFieldValue(listing.bedrooms, 0)} Bed</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 min-w-4 mr-1" />
            <span>{formatFieldValue(listing.bathrooms, 0)} Bath</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Square className="w-4 h-4 min-w-4 mr-1" />
            <span>
              {formatFieldValue(listing.squareFeet, 0, ' ft²')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {amenities.slice(0, 2).map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600"
            >
              <Tag className="w-3 h-3 mr-1" />
              {amenity}
            </span>
          ))}
          {amenities.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
              +{amenities.length - 2} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}