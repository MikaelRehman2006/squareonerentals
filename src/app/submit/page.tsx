'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import StorageUsageBar from '@/components/StorageUsageBar';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const listingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  squareFeet: z.number().min(0, 'Square feet must be positive'),
  images: z.array(z.string()).default([]),
  bedrooms: z.number().min(0, 'Number of bedrooms must be positive'),
  bathrooms: z.number().min(0, 'Number of bathrooms must be positive'),
  amenities: z.array(z.string()).default([]),
  buildingAmenities: z.array(z.string()).default([]),
  propertyType: z.string().min(1, 'Property type is required'),
  listingType: z.string().min(1, 'Listing type is required'),
  leaseType: z.string().min(1, 'Lease type is required'),
  availableDate: z.string().min(1, 'Available date is required'),
  parking: z.string().default('None'),
  featured: z.boolean().default(false),
  status: z.string().default('ACTIVE'),
  features: z.object({
    wifi: z.boolean().default(false),
    airConditioning: z.boolean().default(false),
    laundry: z.boolean().default(false),
    heating: z.boolean().default(false),
    furnished: z.boolean().default(false),
    smartHomeFeatures: z.boolean().default(false),
    walkInCloset: z.boolean().default(false),
  }).default({
    wifi: false,
    airConditioning: false,
    laundry: false,
    heating: false,
    furnished: false,
    smartHomeFeatures: false,
    walkInCloset: false,
  }),
  utilities: z.object({
    electricity: z.boolean().default(false),
    gas: z.boolean().default(false),
    water: z.boolean().default(false),
    internet: z.boolean().default(false),
    trashCollection: z.boolean().default(false),
  }).default({
    electricity: false,
    gas: false,
    water: false,
    internet: false,
    trashCollection: false,
  }),
  phoneNumber: z.string().optional(),
  facebookUrl: z.string().url("Please enter a valid Facebook URL").optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

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

