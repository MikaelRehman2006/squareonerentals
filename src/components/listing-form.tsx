'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ListingFormProps {
  initialData: {
    title: string;
    description: string;
    price: number;
    location: string;
    address: string;
    squareFeet: number;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    buildingAmenities: string[];
    propertyType: string;
    listingType: string;
    leaseType: string;
    availableDate: string;
    parking: string;
    featured: boolean;
    status: string;
    features: {
      wifi: boolean;
      airConditioning: boolean;
      laundry: boolean;
      heating: boolean;
      furnished: boolean;
      smartHomeFeatures: boolean;
      walkInCloset: boolean;
    };
    utilities: {
      electricity: boolean;
      gas: boolean;
      water: boolean;
      internet: boolean;
      trashCollection: boolean;
    };
    phoneNumber?: string;
    facebookUrl?: string;
  };
  onSubmit: (data: any) => void;
  showStatusToggle?: boolean;
  isSubmitting?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  images: z.array(z.string()).default([]),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be a positive number"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be a positive number"),
  squareFeet: z.coerce.number().min(0, "Square feet must be a positive number"),
  amenities: z.array(z.string()).default([]),
  buildingAmenities: z.array(z.string()).default([]),
  features: z.object({
    wifi: z.boolean().default(false),
    airConditioning: z.boolean().default(false),
    laundry: z.boolean().default(false),
    heating: z.boolean().default(false),
    furnished: z.boolean().default(false),
    smartHomeFeatures: z.boolean().default(false),
    walkInCloset: z.boolean().default(false),
  }).default({}),
  utilities: z.object({
    electricity: z.boolean().default(false),
    gas: z.boolean().default(false),
    water: z.boolean().default(false),
    internet: z.boolean().default(false),
    trashCollection: z.boolean().default(false),
  }).default({}),
  propertyType: z.string().min(1, "Property type is required"),
  listingType: z.string().min(1, "Listing type is required"),
  leaseType: z.string().min(1, "Lease type is required"),
  availableDate: z.string().min(1, "Available date is required"),
  parking: z.string().default("None"),
  status: z.string().min(1, "Status is required"),
  featured: z.boolean().default(false),
  phoneNumber: z.string().optional(),
  facebookUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function isPlainObject(obj: unknown): obj is Record<string, boolean> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export const ListingForm = ({
  initialData,
  onSubmit,
  showStatusToggle = false,
  isSubmitting = false,
}: ListingFormProps) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  console.log('ListingForm initialized with data:', initialData);

  // Convert initialData to match the form schema if needed
  const formattedInitialData: FormValues = {
    ...initialData,
    features: isPlainObject(initialData.features) ? initialData.features : {
      wifi: false,
      airConditioning: false,
      laundry: false,
      heating: false,
      furnished: false,
      smartHomeFeatures: false,
      walkInCloset: false,
    },
    utilities: isPlainObject(initialData.utilities) ? initialData.utilities : {
      electricity: false,
      gas: false,
      water: false,
      internet: false,
      trashCollection: false,
    },
    buildingAmenities: Array.isArray(initialData.buildingAmenities) ? initialData.buildingAmenities : [],
    amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
    images: Array.isArray(initialData.images) ? initialData.images : [],
    featured: initialData.featured || false,
    parking: initialData.parking || 'None'
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedInitialData,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      if (!session?.user?.email) {
        throw new Error('Unauthorized');
      }

      const formattedData = {
        ...data,
        buildingAmenities: Array.isArray(data.buildingAmenities) ? data.buildingAmenities : [],
        features: selectedFeatures,
        utilities: selectedUtilities,
      };

      await onSubmit(formattedData);
      toast.success('Listing updated successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit form');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new dropdown options
  const PROPERTY_TYPES = [
    'Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Basement Suite', 'Tiny Home', 'Garage Unit', 'Other'
  ];
  const PARKING_OPTIONS = [
    'None', 'Street Parking', 'Private Parking', 'Garage Parking', 'Underground Parking', 'Permit Required', 'Shared Driveway', 'Other'
  ];
  const LEASE_TYPES = [
    'Fixed Term (6 months/1 year)', 'Month to Month', 'Short Term (<6 months)', 'Other'
  ];
  const LEASE_OTHER_OPTIONS = [
    'Student Lease (e.g., 8 months)', 'Sublet', 'Flexible Lease'
  ];
  const LISTING_TYPES = [
    'Long Term', 'Short Term', 'Vacation Rental', 'Sublet', 'Rent-to-Own', 'Room for Rent', 'Other'
  ];

  // Add state for 'Other' fields
  const [propertyTypeOther, setPropertyTypeOther] = useState('');
  const [parkingOther, setParkingOther] = useState('');
  const [leaseTypeOther, setLeaseTypeOther] = useState('');
  const [listingTypeOther, setListingTypeOther] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  // Add state for 'Available Immediately'
  const [availableImmediately, setAvailableImmediately] = useState(false);

  const handlePreview = () => { /* TODO: Implement preview logic */ };
  const handleSaveDraft = () => { /* TODO: Implement save draft logic */ };

  const validateOtherField = (value: string, fieldName: string) => {
    if (value === 'Other' && !propertyTypeOther && fieldName === 'propertyType') {
      form.setError('propertyType', { message: 'Please specify the property type' });
      return false;
    }
    if (value === 'Other' && !parkingOther && fieldName === 'parking') {
      form.setError('parking', { message: 'Please specify the parking type' });
      return false;
    }
    if (value === 'Other' && !leaseTypeOther && fieldName === 'leaseType') {
      form.setError('leaseType', { message: 'Please specify the lease type' });
      return false;
    }
    if (value === 'Other' && !listingTypeOther && fieldName === 'listingType') {
      form.setError('listingType', { message: 'Please specify the listing type' });
      return false;
    }
    return true;
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const FEATURES = [
    'WiFi Included',
    'Air Conditioning',
    'In-unit Laundry',
    'Heating',
    'Furnished',
    'Smart Home Features',
    'Walk-in Closet',
  ];
  const UTILITIES = [
    'Electricity',
    'Gas',
    'Water',
    'Internet',
    'Trash Collection',
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => {
      const newFeatures = prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature];

      const updatedFeatureObj = {
        wifi: newFeatures.includes('WiFi Included'),
        airConditioning: newFeatures.includes('Air Conditioning'),
        laundry: newFeatures.includes('In-unit Laundry'),
        heating: newFeatures.includes('Heating'),
        furnished: newFeatures.includes('Furnished'),
        smartHomeFeatures: newFeatures.includes('Smart Home Features'),
        walkInCloset: newFeatures.includes('Walk-in Closet'),
      };

      form.setValue('features', updatedFeatureObj, { shouldValidate: true });
      return newFeatures;
    });
  };

  const handleUtilityToggle = (utility: string) => {
    setSelectedUtilities((prev) => {
      const newUtilities = prev.includes(utility)
        ? prev.filter((u) => u !== utility)
        : [...prev, utility];

      const updatedUtilityObj = {
        electricity: newUtilities.includes('Electricity'),
        gas: newUtilities.includes('Gas'),
        water: newUtilities.includes('Water'),
        internet: newUtilities.includes('Internet'),
        trashCollection: newUtilities.includes('Trash Collection'),
      };

      form.setValue('utilities', updatedUtilityObj, { shouldValidate: true });
      return newUtilities;
    });
  };

  useEffect(() => {
    // Preload features
    const featureList: string[] = [];
    const features = form.getValues('features');
    if (features?.wifi) featureList.push('WiFi Included');
    if (features?.airConditioning) featureList.push('Air Conditioning');
    if (features?.laundry) featureList.push('In-unit Laundry');
    if (features?.heating) featureList.push('Heating');
    if (features?.furnished) featureList.push('Furnished');
    if (features?.smartHomeFeatures) featureList.push('Smart Home Features');
    if (features?.walkInCloset) featureList.push('Walk-in Closet');
    setSelectedFeatures(featureList);
    // Preload utilities
    const utilityList: string[] = [];
    const utilities = form.getValues('utilities');
    if (utilities?.electricity) utilityList.push('Electricity');
    if (utilities?.gas) utilityList.push('Gas');
    if (utilities?.water) utilityList.push('Water');
    if (utilities?.internet) utilityList.push('Internet');
    if (utilities?.trashCollection) utilityList.push('Trash Collection');
    setSelectedUtilities(utilityList);
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <div className="bg-[#18181B] border border-[#232329] rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Beautiful 2BR Apartment in Downtown" 
                      {...field} 
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rent ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 1500" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Downtown Toronto" 
                      {...field} 
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 123 Main Street, Toronto, ON" 
                      {...field} 
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 1" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="squareFeet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Feet</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 800" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your property, amenities, neighborhood, etc." 
                    {...field} 
                    rows={4}
                    className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload Section */}
        <div className="bg-[#18181B] border border-[#232329] rounded-xl shadow-md p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FormLabel>Upload Images (optional)</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-muted-foreground">ℹ️</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload up to 10 images. Max size: 5MB each.</p>
                  <p>Supported formats: JPG, PNG, WebP</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={uploadingImages}
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;

                // Check file sizes
                const oversizedFiles = Array.from(files).filter(file => file.size > MAX_FILE_SIZE);
                if (oversizedFiles.length > 0) {
                  toast.error(`Some files exceed the 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
                  return;
                }

                // Check total number of images
                const currentImages = form.getValues('images') || [];
                if (currentImages.length + files.length > 10) {
                  toast.error('Maximum 10 images allowed');
                  return;
                }

                try {
                  setUploadingImages(true);
                  const formData = new FormData();
                  for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                  }

                  const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  if (!response.ok) {
                    throw new Error('Failed to upload images');
                  }

                  const data = await response.json();
                  form.setValue('images', [...currentImages, ...data.urls]);
                  toast.success('Images uploaded successfully');
                } catch (error) {
                  console.error('Error uploading images:', error);
                  toast.error('Failed to upload images');
                } finally {
                  setUploadingImages(false);
                }
              }}
            />
            {uploadingImages && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Uploading images...
              </div>
            )}
          </div>
          {/* Image Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {form.watch('images')?.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentImages = form.getValues('images') || [];
                    form.setValue(
                      'images',
                      currentImages.filter((_, i) => i !== index)
                    );
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Features & Utilities Card */}
        <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Unit Features & Utilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">Features</h3>
              <CardDescription className="text-[#A0A0A0] mb-4">What's inside the unit</CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 p-2 rounded-md hover:bg-[#2A2A2A] transition-colors">
                    <Checkbox
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                      className="h-4 w-4 border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                    />
                    <label className="text-sm font-normal text-[#CCCCCC] cursor-pointer select-none">{feature}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">Utilities Included</h3>
              <CardDescription className="text-[#A0A0A0] mb-4">What's covered in the rent</CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {UTILITIES.map((utility) => (
                  <div key={utility} className="flex items-center gap-2 p-2 rounded-md hover:bg-[#2A2A2A] transition-colors">
                    <Checkbox
                      checked={selectedUtilities.includes(utility)}
                      onCheckedChange={() => handleUtilityToggle(utility)}
                      className="h-4 w-4 border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                    />
                    <label className="text-sm font-normal text-[#CCCCCC] cursor-pointer select-none">{utility}</label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details Card */}
        <div className="bg-[#18181B] border border-[#232329] rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold mb-2">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      validateOtherField(value, 'propertyType');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Show 'Other' input if selected */}
                  {form.watch('propertyType') === 'Other' && (
                    <Input 
                      value={propertyTypeOther} 
                      onChange={e => {
                        setPropertyTypeOther(e.target.value);
                        if (e.target.value) {
                          form.clearErrors('propertyType');
                        }
                      }} 
                      placeholder="Please specify" 
                      className="mt-2" 
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      validateOtherField(value, 'listingType');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LISTING_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Show 'Other' input if selected */}
                  {form.watch('listingType') === 'Other' && (
                    <Input 
                      value={listingTypeOther} 
                      onChange={e => {
                        setListingTypeOther(e.target.value);
                        if (e.target.value) {
                          form.clearErrors('listingType');
                        }
                      }} 
                      placeholder="Please specify" 
                      className="mt-2" 
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      validateOtherField(value, 'leaseType');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lease type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEASE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Show 'Other' input if selected */}
                  {form.watch('leaseType') === 'Other' && (
                    <Input 
                      value={leaseTypeOther} 
                      onChange={e => {
                        setLeaseTypeOther(e.target.value);
                        if (e.target.value) {
                          form.clearErrors('leaseType');
                        }
                      }} 
                      placeholder="Please specify" 
                      className="mt-2" 
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      validateOtherField(value, 'parking');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PARKING_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Show 'Other' input if selected */}
                  {form.watch('parking') === 'Other' && (
                    <Input 
                      value={parkingOther} 
                      onChange={e => {
                        setParkingOther(e.target.value);
                        if (e.target.value) {
                          form.clearErrors('parking');
                        }
                      }} 
                      placeholder="Please specify" 
                      className="mt-2" 
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 mt-8">
              <Checkbox checked={availableImmediately} onCheckedChange={checked => {
                setAvailableImmediately(!!checked);
                if (checked) form.setValue('availableDate', new Date().toISOString().split('T')[0]);
              }} />
              <span>Available Immediately</span>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-[#18181B] border border-[#232329] rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <div className="space-y-2">
            <p className="text-[#A0A0A0] text-sm">
              Add your contact details below (optional). This information will be displayed on your listing 
              so potential renters can reach out to you directly about the property.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#CCCCCC] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Phone Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="e.g., (123) 456-7890" 
                      {...field} 
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <p className="text-sm text-[#A0A0A0]">Add your phone number if you'd like potential renters to call or text you.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#CCCCCC] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    Facebook Profile URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="e.g., https://facebook.com/username" 
                      {...field} 
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                  </FormControl>
                  <p className="text-sm text-[#A0A0A0]">Link to your Facebook profile or a relevant Facebook group.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {showStatusToggle && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={handlePreview}>Preview Listing</Button>
          <Button type="button" variant="outline" onClick={handleSaveDraft}>Save as Draft</Button>
          <Button type="submit" disabled={loading || isSubmitting}>Submit</Button>
        </div>
      </form>
    </Form>
  );
}
