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

// Helper function to check if a field is empty or has a default value
function isEmptyOrDefault(value: any, defaultValue: any = 0): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' && value === defaultValue) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'string' && value.trim().toLowerCase() === 'unknown') return true;
  return false;
}

// Helper function to format field value
function formatFieldValue(value: any, defaultValue: any = 0, suffix: string = ''): string {
  if (isEmptyOrDefault(value, defaultValue)) {
    return 'Unknown';
  }
  if (suffix) {
    return `${value}${suffix}`;
  }
  return String(value);
}

// Helper function to format address
function formatAddress(address: string | null | undefined): string {
  if (!address || address.trim() === '') {
    return 'Didn\'t state';
  }
  return address;
}

// Helper function to format parking
function formatParking(parking: string | null | undefined): string {
  if (!parking || parking.trim() === '') {
    return 'Didn\'t state';
  }
  return parking;
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
              <p className="font-semibold text-gray-900">{formatAddress(address)}</p>
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
              <p className="font-semibold text-gray-900">{formatFieldValue(bedrooms, 0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bath className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Bathrooms</p>
              <p className="font-semibold text-gray-900">{formatFieldValue(bathrooms, 0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Square className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Square Feet</p>
              <p className="font-semibold text-gray-900">
                {formatFieldValue(squareFeet, 0, ' sq ft')}
              </p>
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
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Parking</p>
              <p className="font-semibold text-gray-900">{formatParking(parking)}</p>
            </div>
          </div>
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
