'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/types/listing';
import FavoriteButton from './FavoriteButton';
import ReportButton from './ReportButton';

interface ListingCardProps {
  listing: Listing;
  isFavorited?: boolean;
}

export function ListingCard({ listing, isFavorited = false }: ListingCardProps) {
  // Default image if none is provided or if the first image is invalid
  const defaultImage = 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image+Available';

  // Safely parse string fields that should be arrays
  const parseStringToArray = (value: string | string[] | null | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      // First try parsing as JSON
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If JSON parsing fails and it's a string, try comma splitting
      return typeof value === 'string' 
        ? value.split(',').filter(Boolean).map(item => item.trim())
        : [];
    }
  };

  // Parse images and amenities from strings to arrays
  const images = parseStringToArray(listing.images);
  const amenities = parseStringToArray(listing.amenities);
  
  // Get the first valid image URL or use default
  const imageUrl = images.length > 0 && images[0] && images[0].startsWith('http') 
    ? images[0] 
    : defaultImage;

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg transition hover:shadow-xl">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            onError={() => {
              const imgElement = document.querySelector(`[alt="${listing.title}"]`) as HTMLImageElement;
              if (imgElement) {
                imgElement.src = defaultImage;
              }
            }}
          />
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            <ReportButton
              type="LISTING"
              targetId={listing.id}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
            <FavoriteButton
              listingId={listing.id}
              initialFavorited={isFavorited}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
          </div>
          
          {listing.featured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded-md z-10">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
          <p className="text-gray-600 mb-2">{listing.location}</p>
          <div className="flex justify-between items-center">
            <p className="text-blue-600 font-bold">${listing.price.toLocaleString()}/month</p>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>{listing.bedrooms} bed</span>
              <span>•</span>
              <span>{listing.bathrooms} bath</span>
              <span>•</span>
              <span>{listing.size.toLocaleString()} ft²</span>
            </div>
          </div>
          <p className="mt-2 text-gray-600 line-clamp-2">{listing.description}</p>
          {amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity: string, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>{listing.propertyType}</span>
            <span>{listing.leaseType}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}