export default function SubmitListingPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/api/auth/signin';
    },
  });
  
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      address: '',
      squareFeet: 0,
      images: [],
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      buildingAmenities: [],
      propertyType: 'APARTMENT',
      listingType: 'LONG_TERM',
      leaseType: '',
      availableDate: '',
      parking: 'None',
      featured: false,
      status: 'ACTIVE',
      features: {
        wifi: false,
        airConditioning: false,
        laundry: false,
        heating: false,
        furnished: false,
        smartHomeFeatures: false,
        walkInCloset: false,
      },
      utilities: {
        electricity: false,
        gas: false,
        water: false,
        internet: false,
        trashCollection: false,
      },
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session === null) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      form.setValue('amenities', newAmenities);
      return newAmenities;
    });
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature)
        ? prev.filter(a => a !== feature)
        : [...prev, feature];
      
      // Convert feature names to object keys
      const featureObj = {
        wifi: false,
        airConditioning: false,
        laundry: false,
        heating: false,
        furnished: false,
        smartHomeFeatures: false,
        walkInCloset: false,
        ...newFeatures.reduce((acc, curr) => ({
          ...acc,
          [curr.toLowerCase().replace(/\s+/g, '')]: true
        }), {})
      };
      
      form.setValue('features', featureObj);
      return newFeatures;
    });
  };

  const handleUtilityToggle = (utility: string) => {
    setSelectedUtilities(prev => {
      const newUtilities = prev.includes(utility)
        ? prev.filter(a => a !== utility)
        : [...prev, utility];
      
      // Convert utility names to object keys
      const utilityObj = {
        electricity: false,
        gas: false,
        water: false,
        internet: false,
        trashCollection: false,
        ...newUtilities.reduce((acc, curr) => ({
          ...acc,
          [curr.toLowerCase().replace(/\s+/g, '')]: true
        }), {})
      };
      
      form.setValue('utilities', utilityObj);
      return newUtilities;
    });
  };

  // Track current storage usage
  const [storageUsage, setStorageUsage] = useState(0);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // Fetch current storage usage when component mounts
  useEffect(() => {
    const fetchStorageUsage = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const data = await response.json();
          setStorageUsage(data.storageUsage?.bytes || 0);
        }
      } catch (error) {
        console.error('Error fetching storage usage:', error);
      }
    };

    fetchStorageUsage();
  }, []);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Update pending files for the storage bar
    setPendingFiles(Array.from(files));

    try {
      const loadingToast = toast.loading('Uploading images...');
      
      // Check file size before upload (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > MAX_FILE_SIZE) {
          toast.dismiss(loadingToast);
          toast.error(`File ${files[i].name} exceeds the 5MB size limit`);
          return;
        }
        
        if (!files[i].type.startsWith('image/')) {
          toast.dismiss(loadingToast);
          toast.error(`File ${files[i].name} is not an image`);
          return;
        }
      }

      console.log('Starting image upload for', files.length, 'files');
      
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Uploading file:', file.name);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
          // Handle specific membership error
          if (response.status === 403 && result.error && result.error.includes('membership required')) {
            console.error('Membership required error:', result.error);
            throw new Error('Membership required to upload images. Please purchase a membership plan.');
          }
          
          console.error('Upload error for file', file.name, ':', result);
          throw new Error(result.error || `Upload failed for ${file.name}`);
        }

        console.log('Upload success for file', file.name, ':', result);
        return result.secure_url;
      });

      // Handle upload with proper error handling
      let newImageUrls;
      
      // Check user membership status first - if they don't have one, redirect early
      try {
        const membershipResponse = await fetch('/api/users/me');
        const userData = await membershipResponse.json();
        
        // If no active membership, direct to membership page immediately
        if (!userData.membership || userData.membership.status !== 'active') {
          toast.dismiss(loadingToast);
          toast.error('Membership required', {
            description: 'You need an active membership to upload images and create listings. Please purchase a plan to continue.',
            action: {
              label: 'Get Membership',
              onClick: () => router.push('/memberships')
            }
          });
          setPendingFiles([]);
          return;
        }
      } catch (membershipError) {
        console.error('Error checking membership status:', membershipError);
        // Continue to image upload attempt - the upload API will also check membership status
      }
      
      // Now try the actual upload
      try {
        newImageUrls = await Promise.all(uploadPromises);
        console.log('All uploads complete, new image URLs:', newImageUrls);
      } catch (error: any) {
        toast.dismiss(loadingToast);
        
        // Special handling for different error types
        if (error.message && error.message.includes('membership required')) {
          // Membership issue
          toast.error('Membership required', {
            description: 'You need an active membership to upload images. Please purchase a plan.',
            action: {
              label: 'Get Membership',
              onClick: () => router.push('/memberships')
            }
          });
        } else {
          // Generic error - no fallback to local storage since that's not production-ready
          toast.error(`Upload error`, {
            description: error.message || 'Failed to upload images. Please try again or consider purchasing a membership if you have not yet purchased one.',
            action: {
              label: 'Get Membership',
              onClick: () => router.push('/memberships')
            }
          });
          console.error('Upload error details:', error);
        }
        
        // Clear pending files to reset the storage bar
        setPendingFiles([]);
        return;
      }
      
      // If we get here and don't have newImageUrls, return early
      if (!newImageUrls || newImageUrls.length === 0) {
        toast.dismiss(loadingToast);
        setPendingFiles([]);
        return;
      }
      
      // This is the critical part - make sure we properly update state AND form value
      // Get the current images from the form 
      const currentFormImages = form.getValues('images') || [];
      console.log('Current form images:', currentFormImages);
      
      // Combine existing with new images
      const updatedImages = [...currentFormImages, ...newImageUrls];
      console.log('Updated image array:', updatedImages);
      
      // Update state
      setUploadedImages(updatedImages);
      
      // Explicitly set form value with the combined images
      form.setValue('images', updatedImages, { shouldValidate: true, shouldDirty: true });

      toast.dismiss(loadingToast);
      toast.success(`${newImageUrls.length} image(s) uploaded successfully!`);
      
      // Reset file input but keep the images in state
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
      
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, index) => index !== indexToRemove);
      form.setValue('images', newImages, { shouldValidate: true });
      return newImages;
    });
    toast.success('Image removed');
  };

  const onSubmit = async (data: z.infer<typeof listingSchema>) => {
    try {
      console.log('Starting form submission...');
      console.log('Form data before submission:', data);
      console.log('Selected amenities:', selectedAmenities);
      console.log('Selected features:', selectedFeatures);
      console.log('Selected utilities:', selectedUtilities);
      console.log('Uploaded images before submission:', uploadedImages);

      // Validate required fields
      if (!data.title || !data.description || !data.location) {
        console.error('Missing required fields');
        toast.error('Please fill in all required fields');
        return;
      }

      setSubmitting(true);
      const loadingToast = toast.loading('Submitting your listing...');

      // Debug any potential issues
      console.log('Data object keys:', Object.keys(data));
      console.log('Features data type:', typeof data.features);
      console.log('Features value:', data.features);
      
      // Convert features object to array - more robust handling
      let featureArray = [];
      if (data.features && typeof data.features === 'object') {
        featureArray = Object.entries(data.features)
          .filter(([_, value]) => value === true)
          .map(([key, _]) => {
            // Convert camelCase to readable format (e.g., 'airConditioning' to 'Air Conditioning')
            return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
          });
      } else if (selectedFeatures.length > 0) {
        // Fallback to selectedFeatures if form data doesn't have features
        featureArray = selectedFeatures;
      }
      console.log('Final feature array:', featureArray);

      // Convert utilities object to array - more robust handling
      let utilitiesArray = [];
      if (data.utilities && typeof data.utilities === 'object') {
        utilitiesArray = Object.entries(data.utilities)
          .filter(([_, value]) => value === true)
          .map(([key, _]) => {
            // Convert camelCase to readable format (e.g., 'trashCollection' to 'Trash Collection')
            return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
          });
      } else if (selectedUtilities.length > 0) {
        // Fallback to selectedUtilities if form data doesn't have utilities
        utilitiesArray = selectedUtilities;
      }
      console.log('Final utilities array:', utilitiesArray);
      
      // Log what we're submitting
      console.log('Selected amenities before submission:', selectedAmenities);
      console.log('Selected features before submission:', selectedFeatures);
      console.log('Selected utilities before submission:', selectedUtilities);
      console.log('Uploaded images before submission:', uploadedImages);
      
      // Get the current address value from both sources
      const addressInputValue = document.querySelector('[name=address]') ? 
                             (document.querySelector('[name=address]') as HTMLInputElement).value : 
                             data.address || '';
      
      console.log('Address being submitted:', addressInputValue);
      
      // Format the data with proper handling of arrays
      const formattedData = {
        title: data.title,
        description: data.description,
        price: Number(data.price) || 0,
        location: data.location,
        address: addressInputValue,
        phoneNumber: data.phoneNumber || '',
        facebookUrl: data.facebookUrl || '',
        // Important: Use the directly selected items for submission
        images: uploadedImages,
        amenities: JSON.stringify(selectedAmenities),
        buildingAmenities: JSON.stringify(selectedAmenities),
        features: JSON.stringify(selectedFeatures),
        utilities: JSON.stringify(selectedUtilities),
        squareFeet: Number(data.squareFeet) || 0,
        bedrooms: Number(data.bedrooms) || 0,
        bathrooms: Number(data.bathrooms) || 0,
        propertyType: data.propertyType,
        listingType: data.listingType,
        leaseType: data.leaseType,
        availableDate: data.availableDate,
        parking: data.parking,
      };
      
      console.log('Final data for submission:', {
        images: uploadedImages?.length || 0,
        amenities: selectedAmenities?.length || 0,
        features: selectedFeatures?.length || 0,
        utilities: selectedUtilities?.length || 0,
      });

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        console.error('Server error:', result);
        toast.dismiss(loadingToast);
        throw new Error(result.error || 'Failed to submit listing');
      }

      toast.dismiss(loadingToast);
      toast.success('Listing submitted successfully!');
      if (result.id) {
        router.push(`/listings/${result.id}`);
      } else {
        router.push('/dashboard'); // Fallback if no ID
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (session === null) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center text-[#E0E0E0]">Loading...</div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0] uppercase">Submit Your Listing</h1>
            <p className="mt-2 text-[#A0A0A0]">Fill in the details below to list your property.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-[#333333] text-white hover:bg-[#444444] border-[#444444]"
          >
            Back
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" />
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
                        <FormLabel className="text-[#CCCCCC]">Price (per month)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
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
                      <FormLabel className="text-[#CCCCCC]">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Location</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" />
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
                        <FormLabel className="text-[#CCCCCC]">Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ''}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              console.log('Address changed to:', e.target.value);
                            }}
                            placeholder="Enter the property address"
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormDescription className="text-[#A0A0A0]">
                          The full address of the property being listed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Square Feet</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel className="text-[#CCCCCC]">Upload Images (optional)</FormLabel>
                  
                  {/* Storage Usage Bar */}
                  <StorageUsageBar 
                    currentUsage={storageUsage} 
                    uploadedFiles={pendingFiles}
                  />
                  
                  <div className="flex flex-col gap-4">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                    />
                    <p className="text-sm text-[#A0A0A0]">
                      You can select multiple images. Supported formats: JPG, PNG, WebP.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden shadow-md">
                        <div className="aspect-square relative">
                          <Image
                            src={imageUrl}
                            alt={`Uploaded image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
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
                        <FormLabel className="text-[#CCCCCC]">Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Property Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="APARTMENT">Apartment</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="CONDO">Condo</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="HOUSE">House</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="TOWNHOUSE">Townhouse</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Listing Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm">
                                <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="LONG_TERM">Long Term</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="SHORT_TERM">Short Term</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="leaseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Lease Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm">
                                <SelectValue placeholder="Select lease type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="FIXED">Fixed Term (6 months/1 year)</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="MONTH_TO_MONTH">Month to Month</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="SHORT_TERM">Short Term (less than 6 months)</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Available Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-6">
                  <FormField
                    control={form.control}
                    name="parking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Parking</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm">
                                <SelectValue placeholder="Select parking" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="None">None</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="Street Parking">Street Parking</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="Private Parking">Private Parking</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Featured option removed - admin only feature */}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Contact Information</CardTitle>
                <CardDescription className="text-[#A0A0A0]">Optional ways for interested renters to contact you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ''}
                            placeholder="e.g. (123) 456-7890"
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormDescription className="text-[#A0A0A0]">
                          Your phone number will be displayed on your listing if provided
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#CCCCCC]">Facebook Profile (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ''}
                            placeholder="https://facebook.com/yourusername"
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormDescription className="text-[#A0A0A0]">
                          Enter your Facebook profile URL for interested renters to contact you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Building Amenities</CardTitle>
                <CardDescription className="text-[#A0A0A0]">What the property/building offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                        className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                      />
                      <label className="text-sm font-normal text-[#CCCCCC]">{amenity}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Unit Features & Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">Features</h3>
                  <CardDescription className="text-[#A0A0A0] mb-4">What's inside the unit</CardDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                          className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                        />
                        <label className="text-sm font-normal text-[#CCCCCC]">{feature}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">Utilities Included</h3>
                  <CardDescription className="text-[#A0A0A0] mb-4">What's covered in the rent</CardDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {UTILITIES.map((utility) => (
                      <div key={utility} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedUtilities.includes(utility)}
                          onCheckedChange={() => handleUtilityToggle(utility)}
                          className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                        />
                        <label className="text-sm font-normal text-[#CCCCCC]">{utility}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1 bg-[#444444] text-white hover:bg-[#555555] border-[#333333]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md transition-all duration-200 hover:shadow-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Listing'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}