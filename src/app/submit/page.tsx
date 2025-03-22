'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
  availableFrom: z.date(),
  parking: z.string().default('None'),
  featured: z.boolean().default(false),
  status: z.string().default('AVAILABLE'),
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
      availableFrom: new Date(),
      parking: 'None',
      featured: false,
      status: 'AVAILABLE',
      features: {},
      utilities: {},
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
      form.setValue('features', newFeatures.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
      return newFeatures;
    });
  };

  const handleUtilityToggle = (utility: string) => {
    setSelectedUtilities(prev => {
      const newUtilities = prev.includes(utility)
        ? prev.filter(a => a !== utility)
        : [...prev, utility];
      form.setValue('utilities', newUtilities.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
      return newUtilities;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      toast.loading('Uploading images...');

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
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

      setSubmitting(true);
      const loadingToast = toast.loading('Submitting your listing...');

      // Format the availability date to ISO DateTime
      const formattedDate = new Date(data.availableFrom);
      formattedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

      // Format the data
      const formattedData = {
        ...data,
        availableFrom: formattedDate.toISOString(),
        images: JSON.stringify(uploadedImages),
        amenities: JSON.stringify(selectedAmenities),
        buildingAmenities: JSON.stringify(data.buildingAmenities),
        squareFeet: Number(data.squareFeet),
        price: Number(data.price),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
      };

      console.log('Final submit data:', formattedData);

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
      router.push(`/listings/${result.id}`);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (session === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Submit Your Listing</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in the details below to list your property.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="shadow-sm"
          >
            Back
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-black">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="shadow-sm" />
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
                        <FormLabel className="text-black dark:text-black">Price (per month)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="shadow-sm" 
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
                      <FormLabel className="text-black dark:text-white">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} className="shadow-sm resize-none" />
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
                        <FormLabel className="text-black dark:text-white">Location</FormLabel>
                        <FormControl>
                          <Input {...field} className="shadow-sm" />
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
                        <FormLabel className="text-black dark:text-white">Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="shadow-sm" />
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
                        <FormLabel className="text-black dark:text-white">Square Feet</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="shadow-sm" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel className="text-black dark:text-white">Upload Images (optional)</FormLabel>
                  <div className="flex flex-col gap-4">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="shadow-sm"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-white">Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="shadow-sm" 
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
                        <FormLabel className="text-black dark:text-white">Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''} 
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                            className="shadow-sm" 
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
                        <FormLabel className="text-black dark:text-white">Property Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="shadow-sm">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="APARTMENT">Apartment</SelectItem>
                              <SelectItem value="CONDO">Condo</SelectItem>
                              <SelectItem value="HOUSE">House</SelectItem>
                              <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
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
                        <FormLabel className="text-black dark:text-white">Listing Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="shadow-sm">
                                <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LONG_TERM">Long Term</SelectItem>
                              <SelectItem value="SHORT_TERM">Short Term</SelectItem>
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
                    name="availableFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available From</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
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
                        <FormLabel className="text-black dark:text-white">Parking</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="shadow-sm">
                                <SelectValue placeholder="Select parking" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Street Parking">Street Parking</SelectItem>
                              <SelectItem value="Private Parking">Private Parking</SelectItem>
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
                            className="shadow-sm"
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-gray-700 dark:text-gray-300">Featured Listing</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Building Amenities</CardTitle>
                <CardDescription className="text-gray-600">What the property/building offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                        className="shadow-sm"
                      />
                      <label className="text-sm font-normal text-black dark:text-black">{amenity}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Unit Features & Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Features</h3>
                  <CardDescription className="text-gray-600 mb-4">What's inside the unit</CardDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                          className="shadow-sm"
                        />
                        <label className="text-sm font-normal text-black dark:text-black">{feature}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Utilities Included</h3>
                  <CardDescription className="text-gray-600 mb-4">What's covered in the rent</CardDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {UTILITIES.map((utility) => (
                      <div key={utility} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedUtilities.includes(utility)}
                          onCheckedChange={() => handleUtilityToggle(utility)}
                          className="shadow-sm"
                        />
                        <label className="text-sm font-normal text-black dark:text-black">{utility}</label>
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
                className="flex-1 shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
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