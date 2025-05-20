'use client';

import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign,
  Calendar,
  Clock,
  Car,
  Star,
  Building
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ListingInfoCardProps {
  propertyType: string;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  price: number;
  leaseType: string;
  availableDate: Date;
  parking?: string;
  listingType: string;
  featured?: boolean;
}

export function ListingInfoCard({
  propertyType,
  location,
  address,
  bedrooms,
  bathrooms,
  squareFeet,
  price,
  leaseType,
  availableDate,
  parking,
  listingType,
  featured
}: ListingInfoCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Property Type & Location */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Property Type</p>
              <p className="font-semibold text-gray-900">{propertyType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-900">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold text-gray-900">{address || 'No address provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Size & Rooms */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bed className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Bedrooms</p>
              <p className="font-semibold text-gray-900">{bedrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bath className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Bathrooms</p>
              <p className="font-semibold text-gray-900">{bathrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Square className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Square Feet</p>
              <p className="font-semibold text-gray-900">{squareFeet.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Lease Info */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Monthly Rent</p>
              <p className="font-semibold text-gray-900">${price.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Lease Type</p>
              <p className="font-semibold text-gray-900">{leaseType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Available From</p>
              <p className="font-semibold text-gray-900">{formatDate(availableDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Listing Type</p>
              <p className="font-semibold text-gray-900">{listingType.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
          {parking && (
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Parking</p>
                <p className="font-semibold text-gray-900">{parking}</p>
              </div>
            </div>
          )}
          {featured && (
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Featured Listing</p>
                <p className="font-semibold text-gray-900">Yes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
