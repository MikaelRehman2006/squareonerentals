'use client';

import { Building, Check } from 'lucide-react';

interface AmenitiesSectionProps {
  buildingAmenities: string[];
  features: string[];
  utilities: string[];
}

export function AmenitiesSection({
  buildingAmenities,
  features,
  utilities
}: AmenitiesSectionProps) {
  return (
    <div className="space-y-8">
      {buildingAmenities?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            Building Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buildingAmenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-green-500" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {features?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Unit Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-blue-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {utilities?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Included Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {utilities.map((utility) => (
              <div
                key={utility}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-purple-500" />
                <span>{utility}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
