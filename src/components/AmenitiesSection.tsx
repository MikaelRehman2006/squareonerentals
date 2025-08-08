'use client';

import { Building, Check, Home, Zap } from 'lucide-react';

interface AmenitiesSectionProps {
  buildingAmenities: string[] | null | undefined;
  features: string[] | null | undefined;
  utilities: string[] | null | undefined;
}

export function AmenitiesSection({
  buildingAmenities,
  features,
  utilities
}: AmenitiesSectionProps) {
  // Safely handle arrays that might be null/undefined or non-arrays
  const safeAmenities = Array.isArray(buildingAmenities) ? buildingAmenities : [];
  const safeFeatures = Array.isArray(features) ? features : [];
  const safeUtilities = Array.isArray(utilities) ? utilities : [];
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="h-5 w-5 text-green-600" />
          Building Amenities
        </h3>
        {safeAmenities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {safeAmenities.map((amenity, index) => (
              <div
                key={`${amenity}-${index}`}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-green-500" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Didn't state</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          Unit Features
        </h3>
        {safeFeatures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {safeFeatures.map((feature, index) => (
              <div
                key={`${feature}-${index}`}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-blue-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Didn't state</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          Included Utilities
        </h3>
        {safeUtilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {safeUtilities.map((utility, index) => (
              <div
                key={`${utility}-${index}`}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-purple-500" />
                <span>{utility}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Didn't state</p>
        )}
      </div>
    </div>
  );
}
