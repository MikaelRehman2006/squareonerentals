'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import StorageUsageBar from '@/components/StorageUsageBar';

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
import { ListingForm } from '@/components/listing-form';

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
  features: z.array(z.string()).default([]),
  utilities: z.array(z.string()).default([]),
  propertyType: z.string().min(1, 'Property type is required'),
  listingType: z.string().min(1, 'Listing type is required'),
  leaseType: z.string().min(1, 'Lease type is required'),
  availableDate: z.string().min(1, 'Available date is required'),
  parking: z.string().default('None'),
  featured: z.boolean().default(false),
  status: z.string().default('ACTIVE'),
  phoneNumber: z.string().optional(),
  facebookUrl: z.string().optional(),
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

export default function EditListingPage({ params }: { params: { listingId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
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
      features: [],
      utilities: [],
      propertyType: 'APARTMENT',
      listingType: 'LONG_TERM',
      leaseType: '',
      availableDate: '',
      parking: 'None',
      featured: false,
      status: 'ACTIVE',
      phoneNumber: '',
      facebookUrl: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.listingId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            router.push('/auth/signin');
            return;
          }
          throw new Error(errorData.error || 'Failed to fetch listing');
        }

        const data = await response.json();
        setListing(data);
        
        // Log the full listing data for debugging
        console.log('Full listing data from API:', data);
        
        // Explicitly log the address
        console.log('Address from API before form reset:', data.address);
        
        // Initialize form with listing data
        form.reset({
          title: data.title || '',
          description: data.description || '',
          price: data.price || 0,
          location: data.location || '',
          address: data.address || '',
          squareFeet: data.squareFeet || 0,
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          propertyType: data.propertyType || 'APARTMENT',
          listingType: data.listingType || 'LONG_TERM',
          leaseType: data.leaseType || 'FIXED',
          availableDate: data.availableDate ? new Date(data.availableDate + 'T00:00:00').toISOString().split('T')[0] : '',
          parking: data.parking || 'None',
          featured: data.featured || false,
          status: data.status || 'ACTIVE',
          phoneNumber: data.phoneNumber || '',
          facebookUrl: data.facebookUrl || '',
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          buildingAmenities: Array.isArray(data.buildingAmenities) ? data.buildingAmenities : [],
          features: Array.isArray(data.features) ? data.features : [],
          utilities: Array.isArray(data.utilities) ? data.utilities : [],
          images: Array.isArray(data.images) ? data.images : [],
        });
        
        // Set the state for selected items
        setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : []);
        setSelectedFeatures(Array.isArray(data.features) ? data.features : []);
        setSelectedUtilities(Array.isArray(data.utilities) ? data.utilities : []);
        setUploadedImages(Array.isArray(data.images) ? data.images : []);
        
        console.log('Loaded listing data:', data);
        
        // Log the address we received from the API for debugging
        console.log('Address from API:', data.address);
        
                  // Force update fields that might not be properly loaded
          setTimeout(() => {
            // Enhanced address field handling
            if (data.address) {
              console.log('Setting address to:', data.address);
              
              // First set it directly in the form state
              form.setValue('address', data.address, { 
                shouldValidate: true, 
                shouldDirty: true, 
                shouldTouch: true 
              });
              
              // Also try to set it directly on the DOM element
              const addressField = document.getElementById('address-field') as HTMLInputElement;
              if (addressField) {
                addressField.value = data.address;
                console.log('Manually updated address input element to:', data.address);
                
                // Dispatch events to trigger any form listeners
                const inputEvent = new Event('input', { bubbles: true });
                addressField.dispatchEvent(inputEvent);
                
                const changeEvent = new Event('change', { bubbles: true });
                addressField.dispatchEvent(changeEvent);
              } else {
                console.warn('Could not find address field element by ID');
                
                // Try using querySelector as a fallback
                const addressFieldByName = document.querySelector('input[name="address"]') as HTMLInputElement;
                if (addressFieldByName) {
                  addressFieldByName.value = data.address;
                  console.log('Updated address input by name selector to:', data.address);
                  
                  const inputEvent = new Event('input', { bubbles: true });
                  addressFieldByName.dispatchEvent(inputEvent);
                  
                  const changeEvent = new Event('change', { bubbles: true });
                  addressFieldByName.dispatchEvent(changeEvent);
                }
              }
            }
            
            if (data.phoneNumber) form.setValue('phoneNumber', data.phoneNumber, { shouldValidate: true });
            if (data.facebookUrl) form.setValue('facebookUrl', data.facebookUrl, { shouldValidate: true });
            
            // Force update features and utilities if needed
            if (data.features) {
              console.log('Forcing features update');
              form.trigger('features');
            }
            
            // Additional attempt to ensure address is set
            setTimeout(() => {
              if (data.address && form.getValues('address') !== data.address) {
                console.log('Retrying address set after delay');
                form.setValue('address', data.address, { 
                  shouldValidate: true, 
                  shouldDirty: true, 
                  shouldTouch: true 
                });
              }
            }, 100);
          if (data.utilities) {
            console.log('Forcing utilities update');
            form.trigger('utilities');
          }
          
          // Trigger description update too for consistency
          if (data.description) {
            form.trigger('description');
          }
        }, 300);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listing');
        toast.error(error || 'Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId, router, status, error, form]);

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
      
      form.setValue('features', newFeatures, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      return newFeatures;
    });
  };

  const handleUtilityToggle = (utility: string) => {
    setSelectedUtilities(prev => {
      const newUtilities = prev.includes(utility)
        ? prev.filter(a => a !== utility)
        : [...prev, utility];
      
      form.setValue('utilities', newUtilities, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      return newUtilities;
    });
  };

  // Fetch user storage usage on component mount
  useEffect(() => {
    const fetchStorageUsage = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/storage/usage');
          if (response.ok) {
            const data = await response.json();
            setStorageUsage(data.usage || 0);
          }
        } catch (error) {
          console.error('Error fetching storage usage:', error);
        }
      }
    };

    fetchStorageUsage();
  }, [session]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array for easier handling
    const filesArray = Array.from(files);
    
    // Update pending files for the storage bar visualization
    setPendingFiles(filesArray);
    
    // Calculate total size of pending files
    const totalPendingSize = filesArray.reduce((total, file) => total + file.size, 0);
    console.log(`Total pending size: ${totalPendingSize} bytes`);

    try {
      const loadingToast = toast.loading('Uploading images...');
      
      // Check file size before upload (5MB limit per file)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      for (const file of filesArray) {
        if (file.size > MAX_FILE_SIZE) {
          toast.dismiss(loadingToast);
          toast.error(`File ${file.name} exceeds the 5MB size limit`);
          setPendingFiles([]); // Clear pending files on error
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          toast.dismiss(loadingToast);
          toast.error(`File ${file.name} is not an image`);
          setPendingFiles([]); // Clear pending files on error
          return;
        }
      }

      // Check membership status and storage limit before attempting upload
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
        
        // Check storage limit
        const currentUsage = userData.storageUsage?.bytes || 0;
        const membershipType = userData.membership?.type || 'DEFAULT';
        
        // Storage limits based on membership type
        const STORAGE_LIMITS = {
          FEATURED: 25 * 1024 * 1024, // 25MB
          BASIC: 10 * 1024 * 1024,    // 10MB
          DEFAULT: 5 * 1024 * 1024    // 5MB default
        };
        
        const storageLimit = STORAGE_LIMITS[membershipType as keyof typeof STORAGE_LIMITS] || STORAGE_LIMITS.DEFAULT;
        
        if (currentUsage + totalPendingSize > storageLimit) {
          toast.dismiss(loadingToast);
          toast.error('Storage limit exceeded', {
            description: `You've reached your storage limit of ${(storageLimit / (1024 * 1024)).toFixed(0)}MB. Please delete some images or upgrade your plan.`,
            action: {
              label: 'Upgrade Plan',
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
        
      console.log('Starting image upload for', filesArray.length, 'files');
      
      const uploadPromises = filesArray.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Uploading file:', file.name, 'Size:', file.size, 'bytes');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Upload error for file ${file.name}:`, errorData);
          throw new Error(errorData.error || `Upload failed for ${file.name}`);
        }

        const result = await response.json();
        console.log('Upload success for file', file.name, ':', result);
        
        if (!result.secure_url) {
          throw new Error(`No secure URL returned for ${file.name}`);
        }
        
        return result.secure_url;
      });

      // Now try the actual upload
      let newImageUrls;
      try {
        newImageUrls = await Promise.all(uploadPromises);
        console.log('All uploads complete, new image URLs:', newImageUrls);
        
        if (!newImageUrls || newImageUrls.length === 0) {
          throw new Error('No image URLs were returned from the upload');
        }
        
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
        
        // Refresh storage usage after successful upload
        try {
          const response = await fetch('/api/users/me');
          if (response.ok) {
            const data = await response.json();
            setStorageUsage(data.storageUsage?.bytes || 0);
          }
        } catch (error) {
          console.error('Error fetching updated storage usage:', error);
        }
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
        } else if (error.message && error.message.includes('Storage limit exceeded')) {
          // Storage limit issue
          toast.error('Storage limit exceeded', {
            description: 'You\'ve reached your storage limit. Please delete some images or upgrade your plan.',
            action: {
              label: 'Upgrade Plan',
              onClick: () => router.push('/memberships')
            }
          });
        } else {
          // Generic error
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
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
      
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      // Clear pending files after upload attempt
      setPendingFiles([]);
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
      console.log('Form data:', data);
      console.log('Images:', uploadedImages);
      
      // Validate required fields
      if (!data.title || !data.description || !data.location) {
        console.error('Missing required fields');
        toast.error('Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);
      const loadingToast = toast.loading('Updating your listing...');

      // Log what we're submitting
      console.log('Form data before submission:', data);
      console.log('Selected features before submission:', selectedFeatures);
      console.log('Selected utilities before submission:', selectedUtilities);
      
      // Convert features object to array
      let featureArray;
      if (selectedFeatures.length > 0) {
        // Use the selectedFeatures directly if available
        featureArray = selectedFeatures;
        console.log('Using selectedFeatures array:', featureArray);
      } else {
        // Always treat as array
        featureArray = Array.isArray(data.features) ? data.features : [];
        console.log('Using features as array:', featureArray);
      }

      // Convert utilities object to array
      let utilitiesArray;
      if (selectedUtilities.length > 0) {
        // Use the selectedUtilities directly if available
        utilitiesArray = selectedUtilities;
        console.log('Using selectedUtilities array:', utilitiesArray);
      } else {
        // Always treat as array
        utilitiesArray = Array.isArray(data.utilities) ? data.utilities : [];
        console.log('Using utilities as array:', utilitiesArray);
      }
      
      // Make sure building amenities is properly formatted as an array
      let buildingAmenitiesArray = selectedAmenities;
      if (!Array.isArray(buildingAmenitiesArray)) {
        buildingAmenitiesArray = [];
      }
      console.log('Building amenities being saved:', buildingAmenitiesArray);

      // Get the current address value directly from the form field
      const addressInputValue = document.querySelector('[name=address]') ? 
                             (document.querySelector('[name=address]') as HTMLInputElement).value : 
                             data.address;
      
      console.log('Address from form element:', addressInputValue);
      console.log('Address from form state:', data.address);
      
      // Format the data
      const formattedData = {
        ...data,
        images: uploadedImages,
        // Use both sources for address, prioritizing the input element value
        address: addressInputValue || data.address || '',
        phoneNumber: data.phoneNumber || '',
        facebookUrl: data.facebookUrl || '',
        amenities: JSON.stringify(selectedAmenities),
        buildingAmenities: JSON.stringify(buildingAmenitiesArray),
        features: JSON.stringify(featureArray),
        utilities: JSON.stringify(utilitiesArray),
        squareFeet: Number(data.squareFeet),
        price: Number(data.price),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
      };

      console.log('Final submit data:', formattedData);

      const response = await fetch(`/api/listings/${params.listingId}`, {
        method: 'PATCH',
        credentials: 'include',
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
        throw new Error(result.error || 'Failed to update listing');
      }

      toast.dismiss(loadingToast);
      toast.success('Listing updated successfully!');
      router.push(`/listings/${params.listingId}`);
      
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Error</CardTitle>
              <CardDescription className="text-red-600">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="mt-4"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Not Found</CardTitle>
              <CardDescription>The listing you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="mt-4"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Ensure leaseType is set to a default value if not present
  const initialData = {
    ...listing,
    leaseType: listing.leaseType || 'FIXED',
              availableDate: listing.availableDate ? new Date(listing.availableDate + 'T00:00:00').toISOString().split('T')[0] : '',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      {/* Sticky header with blurred background */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/70 border-b border-gray-800 shadow-xl py-4 mb-8">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase">Edit Your Listing</h1>
              <p className="mt-1 text-gray-300">Update your property details below.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-gray-800/80 text-white hover:bg-gray-700 border-gray-700 hover:border-gray-600 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 pb-20">        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Status Selection Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Listing Status</CardTitle>
                <CardDescription className="text-gray-400 mt-1">Control the visibility of your listing</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-sm font-medium mb-3">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                hover:border-gray-400 transition-all duration-200 shadow-inner">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active (Visible to everyone)</SelectItem>
                          <SelectItem value="ARCHIVED">Archived (Hidden from listings)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400 text-sm mt-2.5">
                        {field.value === "ACTIVE" 
                          ? "Your listing is currently visible to all users." 
                          : "Your listing is currently hidden and not visible on the site."}
                      </FormDescription>
                      <FormMessage className="text-red-400 mt-2.5" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Basic Information Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-10 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Price (per month)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-200 text-sm font-medium mb-3">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4} 
                          className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                            hover:border-gray-400 transition-all duration-200 shadow-inner resize-none" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 mt-2.5" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Location</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            id="address-field"
                            value={field.value || ''}
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-10 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Square Feet</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Property Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                hover:border-gray-400 transition-all duration-200 shadow-inner">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="APARTMENT">Apartment</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="CONDO">Condo</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="HOUSE">House</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="TOWNHOUSE">Townhouse</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Listing Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                hover:border-gray-400 transition-all duration-200 shadow-inner">
                                <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="LONG_TERM">Long Term</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="SHORT_TERM">Short Term</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  <FormField
                    control={form.control}
                    name="leaseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Lease Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                hover:border-gray-400 transition-all duration-200 shadow-inner">
                                <SelectValue placeholder="Select lease type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="FIXED">Fixed Term (6 months/1 year)</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="MONTH_TO_MONTH">Month to Month</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="SHORT_TERM">Short Term (less than 6 months)</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Available Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-6">
                  <FormField
                    control={form.control}
                    name="parking"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Parking</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                hover:border-gray-400 transition-all duration-200 shadow-inner">
                                <SelectValue placeholder="Select parking" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="None">None</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="Street Parking">Street Parking</SelectItem>
                              <SelectItem className="hover:bg-gray-600 focus:bg-gray-600" value="Private Parking">Private Parking</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Images</CardTitle>
                <CardDescription className="text-gray-400 mt-1">Upload and manage your listing images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10 p-8">
                {/* Storage Usage Bar */}
                <StorageUsageBar 
                  currentUsage={storageUsage} 
                  uploadedFiles={pendingFiles}
                />
                
                {/* Image Upload Section with Drag & Drop */}
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors duration-200 rounded-xl p-5 bg-gray-700/30">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/avif,image/heic,image/heif"
                      multiple
                      onChange={handleImageUpload}
                      className="bg-transparent text-gray-300 border-0 cursor-pointer file:mr-4 file:py-2 file:px-4
                        file:rounded-xl file:border-0 file:text-sm file:font-medium
                        file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Drag and drop images here, or click to browse. Supported formats: JPG, PNG, GIF, WebP, BMP, TIFF, SVG, AVIF, HEIC.
                    </p>
                  </div>
                </div>

                {/* Current Images Grid */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-5">Current Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.length > 0 ? (
                      uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl">
                          <div className="aspect-square relative">
                            <Image
                              src={imageUrl}
                              alt={`Property image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="shadow-xl hover:scale-105 transition-transform"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 col-span-full">No images have been uploaded yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Contact Information</CardTitle>
                <CardDescription className="text-gray-400 mt-1">Optional ways for interested renters to contact you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ''}
                            placeholder="e.g. (123) 456-7890"
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-sm mt-2.5">
                          Your phone number will be displayed on your listing if provided
                        </FormDescription>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 text-sm font-medium mb-3">Facebook Profile (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ''}
                            placeholder="https://facebook.com/yourusername"
                            className="bg-gray-700 text-white border-2 border-gray-600 rounded-xl px-4 py-3 h-12 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                              hover:border-gray-400 transition-all duration-200 shadow-inner" 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-sm mt-2.5">
                          Enter your Facebook profile URL for interested renters to contact you
                        </FormDescription>
                        <FormMessage className="text-red-400 mt-2.5" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Building Amenities</CardTitle>
                <CardDescription className="text-gray-400 mt-1">What the property/building offers</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {AMENITIES.map((amenity) => (
                    <div 
                      key={amenity} 
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`
                        px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                        flex items-center justify-center text-center text-sm
                        ${selectedAmenities.includes(amenity) 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'}
                      `}
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features & Utilities Card */}
            <Card className="shadow-xl bg-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gray-800/90 border-b-2 border-gray-600 px-6 py-8 mb-6">
                <CardTitle className="text-xl font-semibold text-white uppercase tracking-wide mb-2">Unit Features & Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-12 p-8">
                <div>
                  <h3 className="text-lg font-medium text-white mb-5">Features</h3>
                  <CardDescription className="text-gray-400 mb-5">What's inside the unit</CardDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FEATURES.map((feature) => (
                      <div 
                        key={feature} 
                        onClick={() => handleFeatureToggle(feature)}
                        className={`
                          px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                          flex items-center justify-center text-center text-sm
                          ${selectedFeatures.includes(feature) 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'}
                        `}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-600">
                  <h3 className="text-lg font-medium text-white mb-5 mt-2">Utilities Included</h3>
                  <CardDescription className="text-gray-400 mb-5">What's covered in the rent</CardDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {UTILITIES.map((utility) => (
                      <div 
                        key={utility} 
                        onClick={() => handleUtilityToggle(utility)}
                        className={`
                          px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                          flex items-center justify-center text-center text-sm
                          ${selectedUtilities.includes(utility) 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'}
                        `}
                      >
                        {utility}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 
                  hover:border-gray-500 rounded-xl h-12 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12
                  shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-pulse">Saving Changes...</span>
                    <span className="absolute bottom-0 left-0 h-1 bg-blue-400 animate-progress"></span>
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
