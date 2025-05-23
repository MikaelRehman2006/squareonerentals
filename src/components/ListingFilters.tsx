'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

const PROPERTY_TYPES = ['APARTMENT', 'CONDO', 'HOUSE', 'TOWNHOUSE'];
const AMENITIES = [
  'Parking',
  'Pet-friendly',
  'WiFi Available',
  'On-site Laundry',
  'Furnished',
  'Air Conditioning',
  'Gym',
  'Pool',
  'Security',
  'Balcony',
  'Elevator'
];

const FEATURES = [
  'WiFi Included',
  'Air Conditioning',
  'In-unit Laundry',
  'Heating',
  'Furnished',
  'Smart Home Features',
  'Walk-in Closet'
];

const UTILITIES = [
  'Electricity',
  'Gas',
  'Water',
  'Internet',
  'Trash Collection'
];

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

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: { min: 0, max: 5000 },
      bedrooms: null,
      bathrooms: null,
      propertyType: null,
      amenities: [],
      features: [],
      utilities: [],
      showAdditionalOptions: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="bg-[#1F1F1F] border border-[#333333] shadow-md">
      <CardHeader className="border-b border-[#333333]">
        <CardTitle className="text-xl font-semibold text-[#E0E0E0]">Filters</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#E0E0E0]">Price Range</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: parseInt(e.target.value) })}
              className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              placeholder="Min Price"
            />
            <Input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) })}
              className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              placeholder="Max Price"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#E0E0E0]">Property Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={filters.bedrooms?.toString() || 'any'}
              onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? null : parseInt(value))}
            >
              <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6]">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                <SelectItem value="any">Any</SelectItem>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}+ beds</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.bathrooms?.toString() || 'any'}
              onValueChange={(value) => handleFilterChange('bathrooms', value === 'any' ? null : parseInt(value))}
            >
              <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6]">
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                <SelectItem value="any">Any</SelectItem>
                {[1, 2, 3, 4].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}+ baths</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select
            value={filters.propertyType || 'any'}
            onValueChange={(value) => handleFilterChange('propertyType', value === 'any' ? null : value)}
          >
            <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6]">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
              <SelectItem value="any">Any Type</SelectItem>
              {PROPERTY_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amenities */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium text-[#E0E0E0] hover:text-[#3B82F6] transition-colors">
            <span>Amenities</span>
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {AMENITIES.map(amenity => (
                <div key={amenity} className="flex items-center gap-2 p-2 rounded-md hover:bg-[#2A2A2A] transition-colors">
                  <Checkbox
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleArrayToggle('amenities', amenity)}
                    className="h-4 w-4 border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                  />
                  <label className="text-sm font-normal text-[#CCCCCC] cursor-pointer select-none">{amenity}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Features */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium text-[#E0E0E0] hover:text-[#3B82F6] transition-colors">
            <span>Features</span>
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {FEATURES.map(feature => (
                <div key={feature} className="flex items-center gap-2 p-2 rounded-md hover:bg-[#2A2A2A] transition-colors">
                  <Checkbox
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleArrayToggle('features', feature)}
                    className="h-4 w-4 border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                  />
                  <label className="text-sm font-normal text-[#CCCCCC] cursor-pointer select-none">{feature}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Utilities */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium text-[#E0E0E0] hover:text-[#3B82F6] transition-colors">
            <span>Utilities</span>
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {UTILITIES.map(utility => (
                <div key={utility} className="flex items-center gap-2 p-2 rounded-md hover:bg-[#2A2A2A] transition-colors">
                  <Checkbox
                    checked={filters.utilities.includes(utility)}
                    onCheckedChange={() => handleArrayToggle('utilities', utility)}
                    className="h-4 w-4 border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                  />
                  <label className="text-sm font-normal text-[#CCCCCC] cursor-pointer select-none">{utility}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-[#333333]">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex-1 bg-[#444444] text-white hover:bg-[#555555] border-[#333333]"
          >
            Reset Filters
          </Button>
          <Button
            onClick={() => onFilterChange(filters)}
            className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
