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
          availableDate: data.availableDate ? new Date(data.availableDate).toISOString().split('T')[0] : '',
          parking: data.parking || 'None',
          featured: data.featured || false,
          status: data.status || 'ACTIVE',
          phoneNumber: data.phoneNumber || '',
          facebookUrl: data.facebookUrl || '',
          features: Array.isArray(data.features) ? data.features : [],
          utilities: Array.isArray(data.utilities) ? data.utilities : [],
        });
        
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
          if (data.utilities) {
            console.log('Forcing utilities update');
            form.trigger('utilities');
          }
          
          // Trigger description update too for consistency
          if (data.description) {
            form.trigger('description');
          }
        }, 300);
        
        // Set uploaded images
        if (data.images && Array.isArray(data.images)) {
          console.log('Loading images from listing data:', data.images);
          setUploadedImages(data.images);
          
          // Ensure images are properly set in the form
          form.setValue('images', data.images);
        }
        
        // Set amenities and building amenities with better parsing
        if (data.amenities) {
          try {
            const parsedAmenities = typeof data.amenities === 'string' 
              ? JSON.parse(data.amenities) 
              : data.amenities;
            setSelectedAmenities(Array.isArray(parsedAmenities) ? parsedAmenities : []);
          } catch (e) {
            console.error('Error parsing amenities:', e);
            setSelectedAmenities([]);
          }
        }

        // Parse building amenities carefully
        if (data.buildingAmenities) {
          try {
            let parsedBuildingAmenities;
            if (typeof data.buildingAmenities === 'string') {
              parsedBuildingAmenities = JSON.parse(data.buildingAmenities);
              console.log('Parsed building amenities from string:', parsedBuildingAmenities);
            } else if (Array.isArray(data.buildingAmenities)) {
              parsedBuildingAmenities = data.buildingAmenities;
              console.log('Building amenities already array:', parsedBuildingAmenities);
            } else {
              // If it's another format, convert to empty array
              parsedBuildingAmenities = [];
              console.log('Building amenities unknown format, using empty array');
            }
            
            // Make sure it's definitely an array
            const amenitiesArray = Array.isArray(parsedBuildingAmenities) ? parsedBuildingAmenities : [];
            form.setValue('buildingAmenities', amenitiesArray);
            console.log('Final building amenities set to:', amenitiesArray);
          } catch (e) {
            console.error('Error parsing building amenities:', e);
            form.setValue('buildingAmenities', []);
          }
        }
        
        // Parse features carefully
        if (data.features) {
          try {
            let parsedFeatures;
            if (typeof data.features === 'string') {
              parsedFeatures = JSON.parse(data.features);
              console.log('Parsed features from string:', parsedFeatures);
            } else if (Array.isArray(data.features)) {
              parsedFeatures = data.features;
              console.log('Features already array:', parsedFeatures);
            } else {
              parsedFeatures = [];
              console.log('Features unknown format, using empty array');
            }
            
            const featuresArray = Array.isArray(parsedFeatures) ? parsedFeatures : [];
            form.setValue('features', featuresArray);
            setSelectedFeatures(featuresArray);
            console.log('Final features set to:', featuresArray);
          } catch (e) {
            console.error('Error parsing features:', e);
            form.setValue('features', []);
            setSelectedFeatures([]);
          }
        }
        
        // Parse utilities carefully
        if (data.utilities) {
          try {
            let parsedUtilities;
            if (typeof data.utilities === 'string') {
              parsedUtilities = JSON.parse(data.utilities);
              console.log('Parsed utilities from string:', parsedUtilities);
            } else if (Array.isArray(data.utilities)) {
              parsedUtilities = data.utilities;
              console.log('Utilities already array:', parsedUtilities);
            } else {
              parsedUtilities = [];
              console.log('Utilities unknown format, using empty array');
            }
            
            const utilitiesArray = Array.isArray(parsedUtilities) ? parsedUtilities : [];
            form.setValue('utilities', utilitiesArray);
            setSelectedUtilities(utilitiesArray);
            console.log('Final utilities set to:', utilitiesArray);
          } catch (e) {
            console.error('Error parsing utilities:', e);
            form.setValue('utilities', []);
            setSelectedUtilities([]);
          }
        }
        
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

      // Store the files for the storage usage bar
      setPendingFiles(Array.from(files));

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            result = await response.json();
          } catch (e) {
            result = { error: 'Invalid JSON response from server.' };
          }
        } else {
          result = { error: 'No JSON response from server.' };
        }

        if (!response.ok) {
          console.error(`Upload error for file ${file.name}:`, result, 'Status:', response.status, 'Method:', response.type);
          throw new Error(result.error || `Upload failed for ${file.name}`);
        }

        console.log('Upload success for file', file.name, ':', result);
        return result.secure_url;
      });

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
      let newImageUrls;
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
      
      // If we get here and don't have newImageUrls, return early
      if (!newImageUrls || newImageUrls.length === 0) {
        toast.dismiss(loadingToast);
        setPendingFiles([]);
        return;
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
      
      // Clear pending files
      setPendingFiles([]);
      
      // Refresh storage usage
      try {
        const response = await fetch('/api/storage/usage');
        if (response.ok) {
          const data = await response.json();
          setStorageUsage(data.usage || 0);
        }
      } catch (error) {
        console.error('Error fetching updated storage usage:', error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
      
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear pending files
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
    availableDate: listing.availableDate ? new Date(listing.availableDate).toISOString().split('T')[0] : '',
  };

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0] uppercase">Edit Your Listing</h1>
            <p className="mt-2 text-[#A0A0A0]">Update your property details below.</p>
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
                            id="address-field"
                            value={field.value || ''}
                            className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="FIXED">Fixed Term</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="MONTH_TO_MONTH">Month-to-Month</SelectItem>
                              <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="FLEXIBLE">Flexible</SelectItem>
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
                              <SelectValue placeholder="Select parking option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                            <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="None">None</SelectItem>
                            <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="Street">Street Parking</SelectItem>
                            <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="Garage">Garage</SelectItem>
                            <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="Driveway">Driveway</SelectItem>
                            <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="Paid">Paid Parking</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">Features</h3>
                  <CardDescription className="text-[#A0A0A0] mb-4">What's included in the unit</CardDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className="flex items-center h-5">
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                            className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                          />
                        </div>
                        <div className="ml-2 text-sm">
                          <label htmlFor={`feature-${feature}`} className="font-normal text-[#CCCCCC] cursor-pointer">{feature}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">Building Amenities</h3>
                  <CardDescription className="text-[#A0A0A0] mb-4">What's available in the building</CardDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {AMENITIES.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <div className="flex items-center h-5">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityToggle(amenity)}
                            className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                          />
                        </div>
                        <div className="ml-2 text-sm">
                          <label htmlFor={`amenity-${amenity}`} className="font-normal text-[#CCCCCC] cursor-pointer">{amenity}</label>
                        </div>
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
                        <div className="flex items-center h-5">
                          <Checkbox
                            id={`utility-${utility}`}
                            checked={selectedUtilities.includes(utility)}
                            onCheckedChange={() => handleUtilityToggle(utility)}
                            className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                          />
                        </div>
                        <div className="ml-2 text-sm">
                          <label htmlFor={`utility-${utility}`} className="font-normal text-[#CCCCCC] cursor-pointer">{utility}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#CCCCCC]">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          placeholder="Optional phone number for inquiries"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#CCCCCC]">Facebook Profile URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" 
                          placeholder="Optional Facebook profile URL"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#E0E0E0] uppercase">Listing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#CCCCCC]">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                          <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="ACTIVE">Active</SelectItem>
                          <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[#A0A0A0]">
                        Active listings are visible to potential renters. Archived listings are hidden from search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-md bg-[#1F1F1F] border border-[#333333]">
              <CardHeader>
                <FormLabel className="text-[#CCCCCC]">Upload Images (optional)</FormLabel>
              </CardHeader>
              <CardContent>
                {/* Storage Usage Bar */}
                <StorageUsageBar 
                  currentUsage={storageUsage} 
                  uploadedFiles={pendingFiles}
                />
                <div className="flex flex-col gap-4 mt-4">
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
                {/* Image Preview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-[#444444] text-white hover:bg-[#555555] border-[#333333]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md transition-all duration-200 hover:shadow-lg"
              >
                {isSubmitting ? 'Updating...' : 'Update Listing'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
