'use client';

import React, { useState } from 'react';

interface FilterState {
  priceRange: { min: number; max: number };
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string | null;
  amenities: string[];
}

interface ListingFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const PROPERTY_TYPES = ['Apartment', 'Condo', 'House'];
const AMENITIES = ['Parking', 'Pet-friendly', 'WiFi', 'Laundry', 'Furnished', 'Air Conditioning'];

export function ListingFilters({ onFilterChange }: ListingFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 5000 },
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    amenities: [],
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-4">
          <input
            type="number"
            value={filters.priceRange.min}
            onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.priceRange.max}
            onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
        <select
          value={filters.bedrooms || ''}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border rounded-md bg-white text-black"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}+ beds</option>
          ))}
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
        <select
          value={filters.bathrooms || ''}
          onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border rounded-md bg-white text-black"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>{num}+ baths</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => handleFilterChange('propertyType', e.target.value || null)}
          className="w-full px-3 py-2 border rounded-md bg-white text-black"
        >
          <option value="">Any</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-600">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 