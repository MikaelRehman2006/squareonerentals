'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

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
  facebookUrl: z.union([z.string().url("Please enter a valid Facebook URL"), z.string().max(0)]).optional(),
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
          features: {
            wifi: data.features?.wifi || false,
            airConditioning: data.features?.airConditioning || false,
            laundry: data.features?.laundry || false,
            heating: data.features?.heating || false,
            furnished: data.features?.furnished || false,
            smartHomeFeatures: data.features?.smartHomeFeatures || false,
            walkInCloset: data.features?.walkInCloset || false,
          },
          utilities: {
            electricity: data.utilities?.electricity || false,
            gas: data.utilities?.gas || false,
            water: data.utilities?.water || false,
            internet: data.utilities?.internet || false,
            trashCollection: data.utilities?.trashCollection || false,
          },
        });
        
        console.log('Loaded listing data:', data);
        
        // Force update fields that might not be properly loaded
        setTimeout(() => {
          if (data.address) form.setValue('address', data.address);
          if (data.phoneNumber) form.setValue('phoneNumber', data.phoneNumber);
          if (data.facebookUrl) form.setValue('facebookUrl', data.facebookUrl);
        }, 300);
        
        // Set uploaded images
        if (data.images && Array.isArray(data.images)) {
          console.log('Loading images from listing data:', data.images);
          setUploadedImages(data.images);
          
          // Ensure images are properly set in the form
          form.setValue('images', data.images);
        }
        
        // Set amenities
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
        
        // Set features
        const featuresList = [];
        if (data.features) {
          if (data.features.wifi) featuresList.push('WiFi Included');
          if (data.features.airConditioning) featuresList.push('Air Conditioning');
          if (data.features.laundry) featuresList.push('In-unit Laundry');
          if (data.features.heating) featuresList.push('Heating');
          if (data.features.furnished) featuresList.push('Furnished');
          if (data.features.smartHomeFeatures) featuresList.push('Smart Home Features');
          if (data.features.walkInCloset) featuresList.push('Walk-in Closet');
        }
        setSelectedFeatures(featuresList);
        
        // Set utilities
        const utilitiesList = [];
        if (data.utilities) {
          if (data.utilities.electricity) utilitiesList.push('Electricity');
          if (data.utilities.gas) utilitiesList.push('Gas');
          if (data.utilities.water) utilitiesList.push('Water');
          if (data.utilities.internet) utilitiesList.push('Internet');
          if (data.utilities.trashCollection) utilitiesList.push('Trash Collection');
        }
        setSelectedUtilities(utilitiesList);
        
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      toast.loading('Uploading images...');
      
      // Check file size before upload (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > MAX_FILE_SIZE) {
          toast.dismiss();
          toast.error(`File ${files[i].name} exceeds the 5MB size limit`);
          return;
        }
        
        if (!files[i].type.startsWith('image/')) {
          toast.dismiss();
          toast.error(`File ${files[i].name} is not an image`);
          return;
        }
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload error:', errorData);
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        console.log('Upload success:', data);
        return data.secure_url;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      
      setUploadedImages(prev => {
        const updatedImages = [...prev, ...newImageUrls];
        form.setValue('images', updatedImages, { shouldValidate: true });
        return updatedImages;
      });

      toast.dismiss();
      toast.success('Images uploaded successfully!');
      
      // Reset file input
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
      console.log('Uploaded images before submission:', uploadedImages);

      // Validate required fields
      if (!data.title || !data.description || !data.location) {
        console.error('Missing required fields');
        toast.error('Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);
      const loadingToast = toast.loading('Updating your listing...');

      // Format the data
      const formattedData = {
        ...data,
        images: uploadedImages,
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
        facebookUrl: data.facebookUrl || '',
        amenities: JSON.stringify(selectedAmenities),
        buildingAmenities: JSON.stringify(data.buildingAmenities),
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
            <p className="mt-2 text-[#A0A0A0]">Update the details of your property below.</p>
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
                          <Input {...field} className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm" />
                        </FormControl>
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

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3B82F6] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white"
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-[#CCCCCC]">Featured Listing</FormLabel>
                      </FormItem>
                    )}
                  />
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#CCCCCC]">Listing Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] text-white border-[#444444]">
                      <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="ACTIVE">Active</SelectItem>
                      <SelectItem className="hover:bg-[#333333] focus:bg-[#333333]" value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[#A0A0A0]">
                    Active listings are visible to the public. Archived listings are only visible to you.  
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
