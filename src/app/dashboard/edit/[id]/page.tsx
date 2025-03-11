'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Listing } from '@/types/listing';
import { StableForm } from '@/components/ui/StableForm';
import { StableInput, StableTextarea } from '@/components/ui/StableInput';
import { resetAndNavigate } from '@/lib/stableNavigation';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const listingId = params.id as string;

  console.log('Edit page loaded with ID:', listingId);

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Listing>>({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // For amenities checkboxes
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedBuildingAmenities, setSelectedBuildingAmenities] = useState<string[]>([]);
  
  // Standard amenities options
  const amenitiesOptions = [
    'Air Conditioning', 'Balcony', 'Dishwasher', 'Elevator', 'Fireplace',
    'Furnished', 'Hardwood Floors', 'In-unit Laundry', 'Stainless Steel Appliances',
    'Walk-in Closet', 'High Ceilings', 'Granite Countertops'
  ];
  
  // Building amenities options  
  const buildingAmenitiesOptions = [
    'Gym', 'Pool', 'Rooftop', 'Doorman', 'Garage Parking', 
    'Storage', 'Pet Friendly', 'Bike Storage', 'Package Service',
    'Concierge', 'Playground', 'BBQ Area'
  ];

  const [formKey, setFormKey] = useState<number>(Date.now());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchListing = async () => {
      try {
        console.log('Fetching listing with ID:', listingId);
        const response = await fetch(`/api/listings/${listingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        
        const data = await response.json();
        console.log('Fetched listing data:', JSON.stringify(data, null, 2));
        
        setListing(data);
        
        // Parse JSON strings if they are strings
        let amenities: string[] = [];
        let buildingAmenities: string[] = [];
        
        try {
          amenities = Array.isArray(data.amenities) 
            ? data.amenities 
            : (typeof data.amenities === 'string' ? JSON.parse(data.amenities) : []);
        } catch (e) {
          console.error('Error parsing amenities:', e);
        }
        
        try {
          buildingAmenities = Array.isArray(data.buildingAmenities) 
            ? data.buildingAmenities 
            : (typeof data.buildingAmenities === 'string' ? JSON.parse(data.buildingAmenities) : []);
        } catch (e) {
          console.error('Error parsing buildingAmenities:', e);
        }
        
        // Initialize features with defaults
        const defaultFeatures = {
          wifi: false,
          laundry: false,
          furnished: false,
          airConditioning: false,
          heating: false
        };
        
        // Initialize utilities with defaults
        const defaultUtilities = {
          electricity: false,
          water: false,
          internet: false,
          gas: false,
          heating: false
        };
        
        // Parse features if exists, otherwise use defaults
        let features = defaultFeatures;
        try {
          if (data.features) {
            features = typeof data.features === 'string' 
              ? { ...defaultFeatures, ...JSON.parse(data.features) }
              : { ...defaultFeatures, ...data.features };
          }
        } catch (e) {
          console.error('Error parsing features:', e);
        }
        
        // Parse utilities if exists, otherwise use defaults
        let utilities = defaultUtilities;
        try {
          if (data.utilities) {
            utilities = typeof data.utilities === 'string' 
              ? { ...defaultUtilities, ...JSON.parse(data.utilities) }
              : { ...defaultUtilities, ...data.utilities };
          }
        } catch (e) {
          console.error('Error parsing utilities:', e);
        }
        
        // Set selected amenities for UI checkboxes
        setSelectedAmenities(amenities);
        setSelectedBuildingAmenities(buildingAmenities);
        
        // Initialize form data with all fields
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          size: data.size,
          availabilityDate: data.availabilityDate,
          leaseType: data.leaseType,
          leaseDuration: data.leaseDuration,
          propertyType: data.propertyType,
          images: data.images,
          featured: data.featured,
          petFriendly: data.petFriendly,
          parking: data.parking,
          landlordName: data.landlordName || '',
          landlordEmail: data.landlordEmail || '',
          landlordPhone: data.landlordPhone || '',
          amenities,
          buildingAmenities,
          features: Array.isArray(features) ? features : [],
          utilities
        });

        // After setting all the form data, reset the form key to force a clean re-render
        setFormKey(Date.now());
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to fetch listing');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId, router, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (!formData.features) return;
    
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: checked
      }
    });
  };
  
  const handleUtilityChange = (utility: string, checked: boolean) => {
    if (!formData.utilities) return;
    
    setFormData({
      ...formData,
      utilities: {
        ...formData.utilities,
        [utility]: checked
      }
    });
  };
  
  const handleAmenityToggle = (amenity: string) => {
    const newSelectedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(newSelectedAmenities);
    setFormData({
      ...formData,
      amenities: newSelectedAmenities
    });
  };
  
  const handleBuildingAmenityToggle = (amenity: string) => {
    const newSelectedBuildingAmenities = selectedBuildingAmenities.includes(amenity)
      ? selectedBuildingAmenities.filter(a => a !== amenity)
      : [...selectedBuildingAmenities, amenity];
    
    setSelectedBuildingAmenities(newSelectedBuildingAmenities);
    setFormData({
      ...formData,
      buildingAmenities: newSelectedBuildingAmenities
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare the data for submission
      const dataToSubmit = {
        ...formData,
        // Ensure these are properly formatted as arrays
        amenities: Array.isArray(selectedAmenities) ? selectedAmenities : [],
        buildingAmenities: Array.isArray(selectedBuildingAmenities) ? selectedBuildingAmenities : [],
        // Ensure features and utilities are objects if they exist
        features: formData.features || {},
        utilities: formData.utilities || {},
        // Add required fields with defaults if missing
        propertyType: formData.propertyType || 'Apartment',
        leaseType: formData.leaseType || 'Long term',
        price: formData.price || 0,
        size: formData.size || 0,
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0
      };

      console.log('Submitting data:', JSON.stringify(dataToSubmit, null, 2));
      
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      // Log the full response for debugging
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);
      
      // Parse the response if it's valid JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update listing');
      }

      // Reset form key before redirecting
      setFormKey(Date.now());
      toast.success('Listing updated successfully');
      
      // Add a small delay before redirecting to ensure clean state
      await resetAndNavigate(router, '/dashboard', setFormKey);
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update listing');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Listing Not Found</CardTitle>
            <CardDescription>
              The listing you are trying to edit could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="shadow-md">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">Edit Listing</CardTitle>
          <CardDescription className="text-base">
            Update your property listing information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StableForm onSubmit={handleSubmit} className="space-y-8" formData={formData}>
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium form-label">Title</Label>
                <StableInput
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  label="Title"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-base font-medium form-label">Description</Label>
                <StableTextarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
              
              {/* Price and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-grid">
                <div>
                  <Label htmlFor="price" className="text-base font-medium form-label">Price ($)</Label>
                  <StableInput
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-base font-medium form-label">Location</Label>
                  <StableInput
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 form-grid">
                <div>
                  <Label htmlFor="bedrooms" className="text-base font-medium form-label">Bedrooms</Label>
                  <StableInput
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="bathrooms" className="text-base font-medium form-label">Bathrooms</Label>
                  <StableInput
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="size" className="text-base font-medium form-label">Square Footage</Label>
                  <StableInput
                    id="size"
                    name="size"
                    type="number"
                    value={formData.size || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Property Type and Lease Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-grid">
                <div>
                  <Label htmlFor="propertyType" className="text-base font-medium form-label">Property Type</Label>
                  <Select
                    value={formData.propertyType || ''}
                    onValueChange={(value) => handleSelectChange('propertyType', value)}
                  >
                    <SelectTrigger id="propertyType" className="mt-1.5 w-full">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Basement">Basement</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="leaseType" className="text-base font-medium form-label">Lease Type</Label>
                  <Select
                    value={formData.leaseType || ''}
                    onValueChange={(value) => handleSelectChange('leaseType', value)}
                  >
                    <SelectTrigger id="leaseType" className="mt-1.5 w-full">
                      <SelectValue placeholder="Select lease type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                      <SelectItem value="Sublease">Sublease</SelectItem>
                      <SelectItem value="Short-term">Short-term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Lease Duration and Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-grid">
                <div>
                  <Label htmlFor="leaseDuration" className="text-base font-medium form-label">Lease Duration</Label>
                  <Select
                    value={formData.leaseDuration || '12 months'}
                    onValueChange={(value) => handleSelectChange('leaseDuration', value)}
                  >
                    <SelectTrigger id="leaseDuration" className="mt-1.5 w-full">
                      <SelectValue placeholder="Select lease duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="24 months">24 months</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="availabilityDate" className="text-base font-medium form-label">Available From</Label>
                  <StableInput
                    id="availabilityDate"
                    name="availabilityDate"
                    type="date"
                    value={formData.availabilityDate?.split('T')[0] || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Checkbox Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 form-grid">
                <div className="flex items-center space-x-3 checkbox-container">
                  <Checkbox
                    id="petFriendly"
                    checked={Boolean(formData.petFriendly)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('petFriendly', checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="petFriendly" className="text-base font-medium">Pet Friendly</Label>
                </div>
                
                <div className="flex items-center space-x-3 checkbox-container">
                  <Checkbox
                    id="parking"
                    checked={Boolean(formData.parking)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('parking', checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="parking" className="text-base font-medium">Parking Available</Label>
                </div>
              </div>
              
              {/* Advanced Options Toggle */}
              <div className="pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full sm:w-auto"
                >
                  {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                </Button>
              </div>
            </div>
            
            {showAdvancedOptions && (
              <div className="space-y-6">
                {/* Landlord Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Landlord Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <Label htmlFor="landlordName" className="text-base font-medium">Landlord Name</Label>
                      <StableInput
                        id="landlordName"
                        name="landlordName"
                        value={formData.landlordName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="landlordEmail" className="text-base font-medium">Landlord Email</Label>
                      <StableInput
                        id="landlordEmail"
                        name="landlordEmail"
                        type="email"
                        value={formData.landlordEmail || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="landlordPhone" className="text-base font-medium">Landlord Phone</Label>
                      <StableInput
                        id="landlordPhone"
                        name="landlordPhone"
                        value={formData.landlordPhone || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Unit Features */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Unit Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries({
                      wifi: "WiFi",
                      laundry: "Laundry",
                      furnished: "Furnished",
                      airConditioning: "Air Conditioning",
                      heating: "Heating"
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Checkbox
                          id={`feature-${key}`}
                          checked={Boolean(formData.features?.[key as keyof typeof formData.features])}
                          onCheckedChange={(checked) => 
                            handleFeatureChange(key, checked as boolean)
                          }
                          className="h-5 w-5"
                        />
                        <Label htmlFor={`feature-${key}`} className="text-base font-medium">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Utilities Included */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Utilities Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries({
                      electricity: "Electricity",
                      water: "Water",
                      internet: "Internet",
                      gas: "Gas",
                      heating: "Heating"
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Checkbox
                          id={`utility-${key}`}
                          checked={Boolean(formData.utilities?.[key as keyof typeof formData.utilities])}
                          onCheckedChange={(checked) => 
                            handleUtilityChange(key, checked as boolean)
                          }
                          className="h-5 w-5"
                        />
                        <Label htmlFor={`utility-${key}`} className="text-base font-medium">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Unit Amenities */}
                <div className="border-t pt-6 pb-4">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Unit Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                    {amenitiesOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                          className="h-5 w-5 rounded border-gray-400 focus:ring-2 focus:ring-primary"
                        />
                        <Label 
                          htmlFor={`amenity-${amenity}`} 
                          className="text-base cursor-pointer select-none flex-1"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Building Amenities */}
                <div className="border-t pt-6 pb-4 mt-4">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Building Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                    {buildingAmenitiesOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`building-${amenity}`}
                          checked={selectedBuildingAmenities.includes(amenity)}
                          onCheckedChange={() => handleBuildingAmenityToggle(amenity)}
                          className="h-5 w-5 rounded border-gray-400 focus:ring-2 focus:ring-primary"
                        />
                        <Label 
                          htmlFor={`building-${amenity}`} 
                          className="text-base cursor-pointer select-none flex-1"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="sm:min-w-28"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </StableForm>
        </CardContent>
      </Card>
    </div>
  );
} 