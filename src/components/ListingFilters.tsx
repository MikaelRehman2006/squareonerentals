'use client';

import React, { useState } from 'react';

interface FilterState {
  priceRange: { min: number; max: number };
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string | null;
  amenities: string[];
  features: string[];
  utilities: string[];
  showAdditionalOptions: boolean;
}

interface ListingFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const PROPERTY_TYPES = ['Apartment', 'Condo', 'House'];
const AMENITIES = [
  'Parking', 'Pet-friendly', 'WiFi Available', 'On-site Laundry', 'Furnished',
  'Air Conditioning', 'Gym', 'Pool', 'Security', 'Balcony', 'Elevator'
];
const FEATURES = [
  'WiFi Included', 'Air Conditioning', 'In-unit Laundry', 'Heating',
  'Furnished', 'Smart Home Features', 'Walk-in Closet'
];
const UTILITIES = ['Electricity', 'Gas', 'Water', 'Internet', 'Trash Collection'];

export function ListingFilters({ onFilterChange }: ListingFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 5000 },
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    amenities: [],
    features: [],
    utilities: [],
    showAdditionalOptions: false,
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleArrayToggle = (key: 'amenities' | 'features' | 'utilities', item: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(a => a !== item)
      : [...currentArray, item];
    handleFilterChange(key, newArray);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto w-full">
      <h3 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-500">Filters</h3>

      {/* Price Range */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min Price"
            />
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Max Price"
            />
          </div>
        </div>

        {/* Main Filters */}
        <div className="space-y-5">
          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Bedrooms</label>
            <select
              value={filters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Bedrooms</option>
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}+ beds</option>)}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Bathrooms</label>
            <select
              value={filters.bathrooms || ''}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Bathrooms</option>
              {[1, 2, 3, 4].map(num => <option key={num} value={num}>{num}+ baths</option>)}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Property Type</label>
            <select
              value={filters.propertyType || ''}
              onChange={(e) => handleFilterChange('propertyType', e.target.value || null)}
              className="w-full px-3 py-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Type</option>
              {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-500 mb-2">Amenities</label>
          <div className="grid grid-cols-1 gap-2">
            {AMENITIES.map(amenity => (
              <label key={amenity} className="flex items-center hover:bg-gray-50 pl-1 py-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleArrayToggle('amenities', amenity)}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-600">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options Toggle */}
        <button
          onClick={() => handleFilterChange('showAdditionalOptions', !filters.showAdditionalOptions)}
          className="w-full mt-5 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition"
        >
          Additional Options {filters.showAdditionalOptions ? '▲' : '▼'}
        </button>

        {/* Additional Options */}
        {filters.showAdditionalOptions && (
          <div className="space-y-5 mt-6 border-t pt-6">
            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Features</label>
              <div className="grid grid-cols-1 gap-2">
                {FEATURES.map(feature => (
                  <label key={feature} className="flex items-center hover:bg-gray-50 pl-1 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(feature)}
                      onChange={() => handleArrayToggle('features', feature)}
                      className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Utilities</label>
              <div className="grid grid-cols-1 gap-2">
                {UTILITIES.map(utility => (
                  <label key={utility} className="flex items-center hover:bg-gray-50 pl-1 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={filters.utilities.includes(utility)}
                      onChange={() => handleArrayToggle('utilities', utility)}
                      className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">{utility}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
