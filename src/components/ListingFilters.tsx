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
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    amenities: [],
    features: [],
    utilities: [],
    sortBy: 'date-desc',
  });
  const [isOpen, setIsOpen] = useState(false);
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

  const FilterContent = () => (
    <Card className="bg-white border border-gray-200 shadow-sm w-full md:w-[250px]">
      <CardHeader className="border-b border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-800">Filters</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 sm:pt-6 space-y-4 sm:space-y-6">
        {/* Price Range */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-sm font-medium text-gray-800">Price Range</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full text-sm text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Min Price"
            />
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full text-sm text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Max Price"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-sm font-medium text-gray-800">Property Details</h3>
          <div className="space-y-2 sm:space-y-3">
            <Select
              value={filters.bedrooms === '' ? 'any' : filters.bedrooms.toString()}
              onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? '' : parseInt(value))}
            >
              <SelectTrigger className="w-full text-sm">
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
              <SelectTrigger className="w-full text-sm">
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
              <SelectTrigger className="w-full text-sm">
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
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
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
                  <label className="text-sm text-gray-900 cursor-pointer select-none">{amenity}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Features */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
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
                  <label className="text-sm text-gray-900 cursor-pointer select-none">{feature}</label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Utilities */}
        <Collapsible open={openSections.utilities} onOpenChange={() => toggleSection('utilities')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
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
                  <label className="text-sm text-gray-900 cursor-pointer select-none">{utility}</label>
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
            className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50"
      >
        Filters
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <FilterContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed left-0 top-0 h-full">
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
