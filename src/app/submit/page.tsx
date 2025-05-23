'use client';

import { Info } from 'lucide-react';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  'Elevator',
  'Other'
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
  const [otherAmenity, setOtherAmenity] = useState('');
  const [otherFeature, setOtherFeature] = useState('');
  const [otherUtility, setOtherUtility] = useState('');
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
      
      // If "Other" is unchecked, clear the other input
      if (amenity === 'Other' && prev.includes('Other')) {
        setOtherAmenity('');
      }
      
      const finalAmenities = newAmenities.includes('Other')
        ? [...newAmenities.filter(a => a !== 'Other'), otherAmenity]
        : newAmenities;
      
      form.setValue('amenities', finalAmenities);
      return newAmenities;
    });
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature)
        ? prev.filter(a => a !== feature)
        : [...prev, feature];
      
      // If "Other" is unchecked, clear the other input
      if (feature === 'Other' && prev.includes('Other')) {
        setOtherFeature('');
      }
      
      const finalFeatures = newFeatures.includes('Other')
        ? [...newFeatures.filter(a => a !== 'Other'), otherFeature]
        : newFeatures;
      
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
      // Check file size before upload (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > MAX_FILE_SIZE) {
          toast.error(`File ${files[i].name} exceeds the 5MB size limit`, {
            className: 'bg-red-50 border border-red-200',
            duration: 5000
          });
          return;
        }
        
        if (!files[i].type.startsWith('image/')) {
          toast.error(`File ${files[i].name} is not an image`, {
            className: 'bg-red-50 border border-red-200',
            duration: 5000
          });
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
          toast.error('Membership required', {
            className: 'bg-red-50 border border-red-200',
            description: 'You need an active membership to upload images and create listings. Please purchase a plan to continue.',
            action: {
              label: 'Get Membership',
              onClick: () => router.push('/memberships')
            },
            duration: 5000
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
        // Special handling for different error types
        if (error.message && error.message.includes('membership required')) {
          // Membership issue
          toast.error('Membership required', {
            className: 'bg-red-50 border border-red-200',
            description: 'You need an active membership to upload images. Please purchase a plan.',
            action: {
              label: 'Get Membership',
              onClick: () => router.push('/memberships')
            },
            duration: 5000
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

      toast.success(`${newImageUrls.length} image(s) uploaded successfully!`, {
        className: 'bg-green-50 border border-green-200',
        description: 'Your images have been added to the listing.',
        duration: 5000
      });

      // Reset file input but keep the images in state
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to submit listing', {
        className: 'bg-red-50 border border-red-200',
        description: error instanceof Error ? error.message : 'Please check all required fields and try again.',
        duration: 5000,
      });
      
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
      let featureArray: string[] = [];
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
      let utilitiesArray: string[] = [];
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
        images: uploadedImages,
        amenities: JSON.stringify(selectedAmenities),
        buildingAmenities: JSON.stringify(featureArray),
        features: JSON.stringify(featureArray),
        utilities: JSON.stringify(utilitiesArray),
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
      toast.success('Listing submitted successfully!', {
        className: 'bg-green-50 border border-green-200',
        description: 'Your listing has been created and is now live.',
        duration: 5000,
      });
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Submit a New Listing</h1>
      <ListingForm
        initialData={{
          title: '',
          description: '',
          price: 0,
          location: '',
          images: [],
          bedrooms: 0,
          bathrooms: 0,
          squareFeet: 0,
          amenities: [],
          buildingAmenities: [],
          features: [],
          utilities: [],
          propertyType: '',
          listingType: '',
          leaseType: '',
          availableDate: new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
          featured: false,
          phoneNumber: '',
          facebookUrl: ''
        }}
        onSubmit={async (data) => {
          // ... submit logic ...
        }}
      />
    </div>
  );
}