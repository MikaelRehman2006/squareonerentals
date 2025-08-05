'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { debounce } from 'lodash';

interface FilterState {
  priceRange: { min: number | ''; max: number | '' };
  bedrooms: number | '';
  bathrooms: number | '';
  propertyType: string | '';
  amenities: string[];
  features: string[];
  utilities: string[];
  sortBy: 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc';
}

interface ListingFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  resetTrigger?: number;
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

export function ListingFilters({ onFilterChange, resetTrigger = 0 }: ListingFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    amenities: [],
    features: [],
    utilities: [],
    sortBy: 'date-desc',
  });
  const [openSections, setOpenSections] = useState({
    amenities: true,
    features: true,
    utilities: true
  });

  // Create a debounced version of onFilterChange
  const debouncedFilterChange = useCallback(
    debounce((newFilters: FilterState) => {
      onFilterChange(newFilters);
    }, 400),
    [onFilterChange]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFilterChange.cancel();
    };
  }, [debouncedFilterChange]);

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      debouncedFilterChange(newFilters);
      return newFilters;
    });
  }, [debouncedFilterChange]);

  const handlePriceChange = useCallback((type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? '' : parseInt(value);
    setFilters(prev => {
      const updated = {
        ...prev,
        priceRange: { ...prev.priceRange, [type]: numValue }
      };
      debouncedFilterChange(updated);
      return updated;
    });
  }, [debouncedFilterChange]);

  const handleArrayToggle = useCallback((key: 'amenities' | 'features' | 'utilities', item: string) => {
    setFilters(prev => {
      const currentArray = prev[key];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(a => a !== item)
        : [...currentArray, item];
      const newFilters = { ...prev, [key]: newArray };
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  const resetFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      priceRange: { min: '', max: '' },
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      amenities: [],
      features: [],
      utilities: [],
      sortBy: 'date-desc',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  }, [onFilterChange]);
  
  // Add effect to reset filters when resetTrigger changes (moved after resetFilters declaration)
  useEffect(() => {
    if (resetTrigger > 0) {
      resetFilters();
    }
  }, [resetTrigger, resetFilters]);

  const FilterContent = () => (
    <div className="space-y-4 sm:space-y-6">
        {/* Price Range */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-sm font-medium text-black sm:text-black text-white">Price Range</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full text-sm text-white sm:text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-white sm:placeholder:text-black"
              placeholder="Min Price"
            />
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full text-sm text-white sm:text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-white sm:placeholder:text-black"
              placeholder="Max Price"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-sm font-medium text-black sm:text-black text-white">Property Details</h3>
          <div className="space-y-2 sm:space-y-3">
            <Select
              value={filters.bedrooms === '' ? 'any' : filters.bedrooms.toString()}
              onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? '' : parseInt(value))}
            >
              <SelectTrigger className="w-full text-sm text-white sm:text-black">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}+ beds</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.bathrooms === '' ? 'any' : filters.bathrooms.toString()}
              onValueChange={(value) => handleFilterChange('bathrooms', value === 'any' ? '' : parseInt(value))}
            >
              <SelectTrigger className="w-full text-sm text-white sm:text-black">
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {[1, 2, 3, 4].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}+ baths</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.propertyType || 'any'}
              onValueChange={(value) => handleFilterChange('propertyType', value === 'any' ? '' : value)}
            >
              <SelectTrigger className="w-full text-sm text-white sm:text-black">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                {PROPERTY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amenities */}
        <Collapsible open={openSections.amenities} onOpenChange={() => toggleSection('amenities')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-white sm:text-black hover:text-gray-300 sm:hover:text-gray-700 transition-colors">
            <span>Amenities</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.amenities ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            <div className="space-y-2">
              {AMENITIES.map(amenity => (
                <div key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleArrayToggle('amenities', amenity)}
                    className="h-4 w-4"
                  />
                  <label className="text-sm text-white sm:text-black cursor-pointer select-none">{amenity}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Features */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-white sm:text-black hover:text-gray-300 sm:hover:text-gray-700 transition-colors">
            <span>Features</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.features ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            <div className="space-y-2">
              {FEATURES.map(feature => (
                <div key={feature} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleArrayToggle('features', feature)}
                    className="h-4 w-4"
                  />
                  <label className="text-sm text-white sm:text-black cursor-pointer select-none">{feature}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Utilities */}
        <Collapsible open={openSections.utilities} onOpenChange={() => toggleSection('utilities')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-white sm:text-black hover:text-gray-300 sm:hover:text-gray-700 transition-colors">
            <span>Utilities</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.utilities ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            <div className="space-y-2">
              {UTILITIES.map(utility => (
                <div key={utility} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.utilities.includes(utility)}
                    onCheckedChange={() => handleArrayToggle('utilities', utility)}
                    className="h-4 w-4"
                  />
                  <label className="text-sm text-white sm:text-black cursor-pointer select-none">{utility}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full bg-white text-black border-gray-300 hover:bg-gray-50"
          >
            Reset Filters
          </Button>
        </div>
        {/* Extra space to prevent bounce-back */}
        <div className="h-40"></div>
      </div>
    );

  return (
    <FilterContent />
  );
}
